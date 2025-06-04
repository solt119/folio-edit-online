
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

  // Load CV data from Supabase with enhanced translation handling
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
      
      // First, try to load data for current language
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Fehler beim Laden der CV-Daten:', error);
        setError('Supabase-Query-Fehler');
        setCvData(cvContentTranslations[language]);
      } else if (data && data.content) {
        console.log('✅ CV-Daten gefunden für Sprache:', language);
        console.log('📋 Geladene Daten:', data.content);
        setCvData(data.content);
        setError(null);
      } else {
        console.log('📝 Keine CV-Daten gefunden für Sprache:', language);
        console.log('🔄 Starte automatische Übersetzung...');
        
        // Try to find data in the other language
        const otherLanguage = language === 'de' ? 'en' : 'de';
        console.log('🔍 Suche Daten in Sprache:', otherLanguage);
        
        const { data: otherLangData, error: otherError } = await supabase
          .from('cv_data')
          .select('*')
          .eq('language', otherLanguage)
          .single();
          
        if (otherLangData && otherLangData.content && !otherError) {
          console.log('✅ Quelldaten gefunden in Sprache:', otherLanguage);
          console.log('🔄 Übersetze von', otherLanguage, 'nach', language);
          
          try {
            const translatedData = await translateCVData(otherLangData.content, language);
            console.log('✅ Übersetzung abgeschlossen für Sprache:', language);
            console.log('📋 Übersetzte Daten:', translatedData);
            
            // Save translated data immediately
            const { error: saveError } = await supabase
              .from('cv_data')
              .upsert({
                language: language,
                content: translatedData,
                updated_at: new Date().toISOString()
              }, { 
                onConflict: 'language' 
              });

            if (saveError) {
              console.error('❌ Fehler beim Speichern der übersetzten Daten:', saveError);
              // Use translated data anyway, even if save failed
              setCvData(translatedData);
            } else {
              console.log('✅ Übersetzte Daten erfolgreich gespeichert für Sprache:', language);
              setCvData(translatedData);
            }
          } catch (translationError) {
            console.error('❌ Übersetzung fehlgeschlagen:', translationError);
            // Fallback to default data
            console.log('⚠️ Verwende Standard-Daten als Fallback');
            setCvData(cvContentTranslations[language]);
          }
        } else {
          console.log('❌ Keine Quelldaten gefunden - verwende Standard-Daten');
          setCvData(cvContentTranslations[language]);
        }
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

  // Save CV data to Supabase with explicit language parameter
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
