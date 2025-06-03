
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Check, X } from 'lucide-react';

interface OpenAIKeyInputProps {
  onKeySet: (key: string) => void;
}

export const OpenAIKeyInput: React.FC<OpenAIKeyInputProps> = ({ onKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      setHasKey(true);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setHasKey(true);
      onKeySet(apiKey.trim());
      setApiKey(''); // Clear input for security
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem('openai_api_key');
    setHasKey(false);
    setApiKey('');
  };

  if (hasKey) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          OpenAI API Key gesetzt. Übersetzungen werden automatisch mit GPT-4 durchgeführt.
          <Button 
            onClick={handleRemoveKey} 
            variant="ghost" 
            size="sm" 
            className="ml-2 text-red-600 hover:text-red-800"
          >
            <X className="w-3 h-3 mr-1" />
            Entfernen
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Key className="w-5 h-5" />
          OpenAI API Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            Für automatische Übersetzungen mit GPT-4 benötigen Sie einen OpenAI API Key. 
            Der Key wird nur lokal in Ihrem Browser gespeichert.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label htmlFor="openai-key" className="text-white">OpenAI API Key</Label>
          <div className="flex gap-2">
            <Input
              id="openai-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="bg-slate-800 border-slate-600 text-white flex-1"
            />
            <Button 
              onClick={handleSaveKey}
              disabled={!apiKey.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Speichern
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
