
import { useState, useEffect, useCallback } from 'react';
import { CVData } from '@/types/cv';
import { FieldVisibility, defaultVisibility } from '@/types/visibility';

export const useLocalStorage = () => {
  const [customData, setCustomData] = useState<{ [key: string]: CVData }>({});
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>(defaultVisibility);

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
        return parsed;
      } catch (error) {
        console.error('Error parsing custom data:', error);
        return {};
      }
    }
    
    if (savedVisibility) {
      try {
        setFieldVisibility(JSON.parse(savedVisibility));
      } catch (error) {
        console.error('Error parsing visibility data:', error);
      }
    }
    
    return {};
  }, []);

  // Save custom data to localStorage
  const saveCustomData = useCallback((newCustomData: { [key: string]: CVData }) => {
    setCustomData(newCustomData);
    localStorage.setItem('customCvData', JSON.stringify(newCustomData));
  }, []);

  // Save field visibility to localStorage
  useEffect(() => {
    localStorage.setItem('fieldVisibility', JSON.stringify(fieldVisibility));
  }, [fieldVisibility]);

  return {
    customData,
    fieldVisibility,
    setFieldVisibility,
    loadStoredData,
    saveCustomData
  };
};
