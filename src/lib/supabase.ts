
import { createClient } from '@supabase/supabase-js'

const getSupabaseUrl = () => {
  return import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('VITE_SUPABASE_URL')
}

const getSupabaseAnonKey = () => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('VITE_SUPABASE_ANON_KEY')
}

const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseAnonKey()

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
