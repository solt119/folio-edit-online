
import { useCallback } from 'react';
import { CVData } from '@/types/cv';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { translateCVData, detectLanguage } from '@/utils/translationService';

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
    
    // If we have data in the other language, translate it
    const otherLanguage = language === 'de' ? 'en' : 'de';
    if (customData[otherLanguage]) {
      console.log('Found data in', otherLanguage, '- will translate to', language);
      
      // We'll handle the translation asynchronously in autoTranslateData
      // For now, return base data with contact info copied
      const baseData = cvContentTranslations[language];
      const sourceData = customData[otherLanguage];
      
      return {
        ...baseData,
        personalInfo: {
          ...baseData.personalInfo,
          email: sourceData.personalInfo.email,
          phone: sourceData.personalInfo.phone,
          linkedin: sourceData.personalInfo.linkedin,
          github: sourceData.personalInfo.github,
          location: sourceData.personalInfo.location,
          image: sourceData.personalInfo.image,
          name: sourceData.personalInfo.name // Keep name as is
        }
      };
    }
    
    console.log('Using default data for', language);
    return cvContentTranslations[language];
  }, []);

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
    
    // Check if we should auto-translate to the other language
    const shouldTranslate = !customData[otherLanguage] || 
      (customData[otherLanguage] && Object.keys(customData).length === 1);
    
    if (shouldTranslate) {
      console.log('Auto-translating content to', otherLanguage);
      try {
        const translatedData = await translateCVData(newCvData, otherLanguage);
        newCustomData[otherLanguage] = translatedData;
        console.log('Auto-translation completed successfully');
      } catch (error) {
        console.error('Translation failed:', error);
        // If translation fails, copy contact info only
        if (customData[otherLanguage]) {
          newCustomData[otherLanguage] = {
            ...customData[otherLanguage],
            personalInfo: {
              ...customData[otherLanguage].personalInfo,
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
    } else {
      // Just sync contact information if both languages exist
      if (customData[otherLanguage]) {
        newCustomData[otherLanguage] = {
          ...customData[otherLanguage],
          personalInfo: {
            ...customData[otherLanguage].personalInfo,
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
