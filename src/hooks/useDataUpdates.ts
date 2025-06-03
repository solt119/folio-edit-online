
import { useCallback } from 'react';
import { CVData, PersonalInfo, Experience, Education, Skill, Language, Certificate } from '@/types/cv';
import { FieldVisibility } from '@/types/visibility';

interface UseDataUpdatesProps {
  saveCustomDataWithTranslation: (newCvData: CVData) => Promise<void>;
  setFieldVisibility: React.Dispatch<React.SetStateAction<FieldVisibility>>;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const useDataUpdates = ({ 
  saveCustomDataWithTranslation, 
  setFieldVisibility, 
  setCvData 
}: UseDataUpdatesProps) => {
  
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value }
      };
      saveCustomDataWithTranslation(newData);
      return newData;
    });
  }, [saveCustomDataWithTranslation, setCvData]);

  const updateExperience = useCallback((index: number, field: keyof Experience, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        experiences: prev.experiences.map((exp, i) => 
          i === index ? { ...exp, [field]: value } : exp
        )
      };
      saveCustomDataWithTranslation(newData);
      return newData;
    });
  }, [saveCustomDataWithTranslation, setCvData]);

  const updateEducation = useCallback((index: number, field: keyof Education, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        education: prev.education.map((edu, i) => 
          i === index ? { ...edu, [field]: value } : edu
        )
      };
      saveCustomDataWithTranslation(newData);
      return newData;
    });
  }, [saveCustomDataWithTranslation, setCvData]);

  const updateSkill = useCallback((index: number, field: keyof Skill, value: string | number) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        skills: prev.skills.map((skill, i) => 
          i === index ? { ...skill, [field]: value } : skill
        )
      };
      saveCustomDataWithTranslation(newData);
      return newData;
    });
  }, [saveCustomDataWithTranslation, setCvData]);

  const updateLanguage = useCallback((index: number, field: keyof Language, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        languages: prev.languages.map((lang, i) => 
          i === index ? { ...lang, [field]: value } : lang
        )
      };
      saveCustomDataWithTranslation(newData);
      return newData;
    });
  }, [saveCustomDataWithTranslation, setCvData]);

  const updateProject = useCallback((index: number, field: string, value: string | string[]) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        projects: prev.projects.map((project, i) => 
          i === index ? { ...project, [field]: value } : project
        )
      };
      saveCustomDataWithTranslation(newData);
      return newData;
    });
  }, [saveCustomDataWithTranslation, setCvData]);

  const updateCertificate = useCallback((index: number, field: keyof Certificate, value: string) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        certificates: prev.certificates.map((cert, i) => 
          i === index ? { ...cert, [field]: value } : cert
        )
      };
      saveCustomDataWithTranslation(newData);
      return newData;
    });
  }, [saveCustomDataWithTranslation, setCvData]);

  const updateFieldVisibility = useCallback((section: keyof FieldVisibility, field: string, visible: boolean) => {
    setFieldVisibility(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: visible
      }
    }));
  }, [setFieldVisibility]);

  return {
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
