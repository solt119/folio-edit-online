
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { FieldVisibility, defaultVisibility } from '@/types/visibility';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { useLanguage } from '@/contexts/LanguageContext';

export const useLocalStorage = () => {
  const { language } = useLanguage();
  const [customData, setCustomData] = useState<{ [key: string]: CVData }>({});
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>(defaultVisibility);
  const [cvData, setCvData] = useState<CVData>(cvContentTranslations[language]);

  // Load data from localStorage
  const loadStoredData = useCallback(() => {
    console.log('Loading data from localStorage...');
    const savedCustomData = localStorage.getItem('customCvData');
    const savedVisibility = localStorage.getItem('fieldVisibility');
    
    if (savedCustomData) {
      try {
        const parsed = JSON.parse(savedCustomData);
        console.log('Loaded custom data:', parsed);
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
    
    if (savedVisibility) {
      try {
        setFieldVisibility(JSON.parse(savedVisibility));
      } catch (error) {
        console.error('Error parsing visibility data:', error);
      }
    }
    
    return {};
  }, [language]);

  // Save custom data to localStorage
  const saveCustomData = useCallback((newCustomData: { [key: string]: CVData }) => {
    console.log('Saving custom data:', newCustomData);
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

  // Save field visibility to localStorage
  useEffect(() => {
    localStorage.setItem('fieldVisibility', JSON.stringify(fieldVisibility));
  }, [fieldVisibility]);

  return {
    customData,
    cvData,
    setCvData,
    fieldVisibility,
    setFieldVisibility,
    loadStoredData,
    saveCustomData
  };
};
