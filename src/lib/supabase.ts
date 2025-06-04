
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Fest eingebaute Supabase-Konfiguration - direkt im Code definiert
const SUPABASE_URL = 'https://vvmboyqgmhqctwnhgldf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWJveXFnbWhxY3R3bmhnbGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNDYwNzUsImV4cCI6MjA0ODkyMjA3NX0.5Qm7N7J7XJPTJWKOBklnwXxQyF7YUy-D3H_1yF5-8cE'

let supabaseClient: SupabaseClient | null = null

// Automatische Initialisierung beim ersten Aufruf
export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    console.log('🚀 Initialisiere Supabase mit hartkodierten Werten...')
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabaseClient
}

// Immer als konfiguriert betrachten, da Werte im Code fest definiert sind
export const isSupabaseConfigured = (): boolean => {
  console.log('✅ Supabase ist immer konfiguriert (hartcodierte Werte)')
  return true
}

// Verbindungstest-Funktion
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Teste Supabase-Verbindung...')
    const supabase = getSupabase()
    
    // Einfacher Test durch Abrufen der aktuellen Session
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('⚠️ Supabase-Verbindung funktioniert, aber Session-Fehler:', error.message)
      return true // Verbindung ist OK, nur keine Session
    }
    
    console.log('✅ Supabase-Verbindung erfolgreich')
    return true
  } catch (error) {
    console.error('❌ Supabase-Verbindung fehlgeschlagen:', error)
    return false
  }
}

// Für Rückwärtskompatibilität
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

// Automatischer Verbindungstest beim Import
testSupabaseConnection()
