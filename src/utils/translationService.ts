// Simple translation mappings for common CV terms
const translationMappings = {
  'de-en': {
    // Job titles and positions
    'Softwareentwickler': 'Software Developer',
    'Frontend-Entwickler': 'Frontend Developer',
    'Backend-Entwickler': 'Backend Developer',
    'Full-Stack-Entwickler': 'Full Stack Developer',
    'Projektmanager': 'Project Manager',
    'Data Scientist': 'Data Scientist',
    'UI/UX Designer': 'UI/UX Designer',
    'DevOps Engineer': 'DevOps Engineer',
    'Systemadministrator': 'System Administrator',
    'Qualitätssicherung': 'Quality Assurance',
    'Teamleiter': 'Team Lead',
    'Senior Entwickler': 'Senior Developer',
    'Junior Entwickler': 'Junior Developer',
    
    // Companies and institutions
    'Universität': 'University',
    'Hochschule': 'University of Applied Sciences',
    'Fachhochschule': 'University of Applied Sciences',
    'Institut': 'Institute',
    'GmbH': 'LLC',
    'AG': 'Corp',
    
    // Education terms
    'Bachelor of Science': 'Bachelor of Science',
    'Master of Science': 'Master of Science',
    'Diplom': 'Diploma',
    'Informatik': 'Computer Science',
    'Wirtschaftsinformatik': 'Business Informatics',
    'Elektrotechnik': 'Electrical Engineering',
    'Maschinenbau': 'Mechanical Engineering',
    'Betriebswirtschaft': 'Business Administration',
    
    // Common terms
    'Jahre Erfahrung': 'years of experience',
    'Berufserfahrung': 'Professional Experience',
    'Ausbildung': 'Education',
    'Fähigkeiten': 'Skills',
    'Sprachen': 'Languages',
    'Projekte': 'Projects',
    'Zertifikate': 'Certificates',
    'Verantwortlichkeiten': 'Responsibilities',
    'Erfolge': 'Achievements',
    'Technologien': 'Technologies',
    'Frameworks': 'Frameworks',
    'Tools': 'Tools',
    'seit': 'since',
    'bis': 'until',
    'heute': 'present',
    'aktuell': 'current'
  },
  'en-de': {
    // Reverse mappings
    'Software Developer': 'Softwareentwickler',
    'Frontend Developer': 'Frontend-Entwickler',
    'Backend Developer': 'Backend-Entwickler',
    'Full Stack Developer': 'Full-Stack-Entwickler',
    'Project Manager': 'Projektmanager',
    'Data Scientist': 'Data Scientist',
    'UI/UX Designer': 'UI/UX Designer',
    'DevOps Engineer': 'DevOps Engineer',
    'System Administrator': 'Systemadministrator',
    'Quality Assurance': 'Qualitätssicherung',
    'Team Lead': 'Teamleiter',
    'Senior Developer': 'Senior Entwickler',
    'Junior Developer': 'Junior Entwickler',
    
    'University': 'Universität',
    'University of Applied Sciences': 'Hochschule',
    'Institute': 'Institut',
    'LLC': 'GmbH',
    'Corp': 'AG',
    
    'Computer Science': 'Informatik',
    'Business Informatics': 'Wirtschaftsinformatik',
    'Electrical Engineering': 'Elektrotechnik',
    'Mechanical Engineering': 'Maschinenbau',
    'Business Administration': 'Betriebswirtschaft',
    
    'years of experience': 'Jahre Erfahrung',
    'Professional Experience': 'Berufserfahrung',
    'Education': 'Ausbildung',
    'Skills': 'Fähigkeiten',
    'Languages': 'Sprachen',
    'Projects': 'Projekte',
    'Certificates': 'Zertifikate',
    'Responsibilities': 'Verantwortlichkeiten',
    'Achievements': 'Erfolge',
    'Technologies': 'Technologien',
    'Frameworks': 'Frameworks',
    'Tools': 'Tools',
    'since': 'seit',
    'until': 'bis',
    'present': 'heute',
    'current': 'aktuell'
  }
};

// Detect language of text
export const detectLanguage = (text: string): 'de' | 'en' => {
  if (!text || text.trim().length === 0) return 'de';
  
  // German indicators
  const germanWords = ['und', 'der', 'die', 'das', 'ist', 'haben', 'werden', 'mit', 'für', 'von', 'zu', 'auf', 'bei', 'durch', 'über', 'unter', 'zwischen', 'während', 'nach', 'vor', 'seit', 'bis', 'sowie', 'bzw', 'bzw.', 'ggf', 'ggf.', 'inkl', 'inkl.', 'ca', 'ca.', 'z.B.', 'usw', 'usw.', 'etc', 'etc.'];
  const germanChars = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];
  
  // English indicators
  const englishWords = ['and', 'the', 'is', 'are', 'have', 'has', 'will', 'with', 'for', 'from', 'to', 'on', 'at', 'by', 'through', 'over', 'under', 'between', 'during', 'after', 'before', 'since', 'until', 'as', 'well', 'as', 'e.g.', 'etc', 'etc.', 'including', 'approximately'];
  
  const lowerText = text.toLowerCase();
  
  // Check for German characters
  if (germanChars.some(char => text.includes(char))) {
    return 'de';
  }
  
  // Count German vs English words
  let germanCount = 0;
  let englishCount = 0;
  
  germanWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) germanCount++;
  });
  
  englishWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) englishCount++;
  });
  
  // Return based on word count, default to German
  return englishCount > germanCount ? 'en' : 'de';
};

