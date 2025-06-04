
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSupabaseCVData = () => {
  const [cvData, setCvData] = useState<CVData>(cvContentTranslations.de);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // Load CV data from Supabase
  const loadCVData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setCvData(cvContentTranslations[language]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading CV data:', error);
        setError(error.message);
        setCvData(cvContentTranslations[language]);
      } else if (data) {
        setCvData(data.content);
      } else {
        // No data found, use default
        setCvData(cvContentTranslations[language]);
      }
    } catch (err) {
      console.error('Error loading CV data:', err);
      setError('Fehler beim Laden der CV-Daten');
      setCvData(cvContentTranslations[language]);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save CV data to Supabase
  const saveCVData = useCallback(async (newCvData: CVData) => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, saving locally only');
      setCvData(newCvData);
      return;
    }

    try {
      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('cv_data')
        .upsert({
          language,
          content: newCvData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving CV data:', error);
        setError(error.message);
      } else {
        setCvData(newCvData);
        setError(null);
      }
    } catch (err) {
      console.error('Error saving CV data:', err);
      setError('Fehler beim Speichern der CV-Daten');
    }
  }, [language]);

  // Load data when component mounts or language changes
  useEffect(() => {
    loadCVData();
  }, [loadCVData]);

  return {
    cvData,
    setCvData,
    saveCVData,
    isLoading,
    error,
    refetch: loadCVData
  };
};
