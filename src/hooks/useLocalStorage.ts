
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export const useLocalStorage = () => {
  const { language } = useLanguage();
  const [customData, setCustomData] = useState<{ [key: string]: CVData }>({});
  const [cvData, setCvData] = useState<CVData>(cvContentTranslations[language]);

  // Load data from localStorage
  const loadStoredData = useCallback(() => {
    const savedCustomData = localStorage.getItem('customCvData');
    
    if (savedCustomData) {
      try {
        const parsed = JSON.parse(savedCustomData);
        setCustomData(parsed);
        
        // Set current language data if available
        if (parsed[language]) {
          setCvData(parsed[language]);
        } else {
          setCvData(cvContentTranslations[language]);
        }
        
        return parsed;
      } catch (error) {
        console.error('Error parsing custom data:', error);
        setCvData(cvContentTranslations[language]);
        return {};
      }
    } else {
      setCvData(cvContentTranslations[language]);
    }
    
    return {};
  }, [language]);

  // Save custom data to localStorage
  const saveCustomData = useCallback((newCustomData: { [key: string]: CVData }) => {
    setCustomData(newCustomData);
    localStorage.setItem('customCvData', JSON.stringify(newCustomData));
    
    // Update current display if data exists for current language
    if (newCustomData[language]) {
      setCvData(newCustomData[language]);
    }
  }, [language]);

  // Load initial data
  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  // Update CV data when language changes
  useEffect(() => {
    if (customData[language]) {
      setCvData(customData[language]);
    } else {
      setCvData(cvContentTranslations[language]);
    }
  }, [language, customData]);

  return {
    customData,
    cvData,
    setCvData,
    loadStoredData,
    saveCustomData
  };
};
