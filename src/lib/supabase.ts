
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
    console.log('📍 Supabase URL:', SUPABASE_URL)
    console.log('🔑 Anon Key vorhanden:', SUPABASE_ANON_KEY ? 'Ja' : 'Nein')
    
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false
      }
    })
  }
  return supabaseClient
}

// Immer als konfiguriert betrachten, da Werte fest im Code definiert sind
export const isSupabaseConfigured = (): boolean => {
  return true
}

// Verbindungstest mit verbesserter Fehlerbehandlung
export const testSupabaseConnection = async (): Promise<boolean> => {
  // Wenn bereits erfolgreich getestet, direkt true zurückgeben
  if (connectionTestedAndWorking) {
    console.log('✅ Supabase-Verbindung bereits getestet und funktioniert')
    return true
  }

  try {
    console.log('🔍 Teste Supabase-Verbindung...')
    console.log('🌐 Current URL:', window.location.origin)
    console.log('🌐 User Agent:', navigator.userAgent.substring(0, 50) + '...')
    
    const supabase = getSupabase()
    
    // Einfacher Test durch Abrufen einer einfachen Query mit Timeout
    console.log('📡 Sende Test-Query an Supabase...')
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout nach 10 Sekunden')), 10000)
    )
    
    const queryPromise = supabase.from('cv_data').select('id').limit(1)
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any
    
    if (error) {
      console.error('❌ Supabase-Verbindung hat Fehler:', error)
      console.error('🔍 Error Details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      connectionTestedAndWorking = false
      return false
    }
    
    console.log('✅ Supabase-Verbindung erfolgreich')
    console.log('📊 Test-Daten erhalten:', data)
    connectionTestedAndWorking = true
    return true
  } catch (error: any) {
    console.error('❌ Supabase-Verbindung fehlgeschlagen:', error)
    console.error('🔍 Fehler-Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 200) + '...'
    })
    
    // Prüfe spezifische Fehlerarten
    if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
      console.error('🌐 Netzwerk-Fehler: Möglicherweise CORS oder Firewall-Problem')
    }
    if (error.message?.includes('Timeout')) {
      console.error('⏱️ Timeout: Supabase antwortet nicht rechtzeitig')
    }
    
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
