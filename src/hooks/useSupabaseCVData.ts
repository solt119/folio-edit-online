
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
  const loadCVData = useCallback(async (targetLanguage: 'de' | 'en') => {
    try {
      setIsLoading(true);
      console.log('🔄 [LANG-DEBUG] Lade CV-Daten für Sprache:', targetLanguage);
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('❌ [LANG-DEBUG] Supabase nicht verfügbar - verwende Standard-Daten');
        setCvData(cvContentTranslations[targetLanguage]);
        setError('Supabase-Verbindung fehlgeschlagen');
        setIsLoading(false);
        return;
      }

      console.log('✅ [LANG-DEBUG] Supabase-Verbindung erfolgreich');
      const supabase = getSupabase();
      
      // Load the main record (always from the 'de' record which contains both columns)
      console.log('📡 [LANG-DEBUG] Lade Daten aus Datenbank...');
      const { data, error } = await supabase
        .from('cv_data')
        .select('content, content_en')
        .eq('language', 'de')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [LANG-DEBUG] Fehler beim Laden der CV-Daten:', error);
        setError('Supabase-Query-Fehler');
        setCvData(cvContentTranslations[targetLanguage]);
      } else if (data) {
        console.log('📋 [LANG-DEBUG] Rohdaten aus Datenbank:', {
          language: targetLanguage,
          hasContent: !!data.content,
          hasContentEn: !!data.content_en,
          contentKeys: data.content ? Object.keys(data.content) : [],
          contentEnKeys: data.content_en ? Object.keys(data.content_en) : []
        });

        // Select the correct content based on target language
        let contentToUse;
        
        if (targetLanguage === 'en') {
          console.log('🌍 [LANG-DEBUG] Sprache ist EN - prüfe content_en...');
          if (data.content_en && Object.keys(data.content_en).length > 0) {
            console.log('✅ [LANG-DEBUG] content_en gefunden und verwendet');
            contentToUse = data.content_en;
          } else {
            console.log('⚠️ [LANG-DEBUG] content_en leer/nicht gefunden, verwende Standard-EN');
            contentToUse = cvContentTranslations.en;
          }
        } else {
          console.log('🌍 [LANG-DEBUG] Sprache ist DE - verwende content');
          if (data.content && Object.keys(data.content).length > 0) {
            console.log('✅ [LANG-DEBUG] content gefunden und verwendet');
            contentToUse = data.content;
          } else {
            console.log('❌ [LANG-DEBUG] content nicht gefunden - verwende Standard-DE');
            contentToUse = cvContentTranslations.de;
          }
        }

        console.log('📋 [LANG-DEBUG] Finale Daten für Sprache', targetLanguage, ':', {
          name: contentToUse?.personalInfo?.name,
          profession: contentToUse?.personalInfo?.profession,
          experienceCount: contentToUse?.experiences?.length || 0
        });
        
        setCvData(contentToUse);
        setError(null);
      } else {
        console.log('📝 [LANG-DEBUG] Keine CV-Daten gefunden - verwende Standard-Daten');
        setCvData(cvContentTranslations[targetLanguage]);
        setError(null);
      }
    } catch (err) {
      console.error('❌ [LANG-DEBUG] Unerwarteter Fehler:', err);
      setError('Verbindungsfehler');
      setCvData(cvContentTranslations[targetLanguage]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Keine Dependencies um Endlosschleife zu vermeiden

  // Save CV data to Supabase with column-specific saving
  const saveCVData = useCallback(async (newCvData: CVData, targetLanguage?: 'de' | 'en') => {
    const saveLanguage = targetLanguage || language;
    
    try {
      console.log('💾 [SAVE-DEBUG] Speichere CV-Daten für Sprache:', saveLanguage);
      console.log('📋 [SAVE-DEBUG] Zu speichernde Daten:', {
        name: newCvData?.personalInfo?.name,
        profession: newCvData?.personalInfo?.profession
      });
      
      // Update local state immediately for current language
      if (saveLanguage === language) {
        console.log('🔄 [SAVE-DEBUG] Aktualisiere lokalen State');
        setCvData(newCvData);
      }
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.warn('❌ [SAVE-DEBUG] Supabase nicht verfügbar');
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
        console.log('💾 [SAVE-DEBUG] Speichere in content (Deutsch)');
      } else {
        updateData.content_en = newCvData;
        console.log('💾 [SAVE-DEBUG] Speichere in content_en (Englisch)');
      }
      
      const { error } = await supabase
        .from('cv_data')
        .update(updateData)
        .eq('language', 'de'); // Always update the German record since it contains both columns

      if (error) {
        console.error('❌ [SAVE-DEBUG] Fehler beim Speichern:', error);
        setError('Speichern fehlgeschlagen');
      } else {
        console.log('✅ [SAVE-DEBUG] Daten erfolgreich gespeichert für Sprache:', saveLanguage);
        setError(null);
      }
    } catch (err) {
      console.error('❌ [SAVE-DEBUG] Fehler beim Speichern:', err);
      setError('Verbindungsfehler beim Speichern');
    }
  }, [language]);

  // Load data when language changes - direkt mit Parameter
  useEffect(() => {
    console.log('🌍 [EFFECT-DEBUG] useSupabaseCVData: Sprachwechsel erkannt - lade Daten neu für:', language);
    loadCVData(language);
  }, [language, loadCVData]);

  return {
    cvData,
    setCvData,
    saveCVData,
    isLoading,
    error,
    refetch: () => loadCVData(language),
    forceReconnection: async () => {
      const result = await forceReconnection();
      if (result) {
        await loadCVData(language);
      }
      return result;
    }
  };
};
