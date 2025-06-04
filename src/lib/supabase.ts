
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase-Konfiguration (Klartext)
const SUPABASE_URL = 'https://naujdpvmnubgfjxddrst.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdWpkcHZtbnViZ2ZqeGRkcnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NTcxMTgsImV4cCI6MjA2NDUzMzExOH0.nC51JR0PJGF0ca3yFOeGjq7yq-PvJGWeOE04tUtzEgQ'

let supabaseClient: SupabaseClient | null = null
let connectionTestedAndWorking = false

// Debug-Informationen protokollieren
const logEnvironment = () => {
  console.log('🔍 Environment Debug Info:')
  console.log('- URL:', window.location.href)
  console.log('- Origin:', window.location.origin)
  console.log('- Host:', window.location.host)
  console.log('- Protocol:', window.location.protocol)
  console.log('- User Agent:', navigator.userAgent.substring(0, 100))
  console.log('- Online Status:', navigator.onLine)
  console.log('- Connection Type:', (navigator as any).connection?.effectiveType || 'unknown')
}

// Initialisierung beim ersten Aufruf
export const getSupabase = (): SupabaseClient => {
  if (!supabaseClient) {
    console.log('🚀 Initialisiere Supabase...')
    console.log('📍 Supabase URL:', SUPABASE_URL)
    console.log('🔑 Anon Key vorhanden:', SUPABASE_ANON_KEY ? 'Ja' : 'Nein')
    
    logEnvironment()
    
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

  console.log('🔍 Starte Supabase-Verbindungstest...')
  logEnvironment()

  try {
    const supabase = getSupabase()
    
    // Erweiterte Timeout-Konfiguration für langsame Server
    console.log('📡 Sende Test-Query an Supabase mit 15s Timeout...')
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout nach 15 Sekunden')), 15000)
    )
    
    // Erst einfache Ping-Test
    console.log('🏓 Teste einfache Verbindung...')
    const pingPromise = fetch(SUPABASE_URL + '/health', { 
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    }).then(response => {
      console.log('🏓 Ping Response Status:', response.status)
      return response
    }).catch(error => {
      console.error('🏓 Ping Failed:', error)
      throw error
    })
    
    try {
      await Promise.race([pingPromise, timeoutPromise])
      console.log('✅ Basis-Verbindung zu Supabase erfolgreich')
    } catch (pingError) {
      console.error('❌ Basis-Verbindung zu Supabase fehlgeschlagen:', pingError)
      // Weiter versuchen mit Supabase Query
    }
    
    // Jetzt Supabase-Query testen
    console.log('📊 Teste Supabase-Query...')
    const queryPromise = supabase.from('cv_data').select('id').limit(1)
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any
    
    if (error) {
      console.error('❌ Supabase-Query hat Fehler:', error)
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
    console.error('❌ Supabase-Verbindung komplett fehlgeschlagen:', error)
    console.error('🔍 Fehler-Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 300) + '...'
    })
    
    // Prüfe spezifische Fehlerarten
    if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
      console.error('🌐 Netzwerk-Fehler: Möglicherweise CORS, Firewall oder Provider-Problem')
    }
    if (error.message?.includes('Timeout')) {
      console.error('⏱️ Timeout: Supabase antwortet nicht rechtzeitig')
    }
    if (error.message?.includes('TypeError')) {
      console.error('🔧 TypeError: Möglicherweise fehlt fetch() oder andere Web-APIs')
    }
    
    connectionTestedAndWorking = false
    return false
  }
}

// Prüft, ob die Supabase-Verbindung funktioniert
export const isSupabaseWorking = (): boolean => {
  return connectionTestedAndWorking
}

// Force reconnection (für Debug-Zwecke)
export const forceReconnection = async (): Promise<boolean> => {
  console.log('🔄 Erzwinge Neuverbindung...')
  connectionTestedAndWorking = false
  return await testSupabaseConnection()
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
