import { useState, useEffect, useCallback } from 'react';
import { CVData, PersonalInfo, Experience, Education, Skill, Language, Certificate } from '@/types/cv';
import { FieldVisibility, defaultVisibility } from '@/types/visibility';

const initialCVData: CVData = {
  personalInfo: {
    name: "Max Mustermann",
    profession: "Senior Frontend Developer",
    location: "Berlin, Deutschland",
    email: "max.mustermann@email.de",
    phone: "+49 123 456789",
    linkedin: "linkedin.com/in/maxmustermann",
    github: "github.com/maxmustermann",
    bio: "Leidenschaftlicher Frontend-Entwickler mit 5+ Jahren Erfahrung in React, TypeScript und modernen Web-Technologies. Spezialisiert auf responsive Design und Performance-Optimierung."
  },
  experiences: [
    {
      id: "1",
      company: "Tech Solutions GmbH",
      position: "Senior Frontend Developer",
      duration: "2022 - Heute",
      description: "Entwicklung und Wartung von React-Anwendungen für Enterprise-Kunden. Implementierung von Design-Systemen und Performance-Optimierungen."
    },
    {
      id: "2",
      company: "Digital Agency Berlin",
      position: "Frontend Developer",
      duration: "2020 - 2022",
      description: "Erstellung responsiver Websites und Web-Anwendungen. Zusammenarbeit mit Design- und Backend-Teams in agilen Entwicklungsprozessen."
    }
  ],
  education: [
    {
      id: "1",
      institution: "Technische Universität Berlin",
      degree: "Bachelor of Science - Informatik",
      duration: "2016 - 2020",
      description: "Schwerpunkt: Web-Entwicklung und Software Engineering. Abschlussnote: 1,5"
    }
  ],
  skills: [
    { id: "1", name: "React", level: 90 },
    { id: "2", name: "TypeScript", level: 85 },
    { id: "3", name: "Tailwind CSS", level: 88 },
    { id: "4", name: "Node.js", level: 75 },
    { id: "5", name: "Git", level: 85 },
    { id: "6", name: "Figma", level: 70 }
  ],
  languages: [
    { id: "1", name: "Deutsch", level: "Muttersprache" },
    { id: "2", name: "Englisch", level: "Fließend (C1)" },
    { id: "3", name: "Französisch", level: "Grundkenntnisse (A2)" }
  ],
  projects: [
    {
      id: "1",
      name: "E-Commerce Dashboard",
      description: "Vollständiges Dashboard für Online-Shop-Verwaltung mit React und TypeScript",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
      link: "https://demo-dashboard.example.com"
    },
    {
      id: "2",
      name: "Portfolio Website",
      description: "Responsive Portfolio-Website mit modernem Design und Animationen",
      technologies: ["React", "Framer Motion", "Styled Components"]
    }
  ],
  certificates: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issueDate: "März 2023",
      expiryDate: "März 2026",
      credentialId: "AWS-SAA-123456",
      link: "https://aws.amazon.com/verification"
    },
    {
      id: "2",
      name: "Google Analytics Certified",
      issuer: "Google",
      issueDate: "Januar 2023",
      credentialId: "GA-456789"
    }
  ]
};

export const useCVData = () => {
  const [cvData, setCvData] = useState<CVData>(initialCVData);
  const [fieldVisibility, setFieldVisibility] = useState<FieldVisibility>(defaultVisibility);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      setCvData(JSON.parse(savedData));
    }
    
    const savedVisibility = localStorage.getItem('fieldVisibility');
    if (savedVisibility) {
      setFieldVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  // Save data to localStorage whenever cvData or visibility changes
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

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
