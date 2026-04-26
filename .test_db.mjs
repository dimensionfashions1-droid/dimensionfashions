import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function test() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const { data: cats } = await supabase.from('categories').select('*')
  console.log("Categories:", cats)

  if (cats && cats.length > 0) {
      const { data: prods } = await supabase.from('products').select('*, categories(slug)').eq('category_id', cats[0].id)
      console.log(`Products for ${cats[0].slug}:`, prods?.length)
  }

  const { data: pAll } = await supabase.from('products').select('*, categories!inner(slug)')
  console.log("Products with inner join:", pAll?.length)
}
test()
