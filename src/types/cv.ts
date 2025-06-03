export interface PersonalInfo {
  name: string;
  profession: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  certificates: Certificate[];
}
