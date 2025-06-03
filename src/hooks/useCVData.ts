
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

  const {
    customData,
    fieldVisibility,
    setFieldVisibility,
    loadStoredData,
    saveCustomData
  } = useLocalStorage();

  const { getDataForLanguage, autoTranslateData } = useDataTranslation();

  // Save custom data with auto-translation
  const saveCustomDataWithTranslation = useCallback((newCvData: CVData) => {
    const newCustomData = autoTranslateData(newCvData, language, customData);
    saveCustomData(newCustomData);
  }, [autoTranslateData, customData, language, saveCustomData]);

  const updateFunctions = useDataUpdates({
    saveCustomDataWithTranslation,
    setFieldVisibility,
    setCvData
  });

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
  useEffect(() => {
    if (!isInitialized) return;
    
    const newData = getDataForLanguage(language, customData);
    
    // If we got translated data, save it
    if (newData !== cvContentTranslations[language] && !customData[language]) {
      const newCustomData = {
        ...customData,
        [language]: newData
      };
      saveCustomData(newCustomData);
    }
    
    setCvData(newData);
  }, [language, customData, isInitialized, getDataForLanguage, saveCustomData]);

  return {
    cvData,
    fieldVisibility,
    ...updateFunctions
  };
};
