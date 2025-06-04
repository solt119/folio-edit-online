import { useCallback } from 'react';
import { CVData } from '@/types/cv';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { translateCVData, detectLanguage } from '@/utils/translationService';

export const useDataTranslation = () => {
  const getDataForLanguage = useCallback(async (
    language: 'de' | 'en',
    customData: { [key: string]: CVData },
    currentData?: CVData
  ): Promise<CVData> => {
    console.log('Getting data for language:', language);
    console.log('Available custom data:', Object.keys(customData));
    
    // Wenn wir bereits Daten für diese Sprache haben, verwende sie
    if (customData[language]) {
      console.log('Using existing custom data for', language);
      return customData[language];
    }
    
    // Verwende Standard-Template für die Sprache (keine automatische Übersetzung beim Sprachwechsel)
    console.log('Using default template data for', language);
    return cvContentTranslations[language];
  }, []);

  // Auto-translate function - wird nur beim Speichern aufgerufen
  const autoTranslateData = useCallback(async (
    newCvData: CVData,
    fromLanguage: 'de' | 'en',
    customData: { [key: string]: CVData }
  ): Promise<{ [key: string]: CVData }> => {
    const otherLanguage = fromLanguage === 'de' ? 'en' : 'de';
    
    console.log('Auto-translating data from', fromLanguage, 'to', otherLanguage);
    
    // Update the source language data
    const newCustomData = {
      ...customData,
      [fromLanguage]: newCvData
    };
    
    // Auto-translate to the other language ONLY when saving
    console.log('Auto-translating content to', otherLanguage);
    try {
      const translatedData = await translateCVData(newCvData, otherLanguage);
      newCustomData[otherLanguage] = translatedData;
      console.log('Auto-translation completed successfully');
    } catch (error) {
      console.error('Translation failed:', error);
      // If translation fails, keep existing data for other language or use template
      if (!customData[otherLanguage]) {
        newCustomData[otherLanguage] = {
          ...cvContentTranslations[otherLanguage],
          personalInfo: {
            ...cvContentTranslations[otherLanguage].personalInfo,
            email: newCvData.personalInfo.email,
            phone: newCvData.personalInfo.phone,
            linkedin: newCvData.personalInfo.linkedin,
            github: newCvData.personalInfo.github,
            location: newCvData.personalInfo.location,
            image: newCvData.personalInfo.image,
            name: newCvData.personalInfo.name
          }
        };
      }
    }
    
    console.log('Data synchronization completed');
    return newCustomData;
  }, []);

  const forceRetranslate = useCallback(async (
    customData: { [key: string]: CVData }
  ): Promise<{ [key: string]: CVData }> => {
    console.log('Force retranslating all data');
    
    const languages = Object.keys(customData) as ('de' | 'en')[];
    if (languages.length === 0) return customData;
    
    // Use the first language as source
    const sourceLanguage = languages[0];
    const sourceData = customData[sourceLanguage];
    
    const newCustomData = { ...customData };
    
    // Translate to all other languages
    for (const targetLanguage of languages) {
      if (targetLanguage !== sourceLanguage) {
        try {
          console.log('Force translating from', sourceLanguage, 'to', targetLanguage);
          const translatedData = await translateCVData(sourceData, targetLanguage);
          newCustomData[targetLanguage] = translatedData;
        } catch (error) {
          console.error('Force translation failed for', targetLanguage, ':', error);
        }
      }
    }
    
    console.log('Force retranslation completed');
    return newCustomData;
  }, []);

  return {
    getDataForLanguage,
    autoTranslateData,
    forceRetranslate
  };
};
