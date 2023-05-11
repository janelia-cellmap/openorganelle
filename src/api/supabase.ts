import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY

if (supabaseUrl === undefined){
  throw new Error('Could not get REACT_APP_SUPABASE_URL from environment.');
}

if (supabaseKey === undefined){
  throw new Error('Could not get REACT_APP_SUPABASE_KEY from environment.');
}
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)