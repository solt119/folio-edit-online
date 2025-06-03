
// Simple translation mappings for common CV terms
const translations: { [key: string]: { de: string; en: string } } = {
  // Personal Info
  'Max Mustermann': { de: 'Max Mustermann', en: 'John Smith' },
  'Senior Frontend Developer': { de: 'Senior Frontend Developer', en: 'Senior Frontend Developer' },
  'Berlin, Deutschland': { de: 'Berlin, Deutschland', en: 'Berlin, Germany' },
  'Leidenschaftlicher Frontend-Entwickler': { de: 'Leidenschaftlicher Frontend-Entwickler', en: 'Passionate Frontend Developer' },
  
  // Experience
  'Tech Solutions GmbH': { de: 'Tech Solutions GmbH', en: 'Tech Solutions GmbH' },
  'Digital Agency Berlin': { de: 'Digital Agency Berlin', en: 'Digital Agency Berlin' },
  'Entwicklung und Wartung': { de: 'Entwicklung und Wartung', en: 'Development and maintenance' },
  'Erstellung responsiver': { de: 'Erstellung responsiver', en: 'Creation of responsive' },
  'Heute': { de: 'Heute', en: 'Present' },
  
  // Education
  'Technische Universität Berlin': { de: 'Technische Universität Berlin', en: 'Technical University Berlin' },
  'Bachelor of Science - Informatik': { de: 'Bachelor of Science - Informatik', en: 'Bachelor of Science - Computer Science' },
  'Schwerpunkt: Web-Entwicklung': { de: 'Schwerpunkt: Web-Entwicklung', en: 'Focus: Web Development' },
  
  // Languages
  'Deutsch': { de: 'Deutsch', en: 'German' },
  'Englisch': { de: 'Englisch', en: 'English' },
  'Französisch': { de: 'Französisch', en: 'French' },
  'Muttersprache': { de: 'Muttersprache', en: 'Native' },
  'Fließend': { de: 'Fließend', en: 'Fluent' },
  'Grundkenntnisse': { de: 'Grundkenntnisse', en: 'Basic' },
  
  // Projects
  'E-Commerce Dashboard': { de: 'E-Commerce Dashboard', en: 'E-Commerce Dashboard' },
  'Portfolio Website': { de: 'Portfolio Website', en: 'Portfolio Website' },
  'Vollständiges Dashboard': { de: 'Vollständiges Dashboard', en: 'Complete dashboard' },
  'Responsive Portfolio-Website': { de: 'Responsive Portfolio-Website', en: 'Responsive portfolio website' },
  
  // Certificates
  'AWS Certified Solutions Architect': { de: 'AWS Certified Solutions Architect', en: 'AWS Certified Solutions Architect' },
  'Google Analytics Certified': { de: 'Google Analytics Certified', en: 'Google Analytics Certified' },
  'Amazon Web Services': { de: 'Amazon Web Services', en: 'Amazon Web Services' },
  'März': { de: 'März', en: 'March' },
  'Januar': { de: 'Januar', en: 'January' }
};

export const translateText = (text: string, fromLang: 'de' | 'en', toLang: 'de' | 'en'): string => {
  if (fromLang === toLang) return text;
  
  // Try to find exact matches first
  for (const [key, value] of Object.entries(translations)) {
    if (value[fromLang] === text) {
      return value[toLang];
    }
  }
  
  // Try partial matches for longer texts
  let translatedText = text;
  for (const [key, value] of Object.entries(translations)) {
    if (text.includes(value[fromLang])) {
      translatedText = translatedText.replace(value[fromLang], value[toLang]);
    }
  }
  
  return translatedText;
};

export const translateCVData = (data: any, fromLang: 'de' | 'en', toLang: 'de' | 'en'): any => {
  if (fromLang === toLang) return data;
  
  const translateObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return translateText(obj, fromLang, toLang);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(translateObject);
    }
    
    if (obj && typeof obj === 'object') {
      const translated: any = {};
      for (const [key, value] of Object.entries(obj)) {
        translated[key] = translateObject(value);
      }
      return translated;
    }
    
    return obj;
  };
  
  return translateObject(data);
};
