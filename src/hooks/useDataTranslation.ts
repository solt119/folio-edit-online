
import { useCallback } from 'react';
import { CVData } from '@/types/cv';
import { translateCVData } from '@/utils/translationService';
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
    } else if (Object.keys(customData).length > 0) {
      // If we have custom data for other language but not current, translate it
      const otherLanguage = language === 'de' ? 'en' : 'de';
      if (customData[otherLanguage]) {
        console.log('Translating from', otherLanguage, 'to', language);
        const translatedData = translateCVData(customData[otherLanguage], otherLanguage, language);
        console.log('Translated data:', translatedData);
        return translatedData;
      }
    }
    
    console.log('Using default data for', language);
    return cvContentTranslations[language];
  }, []);

  const autoTranslateData = useCallback(async (
    newCvData: CVData,
    fromLanguage: 'de' | 'en',
    customData: { [key: string]: CVData }
  ): Promise<{ [key: string]: CVData }> => {
    const newCustomData = {
      ...customData,
      [fromLanguage]: newCvData
    };
    
    // Translate to the other language using the basic translation service
    const otherLanguage = fromLanguage === 'de' ? 'en' : 'de';
    console.log('Auto-translating to', otherLanguage);
    
    // Use the basic translation service to translate the custom data
    newCustomData[otherLanguage] = translateCVData(newCvData, fromLanguage, otherLanguage);
    console.log('Auto-translated data:', newCustomData[otherLanguage]);
    
    return newCustomData;
  }, []);

  const forceRetranslate = useCallback(async (
    customData: { [key: string]: CVData }
  ): Promise<{ [key: string]: CVData }> => {
    if (!customData.de && !customData.en) {
      return customData;
    }
    
    // Use German as source if available, otherwise English
    const sourceLanguage = customData.de ? 'de' : 'en';
    const targetLanguage = sourceLanguage === 'de' ? 'en' : 'de';
    
    const newCustomData = { ...customData };
    
    // Use basic translation service
    newCustomData[targetLanguage] = translateCVData(customData[sourceLanguage], sourceLanguage, targetLanguage);
    console.log('Force retranslated data:', newCustomData);
    
    return newCustomData;
  }, []);

  return {
    getDataForLanguage,
    autoTranslateData,
    forceRetranslate
  };
};
