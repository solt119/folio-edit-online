
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Fest eingebaute Supabase-Konfiguration - direkt im Code definiert
const SUPABASE_URL = 'https://naujdpvmnubgfjxddrst.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWpkcHZtbnViZ2ZqeGRkcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTcxMTgsImV4cCI6MjA2NDUzMzExOH0.nC51JR0PJGF0ca3yFOeGjq7yq-PvJGWeOE04tUtzEgQ'

let supabaseClient: SupabaseClient | null = null
let isConnectionWorking = false

// Automatische Initialisierung beim ersten Aufruf
export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    console.log('🚀 Initialisiere Supabase mit aktualisierten Zugangsdaten...')
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
    console.log('🔍 Teste Supabase-Verbindung mit neuen Zugangsdaten...')
    const supabase = getSupabase()
    
    // Einfacher Test durch Abrufen der aktuellen Session
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.warn('⚠️ Supabase-Verbindung hat Fehler:', error.message)
      isConnectionWorking = false
      return false
    }
    
    console.log('✅ Supabase-Verbindung erfolgreich mit neuen Zugangsdaten')
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
