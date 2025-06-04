
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
    console.log('loadCVData called, isSupabaseConfigured:', isSupabaseConfigured());
    
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using default translations');
      setCvData(cvContentTranslations[language]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = getSupabase();
      
      console.log('Loading data from Supabase for language:', language);
      
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('language', language)
        .single();

      console.log('Supabase response - data:', data, 'error:', error);

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading CV data:', error);
        setError(error.message);
        setCvData(cvContentTranslations[language]);
      } else if (data) {
        console.log('Data loaded from Supabase:', data.content);
        setCvData(data.content);
      } else {
        console.log('No data found in Supabase, using default');
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
    console.log('saveCVData called with:', newCvData);
    
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, saving locally only');
      setCvData(newCvData);
      return;
    }

    try {
      const supabase = getSupabase();
      
      console.log('Saving to Supabase for language:', language);
      
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
        console.log('Data saved successfully to Supabase');
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
