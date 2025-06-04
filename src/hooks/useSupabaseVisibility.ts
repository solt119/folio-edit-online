
import { useState, useEffect, useCallback } from 'react';
import { FieldVisibility, defaultVisibility } from '@/types/visibility';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSupabaseVisibility = () => {
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>(defaultVisibility);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // Load visibility settings from Supabase
  const loadVisibilitySettings = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Fall back to localStorage
      const savedVisibility = localStorage.getItem('fieldVisibility');
      if (savedVisibility) {
        try {
          setFieldVisibility(JSON.parse(savedVisibility));
        } catch (error) {
          console.error('Error parsing visibility data:', error);
          setFieldVisibility(defaultVisibility);
        }
      }
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('visibility_settings')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading visibility settings:', error);
        setError(error.message);
        setFieldVisibility(defaultVisibility);
      } else if (data) {
        setFieldVisibility(data.visibility);
      } else {
        // No data found, use default
        setFieldVisibility(defaultVisibility);
      }
    } catch (err) {
      console.error('Error loading visibility settings:', err);
      setError('Fehler beim Laden der Sichtbarkeitseinstellungen');
      setFieldVisibility(defaultVisibility);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save visibility settings to Supabase
  const saveVisibilitySettings = useCallback(async (newVisibility: FieldVisibility) => {
    if (!isSupabaseConfigured()) {
      // Fall back to localStorage
      localStorage.setItem('fieldVisibility', JSON.stringify(newVisibility));
      setFieldVisibility(newVisibility);
      return;
    }

    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('visibility_settings')
        .upsert({
          language,
          visibility: newVisibility
        }, { 
          onConflict: 'language' 
        });

      if (error) {
        console.error('Error saving visibility settings:', error);
        setError(error.message);
        // Fall back to localStorage on error
        localStorage.setItem('fieldVisibility', JSON.stringify(newVisibility));
      } else {
        setFieldVisibility(newVisibility);
        setError(null);
      }
    } catch (err) {
      console.error('Error saving visibility settings:', err);
      setError('Fehler beim Speichern der Sichtbarkeitseinstellungen');
      // Fall back to localStorage on error
      localStorage.setItem('fieldVisibility', JSON.stringify(newVisibility));
      setFieldVisibility(newVisibility);
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
