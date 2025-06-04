
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
  const [isTranslating, setIsTranslating] = useState(false);

  // Always use Supabase as primary data source
  const supabaseData = useSupabaseCVData();
  const localStorageData = useLocalStorage();
  const visibilityData = useSupabaseVisibility();
  const { autoTranslateData } = useDataTranslation();

  // Use Supabase data as primary source
  const cvData = supabaseData.cvData;
  const fieldVisibility = visibilityData.fieldVisibility;

  // Enhanced save function with translation
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    console.log('🔄 Speichere mit Auto-Übersetzung für Sprache:', language);
    setIsTranslating(true);
    
    try {
      // Save current data first
      console.log('💾 Speichere Hauptdaten für:', language);
      await supabaseData.saveCVData(newCvData, language);
      
      // Auto-translate to other language
      const otherLanguage = language === 'de' ? 'en' : 'de';
      console.log('🔄 Starte Auto-Übersetzung für:', otherLanguage);
      
      const translatedData = await autoTranslateData(newCvData, language, {});
      
      if (translatedData[otherLanguage]) {
        console.log('💾 Speichere übersetzte Daten für:', otherLanguage);
        await supabaseData.saveCVData(translatedData[otherLanguage], otherLanguage);
        console.log('✅ Auto-Übersetzung abgeschlossen');
      }
    } catch (error) {
      console.error('❌ Fehler beim Speichern mit Auto-Übersetzung:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [supabaseData, autoTranslateData, language]);

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

  // Track editing language
  const startEditing = useCallback(() => {
    console.log('✏️ Bearbeitung startet in Sprache:', language);
  }, [language]);

  return {
    cvData,
    fieldVisibility,
    currentEditingLanguage: language,
    startEditing,
    isLoading: supabaseData.isLoading || visibilityData.isLoading || isTranslating,
    error: supabaseData.error || visibilityData.error,
    isTranslating,
    ...updateFunctions,
    updateFieldVisibility
  };
};
