
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
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);

  // Always try to use Supabase, with automatic fallback to localStorage
  const supabaseData = useSupabaseCVData();
  const localStorageData = useLocalStorage();
  const visibilityData = useSupabaseVisibility();
  const { getDataForLanguage, autoTranslateData } = useDataTranslation();

  // Use Supabase data as primary source
  const cvData = supabaseData.cvData;
  const fieldVisibility = visibilityData.fieldVisibility;

  // Enhanced save function that saves translated data to Supabase for both languages
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    console.log('Saving CV data with auto-translation for language:', currentEditingLanguage);
    setIsTranslating(true);
    
    try {
      // First save current data to Supabase
      await supabaseData.saveCVData(newCvData);
      console.log('Saved current language data to Supabase');
      
      // Update cache and handle auto-translation
      const updatedCustomData = await autoTranslateData(
        newCvData, 
        currentEditingLanguage, 
        customDataCache
      );
      
      setCustomDataCache(updatedCustomData);
      
      // Save translated data to Supabase for the other language
      const otherLanguage = currentEditingLanguage === 'de' ? 'en' : 'de';
      if (updatedCustomData[otherLanguage]) {
        console.log('Saving translated data to Supabase for', otherLanguage);
        
        // Temporarily switch language context to save translated data
        const originalLanguage = currentEditingLanguage;
        setCurrentEditingLanguage(otherLanguage);
        
        // Create a temporary Supabase hook for the other language
        const tempSupabase = { ...supabaseData };
        await tempSupabase.saveCVData(updatedCustomData[otherLanguage]);
        
        // Switch back to original language
        setCurrentEditingLanguage(originalLanguage);
        
        console.log('Translated data saved to Supabase for', otherLanguage);
      }
      
      console.log('Save with auto-translation completed successfully');
    } catch (error) {
      console.error('Error saving data with auto-translation:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [supabaseData, autoTranslateData, currentEditingLanguage, customDataCache]);

  // Handle language switching - load from Supabase for the new language
  useEffect(() => {
    const handleLanguageSwitch = async () => {
      if (language !== currentEditingLanguage && !isLanguageSwitching) {
        console.log('Language switched from', currentEditingLanguage, 'to', language);
        setIsLanguageSwitching(true);
        
        try {
          // Store current data in cache before switching
          const currentData = supabaseData.cvData;
          if (currentData) {
            console.log('Storing current data for language:', currentEditingLanguage);
            const newCache = {
              ...customDataCache,
              [currentEditingLanguage]: currentData
            };
            setCustomDataCache(newCache);
          }
          
          // Load data for new language from Supabase
          console.log('Loading data for new language from Supabase:', language);
          await supabaseData.refetch(); // This will load data for the new language
          
          setCurrentEditingLanguage(language);
        } catch (error) {
          console.error('Error during language switch:', error);
        } finally {
          setIsLanguageSwitching(false);
        }
      }
    };

    // Debounce the language switch to prevent rapid changes
    const timeoutId = setTimeout(handleLanguageSwitch, 100);
    
    return () => clearTimeout(timeoutId);
  }, [language, currentEditingLanguage, customDataCache, supabaseData, isLanguageSwitching]);

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
