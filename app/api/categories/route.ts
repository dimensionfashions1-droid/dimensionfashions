import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'

async function ensureCategoryUniqueness(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  name: string,
  slug: string,
  excludeId?: string
) {
  const loweredName = name.trim().toLowerCase()
  const loweredSlug = slug.trim().toLowerCase()

  let nameQuery = supabase.from('categories').select('id, name, slug').ilike('name', name.trim())
  let slugQuery = supabase.from('categories').select('id, name, slug').ilike('slug', slug.trim())

  if (excludeId) {
    nameQuery = nameQuery.neq('id', excludeId)
    slugQuery = slugQuery.neq('id', excludeId)
  }

  const [
    { data: nameMatches, error: nameError },
    { data: slugMatches, error: slugError },
  ] = await Promise.all([nameQuery, slugQuery])

  if (nameError) throw nameError
  if (slugError) throw slugError

  const duplicate = [...(nameMatches || []), ...(slugMatches || [])].find((row) =>
    row.name?.trim().toLowerCase() === loweredName || row.slug?.trim().toLowerCase() === loweredSlug
  )

  if (duplicate) {
    const isNameDuplicate = duplicate.name?.trim().toLowerCase() === loweredName

    return {
      error: `A category with this ${isNameDuplicate ? 'name' : 'slug'} already exists.`,
    }
  }

  return null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 10
    const all = searchParams.get('all') === 'true'
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true'

    const supabase = await createAdminClient()

    let catQuery = supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })

    if (search) {
      catQuery = catQuery.ilike('name', `%${search}%`)
    }

    if (!all) {
      const from = (page - 1) * limit
      const to = from + limit - 1
      catQuery = catQuery.range(from, to)
    }

    const { data: categories, error: catsError, count } = await catQuery
    if (catsError) throw catsError

    let data = categories || []

    if (includeSubcategories && categories && categories.length > 0) {
      const categoryIds = categories.map((category) => category.id)
      const { data: subs, error: subsError } = await supabase
        .from('subcategories')
        .select('*')
        .in('category_id', categoryIds)
        .order('name', { ascending: true })

      if (subsError) throw subsError

      data = categories.map((category) => ({
        ...category,
        subcategories: (subs || []).filter((sub) => sub.category_id === category.id),
      }))
    }

    const total = count || 0
    const totalPages = all ? 1 : Math.ceil(total / limit)

    return NextResponse.json({
      data,
      meta: { total, page: all ? 1 : page, totalPages },
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error fetching categories:', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const supabase = await createAdminClient()
    const body = await request.json()

    if (!body.name?.trim() || !body.slug?.trim()) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 })
    }

    const uniquenessError = await ensureCategoryUniqueness(supabase, body.name, body.slug)
    if (uniquenessError) {
      return NextResponse.json({ error: uniquenessError.error }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Category created successfully' })
  } catch (error: unknown) {
    const err = error as Error
    console.error('Error creating category:', err)
    return NextResponse.json({ error: err.message || 'Failed to create category' }, { status: 500 })
  }
}
