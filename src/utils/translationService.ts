
// Simple translation mappings for common CV terms
const translations: { [key: string]: { de: string; en: string } } = {
  // Personal Info
  'Max Mustermann': { de: 'Max Mustermann', en: 'John Smith' },
  'Marcel Test Test': { de: 'Marcel Test Test', en: 'Marcel Test Test' },
  'Senior Frontend Developer': { de: 'Senior Frontend Developer', en: 'Senior Frontend Developer' },
  'Berlin, Deutschland': { de: 'Berlin, Deutschland', en: 'Berlin, Germany' },
  'Leidenschaftlicher Frontend-Entwickler': { de: 'Leidenschaftlicher Frontend-Entwickler', en: 'Passionate Frontend Developer' },
  'Ich bin Marcel Test Test': { de: 'Ich bin Marcel Test Test', en: 'I am Marcel Test Test' },
  'Ich bin Marcel': { de: 'Ich bin Marcel', en: 'I am Marcel' },
  
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

// Enhanced word-by-word translation for better coverage
const wordTranslations: { [key: string]: { de: string; en: string } } = {
  'mit': { de: 'mit', en: 'with' },
  'und': { de: 'und', en: 'and' },
  'in': { de: 'in', en: 'in' },
  'auf': { de: 'auf', en: 'on' },
  'für': { de: 'für', en: 'for' },
  'von': { de: 'von', en: 'of' },
  'Jahren': { de: 'Jahren', en: 'years' },
  'Erfahrung': { de: 'Erfahrung', en: 'experience' },
  'modernen': { de: 'modernen', en: 'modern' },
  'Spezialisiert': { de: 'Spezialisiert', en: 'Specialized' },
  'responsive': { de: 'responsive', en: 'responsive' },
  'Design': { de: 'Design', en: 'design' },
  'Performance-Optimierung': { de: 'Performance-Optimierung', en: 'performance optimization' },
  'Web-Technologies': { de: 'Web-Technologies', en: 'web technologies' }
};

export const translateText = (text: string, fromLang: 'de' | 'en', toLang: 'de' | 'en'): string => {
  if (fromLang === toLang) return text;
  
  console.log(`Translating: "${text}" from ${fromLang} to ${toLang}`);
  
  // Try to find exact matches first
  for (const [key, value] of Object.entries(translations)) {
    if (value[fromLang] === text) {
      console.log(`Found exact match: ${value[toLang]}`);
      return value[toLang];
    }
  }
  
  // Try partial matches for longer texts
  let translatedText = text;
  let hasTranslation = false;
  
  for (const [key, value] of Object.entries(translations)) {
    if (text.includes(value[fromLang])) {
      translatedText = translatedText.replace(value[fromLang], value[toLang]);
      hasTranslation = true;
    }
  }
  
  // If no partial matches found, try word-by-word translation
  if (!hasTranslation) {
    const words = text.split(/(\s+|[.,;:!?()+-])/);
    const translatedWords = words.map(word => {
      const cleanWord = word.trim();
      if (!cleanWord || /^[\s.,;:!?()+-]+$/.test(word)) {
        return word; // Keep punctuation and spaces as is
      }
      
      for (const [key, value] of Object.entries(wordTranslations)) {
        if (value[fromLang] === cleanWord) {
          return value[toLang];
        }
      }
      
      return word; // Return original if no translation found
    });
    
    translatedText = translatedWords.join('');
  }
  
  console.log(`Translation result: "${translatedText}"`);
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
