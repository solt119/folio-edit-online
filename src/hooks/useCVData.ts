
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
      // First save to Supabase for current language
      await supabaseData.saveCVData(newCvData);
      
      // Update cache and handle auto-translation
      const updatedCustomData = await autoTranslateData(
        newCvData, 
        currentEditingLanguage, 
        customDataCache
      );
      
      setCustomDataCache(updatedCustomData);
      
      console.log('Save with auto-translation completed successfully');
    } catch (error) {
      console.error('Error saving data with auto-translation:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [supabaseData, autoTranslateData, currentEditingLanguage, customDataCache]);

  // Handle language switching with automatic translation
  useEffect(() => {
    const handleLanguageSwitch = async () => {
      if (language !== currentEditingLanguage) {
        console.log('Language switched from', currentEditingLanguage, 'to', language);
        setIsTranslating(true);
        
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
            
            // Get or translate data for the new language
            console.log('Getting/translating data for new language:', language);
            const targetData = await getDataForLanguage(language, newCache);
            
            if (targetData) {
              console.log('Setting translated data for language:', language);
              supabaseData.setCvData(targetData);
              
              // If this is a new translation, also save it to Supabase
              if (!newCache[language]) {
                console.log('Saving new translation to Supabase for:', language);
                // Temporarily switch the language context for saving
                const originalLanguage = currentEditingLanguage;
                setCurrentEditingLanguage(language);
                await supabaseData.saveCVData(targetData);
                setCurrentEditingLanguage(originalLanguage);
              }
            }
          }
          
          setCurrentEditingLanguage(language);
        } catch (error) {
          console.error('Error during language switch:', error);
        } finally {
          setIsTranslating(false);
        }
      }
    };

    handleLanguageSwitch();
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
