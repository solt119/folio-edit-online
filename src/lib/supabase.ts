
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

const getSupabaseUrl = () => {
  return import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('VITE_SUPABASE_URL')
}

const getSupabaseAnonKey = () => {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('VITE_SUPABASE_ANON_KEY')
}

export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    const supabaseUrl = getSupabaseUrl()
    const supabaseAnonKey = getSupabaseAnonKey()

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

export const isSupabaseConfigured = (): boolean => {
  const supabaseUrl = getSupabaseUrl()
  const supabaseAnonKey = getSupabaseAnonKey()
  return !!(supabaseUrl && supabaseAnonKey)
}

// For backward compatibility
export const supabase = {
  get auth() {
    return getSupabase().auth
  },
  get from() {
    return getSupabase().from.bind(getSupabase())
  },
  get storage() {
    return getSupabase().storage
  }
}
