
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { getSupabase, testSupabaseConnection, forceReconnection } from '@/lib/supabase';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { translateCVData } from '@/utils/translationService';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSupabaseCVData = () => {
  const [cvData, setCvData] = useState<CVData>(cvContentTranslations.de);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  // Load CV data from Supabase with enhanced column handling
  const loadCVData = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Lade CV-Daten für Sprache:', language);
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('❌ Supabase nicht verfügbar - verwende Standard-Daten');
        setCvData(cvContentTranslations[language]);
        setError('Supabase-Verbindung fehlgeschlagen');
        setIsLoading(false);
        return;
      }

      console.log('✅ Supabase-Verbindung erfolgreich');
      const supabase = getSupabase();
      
      // Load German data and check for English column
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('language', 'de')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Fehler beim Laden der CV-Daten:', error);
        setError('Supabase-Query-Fehler');
        setCvData(cvContentTranslations[language]);
      } else if (data) {
        // Choose correct content based on language
        let contentToUse;
        
        if (language === 'en' && data.content_en) {
          console.log('✅ Verwende englische Spalte (content_en)');
          contentToUse = data.content_en;
        } else if (language === 'de' && data.content) {
          console.log('✅ Verwende deutsche Spalte (content)');
          contentToUse = data.content;
        } else if (data.content) {
          console.log('⚠️ Sprach-spezifische Spalte nicht gefunden, verwende Hauptinhalt');
          contentToUse = data.content;
        } else {
          console.log('❌ Keine Inhalte gefunden');
          setCvData(cvContentTranslations[language]);
          setError(null);
          setIsLoading(false);
          return;
        }

        console.log('📋 Geladene Daten für Sprache', language, ':', contentToUse);
        setCvData(contentToUse);
        setError(null);
      } else {
        console.log('📝 Keine CV-Daten gefunden - verwende Standard-Daten');
        setCvData(cvContentTranslations[language]);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Unerwarteter Fehler:', err);
      setError('Verbindungsfehler');
      setCvData(cvContentTranslations[language]);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save CV data to Supabase with column-specific saving
  const saveCVData = useCallback(async (newCvData: CVData, targetLanguage?: 'de' | 'en') => {
    const saveLanguage = targetLanguage || language;
    
    try {
      console.log('💾 Speichere CV-Daten für Sprache:', saveLanguage);
      console.log('📋 Zu speichernde Daten:', newCvData);
      
      // Update local state immediately for current language
      if (saveLanguage === language) {
        setCvData(newCvData);
      }
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.warn('❌ Supabase nicht verfügbar');
        setError('Supabase nicht verfügbar');
        return;
      }

      const supabase = getSupabase();
      
      // Determine which column to update
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (saveLanguage === 'de') {
        updateData.content = newCvData;
        console.log('💾 Speichere in content (Deutsch)');
      } else {
        updateData.content_en = newCvData;
        console.log('💾 Speichere in content_en (Englisch)');
      }
      
      const { error } = await supabase
        .from('cv_data')
        .update(updateData)
        .eq('language', 'de'); // Always update the German record since it contains both columns

      if (error) {
        console.error('❌ Fehler beim Speichern:', error);
        setError('Speichern fehlgeschlagen');
      } else {
        console.log('✅ Daten erfolgreich gespeichert für Sprache:', saveLanguage);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Fehler beim Speichern:', err);
      setError('Verbindungsfehler beim Speichern');
    }
  }, [language]);

  // Force reload when language changes
  useEffect(() => {
    console.log('🌍 Sprachwechsel erkannt - lade Daten neu für:', language);
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
