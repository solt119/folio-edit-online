
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

const getSupabaseUrl = () => {
  // First try environment variables, then localStorage
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
  console.log('🔍 Checking Supabase URL - ENV:', envUrl ? 'SET' : 'NOT SET', 'LocalStorage:', localUrl ? 'SET' : 'NOT SET');
  return envUrl || localUrl;
}

const getSupabaseAnonKey = () => {
  // First try environment variables, then localStorage
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');
  console.log('🔍 Checking Supabase Key - ENV:', envKey ? 'SET' : 'NOT SET', 'LocalStorage:', localKey ? 'SET' : 'NOT SET');
  return envKey || localKey;
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
  const configured = !!(supabaseUrl && supabaseAnonKey);
  console.log('🔍 isSupabaseConfigured:', configured);
  return configured;
}

// Check if configuration comes from environment variables
export const isConfiguredViaEnv = (): boolean => {
  const configuredViaEnv = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('🔍 isConfiguredViaEnv:', configuredViaEnv);
  return configuredViaEnv;
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
