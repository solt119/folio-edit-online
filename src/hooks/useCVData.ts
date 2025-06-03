
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

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCustomData = localStorage.getItem('customCvData');
    if (savedCustomData) {
      const parsed = JSON.parse(savedCustomData);
      setCustomData(parsed);
      
      // If we have custom data for current language, use it, otherwise use default
      if (parsed[language]) {
        setCvData(parsed[language]);
      } else {
        setCvData(cvContentTranslations[language]);
      }
    } else {
      setCvData(cvContentTranslations[language]);
    }
    
    const savedVisibility = localStorage.getItem('fieldVisibility');
    if (savedVisibility) {
      setFieldVisibility(JSON.parse(savedVisibility));
    }
  }, [language]);

  // Save custom data to localStorage and auto-translate to other language
  useEffect(() => {
    const newCustomData = {
      ...customData,
      [language]: cvData
    };
    
    // Auto-translate to the other language
    const otherLanguage = language === 'de' ? 'en' : 'de';
    if (!newCustomData[otherLanguage] || JSON.stringify(newCustomData[otherLanguage]) === JSON.stringify(cvContentTranslations[otherLanguage])) {
      // Only auto-translate if the other language doesn't have custom data or still has default data
      newCustomData[otherLanguage] = translateCVData(cvData, language, otherLanguage);
    }
    
    setCustomData(newCustomData);
    localStorage.setItem('customCvData', JSON.stringify(newCustomData));
  }, [cvData, language]);

  useEffect(() => {
    localStorage.setItem('fieldVisibility', JSON.stringify(fieldVisibility));
  }, [fieldVisibility]);

  // Memoized update functions to prevent unnecessary re-renders
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  }, []);

  const updateExperience = useCallback((index: number, field: keyof Experience, value: string) => {
    setCvData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  }, []);

  const updateEducation = useCallback((index: number, field: keyof Education, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  }, []);

  const updateSkill = useCallback((index: number, field: keyof Skill, value: string | number) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  }, []);

  const updateLanguage = useCallback((index: number, field: keyof Language, value: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  }, []);

  const updateProject = useCallback((index: number, field: string, value: string | string[]) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  }, []);

  const updateCertificate = useCallback((index: number, field: keyof Certificate, value: string) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  }, []);

  const updateFieldVisibility = useCallback((section: keyof FieldVisibility, field: string, visible: boolean) => {
    setFieldVisibility(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: visible
      }
    }));
  }, []);

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
