
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
    saveCustomData,
    retranslateStoredData
  } = useLocalStorage();

  const { getDataForLanguage, autoTranslateData, forceRetranslate } = useDataTranslation();

  // Save custom data with auto-translation
  const saveCustomDataWithTranslation = useCallback(async (newCvData: CVData) => {
    const newCustomData = await autoTranslateData(newCvData, language, customData);
    saveCustomData(newCustomData);
  }, [autoTranslateData, customData, language, saveCustomData]);

  // Force retranslation of all data
  const forceRetranslateAll = useCallback(async () => {
    const retranslatedData = await forceRetranslate(customData);
    saveCustomData(retranslatedData);
  }, [forceRetranslate, customData, saveCustomData]);

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
    
    const openaiKey = localStorage.getItem('openai_api_key');
    
    // If we have custom data and OpenAI key, try to get translated data
    if (Object.keys(customData).length > 0 && openaiKey) {
      const otherLanguage = language === 'de' ? 'en' : 'de';
      
      // If we don't have data for current language but have for other language
      if (!customData[language] && customData[otherLanguage]) {
        console.log('Auto-translating custom data with OpenAI for language:', language);
        autoTranslateData(customData[otherLanguage], otherLanguage, {}).then(translatedData => {
          if (translatedData[language]) {
            setCvData(translatedData[language]);
            // Save the translated data
            const newCustomData = {
              ...customData,
              [language]: translatedData[language]
            };
            saveCustomData(newCustomData);
          }
        }).catch(error => {
          console.error('Translation failed:', error);
          // Fallback to basic translation
          const newData = getDataForLanguage(language, customData);
          setCvData(newData);
        });
        return;
      }
    }
    
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
  }, [language, customData, isInitialized, getDataForLanguage, saveCustomData, autoTranslateData]);

  // One-time retranslation on mount if needed
  useEffect(() => {
    if (isInitialized && Object.keys(customData).length > 0) {
      // Check if we need to retranslate (e.g., if English bio still contains German text)
      const englishData = customData.en;
      if (englishData?.personalInfo?.bio?.includes('mit 5+ Jahren Erfahrung')) {
        console.log('Detected untranslated text, forcing retranslation...');
        forceRetranslateAll();
      }
    }
  }, [isInitialized, customData, forceRetranslateAll]);

  return {
    cvData,
    fieldVisibility,
    forceRetranslateAll,
    ...updateFunctions
  };
};
