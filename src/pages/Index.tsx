
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { useCVData } from '@/hooks/useCVData';
import { PersonalInfoSection } from '@/components/cv/PersonalInfoSection';
import { ExperienceSection } from '@/components/cv/ExperienceSection';
import { EducationSection } from '@/components/cv/EducationSection';
import { SkillsSection } from '@/components/cv/SkillsSection';
import { LanguagesSection } from '@/components/cv/LanguagesSection';
import { ProjectsSection } from '@/components/cv/ProjectsSection';
import { CertificatesSection } from '@/components/cv/CertificatesSection';

const Index = () => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const { user, loading, signIn, signOut } = useAuth();
  
  const {
    cvData,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateLanguage,
    updateProject,
    updateCertificate
  } = useCVData();

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Erfolgreich eingeloggt",
        description: "Sie können jetzt Ihren Lebenslauf bearbeiten.",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setEditingSection(null);
      toast({
        title: "Erfolgreich ausgeloggt",
        description: "Sie befinden sich jetzt im Ansichtsmodus.",
      });
    }
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={handleLogin} loading={loading} />;
  }

  // Show CV editor if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/80 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Curriculum Vitae</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">Angemeldet als: {user.email}</span>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm"
              className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Personal Information */}
        <PersonalInfoSection
          personalInfo={cvData.personalInfo}
          isLoggedIn={true}
          isEditing={editingSection === 'personal'}
          onEdit={() => handleEdit('personal')}
          onSave={handleSave}
          onUpdate={updatePersonalInfo}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Experience */}
          <ExperienceSection
            experiences={cvData.experiences}
            isLoggedIn={true}
            isEditing={editingSection === 'experience'}
            onEdit={() => handleEdit('experience')}
            onSave={handleSave}
            onUpdate={updateExperience}
          />

          {/* Education */}
          <EducationSection
            education={cvData.education}
            isLoggedIn={true}
            isEditing={editingSection === 'education'}
            onEdit={() => handleEdit('education')}
            onSave={handleSave}
            onUpdate={updateEducation}
          />

          {/* Skills */}
          <SkillsSection
            skills={cvData.skills}
            isLoggedIn={true}
            isEditing={editingSection === 'skills'}
            onEdit={() => handleEdit('skills')}
            onSave={handleSave}
            onUpdate={updateSkill}
          />

          {/* Languages */}
          <LanguagesSection
            languages={cvData.languages}
            isLoggedIn={true}
            isEditing={editingSection === 'languages'}
            onEdit={() => handleEdit('languages')}
            onSave={handleSave}
            onUpdate={updateLanguage}
          />

          {/* Certificates */}
          <CertificatesSection
            certificates={cvData.certificates}
            isLoggedIn={true}
            isEditing={editingSection === 'certificates'}
            onEdit={() => handleEdit('certificates')}
            onSave={handleSave}
            onUpdate={updateCertificate}
          />
        </div>

        {/* Projects */}
        <ProjectsSection
          projects={cvData.projects}
          isLoggedIn={true}
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
