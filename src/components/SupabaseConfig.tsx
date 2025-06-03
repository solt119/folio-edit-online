
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

interface SupabaseConfigProps {
  onConfigured: () => void
}

export const SupabaseConfig: React.FC<SupabaseConfigProps> = ({ onConfigured }) => {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabaseUrl || !supabaseAnonKey) {
      toast({
        title: "Fehler",
        description: "Bitte beide Felder ausfüllen.",
        variant: "destructive"
      })
      return
    }

    // Store in localStorage temporarily
    localStorage.setItem('VITE_SUPABASE_URL', supabaseUrl)
    localStorage.setItem('VITE_SUPABASE_ANON_KEY', supabaseAnonKey)
    
    toast({
      title: "Konfiguration gespeichert",
      description: "Supabase wurde erfolgreich konfiguriert.",
    })
    
    onConfigured()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-400">Supabase Konfiguration</CardTitle>
          <p className="text-slate-400 text-sm">
            Bitte geben Sie Ihre Supabase-Zugangsdaten ein
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Supabase URL
              </label>
              <Input
                type="url"
                placeholder="https://ihr-projekt.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Anon Key
              </label>
              <Input
                type="text"
                placeholder="Ihr Supabase anon key"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Konfiguration speichern
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
