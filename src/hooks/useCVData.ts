
import { useState, useCallback, useEffect } from 'react';
import { CVData } from '@/types/cv';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from './useLocalStorage';
import { useDataUpdates } from './useDataUpdates';
import { useSupabaseCVData } from './useSupabaseCVData';
import { useSupabaseVisibility } from './useSupabaseVisibility';
import { useDataTranslation } from './useDataTranslation';

export const useCVData = () => {
  const { language } = useLanguage();
  const [currentEditingLanguage, setCurrentEditingLanguage] = useState<'de' | 'en'>(language);
  const [isTranslating, setIsTranslating] = useState(false);

  // Always try to use Supabase, with automatic fallback to localStorage
  const supabaseData = useSupabaseCVData();
  const localStorageData = useLocalStorage();
  const visibilityData = useSupabaseVisibility();
  const { autoTranslateData } = useDataTranslation();

  // Use Supabase data as primary source
  const cvData = supabaseData.cvData;
  const fieldVisibility = visibilityData.fieldVisibility;

  // Enhanced save function that saves translated data to Supabase for both languages
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    console.log('🔄 Speichere CV-Daten mit Auto-Übersetzung für Sprache:', currentEditingLanguage);
    setIsTranslating(true);
    
    try {
      // Speichere aktuelle Daten direkt in Supabase
      console.log('💾 Speichere aktuelle Daten für Sprache:', currentEditingLanguage);
      await supabaseData.saveCVData(newCvData, currentEditingLanguage);
      
      // Auto-Übersetzung für die andere Sprache
      const otherLanguage = currentEditingLanguage === 'de' ? 'en' : 'de';
      console.log('🔄 Starte Auto-Übersetzung für:', otherLanguage);
      
      const translatedData = await autoTranslateData(newCvData, currentEditingLanguage, {});
      
      if (translatedData[otherLanguage]) {
        console.log('💾 Speichere übersetzte Daten für:', otherLanguage);
        await supabaseData.saveCVData(translatedData[otherLanguage], otherLanguage);
        console.log('✅ Übersetzte Daten erfolgreich gespeichert für:', otherLanguage);
      }
      
      console.log('✅ Speichern mit Auto-Übersetzung abgeschlossen');
    } catch (error) {
      console.error('❌ Fehler beim Speichern mit Auto-Übersetzung:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [supabaseData, autoTranslateData, currentEditingLanguage]);

  // Create initial translation when switching to a language that has no data
  const createInitialTranslation = useCallback(async () => {
    console.log('🔄 Erstelle initiale Übersetzung für Sprache:', language);
    setIsTranslating(true);
    
    try {
      const otherLanguage = language === 'de' ? 'en' : 'de';
      
      // Get current CV data (which should be from the other language or default)
      const sourceData = cvData;
      
      if (sourceData) {
        console.log('🔄 Übersetze von', otherLanguage, 'nach', language);
        const translatedData = await autoTranslateData(sourceData, otherLanguage, {});
        
        if (translatedData[language]) {
          console.log('💾 Speichere initiale Übersetzung für:', language);
          await supabaseData.saveCVData(translatedData[language], language);
          console.log('✅ Initiale Übersetzung erfolgreich erstellt');
          
          // Reload data to show the translated version
          await supabaseData.refetch();
        }
      }
    } catch (error) {
      console.error('❌ Fehler bei initialer Übersetzung:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [language, cvData, autoTranslateData, supabaseData]);

  // Handle language switching - load from Supabase for the new language
  useEffect(() => {
    if (language !== currentEditingLanguage) {
      console.log('🌍 Sprachwechsel von', currentEditingLanguage, 'zu', language);
      setCurrentEditingLanguage(language);
      
      // Trigger reload of data for new language
      console.log('🔄 Lade Daten für neue Sprache:', language);
      supabaseData.refetch();
    }
  }, [language, currentEditingLanguage, supabaseData]);

  const updateFunctions = useDataUpdates({
    saveCustomDataWithTranslation,
    setFieldVisibility: visibilityData.setFieldVisibility,
    setCvData: supabaseData.setCvData
  });

  // Direct visibility update function
  const updateFieldVisibility = useCallback(async (
    section: keyof typeof fieldVisibility,
    field: string,
    visible: boolean
  ) => {
    const updatedVisibility = {
      ...fieldVisibility,
      [section]: {
        ...fieldVisibility[section],
        [field]: visible
      }
    };
    
    console.log('👁️ Aktualisiere Sichtbarkeit:', { section, field, visible });
    await visibilityData.setFieldVisibility(updatedVisibility);
  }, [fieldVisibility, visibilityData.setFieldVisibility]);

  // Track when user starts editing to remember the language context
  const startEditing = useCallback(() => {
    setCurrentEditingLanguage(language);
    console.log('✏️ Beginne Bearbeitung in Sprache:', language);
  }, [language]);

  return {
    cvData,
    fieldVisibility,
    currentEditingLanguage,
    startEditing,
    createInitialTranslation,
    isLoading: supabaseData.isLoading || visibilityData.isLoading || isTranslating,
    error: supabaseData.error || visibilityData.error,
    isTranslating,
    ...updateFunctions,
    updateFieldVisibility
  };
};
