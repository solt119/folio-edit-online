
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCVData } from '@/hooks/useCVData';
import { PersonalInfoSection } from '@/components/cv/PersonalInfoSection';
import { ExperienceSection } from '@/components/cv/ExperienceSection';
import { EducationSection } from '@/components/cv/EducationSection';
import { SkillsSection } from '@/components/cv/SkillsSection';
import { LanguagesSection } from '@/components/cv/LanguagesSection';
import { ProjectsSection } from '@/components/cv/ProjectsSection';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  const {
    cvData,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateLanguage,
    updateProject
  } = useCVData();

  // Load login status from localStorage on component mount
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

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

  const handleEdit = (section: string) => {
    setEditingSection(editingSection === section ? null : section);
  };

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
        <PersonalInfoSection
          personalInfo={cvData.personalInfo}
          isLoggedIn={isLoggedIn}
          isEditing={editingSection === 'personal'}
          onEdit={() => handleEdit('personal')}
          onSave={handleSave}
          onUpdate={updatePersonalInfo}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Experience */}
          <ExperienceSection
            experiences={cvData.experiences}
            isLoggedIn={isLoggedIn}
            isEditing={editingSection === 'experience'}
            onEdit={() => handleEdit('experience')}
            onSave={handleSave}
            onUpdate={updateExperience}
          />

          {/* Education */}
          <EducationSection
            education={cvData.education}
            isLoggedIn={isLoggedIn}
            isEditing={editingSection === 'education'}
            onEdit={() => handleEdit('education')}
            onSave={handleSave}
            onUpdate={updateEducation}
          />

          {/* Skills */}
          <SkillsSection
            skills={cvData.skills}
            isLoggedIn={isLoggedIn}
            isEditing={editingSection === 'skills'}
            onEdit={() => handleEdit('skills')}
            onSave={handleSave}
            onUpdate={updateSkill}
          />

          {/* Languages */}
          <LanguagesSection
            languages={cvData.languages}
            isLoggedIn={isLoggedIn}
            isEditing={editingSection === 'languages'}
            onEdit={() => handleEdit('languages')}
            onSave={handleSave}
            onUpdate={updateLanguage}
          />
        </div>

        {/* Projects */}
        <ProjectsSection
          projects={cvData.projects}
          isLoggedIn={isLoggedIn}
          isEditing={editingSection === 'projects'}
          onEdit={() => handleEdit('projects')}
          onSave={handleSave}
          onUpdate={updateProject}
        />
      </div>
    </div>
  );
};

export default Index;
