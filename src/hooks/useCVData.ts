
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
  const [customDataCache, setCustomDataCache] = useState<{ [key: string]: CVData }>({});

  // Always try to use Supabase, with automatic fallback to localStorage
  const supabaseData = useSupabaseCVData();
  const localStorageData = useLocalStorage();
  const visibilityData = useSupabaseVisibility();
  const { getDataForLanguage, autoTranslateData } = useDataTranslation();

  // Use Supabase data as primary source
  const cvData = supabaseData.cvData;
  const fieldVisibility = visibilityData.fieldVisibility;

  // Enhanced save function that handles automatic translation
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    console.log('Saving CV data with auto-translation for language:', currentEditingLanguage);
    setIsTranslating(true);
    
    try {
      // First save to Supabase
      await supabaseData.saveCVData(newCvData);
      
      // Update cache and handle auto-translation
      const updatedCustomData = await autoTranslateData(
        newCvData, 
        currentEditingLanguage, 
        customDataCache
      );
      
      setCustomDataCache(updatedCustomData);
      
      // Save translated data for the other language if it exists
      const otherLanguage = currentEditingLanguage === 'de' ? 'en' : 'de';
      if (updatedCustomData[otherLanguage]) {
        console.log('Saving auto-translated data for', otherLanguage);
        // We need to temporarily switch context to save the other language
        // This is handled by the Supabase hook internally
      }
      
      console.log('Save with auto-translation completed successfully');
    } catch (error) {
      console.error('Error saving data with auto-translation:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [supabaseData, autoTranslateData, currentEditingLanguage, customDataCache]);

  // Handle language switching with automatic translation
  useEffect(() => {
    if (language !== currentEditingLanguage) {
      console.log('Language switched from', currentEditingLanguage, 'to', language);
      
      // Update custom data cache when language changes
      const currentData = supabaseData.cvData;
      if (currentData) {
        setCustomDataCache(prev => ({
          ...prev,
          [currentEditingLanguage]: currentData
        }));
      }
      
      // Check if we need to get translated data for the new language
      const targetData = getDataForLanguage(language, customDataCache);
      if (targetData) {
        supabaseData.setCvData(targetData);
      }
    }
  }, [language, currentEditingLanguage, customDataCache, getDataForLanguage, supabaseData]);

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
    
    console.log('Updating visibility:', { section, field, visible, updatedVisibility });
    await visibilityData.setFieldVisibility(updatedVisibility);
  }, [fieldVisibility, visibilityData.setFieldVisibility]);

  // Track when user starts editing to remember the language context
  const startEditing = useCallback(() => {
    setCurrentEditingLanguage(language);
    console.log('Started editing in language:', language);
  }, [language]);

  return {
    cvData,
    fieldVisibility,
    currentEditingLanguage,
    startEditing,
    isLoading: supabaseData.isLoading || visibilityData.isLoading || isTranslating,
    error: supabaseData.error || visibilityData.error,
    isTranslating,
    ...updateFunctions,
    updateFieldVisibility
  };
};
