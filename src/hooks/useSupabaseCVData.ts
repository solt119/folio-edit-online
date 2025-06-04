
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { getSupabase, testSupabaseConnection, forceReconnection } from '@/lib/supabase';
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
      console.log('🔄 Versuche CV-Daten von Supabase zu laden...');
      console.log('🌍 Aktueller Standort:', window.location.href);
      console.log('📡 Lade CV-Daten für Sprache:', language);
      
      // IMMER Verbindungstest durchführen
      console.log('🔍 Führe Supabase-Verbindungstest durch...');
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('❌ Supabase nicht verfügbar - verwende Standard-Daten');
        setCvData(cvContentTranslations[language]);
        setError('Supabase-Verbindung fehlgeschlagen');
        setIsLoading(false);
        return;
      }

      console.log('✅ Supabase-Verbindung erfolgreich - lade Daten...');
      const supabase = getSupabase();
      
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Fehler beim Laden der CV-Daten:', error);
        setError('Supabase-Query-Fehler');
        setCvData(cvContentTranslations[language]);
      } else if (data) {
        console.log('✅ CV-Daten von Supabase geladen für Sprache:', language);
        console.log('📋 Geladene Daten:', data.content);
        setCvData(data.content);
        setError(null);
      } else {
        console.log('📝 Keine CV-Daten in Supabase gefunden für Sprache:', language, '- verwende Standard-Daten');
        setCvData(cvContentTranslations[language]);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Unerwarteter Fehler beim Laden der CV-Daten:', err);
      setError('Verbindungsfehler');
      setCvData(cvContentTranslations[language]);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save CV data to Supabase with explicit language parameter
  const saveCVData = useCallback(async (newCvData: CVData, targetLanguage?: 'de' | 'en') => {
    const saveLanguage = targetLanguage || language;
    
    try {
      console.log('💾 Speichere CV-Daten für Sprache:', saveLanguage);
      
      // Update local state only if saving for current language
      if (saveLanguage === language) {
        setCvData(newCvData);
      }
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.warn('❌ Supabase nicht verfügbar, Speichern nicht möglich');
        setError('Supabase nicht verfügbar');
        return;
      }

      const supabase = getSupabase();
      
      const { error } = await supabase
        .from('cv_data')
        .upsert({
          language: saveLanguage,
          content: newCvData,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'language' 
        });

      if (error) {
        console.error('❌ Fehler beim Speichern der CV-Daten:', error);
        setError('Speichern fehlgeschlagen');
      } else {
        console.log('✅ CV-Daten in Supabase gespeichert für Sprache:', saveLanguage);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Fehler beim Speichern der CV-Daten:', err);
      setError('Verbindungsfehler beim Speichern');
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
    refetch: loadCVData,
    forceReconnection: async () => {
      const result = await forceReconnection();
      if (result) {
        await loadCVData();
      }
      return result;
    }
  };
};