// Simple translation function using mappings
export const translateText = (text: string, fromLang: 'de' | 'en', toLang: 'de' | 'en'): string => {
  if (!text || fromLang === toLang) return text;
  
  const mappingKey = `${fromLang}-${toLang}` as keyof typeof translationMappings;
  const mappings = translationMappings[mappingKey];
  
  if (!mappings) return text;
  
  let translatedText = text;
  
  // Replace exact matches first (case-insensitive)
  Object.entries(mappings).forEach(([source, target]) => {
    const regex = new RegExp(`\\b${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    translatedText = translatedText.replace(regex, target);
  });
  
  // Basic sentence structure adjustments for German to English
  if (fromLang === 'de' && toLang === 'en') {
    // Remove common German prefixes/suffixes that don't translate well
    translatedText = translatedText.replace(/\b(sehr|ganz|besonders)\s+/gi, '');
    
    // Adjust common German sentence patterns
    translatedText = translatedText.replace(/\bich habe\b/gi, 'I have');
    translatedText = translatedText.replace(/\bich bin\b/gi, 'I am');
    translatedText = translatedText.replace(/\bich war\b/gi, 'I was');
    translatedText = translatedText.replace(/\bverantwortlich für\b/gi, 'responsible for');
    translatedText = translatedText.replace(/\bzuständig für\b/gi, 'responsible for');
    translatedText = translatedText.replace(/\bim Bereich\b/gi, 'in the field of');
    translatedText = translatedText.replace(/\bmehr als\b/gi, 'more than');
    translatedText = translatedText.replace(/\bweniger als\b/gi, 'less than');
  }
  
  // Basic sentence structure adjustments for English to German
  if (fromLang === 'en' && toLang === 'de') {
    translatedText = translatedText.replace(/\bI have\b/gi, 'ich habe');
    translatedText = translatedText.replace(/\bI am\b/gi, 'ich bin');
    translatedText = translatedText.replace(/\bI was\b/gi, 'ich war');
    translatedText = translatedText.replace(/\bresponsible for\b/gi, 'verantwortlich für');
    translatedText = translatedText.replace(/\bin the field of\b/gi, 'im Bereich');
    translatedText = translatedText.replace(/\bmore than\b/gi, 'mehr als');
    translatedText = translatedText.replace(/\bless than\b/gi, 'weniger als');
  }
  
  return translatedText;
};

// Translate CV data object
export const translateCVData = async (cvData: any, targetLanguage: 'de' | 'en'): Promise<any> => {
  console.log('Translating CV data to', targetLanguage);
  
  // Detect source language from the bio or first experience description
  const sourceText = cvData.personalInfo?.bio || cvData.experiences?.[0]?.description || '';
  const sourceLanguage = detectLanguage(sourceText);
  
  console.log('Detected source language:', sourceLanguage);
  
  if (sourceLanguage === targetLanguage) {
    console.log('Source and target language are the same, no translation needed');
    return cvData;
  }
  
  const translatedData = { ...cvData };
  
  // Translate personal info
  if (translatedData.personalInfo) {
    translatedData.personalInfo = {
      ...translatedData.personalInfo,
      profession: translateText(translatedData.personalInfo.profession || '', sourceLanguage, targetLanguage),
      bio: translateText(translatedData.personalInfo.bio || '', sourceLanguage, targetLanguage)
    };
  }
  
  // Translate experiences
  if (translatedData.experiences) {
    translatedData.experiences = translatedData.experiences.map((exp: any) => ({
      ...exp,
      company: translateText(exp.company || '', sourceLanguage, targetLanguage),
      position: translateText(exp.position || '', sourceLanguage, targetLanguage),
      description: translateText(exp.description || '', sourceLanguage, targetLanguage)
    }));
  }
  
  // Translate education
  if (translatedData.education) {
    translatedData.education = translatedData.education.map((edu: any) => ({
      ...edu,
      institution: translateText(edu.institution || '', sourceLanguage, targetLanguage),
      degree: translateText(edu.degree || '', sourceLanguage, targetLanguage),
      description: translateText(edu.description || '', sourceLanguage, targetLanguage)
    }));
  }
  
  // Keep ALL skill values unchanged - no translation at all
  if (translatedData.skills) {
    translatedData.skills = translatedData.skills.map((skill: any) => ({
      ...skill,
      // Keep everything as-is - name and level unchanged
      name: skill.name || '',
      level: skill.level || 0
    }));
  }
  
  // Keep ALL project values unchanged except description
  if (translatedData.projects) {
    translatedData.projects = translatedData.projects.map((project: any) => ({
      ...project,
      // Keep project name unchanged
      name: project.name || '',
      // Only translate description
      description: translateText(project.description || '', sourceLanguage, targetLanguage),
      // Keep all technologies unchanged
      technologies: project.technologies || [],
      // Keep link unchanged
      link: project.link || ''
    }));
  }
  
  // Keep ALL certificate values unchanged
  if (translatedData.certificates) {
    translatedData.certificates = translatedData.certificates.map((cert: any) => ({
      ...cert,
      // Keep all values unchanged
      name: cert.name || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      link: cert.link || ''
    }));
  }
  
  // Keep ALL language values unchanged
  if (translatedData.languages) {
    translatedData.languages = translatedData.languages.map((lang: any) => ({
      ...lang,
      // Keep all values unchanged
      name: lang.name || '',
      level: lang.level || ''
    }));
  }
  
  console.log('Translation completed');
  return translatedData;
};
