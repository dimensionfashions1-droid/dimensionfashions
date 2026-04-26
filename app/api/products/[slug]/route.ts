import { NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

// Interfaces for the raw joined data to avoid 'any'
interface RawProductAttribute {
  attribute_definitions: {
    id: string
    name: string
    slug: string
    type: string
  } | null
  attribute_options: {
    id: string
    value: string
    hex_code: string | null
    display_value: string | null
  } | null
  text_value: string | null
}

interface FormattedAttribute {
  id: string
  name: string
  type: string
  values: Array<string | { id: string; value: string; hex_code: string | null; display_value: string | null }>
}

async function ensureProductUniqueness(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  title: string,
  slug: string,
  excludeId: string
) {
  const loweredTitle = title.trim().toLowerCase()
  const loweredSlug = slug.trim().toLowerCase()

  const titleQuery = supabase
    .from('products')
    .select('id, title, slug')
    .neq('id', excludeId)
    .ilike('title', title.trim())

  const slugQuery = supabase
    .from('products')
    .select('id, title, slug')
    .neq('id', excludeId)
    .ilike('slug', slug.trim())

  const [
    { data: titleMatches, error: titleError },
    { data: slugMatches, error: slugError },
  ] = await Promise.all([titleQuery, slugQuery])

  if (titleError) throw titleError
  if (slugError) throw slugError

  const duplicate = [...(titleMatches || []), ...(slugMatches || [])].find((row) =>
    row.title?.trim().toLowerCase() === loweredTitle || row.slug?.trim().toLowerCase() === loweredSlug
  )

  if (duplicate) {
    const isTitleDuplicate = duplicate.title?.trim().toLowerCase() === loweredTitle
    return {
      error: `A product with this ${isTitleDuplicate ? 'title' : 'slug'} already exists.`,
    }
  }

  return null
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createAdminClient()
    const resolvedParams = await params
    const slug = resolvedParams.slug

    if (!slug) {
      return NextResponse.json({ error: 'Product slug is required' }, { status: 400 })
    }

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        category_id,
        subcategory_id,
        categories (id, name, slug),
        subcategories (id, name, slug),
        product_attributes (
          id,
          text_value,
          attribute_definitions!inner (id, name, slug, type, is_variant),
          attribute_options (id, value, hex_code, display_value)
        ),
        product_variants (
          *,
          product_variant_options (
            attribute_id,
            option_id,
            attribute_definitions (name, slug),
            attribute_options (value, hex_code)
          )
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      throw error
    }

    // Security: If product is draft, only allow admins
    if (product.status === 'draft') {
      const adminCheck = await requireAdmin()
      if (adminCheck) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
    }

    // --- RAW DEBUG TRACING START ---
    console.log("DEBUG API RAW: Product found ID:", product.id)
    console.log("DEBUG API RAW: Product variations array length:", product.product_variants?.length || 0)
    
    // Independent check: double-check product_variants table directly
    const { count: variantCountDirect } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', product.id)
    
    console.log("DEBUG API RAW: Independent variant count query for ID:", product.id, "RESULTS:", variantCountDirect)
    // --- RAW DEBUG TRACING END ---

    // Get aggregated reviews for this product
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product.id)
    
    let averageRating = product.rating
    if (!reviewsError && reviews && reviews.length > 0) {
       const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0)
       averageRating = sum / reviews.length
    }

    const rawAttributes = product.product_attributes as unknown as RawProductAttribute[]

    // Process variants to be more usable
    const formattedVariants = (product.product_variants || []).map((v: any) => {
      const options = (v.product_variant_options || []).reduce((acc: any, pvo: any) => {
        const slug = pvo.attribute_definitions?.slug
        const value = pvo.attribute_options?.value
        const optionId = pvo.option_id
        const attributeId = pvo.attribute_id
        
        if (slug && value !== undefined) {
          acc[slug] = {
            value,
            option_id: optionId,
            attribute_id: attributeId
          }
        }
        return acc
      }, {})

      return {
        ...v,
        options
      }
    })

    console.log(`DEBUG API: Product ${slug} fetched with ${formattedVariants.length} variants.`)

    // Process the raw product data to format attributes cleanly for the frontend
    const formattedProduct = {
      ...product,
      computed_rating: averageRating,
      variants: formattedVariants,
      attributes: (rawAttributes || []).reduce<Record<string, FormattedAttribute>>((acc, pa) => {
        const attrDef = pa.attribute_definitions
        if (!attrDef) return acc
        
        if (!acc[attrDef.slug]) {
          acc[attrDef.slug] = {
            id: attrDef.id,
            name: attrDef.name,
            type: attrDef.type,
            values: []
          }
        }

        if (attrDef.type === 'text' && pa.text_value) {
          acc[attrDef.slug].values.push(pa.text_value)
        } else if (pa.attribute_options) {
          acc[attrDef.slug].values.push(pa.attribute_options)
        }

        return acc
      }, {})
    }

    // Clean up raw joining table arrays
    delete (formattedProduct as any).product_attributes
    delete (formattedProduct as any).product_variants

    return NextResponse.json({ data: formattedProduct })
  } catch (error: unknown) {
    console.error('Error fetching product:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to fetch product' }, { status: 500 })
  }
}

