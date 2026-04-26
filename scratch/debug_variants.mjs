import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      title,
      product_variants(id)
    `)
    .limit(5)

  if (error) {
    console.error(error)
    return
  }

  console.log(JSON.stringify(data, null, 2))
}

test()
