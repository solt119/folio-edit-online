
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { useLanguage } from '@/contexts/LanguageContext';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { useLocalStorage } from './useLocalStorage';
import { useDataTranslation } from './useDataTranslation';
import { useDataUpdates } from './useDataUpdates';

export const useCVData = () => {
  const { language } = useLanguage();
  const [cvData, setCvData] = useState<CVData>(cvContentTranslations[language]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentEditingLanguage, setCurrentEditingLanguage] = useState<'de' | 'en'>(language);

  const {
    customData,
    fieldVisibility,
    setFieldVisibility,
    loadStoredData,
    saveCustomData,
    retranslateStoredData
  } = useLocalStorage();

  const { getDataForLanguage, autoTranslateData, forceRetranslate } = useDataTranslation();

  // Save custom data with auto-translation
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    const newCustomData = await autoTranslateData(newCvData, currentEditingLanguage, customData);
    saveCustomData(newCustomData);
    
    // Update the current display with the new data for current language
    setCvData(newCustomData[language]);
  }, [autoTranslateData, customData, currentEditingLanguage, language, saveCustomData, setCvData]);

  const updateFunctions = useDataUpdates({
    saveCustomDataWithTranslation,
    setFieldVisibility,
    setCvData
  });

  // Track when user starts editing to remember the language context
  const startEditing = useCallback(() => {
    setCurrentEditingLanguage(language);
  }, [language]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = loadStoredData();
    
    if (storedData[language]) {
      console.log('Setting CV data for language:', language);
      setCvData(storedData[language]);
    } else {
      console.log('No custom data for current language, using default');
      setCvData(cvContentTranslations[language]);
    }
    
    setIsInitialized(true);
  }, [language, loadStoredData]);

  // Update CV data when language changes (only after initialization)
  // This now handles real-time translation during editing
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log('Language changed to:', language);
    console.log('Available custom data languages:', Object.keys(customData));
    
    // If we have custom data, always try to get/translate for the current language
    if (Object.keys(customData).length > 0) {
      const newData = getDataForLanguage(language, customData);
      
      // If we got translated data and it's different from what we have stored, save it
      if (newData !== cvContentTranslations[language] && !customData[language]) {
        console.log('Saving translated data for language:', language);
        const newCustomData = {
          ...customData,
          [language]: newData
        };
        saveCustomData(newCustomData);
      }
      
      // Always update the display with the correct language data
      setCvData(newData);
    } else {
      // No custom data, use defaults
      setCvData(cvContentTranslations[language]);
    }
  }, [language, customData, isInitialized, getDataForLanguage, saveCustomData]);

  return {
    cvData,
    fieldVisibility,
    currentEditingLanguage,
    startEditing,
    ...updateFunctions
  };
};
