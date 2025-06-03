
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn, Eye, EyeOff, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useLanguage } from '@/contexts/LanguageContext'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  loading: boolean
  onCancel?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, onCancel }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: "Fehler",
        description: "Bitte E-Mail und Passwort eingeben.",
        variant: "destructive"
      })
      return
    }
    await onLogin(email, password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
        <CardHeader className="text-center relative">
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <CardTitle className="text-2xl text-blue-400">{t('login_to_edit')}</CardTitle>
          <p className="text-slate-400 text-sm">
            Melden Sie sich an, um den Lebenslauf zu bearbeiten
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-slate-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? t('loading') : t('login_to_edit')}
            </Button>
            {onCancel && (
              <Button 
                type="button"
                variant="outline"
                className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800"
                onClick={onCancel}
              >
                {t('cancel')}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
