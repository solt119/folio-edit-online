// Vereinfachte Übersetzungstabelle - nur Deutsch nach Englisch
const translations: { [germanText: string]: string } = {
  // Personal Info
  'Leidenschaftlicher Frontend-Entwickler mit 5+ Jahren Erfahrung in React, TypeScript und modernen Web-Technologies. Spezialisiert auf responsive Design und Performance-Optimierung.': 'Passionate Frontend Developer with 5+ years of experience in React, TypeScript and modern web technologies. Specialized in responsive design and performance optimization.',
  
  // Better translations for common phrases
  'Passionate Skilled Service Desk Agent with mehr als 5 Years Experience': 'Passionate Skilled Service Desk Agent with more than 5 years experience',
  'Leidenschaftlicher qualifizierter Service Desk Agent mit mehr als 5 Jahren Erfahrung': 'Passionate skilled Service Desk Agent with more than 5 years experience',
  
  // Phrase patterns that need special handling
  'mehr als': 'more than',
  'mit mehr als': 'with more than',
  
  // Names (bleiben gleich)
  'Max Mustermann': 'Max Mustermann',
  'Marcel Test Test': 'Marcel Test Test',
  
  // Positions
  'Senior Frontend Developer': 'Senior Frontend Developer',
  'Frontend Developer': 'Frontend Developer',
  'Service Desk Agent': 'Service Desk Agent',
  
  // Locations
  'Berlin, Deutschland': 'Berlin, Germany',
  'Deutschland': 'Germany',
  
  // Experience descriptions
  'Entwicklung und Wartung von React-Anwendungen für Enterprise-Kunden. Implementierung von Design-Systemen und Performance-Optimierungen.': 'Development and maintenance of React applications for enterprise clients. Implementation of design systems and performance optimizations.',
  'Erstellung responsiver Websites und Web-Anwendungen. Zusammenarbeit mit Design- und Backend-Teams in agilen Entwicklungsprozessen.': 'Creation of responsive websites and web applications. Collaboration with design and backend teams in agile development processes.',
  
  // Education
  'Technische Universität Berlin': 'Technical University Berlin',
  'Bachelor of Science - Informatik': 'Bachelor of Science - Computer Science',
  'Schwerpunkt: Web-Entwicklung und Software Engineering. Abschlussnote: 1,5': 'Focus: Web Development and Software Engineering. Final grade: 1.5',
  
  // Time periods
  'Heute': 'Present',
  '2022 - Heute': '2022 - Present',
  
  // Languages
  'Deutsch': 'German',
  'Englisch': 'English',
  'Französisch': 'French',
  'Muttersprache': 'Native',
  'Fließend (C1)': 'Fluent (C1)',
  'Grundkenntnisse (A2)': 'Basic (A2)',
  
  // Projects
  'Vollständiges Dashboard für Online-Shop-Verwaltung mit React und TypeScript': 'Complete dashboard for online shop management with React and TypeScript',
  'Responsive Portfolio-Website mit modernem Design und Animationen': 'Responsive portfolio website with modern design and animations',
  
  // Certificates
  'März 2023': 'March 2023',
  'März 2026': 'March 2026',
  'Januar 2023': 'January 2023',
  'Amazon Web Services': 'Amazon Web Services',
  'Google': 'Google',
  
  // Common custom phrases
  'Guten Morgen': 'Good Morning',
  'Das ist ein Test': 'This is a test',
  'Hallo Welt': 'Hello World',
  'ich bin sehr gut': 'I am very good',
  'heute ist schön': 'today is nice',
  'Das funktioniert gut': 'This works well',
  'Sehr interessant': 'Very interesting',
  'Toll gemacht': 'Well done',
  'Perfekt': 'Perfect'
};

