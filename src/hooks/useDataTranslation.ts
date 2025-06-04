
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
    
    // If we have data in the other language, copy contact information
    const otherLanguage = language === 'de' ? 'en' : 'de';
    if (customData[otherLanguage]) {
      console.log('Creating data for', language, 'with contact info from', otherLanguage);
      const baseData = cvContentTranslations[language];
      const sourceData = customData[otherLanguage];
      
      // Copy contact information from the other language
      return {
        ...baseData,
        personalInfo: {
          ...baseData.personalInfo,
          email: sourceData.personalInfo.email,
          phone: sourceData.personalInfo.phone,
          linkedin: sourceData.personalInfo.linkedin,
          github: sourceData.personalInfo.github,
          location: sourceData.personalInfo.location,
          image: sourceData.personalInfo.image
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
    
    // Update the source language data
    const newCustomData = {
      ...customData,
      [fromLanguage]: newCvData
    };
    
    // If we have data in the other language, update its contact information
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
          image: newCvData.personalInfo.image
        }
      };
    }
    
    console.log('Saving data with synchronized contact info for language:', fromLanguage);
    
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
