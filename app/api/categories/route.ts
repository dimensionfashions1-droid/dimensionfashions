import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/supabase/check-admin'
import { CategoryRow, SubcategoryRow } from '@/types'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Fetch categories
    const { data: categories, error: catsError } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (catsError) throw catsError

    // Fetch subcategories
    const { data: subcategories, error: subsError } = await supabase
      .from('subcategories')
      .select('*')
      .order('name', { ascending: true })

    if (subsError) throw subsError

    // Group subcategories by category_id
    const categoriesWithSubs = (categories as CategoryRow[]).map((cat) => {
      return {
        ...cat,
        subcategories: (subcategories as SubcategoryRow[]).filter((sub) => sub.category_id === cat.id)
      }
    })

    return NextResponse.json({ data: categoriesWithSubs })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const adminCheck = await requireAdmin()
  if (adminCheck) return adminCheck

  try {
    const body = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('categories')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data, message: 'Category created successfully' })
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 })
  }
}