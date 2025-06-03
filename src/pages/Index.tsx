import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Globe, 
  Github,
  Linkedin,
  Edit,
  Save,
  X,
  LogIn,
  LogOut
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PersonalInfo {
  name: string;
  profession: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface Language {
  id: string;
  name: string;
  level: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [cvData, setCvData] = useState<CVData>({
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
    ]
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      setCvData(JSON.parse(savedData));
    }
    
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Save data to localStorage whenever cvData changes
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
  }, [cvData]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    toast({
      title: "Erfolgreich eingeloggt",
      description: "Sie können jetzt Ihren Lebenslauf bearbeiten.",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    setEditingSection(null);
    toast({
      title: "Erfolgreich ausgeloggt",
      description: "Sie befinden sich jetzt im Ansichtsmodus.",
    });
  };

  const handleSave = () => {
    setEditingSection(null);
    toast({
      title: "Gespeichert",
      description: "Ihre Änderungen wurden erfolgreich gespeichert.",
    });
  };

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

  const EditableText = React.memo(({ 
    value, 
    onChange, 
    multiline = false, 
    className = "" 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    multiline?: boolean; 
    className?: string;
  }) => {
    if (multiline) {
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-slate-800 border-slate-600 text-white ${className}`}
        />
      );
    }
    
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-slate-800 border-slate-600 text-white ${className}`}
      />
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/80 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Curriculum Vitae</h1>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Abmelden
              </Button>
            ) : (
              <Button 
                onClick={handleLogin}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Anmelden
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Personal Information */}
        <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
          <CardHeader className="relative">
            {isLoggedIn && (
              <Button
                onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                {editingSection === 'personal' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            )}
            
            <div className="text-center space-y-4">
              {editingSection === 'personal' ? (
                <div className="space-y-4">
                  <EditableText
                    value={cvData.personalInfo.name}
                    onChange={(value) => updatePersonalInfo('name', value)}
                    className="text-center text-3xl font-bold"
                  />
                  <EditableText
                    value={cvData.personalInfo.profession}
                    onChange={(value) => updatePersonalInfo('profession', value)}
                    className="text-center text-xl"
                  />
                  <div className="space-y-2">
                    <EditableText
                      value={cvData.personalInfo.location}
                      onChange={(value) => updatePersonalInfo('location', value)}
                    />
                    <EditableText
                      value={cvData.personalInfo.email}
                      onChange={(value) => updatePersonalInfo('email', value)}
                    />
                    <EditableText
                      value={cvData.personalInfo.phone}
                      onChange={(value) => updatePersonalInfo('phone', value)}
                    />
                    <EditableText
                      value={cvData.personalInfo.linkedin}
                      onChange={(value) => updatePersonalInfo('linkedin', value)}
                    />
                    <EditableText
                      value={cvData.personalInfo.github}
                      onChange={(value) => updatePersonalInfo('github', value)}
                    />
                  </div>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-white">{cvData.personalInfo.name}</h1>
                  <p className="text-xl text-blue-400">{cvData.personalInfo.profession}</p>
                  
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{cvData.personalInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{cvData.personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{cvData.personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      <span>{cvData.personalInfo.linkedin}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      <span>{cvData.personalInfo.github}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {editingSection === 'personal' ? (
              <EditableText
                value={cvData.personalInfo.bio}
                onChange={(value) => updatePersonalInfo('bio', value)}
                multiline
                className="mt-4"
              />
            ) : (
              <p className="text-slate-300 text-center leading-relaxed">{cvData.personalInfo.bio}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Experience */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Briefcase className="w-5 h-5" />
                Berufserfahrung
              </CardTitle>
              {isLoggedIn && (
                <Button
                  onClick={() => setEditingSection(editingSection === 'experience' ? null : 'experience')}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  {editingSection === 'experience' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.experiences.map((exp, index) => (
                <div key={exp.id} className="border-l-2 border-blue-600 pl-4">
                  {editingSection === 'experience' ? (
                    <div className="space-y-3">
                      <EditableText
                        value={exp.company}
                        onChange={(value) => updateExperience(index, 'company', value)}
                        className="font-semibold"
                      />
                      <EditableText
                        value={exp.position}
                        onChange={(value) => updateExperience(index, 'position', value)}
                      />
                      <EditableText
                        value={exp.duration}
                        onChange={(value) => updateExperience(index, 'duration', value)}
                      />
                      <EditableText
                        value={exp.description}
                        onChange={(value) => updateExperience(index, 'description', value)}
                        multiline
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-white">{exp.company}</h3>
                      <p className="text-blue-400">{exp.position}</p>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.duration}
                      </p>
                      <p className="text-slate-300 text-sm mt-2">{exp.description}</p>
                    </>
                  )}
                </div>
              ))}
              
              {editingSection === 'experience' && (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <GraduationCap className="w-5 h-5" />
                Ausbildung
              </CardTitle>
              {isLoggedIn && (
                <Button
                  onClick={() => setEditingSection(editingSection === 'education' ? null : 'education')}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  {editingSection === 'education' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {cvData.education.map((edu, index) => (
                <div key={edu.id} className="border-l-2 border-blue-600 pl-4">
                  {editingSection === 'education' ? (
                    <div className="space-y-3">
                      <EditableText
                        value={edu.institution}
                        onChange={(value) => updateEducation(index, 'institution', value)}
                        className="font-semibold"
                      />
                      <EditableText
                        value={edu.degree}
                        onChange={(value) => updateEducation(index, 'degree', value)}
                      />
                      <EditableText
                        value={edu.duration}
                        onChange={(value) => updateEducation(index, 'duration', value)}
                      />
                      <EditableText
                        value={edu.description}
                        onChange={(value) => updateEducation(index, 'description', value)}
                        multiline
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-white">{edu.institution}</h3>
                      <p className="text-blue-400">{edu.degree}</p>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {edu.duration}
                      </p>
                      <p className="text-slate-300 text-sm mt-2">{edu.description}</p>
                    </>
                  )}
                </div>
              ))}
              
              {editingSection === 'education' && (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Code className="w-5 h-5" />
                Fähigkeiten
              </CardTitle>
              {isLoggedIn && (
                <Button
                  onClick={() => setEditingSection(editingSection === 'skills' ? null : 'skills')}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  {editingSection === 'skills' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {cvData.skills.map((skill, index) => (
                <div key={skill.id}>
                  {editingSection === 'skills' ? (
                    <div className="space-y-2">
                      <EditableText
                        value={skill.name}
                        onChange={(value) => updateSkill(index, 'name', value)}
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={skill.level}
                        onChange={(e) => updateSkill(index, 'level', parseInt(e.target.value) || 0)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-slate-400 text-sm">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              {editingSection === 'skills' && (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <Globe className="w-5 h-5" />
                Sprachen
              </CardTitle>
              {isLoggedIn && (
                <Button
                  onClick={() => setEditingSection(editingSection === 'languages' ? null : 'languages')}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  {editingSection === 'languages' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {cvData.languages.map((language, index) => (
                <div key={language.id} className="flex justify-between items-center">
                  {editingSection === 'languages' ? (
                    <div className="flex gap-2 w-full">
                      <EditableText
                        value={language.name}
                        onChange={(value) => updateLanguage(index, 'name', value)}
                        className="flex-1"
                      />
                      <EditableText
                        value={language.level}
                        onChange={(value) => updateLanguage(index, 'level', value)}
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <>
                      <span className="text-white">{language.name}</span>
                      <Badge variant="outline" className="border-blue-600 text-blue-400">
                        {language.level}
                      </Badge>
                    </>
                  )}
                </div>
              ))}
              
              {editingSection === 'languages' && (
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card className="mt-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Code className="w-5 h-5" />
              Projekte
            </CardTitle>
            {isLoggedIn && (
              <Button
                onClick={() => setEditingSection(editingSection === 'projects' ? null : 'projects')}
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                {editingSection === 'projects' ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {cvData.projects.map((project, index) => (
                <div key={project.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  {editingSection === 'projects' ? (
                    <div className="space-y-3">
                      <EditableText
                        value={project.name}
                        onChange={(value) => updateProject(index, 'name', value)}
                        className="font-semibold"
                      />
                      <EditableText
                        value={project.description}
                        onChange={(value) => updateProject(index, 'description', value)}
                        multiline
                      />
                      <EditableText
                        value={project.technologies.join(', ')}
                        onChange={(value) => updateProject(index, 'technologies', value.split(', ').filter(t => t.trim()))}
                      />
                      <EditableText
                        value={project.link || ''}
                        onChange={(value) => updateProject(index, 'link', value || undefined)}
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-white mb-2">{project.name}</h3>
                      <p className="text-slate-300 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="bg-blue-900/50 text-blue-400">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3" />
                          Live Demo
                        </a>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {editingSection === 'projects' && (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full mt-6">
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
