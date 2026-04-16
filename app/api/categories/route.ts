import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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