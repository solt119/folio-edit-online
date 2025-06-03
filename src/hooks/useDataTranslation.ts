
import { useCallback } from 'react';
import { CVData } from '@/types/cv';
import { translateCVData } from '@/utils/translationService';
import { translateCVDataWithOpenAI } from '@/utils/openaiTranslation';
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
    
    // Auto-translate to the other language using OpenAI if available
    const otherLanguage = fromLanguage === 'de' ? 'en' : 'de';
    console.log('Auto-translating to', otherLanguage, 'with OpenAI');
    
    try {
      const openaiKey = localStorage.getItem('openai_api_key');
      if (openaiKey) {
        newCustomData[otherLanguage] = await translateCVDataWithOpenAI(newCvData, fromLanguage, otherLanguage, openaiKey);
        console.log('OpenAI auto-translated data:', newCustomData[otherLanguage]);
      } else {
        // Fallback to basic translation
        newCustomData[otherLanguage] = translateCVData(newCvData, fromLanguage, otherLanguage);
        console.log('Basic auto-translated data:', newCustomData[otherLanguage]);
      }
    } catch (error) {
      console.error('OpenAI translation failed, using fallback:', error);
      newCustomData[otherLanguage] = translateCVData(newCvData, fromLanguage, otherLanguage);
    }
    
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
    
    try {
      const openaiKey = localStorage.getItem('openai_api_key');
      if (openaiKey) {
        newCustomData[targetLanguage] = await translateCVDataWithOpenAI(customData[sourceLanguage], sourceLanguage, targetLanguage, openaiKey);
        console.log('OpenAI force retranslated data:', newCustomData);
      } else {
        // Fallback to basic translation
        newCustomData[targetLanguage] = translateCVData(customData[sourceLanguage], sourceLanguage, targetLanguage);
        console.log('Basic force retranslated data:', newCustomData);
      }
    } catch (error) {
      console.error('OpenAI retranslation failed, using fallback:', error);
      newCustomData[targetLanguage] = translateCVData(customData[sourceLanguage], sourceLanguage, targetLanguage);
    }
    
    return newCustomData;
  }, []);

  return {
    getDataForLanguage,
    autoTranslateData,
    forceRetranslate
  };
};
