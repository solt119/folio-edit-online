
import { useState, useEffect, useCallback } from 'react';
import { CVData, PersonalInfo, Experience, Education, Skill, Language, Certificate } from '@/types/cv';
import { FieldVisibility, defaultVisibility } from '@/types/visibility';
import { useLanguage } from '@/contexts/LanguageContext';
import { cvContentTranslations } from '@/utils/cvContentTranslations';
import { translateCVData } from '@/utils/translationService';

export const useCVData = () => {
  const { language } = useLanguage();
  const [cvData, setCvData] = useState<CVData>(cvContentTranslations[language]);
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>(defaultVisibility);
  const [customData, setCustomData] = useState<{ [key: string]: CVData }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Save custom data to localStorage and auto-translate to other language
  const saveCustomData = useCallback((newCvData: CVData) => {
    const newCustomData = {
      ...customData,
      [language]: newCvData
    };
    
    // Auto-translate to the other language
    const otherLanguage = language === 'de' ? 'en' : 'de';
    if (!newCustomData[otherLanguage] || JSON.stringify(newCustomData[otherLanguage]) === JSON.stringify(cvContentTranslations[otherLanguage])) {
      // Only auto-translate if the other language doesn't have custom data or still has default data
      newCustomData[otherLanguage] = translateCVData(newCvData, language, otherLanguage);
    }
    
    setCustomData(newCustomData);
    localStorage.setItem('customCvData', JSON.stringify(newCustomData));
  }, [customData, language]);

  // Memoized update functions to prevent unnecessary re-renders
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value }
      };
      saveCustomData(newData);
      return newData;
    });
  }, [saveCustomData]);

  const updateExperience = useCallback((index: number, field: keyof Experience, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        experiences: prev.experiences.map((exp, i) => 
          i === index ? { ...exp, [field]: value } : exp
        )
      };
      saveCustomData(newData);
      return newData;
    });
  }, [saveCustomData]);

  const updateEducation = useCallback((index: number, field: keyof Education, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        education: prev.education.map((edu, i) => 
          i === index ? { ...edu, [field]: value } : edu
        )
      };
      saveCustomData(newData);
      return newData;
    });
  }, [saveCustomData]);

  const updateSkill = useCallback((index: number, field: keyof Skill, value: string | number) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        skills: prev.skills.map((skill, i) => 
          i === index ? { ...skill, [field]: value } : skill
        )
      };
      saveCustomData(newData);
      return newData;
    });
  }, [saveCustomData]);

  const updateLanguage = useCallback((index: number, field: keyof Language, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        languages: prev.languages.map((lang, i) => 
          i === index ? { ...lang, [field]: value } : lang
        )
      };
      saveCustomData(newData);
      return newData;
    });
  }, [saveCustomData]);

  const updateProject = useCallback((index: number, field: string, value: string | string[]) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        projects: prev.projects.map((project, i) => 
          i === index ? { ...project, [field]: value } : project
        )
      };
      saveCustomData(newData);
      return newData;
    });
  }, [saveCustomData]);

  const updateCertificate = useCallback((index: number, field: keyof Certificate, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        certificates: prev.certificates.map((cert, i) => 
          i === index ? { ...cert, [field]: value } : cert
        )
      };
      saveCustomData(newData);
      return newData;
    });
  }, [saveCustomData]);

  const updateFieldVisibility = useCallback((section: keyof FieldVisibility, field: string, visible: boolean) => {
    setFieldVisibility(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: visible
      }
    }));
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    const savedCustomData = localStorage.getItem('customCvData');
    const savedVisibility = localStorage.getItem('fieldVisibility');
    
    if (savedCustomData) {
      try {
        const parsed = JSON.parse(savedCustomData);
        console.log('Loaded custom data:', parsed);
        setCustomData(parsed);
        
        // Set CV data for current language
        if (parsed[language]) {
          console.log('Setting CV data for language:', language);
          setCvData(parsed[language]);
        } else {
          console.log('No custom data for current language, using default');
          setCvData(cvContentTranslations[language]);
        }
      } catch (error) {
        console.error('Error parsing custom data:', error);
        setCvData(cvContentTranslations[language]);
      }
    } else {
      console.log('No saved custom data, using default');
      setCvData(cvContentTranslations[language]);
    }
    
    if (savedVisibility) {
      try {
        setFieldVisibility(JSON.parse(savedVisibility));
      } catch (error) {
        console.error('Error parsing visibility data:', error);
      }
    }
    
    setIsInitialized(true);
  }, [language]);

  // Update CV data when language changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log('Language changed to:', language);
    console.log('Available custom data:', Object.keys(customData));
    
    if (customData[language]) {
      console.log('Using existing custom data for', language);
      setCvData(customData[language]);
    } else if (Object.keys(customData).length > 0) {
      // If we have custom data for other language but not current, translate it
      const otherLanguage = language === 'de' ? 'en' : 'de';
      if (customData[otherLanguage]) {
        console.log('Translating from', otherLanguage, 'to', language);
        const translatedData = translateCVData(customData[otherLanguage], otherLanguage as 'de' | 'en', language as 'de' | 'en');
        console.log('Translated data:', translatedData);
        
        const newCustomData = {
          ...customData,
          [language]: translatedData
        };
        setCustomData(newCustomData);
        localStorage.setItem('customCvData', JSON.stringify(newCustomData));
        setCvData(translatedData);
      } else {
        console.log('No data to translate, using default');
        setCvData(cvContentTranslations[language]);
      }
    } else {
      console.log('No custom data available, using default');
      setCvData(cvContentTranslations[language]);
    }
  }, [language, customData, isInitialized]);

  useEffect(() => {
    localStorage.setItem('fieldVisibility', JSON.stringify(fieldVisibility));
  }, [fieldVisibility]);

  return {
    cvData,
    fieldVisibility,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateLanguage,
    updateProject,
    updateCertificate,
    updateFieldVisibility
  };
};
