import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvwjcggnkipomjlbjykf.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY
if (supabaseKey === undefined){
  throw new Error('Could not get SUPABASE_KEY from environment.');
}
export const supabase = createClient(supabaseUrl, supabaseKey)