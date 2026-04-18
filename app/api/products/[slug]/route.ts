import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const resolvedParams = await params
    const slug = resolvedParams.slug

    if (!slug) {
      return NextResponse.json({ error: 'Product slug is required' }, { status: 400 })
    }

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (id, name, slug),
        subcategories (id, name, slug),
        product_attributes (
          id,
          text_value,
          attribute_definitions!inner (id, name, slug, type),
          attribute_options (id, value, hex_code, display_value)
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

    // Process the raw product data to format attributes cleanly for the frontend
    const formattedProduct = {
      ...product,
      computed_rating: averageRating,
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
    delete (formattedProduct as typeof formattedProduct & { product_attributes?: unknown }).product_attributes

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
    const supabase = await createClient()
    const resolvedParams = await params
    const slug = resolvedParams.slug
    const body = await request.json()

    // Separate product_attributes from the core product fields
    const { attributes, ...productFields } = body

    // 1. Update product core fields
    const { data: product, error } = await supabase
      .from('products')
      .update(productFields)
      .eq('slug', slug)
      .select('id')
      .single()

    if (error) throw error

    // 2. Re-link attributes if provided
    if (attributes && Array.isArray(attributes)) {
      // Delete existing attributes
      const { error: deleteError } = await supabase
        .from('product_attributes')
        .delete()
        .eq('product_id', product.id)

      if (deleteError) throw deleteError

      // Insert new attributes
      if (attributes.length > 0) {
        const attrRows = attributes.map((attr: { attribute_id: string; option_id?: string; text_value?: string }) => ({
          product_id: product.id,
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

    return NextResponse.json({ data: product, message: 'Product updated successfully' })
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
    const supabase = await createClient()
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