// Verbesserte Wort-für-Wort Übersetzungen
const wordTranslations: { [germanWord: string]: string } = {
  // Common words
  'mit': 'with',
  'und': 'and',
  'in': 'in',
  'auf': 'on',
  'für': 'for',
  'von': 'of',
  'als': 'than',
  'mehr': 'more',
  'Jahren': 'years',
  'Jahre': 'years',
  'Erfahrung': 'experience',
  'Experience': 'experience',
  'modernen': 'modern',
  'Spezialisiert': 'Specialized',
  'responsive': 'responsive',
  'Design': 'design',
  'Performance-Optimierung': 'performance optimization',
  'Web-Technologies': 'web technologies',
  'Leidenschaftlicher': 'Passionate',
  'leidenschaftlicher': 'passionate',
  'qualifizierter': 'skilled',
  'Qualifizierter': 'Skilled',
  'Entwicklung': 'Development',
  'Wartung': 'maintenance',
  'Implementierung': 'Implementation',
  'Erstellung': 'Creation',
  'Zusammenarbeit': 'Collaboration',
  'Schwerpunkt': 'Focus',
  'Abschlussnote': 'Final grade',
  'Vollständiges': 'Complete',
  'Dashboard': 'dashboard',
  'Online-Shop-Verwaltung': 'online shop management',
  'Portfolio-Website': 'portfolio website',
  'Animationen': 'animations',
  
  // Simple words
  'Guten': 'Good',
  'Morgen': 'Morning',
  'Das': 'This',
  'ist': 'is',
  'ein': 'a',
  'eine': 'a',
  'Test': 'test',
  'Hallo': 'Hello',
  'Welt': 'World',
  'ich': 'I',
  'bin': 'am',
  'sehr': 'very',
  'gut': 'good',
  'schön': 'nice',
  'heute': 'today',
  'funktioniert': 'works',
  'interessant': 'interesting',
  'toll': 'great',
  'gemacht': 'done',
  'perfekt': 'perfect',
  
  // Service Desk specific
  'Service': 'Service',
  'Desk': 'Desk',
  'Agent': 'Agent',
  'Passionate': 'Passionate',
  'Skilled': 'Skilled'
};

// Verbesserte Übersetzungsfunktion
export const translateText = (text: string, fromLang: 'de' | 'en', toLang: 'de' | 'en'): string => {
  // Nur von Deutsch nach Englisch übersetzen
  if (fromLang !== 'de' || toLang !== 'en') {
    return text;
  }
  
  console.log(`Translating: "${text}" from German to English`);
  
  const trimmedText = text.trim();
  if (!trimmedText) return text;
  
  // Erst versuchen, eine exakte Übereinstimmung zu finden
  if (translations[trimmedText]) {
    console.log(`Found exact translation: ${translations[trimmedText]}`);
    return translations[trimmedText];
  }
  
  // Dann versuchen, Teilübereinstimmungen zu finden (längste zuerst)
  const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  
  let translatedText = text;
  
  for (const [germanText, englishText] of sortedTranslations) {
    if (text.toLowerCase().includes(germanText.toLowerCase())) {
      const regex = new RegExp(germanText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      translatedText = translatedText.replace(regex, englishText);
      console.log(`Applied phrase translation: ${germanText} -> ${englishText}`);
    }
  }
  
  // Immer Wort-für-Wort Übersetzung für alle verbleibenden deutschen Wörter anwenden
  console.log('Applying word-by-word translation for remaining German words');
  
  // Spezielle Behandlung für "mehr als" - zuerst als Phrase
  translatedText = translatedText.replace(/mehr\s+als/gi, 'more than');
  
  // Dann Wort-für-Wort Übersetzung für alle Wörter
  const words = translatedText.split(/(\s+|[.,;:!?()+-])/);
  const translatedWords = words.map(word => {
    const cleanWord = word.trim();
    if (!cleanWord || /^[\s.,;:!?()+-]+$/.test(word)) {
      return word; // Punktuation und Leerzeichen beibehalten
    }
    
    // Prüfe sowohl den originalen als auch den lowercase Wert
    const lowerWord = cleanWord.toLowerCase();
    let translation = wordTranslations[cleanWord] || wordTranslations[lowerWord];
    
    if (translation) {
      console.log(`Word translation: ${cleanWord} -> ${translation}`);
      // Groß-/Kleinschreibung beibehalten
      if (cleanWord === cleanWord.toUpperCase()) {
        return translation.toUpperCase();
      } else if (cleanWord[0] === cleanWord[0].toUpperCase()) {
        return translation.charAt(0).toUpperCase() + translation.slice(1);
      }
      return translation;
    }
    
    return word; // Original zurückgeben, wenn keine Übersetzung gefunden
  });
  
  translatedText = translatedWords.join('');
  
  console.log(`Translation result: "${translatedText}"`);
  return translatedText;
};

export const translateCVData = (data: any, fromLang: 'de' | 'en', toLang: 'de' | 'en'): any => {
  // Nur von Deutsch nach Englisch übersetzen
  if (fromLang !== 'de' || toLang !== 'en') {
    return data;
  }
  
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
