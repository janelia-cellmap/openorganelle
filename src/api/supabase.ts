import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (supabaseKey === undefined){
  throw new Error('Could not get SUPABASE_KEY from environment.');
}
else if (supabaseUrl == undefined){
  throw new Error('Could not get SUPABASE_URL from environment')

}
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)