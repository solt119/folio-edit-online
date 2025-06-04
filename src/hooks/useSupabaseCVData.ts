
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
      console.log('🔄 Versuche CV-Daten von Supabase zu laden...');
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.log('📱 Supabase nicht verfügbar, verwende Standard-Daten');
        console.log('💾 Lade Daten aus localStorage...');
        
        // Versuche localStorage als Fallback
        const savedData = localStorage.getItem('customCvData');
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            if (parsed[language]) {
              console.log('✅ CV-Daten aus localStorage geladen für Sprache:', language);
              setCvData(parsed[language]);
            } else {
              console.log('📝 Keine gespeicherten Daten für Sprache gefunden, verwende Standard-Daten');
              setCvData(cvContentTranslations[language]);
            }
          } catch (parseError) {
            console.error('❌ Fehler beim Parsen der localStorage-Daten:', parseError);
            setCvData(cvContentTranslations[language]);
          }
        } else {
          console.log('📝 Keine localStorage-Daten gefunden, verwende Standard-Daten');
          setCvData(cvContentTranslations[language]);
        }
        setIsLoading(false);
        return;
      }

      const supabase = getSupabase();
      
      console.log('📡 Lade CV-Daten von Supabase für Sprache:', language);
      const { data, error } = await supabase
        .from('cv_data')
        .select('*')
        .eq('language', language)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Fehler beim Laden der CV-Daten:', error);
        setError('Supabase-Fehler - verwende lokale Daten');
        
        // Fallback zu localStorage
        const savedData = localStorage.getItem('customCvData');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setCvData(parsed[language] || cvContentTranslations[language]);
        } else {
          setCvData(cvContentTranslations[language]);
        }
      } else if (data) {
        console.log('✅ CV-Daten von Supabase geladen');
        setCvData(data.content);
        setError(null);
        
        // Speichere auch in localStorage als Backup
        const savedData = localStorage.getItem('customCvData') || '{}';
        const parsed = JSON.parse(savedData);
        parsed[language] = data.content;
        localStorage.setItem('customCvData', JSON.stringify(parsed));
      } else {
        console.log('📝 Keine CV-Daten in Supabase gefunden, verwende Standard-Daten');
        setCvData(cvContentTranslations[language]);
        setError(null);
      }
    } catch (err) {
      console.error('❌ Fehler beim Laden der CV-Daten:', err);
      setError('Verbindungsfehler - verwende lokale Daten');
      
      // Fallback zu localStorage
      const savedData = localStorage.getItem('customCvData');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setCvData(parsed[language] || cvContentTranslations[language]);
        } catch {
          setCvData(cvContentTranslations[language]);
        }
      } else {
        setCvData(cvContentTranslations[language]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Save CV data to Supabase
  const saveCVData = useCallback(async (newCvData: CVData) => {
    try {
      console.log('💾 Speichere CV-Daten...');
      
      // Immer zuerst in localStorage speichern
      const savedData = localStorage.getItem('customCvData') || '{}';
      const parsed = JSON.parse(savedData);
      parsed[language] = newCvData;
      localStorage.setItem('customCvData', JSON.stringify(parsed));
      setCvData(newCvData);
      
      const isWorking = await testSupabaseConnection();
      
      if (!isWorking) {
        console.warn('📱 Supabase nicht verfügbar, speichere nur lokal');
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
        console.error('❌ Fehler beim Speichern der CV-Daten:', error);
        setError('Speichern fehlgeschlagen - Daten nur lokal gespeichert');
      } else {
        console.log('✅ CV-Daten in Supabase gespeichert');
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
    refetch: loadCVData
  };
};