// ── PUT: Update Product ──────────────────────────────────────────────
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const resolvedParams = await params
    const slug = resolvedParams.slug
    const body = await request.json()

    // Separate attributes and variants from the core product fields
    const { attributes, variants, ...productFields } = body
    let productId = ''

    const existing = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing.error) {
      if (existing.error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      throw existing.error
    }

    productId = existing.data.id

    if (Object.keys(productFields).length > 0) {
      if (!productFields.title?.trim() || !productFields.slug?.trim()) {
        return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 })
      }

      const uniquenessError = await ensureProductUniqueness(
        supabase,
        productFields.title,
        productFields.slug,
        productId
      )
      if (uniquenessError) {
        return NextResponse.json({ error: uniquenessError.error }, { status: 409 })
      }

      // 1. Update product core fields
      const { error } = await supabase
        .from('products')
        .update(productFields)
        .eq('id', productId)

      if (error) throw error
    }

    // 2. Re-link attributes if provided
    if (attributes && Array.isArray(attributes)) {
      // Delete existing attributes
      const { error: deleteError } = await supabase
        .from('product_attributes')
        .delete()
        .eq('product_id', productId)

      if (deleteError) throw deleteError

      // Insert new attributes
      if (attributes.length > 0) {
        const attrRows = attributes.map((attr: { attribute_id: string; option_id?: string; text_value?: string }) => ({
          product_id: productId,
          attribute_id: attr.attribute_id,
          option_id: attr.option_id || null,
          text_value: attr.text_value || null,
        }))

        const { error: insertError } = await supabase
          .from('product_attributes')
          .insert(attrRows)

        if (insertError) throw insertError
      }
    }

    // 3. Sync Variants
    if (variants && Array.isArray(variants)) {
      // Fetch existing variants to compare
      const { data: existingVariants, error: fetchVariantsError } = await supabase
        .from('product_variants')
        .select('*, product_variant_options(*)')
        .eq('product_id', productId)

      if (fetchVariantsError) throw fetchVariantsError

      const existingVariantIds = existingVariants.map(v => v.id)
      const incomingVariantIds = variants.filter(v => v.id && !v.id.startsWith('temp-')).map(v => v.id)

      // a. Delete variants that are no longer present
      const variantsToDelete = existingVariantIds.filter(id => !incomingVariantIds.includes(id))
      if (variantsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('product_variants')
          .delete()
          .in('id', variantsToDelete)
        if (deleteError) throw deleteError
      }

      // b. Update or Insert variants
      for (const variant of variants) {
        const { id, price, original_price, stock_count, sku, images, options } = variant
        const isNew = !id || id.startsWith('temp-')

        let variantId = id

        const variantData = {
          product_id: productId,
          price: price ? Number(price) : null,
          original_price: original_price ? Number(original_price) : null,
          stock_count: Number(stock_count) || 0,
          sku: sku || null,
          images: images || null
        }

        if (isNew) {
          const { data: newV, error: insError } = await supabase
            .from('product_variants')
            .insert([variantData])
            .select()
            .single()
          if (insError) throw insError
          variantId = newV.id
        } else {
          const { error: updError } = await supabase
            .from('product_variants')
            .update(variantData)
            .eq('id', variantId)
          if (updError) throw updError
        }

        // c. Sync variant options (simpler to delete and re-insert for the specific variant)
        const { error: delOptError } = await supabase
          .from('product_variant_options')
          .delete()
          .eq('variant_id', variantId)
        if (delOptError) throw delOptError

        if (options && Array.isArray(options) && options.length > 0) {
          const optionRows = options.map((opt: any) => ({
            variant_id: variantId,
            attribute_id: opt.attribute_id,
            option_id: opt.option_id
          }))
          const { error: insOptError } = await supabase
            .from('product_variant_options')
            .insert(optionRows)
          if (insOptError) throw insOptError
        }
      }
    }

    return NextResponse.json({ data: { id: productId }, message: 'Product updated successfully' })
  } catch (error: unknown) {
    console.error('API /products/[slug] PUT error:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 })
  }
}

// ── DELETE: Remove Product ───────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const resolvedParams = await params
    const slug = resolvedParams.slug

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('slug', slug)

    if (error) throw error

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error: unknown) {
    console.error('API /products/[slug] DELETE error:', error)
    const err = error as Error
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 })
  }
}
