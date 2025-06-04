
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Fest eingebaute Supabase-Konfiguration - direkt im Code definiert
const SUPABASE_URL = 'https://naujdpvmnubgfjxddrst.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWpkcHZtbnViZ2ZqeGRkcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTcxMTgsImV4cCI6MjA2NDUzMzExOH0.nC51JR0PJGF0ca3yFOeGjq7yq-PvJGWeOE04tUtzEgQ'

let supabaseClient: SupabaseClient | null = null
let connectionTestedAndWorking = false

// Initialisierung beim ersten Aufruf
export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    console.log('🚀 Initialisiere Supabase mit fest konfigurierten Zugangsdaten...')
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabaseClient
}

// Immer als konfiguriert betrachten, da Werte fest im Code definiert sind
export const isSupabaseConfigured = (): boolean => {
  return true
}

// Verbindungstest mit caching für bessere Performance
export const testSupabaseConnection = async (): Promise<boolean> => {
  // Wenn bereits erfolgreich getestet, direkt true zurückgeben
  if (connectionTestedAndWorking) {
    return true
  }

  try {
    console.log('🔍 Teste Supabase-Verbindung...')
    const supabase = getSupabase()
    
    // Einfacher Test durch Abrufen einer einfachen Query
    const { error } = await supabase.from('cv_data').select('id').limit(1)
    
    if (error) {
      console.warn('⚠️ Supabase-Verbindung hat Fehler:', error.message)
      connectionTestedAndWorking = false
      return false
    }
    
    console.log('✅ Supabase-Verbindung erfolgreich')
    connectionTestedAndWorking = true
    return true
  } catch (error) {
    console.error('❌ Supabase-Verbindung fehlgeschlagen:', error)
    connectionTestedAndWorking = false
    return false
  }
}

// Prüft, ob die Supabase-Verbindung funktioniert
export const isSupabaseWorking = (): boolean => {
  return connectionTestedAndWorking
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
