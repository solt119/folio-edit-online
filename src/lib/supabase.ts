
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

// Fest eingebaute Supabase-Konfiguration
const SUPABASE_URL = 'https://vvmboyqgmhqctwnhgldf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWJveXFnbWhxY3R3bmhnbGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNDYwNzUsImV4cCI6MjA0ODkyMjA3NX0.5Qm7N7J7XJPTJWKOBklnwXxQyF7YUy-D3H_1yF5-8cE'

const getSupabaseUrl = () => {
  // First try environment variables, then hardcoded values
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const localUrl = localStorage.getItem('VITE_SUPABASE_URL');
  console.log('🔍 Checking Supabase URL - ENV:', envUrl ? 'SET' : 'NOT SET', 'LocalStorage:', localUrl ? 'SET' : 'NOT SET');
  return envUrl || localUrl || SUPABASE_URL;
}

const getSupabaseAnonKey = () => {
  // First try environment variables, then hardcoded values
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY');
  console.log('🔍 Checking Supabase Key - ENV:', envKey ? 'SET' : 'NOT SET', 'LocalStorage:', localKey ? 'SET' : 'NOT SET');
  return envKey || localKey || SUPABASE_ANON_KEY;
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
