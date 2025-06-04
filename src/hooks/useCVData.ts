
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalStorage } from './useLocalStorage';
import { useDataUpdates } from './useDataUpdates';
import { useSupabaseCVData } from './useSupabaseCVData';
import { isSupabaseConfigured } from '@/lib/supabase';

export const useCVData = () => {
  const { language } = useLanguage();
  const [currentEditingLanguage, setCurrentEditingLanguage] = useState<'de' | 'en'>(language);

  // Use Supabase if configured, otherwise fall back to localStorage
  const supabaseData = useSupabaseCVData();
  const localStorageData = useLocalStorage();

  const isUsingSupabase = isSupabaseConfigured();

  console.log('useCVData - isUsingSupabase:', isUsingSupabase);
  console.log('useCVData - supabaseData.cvData:', supabaseData.cvData);
  console.log('useCVData - localStorageData.cvData:', localStorageData.cvData);

  // Choose data source based on Supabase configuration
  const cvData = isUsingSupabase ? supabaseData.cvData : localStorageData.cvData;
  const fieldVisibility = localStorageData.fieldVisibility; // Always use localStorage for visibility

  // Save function that uses appropriate storage
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    console.log('saveCustomDataWithTranslation called with:', newCvData);
    console.log('isUsingSupabase:', isUsingSupabase);
    
    if (isUsingSupabase) {
      console.log('Saving to Supabase...');
      await supabaseData.saveCVData(newCvData);
    } else {
      console.log('Saving to localStorage...');
      // Fall back to localStorage method
      localStorageData.saveCustomData({ [language]: newCvData });
    }
  }, [isUsingSupabase, supabaseData, localStorageData, language]);

  const updateFunctions = useDataUpdates({
    saveCustomDataWithTranslation,
    setFieldVisibility: localStorageData.setFieldVisibility,
    setCvData: isUsingSupabase ? supabaseData.setCvData : localStorageData.setCvData
  });

  // Track when user starts editing to remember the language context
  const startEditing = useCallback(() => {
    setCurrentEditingLanguage(language);
  }, [language]);

  return {
    cvData,
    fieldVisibility,
    currentEditingLanguage,
    startEditing,
    isLoading: isUsingSupabase ? supabaseData.isLoading : false,
    error: isUsingSupabase ? supabaseData.error : null,
    ...updateFunctions
  };
};
