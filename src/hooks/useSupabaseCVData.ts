
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { getSupabase, testSupabaseConnection } from '@/lib/supabase';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSupabaseCVData = () => {
  const [cvData, setCvData] = useState<CVData>(cvContentTranslations.de);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // Load CV data from Supabase
  const loadCVData = useCallback(async () => {
    try {
      setIsLoading(true);
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('📱 Supabase nicht verfügbar, verwende Standard-Daten');
        setCvData(cvContentTranslations[language]);
        setIsLoading(false);
        return;
      }

      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading CV data:', error);
        setError('Supabase-Verbindung fehlgeschlagen - verwende lokale Daten');
        setCvData(cvContentTranslations[language]);
      } else if (data) {
        setCvData(data.content);
        setError(null);
      } else {
        // No data found, use default
        setCvData(cvContentTranslations[language]);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading CV data:', err);
      setError('Verbindungsfehler - verwende lokale Daten');
      setCvData(cvContentTranslations[language]);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save CV data to Supabase
  const saveCVData = useCallback(async (newCvData: CVData) => {
    try {
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.warn('Supabase nicht verfügbar, speichere nur lokal');
        setCvData(newCvData);
        return;
      }

      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('cv_data')
        .upsert({
          language,
          content: newCvData,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'language' 
        });

      if (error) {
        console.error('Error saving CV data:', error);
        setError('Speichern fehlgeschlagen - Daten nur lokal gespeichert');
        setCvData(newCvData);
      } else {
        setCvData(newCvData);
        setError(null);
      }
    } catch (err) {
      console.error('Error saving CV data:', err);
      setError('Verbindungsfehler beim Speichern');
      setCvData(newCvData);
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
