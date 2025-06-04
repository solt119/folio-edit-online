
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Fest eingebaute Supabase-Konfiguration - direkt im Code definiert
const SUPABASE_URL = 'https://vvmboyqgmhqctwnhgldf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWJveXFnbWhxY3R3bmhnbGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzNDYwNzUsImV4cCI6MjA0ODkyMjA3NX0.5Qm7N7J7XJPTJWKOBklnwXxQyF7YUy-D3H_1yF5-8cE'

let supabaseClient: SupabaseClient | null = null
let isConnectionWorking = false

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
  return true
}

// Verbindungstest-Funktion mit besserer Fehlerbehandlung
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Teste Supabase-Verbindung...')
    const supabase = getSupabase()
    
    // Einfacher Test durch Abrufen der aktuellen Session
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('⚠️ Supabase-Verbindung hat Fehler:', error.message)
      isConnectionWorking = false
      return false
    }
    
    console.log('✅ Supabase-Verbindung erfolgreich')
    isConnectionWorking = true
    return true
  } catch (error) {
    console.error('❌ Supabase-Verbindung fehlgeschlagen:', error)
    isConnectionWorking = false
    return false
  }
}

// Prüft, ob die Supabase-Verbindung funktioniert
export const isSupabaseWorking = (): boolean => {
  return isConnectionWorking
}

// Für Rückwärtskompatibilität mit besserer Fehlerbehandlung
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
