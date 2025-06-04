
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
    console.log('🔍 Loading visibility settings for language:', language);
    
    try {
      setIsLoading(true);
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('📱 Supabase nicht verfügbar, verwende localStorage');
        // Fall back to localStorage
        const savedVisibility = localStorage.getItem('fieldVisibility');
        if (savedVisibility) {
          try {
            const parsed = JSON.parse(savedVisibility);
            console.log('✅ Loaded from localStorage:', parsed);
            setFieldVisibility(parsed);
          } catch (error) {
            console.error('❌ Error parsing visibility data:', error);
            setFieldVisibility(defaultVisibility);
          }
        } else {
          setFieldVisibility(defaultVisibility);
        }
        setIsLoading(false);
        return;
      }

      const supabase = getSupabase();
      
      console.log('🔄 Fetching from Supabase...');
      const { data, error } = await supabase
        .from('visibility_settings')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Error loading visibility settings:', error);
        setError('Supabase-Verbindung fehlgeschlagen');
        // Fall back to localStorage
        const savedVisibility = localStorage.getItem('fieldVisibility');
        if (savedVisibility) {
          setFieldVisibility(JSON.parse(savedVisibility));
        } else {
          setFieldVisibility(defaultVisibility);
        }
      } else if (data) {
        console.log('✅ Loaded from Supabase:', data.visibility);
        setFieldVisibility(data.visibility);
        setError(null);
      } else {
        console.log('📝 No data found in Supabase, using default');
        setFieldVisibility(defaultVisibility);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Error loading visibility settings:', err);
      setError('Verbindungsfehler');
      // Fall back to localStorage
      const savedVisibility = localStorage.getItem('fieldVisibility');
      if (savedVisibility) {
        try {
          setFieldVisibility(JSON.parse(savedVisibility));
        } catch {
          setFieldVisibility(defaultVisibility);
        }
      } else {
        setFieldVisibility(defaultVisibility);
      }
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save visibility settings to Supabase
  const saveVisibilitySettings = useCallback(async (newVisibility: FieldVisibility) => {
    console.log('💾 Saving visibility settings:', newVisibility);
    
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

    // Always save to localStorage as backup
    localStorage.setItem('fieldVisibility', JSON.stringify(validatedVisibility));
    setFieldVisibility(validatedVisibility);

    try {
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('📱 Supabase nicht verfügbar, nur localStorage verwendet');
        return;
      }

      const supabase = getSupabase();
      
      console.log('🔄 Saving to Supabase with data:', { language, visibility: validatedVisibility });
      
      const { error } = await supabase
        .from('visibility_settings')
        .upsert({
          language,
          visibility: validatedVisibility
        }, { 
          onConflict: 'language' 
        });

      if (error) {
        console.error('❌ Error saving visibility settings:', error);
        setError('Speichern in Supabase fehlgeschlagen - in localStorage gespeichert');
      } else {
        console.log('✅ Successfully saved to Supabase');
        setError(null);
      }
    } catch (err) {
      console.error('❌ Error saving visibility settings:', err);
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
