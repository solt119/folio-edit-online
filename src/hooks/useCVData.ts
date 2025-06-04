
import { useState, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from './useLocalStorage';
import { useDataUpdates } from './useDataUpdates';
import { useSupabaseCVData } from './useSupabaseCVData';
import { useSupabaseVisibility } from './useSupabaseVisibility';
import { isSupabaseConfigured } from '@/lib/supabase';

export const useCVData = () => {
  const { language } = useLanguage();
  const [currentEditingLanguage, setCurrentEditingLanguage] = useState<'de' | 'en'>(language);

  // Use Supabase if configured, otherwise fall back to localStorage
  const supabaseData = useSupabaseCVData();
  const localStorageData = useLocalStorage();
  const visibilityData = useSupabaseVisibility();

  const isUsingSupabase = isSupabaseConfigured();

  // Choose data source based on Supabase configuration
  const cvData = isUsingSupabase ? supabaseData.cvData : localStorageData.cvData;
  const fieldVisibility = visibilityData.fieldVisibility;

  // Save function that uses appropriate storage
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    if (isUsingSupabase) {
      await supabaseData.saveCVData(newCvData);
    } else {
      // Fall back to localStorage method
      localStorageData.saveCustomData({ [language]: newCvData });
    }
  }, [isUsingSupabase, supabaseData, localStorageData, language]);

  const updateFunctions = useDataUpdates({
    saveCustomDataWithTranslation,
    setFieldVisibility: visibilityData.setFieldVisibility,
    setCvData: isUsingSupabase ? supabaseData.setCvData : localStorageData.setCvData
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
  }, [language]);

  return {
    cvData,
    fieldVisibility,
    currentEditingLanguage,
    startEditing,
    isLoading: isUsingSupabase ? (supabaseData.isLoading || visibilityData.isLoading) : false,
    error: isUsingSupabase ? (supabaseData.error || visibilityData.error) : null,
    ...updateFunctions,
    updateFieldVisibility
  };
};
