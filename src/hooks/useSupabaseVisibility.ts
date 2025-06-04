
import { useState, useEffect, useCallback } from 'react';
import { FieldVisibility, defaultVisibility } from '@/types/visibility';
import { getSupabase, testSupabaseConnection } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSupabaseVisibility = () => {
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>(defaultVisibility);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // Load visibility settings from Supabase
  const loadVisibilitySettings = useCallback(async () => {
    console.log('🔍 Lade Sichtbarkeitseinstellungen für Sprache:', language);
    
    try {
      setIsLoading(true);
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('❌ Supabase nicht verfügbar, verwende Standard-Einstellungen');
        setFieldVisibility(defaultVisibility);
        setError('Supabase nicht verfügbar');
        setIsLoading(false);
        return;
      }

      const supabase = getSupabase();
      
      console.log('🔄 Lade von Supabase...');
      const { data, error } = await supabase
        .from('visibility_settings')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Fehler beim Laden der Sichtbarkeitseinstellungen:', error);
        setError('Supabase-Verbindung fehlgeschlagen');
        setFieldVisibility(defaultVisibility);
      } else if (data) {
        console.log('✅ Von Supabase geladen:', data.visibility);
        setFieldVisibility(data.visibility);
        setError(null);
      } else {
        console.log('📝 Keine Daten in Supabase gefunden, verwende Standard-Einstellungen');
        setFieldVisibility(defaultVisibility);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Fehler beim Laden der Sichtbarkeitseinstellungen:', err);
      setError('Verbindungsfehler');
      setFieldVisibility(defaultVisibility);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save visibility settings to Supabase
  const saveVisibilitySettings = useCallback(async (newVisibility: FieldVisibility) => {
    console.log('💾 Speichere Sichtbarkeitseinstellungen:', newVisibility);
    
    // Validate that newVisibility is not null/undefined and has the correct structure
    if (!newVisibility || typeof newVisibility !== 'object') {
      console.error('❌ Invalid visibility data:', newVisibility);
      return;
    }

    // Ensure the visibility object has the required structure
    const validatedVisibility = {
      personalInfo: newVisibility.personalInfo || defaultVisibility.personalInfo,
      sections: newVisibility.sections || defaultVisibility.sections
    };

    setFieldVisibility(validatedVisibility);

    try {
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('❌ Supabase nicht verfügbar, Speichern nicht möglich');
        setError('Supabase nicht verfügbar');
        return;
      }

      const supabase = getSupabase();
      
      console.log('🔄 Speichere in Supabase...');
      
      const { error } = await supabase
        .from('visibility_settings')
        .upsert({
          language,
          visibility: validatedVisibility
        }, { 
          onConflict: 'language' 
        });

      if (error) {
        console.error('❌ Fehler beim Speichern der Sichtbarkeitseinstellungen:', error);
        setError('Speichern in Supabase fehlgeschlagen');
      } else {
        console.log('✅ Erfolgreich in Supabase gespeichert');
        setError(null);
      }
    } catch (err) {
      console.error('❌ Fehler beim Speichern der Sichtbarkeitseinstellungen:', err);
      setError('Verbindungsfehler beim Speichern');
    }
  }, [language]);

  // Load data when component mounts or language changes
  useEffect(() => {
    loadVisibilitySettings();
  }, [loadVisibilitySettings]);

  return {
    fieldVisibility,
    setFieldVisibility: saveVisibilitySettings,
    isLoading,
    error,
    refetch: loadVisibilitySettings
  };
};
