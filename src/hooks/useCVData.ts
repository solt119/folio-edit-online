
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
    const savedCustomData = localStorage.getItem('customCvData');
    if (savedCustomData) {
      const parsed = JSON.parse(savedCustomData);
      setCustomData(parsed);
    }
    
    const savedVisibility = localStorage.getItem('fieldVisibility');
    if (savedVisibility) {
      setFieldVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  // Update CV data when language changes
  useEffect(() => {
    const savedCustomData = localStorage.getItem('customCvData');
    if (savedCustomData) {
      const parsed = JSON.parse(savedCustomData);
      
      // If we have custom data for current language, use it
      if (parsed[language]) {
        setCvData(parsed[language]);
      } else {
        // If no custom data for this language, use default
        setCvData(cvContentTranslations[language]);
      }
    } else {
      setCvData(cvContentTranslations[language]);
    }
  }, [language]);

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
