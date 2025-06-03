
import { useCallback } from 'react';
import { CVData } from '@/types/cv';
import { cvContentTranslations } from '@/utils/cvContentTranslations';

export const useDataTranslation = () => {
  const getDataForLanguage = useCallback((
    language: 'de' | 'en',
    customData: { [key: string]: CVData }
  ): CVData => {
    console.log('Getting data for language:', language);
    console.log('Available custom data:', Object.keys(customData));
    
    if (customData[language]) {
      console.log('Using existing custom data for', language);
      return customData[language];
    }
    
    console.log('Using default data for', language);
    return cvContentTranslations[language];
  }, []);

  const autoTranslateData = useCallback(async (
    newCvData: CVData,
    fromLanguage: 'de' | 'en',
    customData: { [key: string]: CVData }
  ): Promise<{ [key: string]: CVData }> => {
    // No automatic translation - just save the data for the current language
    const newCustomData = {
      ...customData,
      [fromLanguage]: newCvData
    };
    
    console.log('Saving data without auto-translation for language:', fromLanguage);
    
    return newCustomData;
  }, []);

  const forceRetranslate = useCallback(async (
    customData: { [key: string]: CVData }
  ): Promise<{ [key: string]: CVData }> => {
    // No forced retranslation - return data as is
    console.log('Force retranslation disabled - returning data as is');
    return customData;
  }, []);

  return {
    getDataForLanguage,
    autoTranslateData,
    forceRetranslate
  };
};
