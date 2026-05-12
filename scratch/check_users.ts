import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkUsers() {
  console.log('Checking public.users table...')
  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
  
  if (error) {
    console.error('Error fetching users:', error)
  } else {
    console.log('Count of users in public.users:', count)
    console.log('First 5 users:', data?.slice(0, 5))
  }

  console.log('\nChecking auth.users table (via admin API)...')
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error('Error fetching auth users:', authError)
  } else {
    console.log('Count of users in auth.users:', users.length)
    console.log('First 5 auth users:', users.slice(0, 5).map(u => ({ id: u.id, email: u.email })))
  }
}

checkUsers()
