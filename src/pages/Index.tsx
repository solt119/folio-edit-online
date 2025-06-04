
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Edit, LogIn, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { SupabaseConfig } from '@/components/SupabaseConfig';
import { VisibilityControls } from '@/components/VisibilityControls';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { isSupabaseConfigured } from '@/lib/supabase';
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
  const [showLogin, setShowLogin] = useState(false);
  const [showVisibilitySettings, setShowVisibilitySettings] = useState(false);
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);
  const { user, loading, signIn, signOut } = useAuth();
  const { t } = useLanguage();
  
  const {
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
  } = useCVData();

  const handleSupabaseConfigured = () => {
    setShowSupabaseConfig(false);
    // Reload the page to reinitialize Supabase client
    window.location.reload();
  };

  const handleLogin = async (email: string, password: string) => {
    // Check if Supabase is configured first
    if (!isSupabaseConfigured()) {
      setShowSupabaseConfig(true);
      setShowLogin(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      toast({
        title: t('login_failed'),
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: t('login_success'),
        description: t('login_success_desc'),
      });
      setShowLogin(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: t('logout_error'),
        description: error.message,
        variant: "destructive"
      });
    } else {
      setEditingSection(null);
      toast({
        title: t('logout_success'),
        description: t('logout_success_desc'),
      });
    }
  };

  const handleSave = () => {
    setEditingSection(null);
    toast({
      title: t('saved'),
      description: t('saved_desc'),
    });
  };

  const handleEdit = (section: string) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setEditingSection(editingSection === section ? null : section);
  };

  // Show Supabase configuration only when explicitly requested
  if (showSupabaseConfig) {
    return <SupabaseConfig onConfigured={handleSupabaseConfigured} />;
  }

  // Show login form as overlay if requested
  if (showLogin && !user && !loading) {
    return <LoginForm onLogin={handleLogin} loading={loading} onCancel={() => setShowLogin(false)} />;
  }

  // Always show CV content - this is the main change
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/80 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{t('curriculum_vitae')}</h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            {user ? (
              <>
                <span className="text-slate-400 text-sm">{t('logged_in_as')}: {user.email}</span>
                <Button 
                  onClick={() => setShowVisibilitySettings(!showVisibilitySettings)}
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t('visibility')}
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setShowLogin(true)}
                variant="outline" 
                size="sm"
                className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
                disabled={loading}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? t('loading') : t('login_to_edit')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Visibility Controls - only show when logged in and toggled */}
        {user && showVisibilitySettings && (
          <VisibilityControls
            visibility={fieldVisibility}
            onUpdate={updateFieldVisibility}
          />
        )}

        {/* Personal Information */}
        <PersonalInfoSection
          personalInfo={cvData.personalInfo}
          isLoggedIn={!!user}
          isEditing={editingSection === 'personal'}
          onEdit={() => handleEdit('personal')}
          onSave={handleSave}
          onUpdate={updatePersonalInfo}
          visibility={fieldVisibility.personalInfo}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Experience */}
          {(user || fieldVisibility.sections.experience) && (
            <ExperienceSection
              experiences={cvData.experiences}
              isLoggedIn={!!user}
              isEditing={editingSection === 'experience'}
              onEdit={() => handleEdit('experience')}
              onSave={handleSave}
              onUpdate={updateExperience}
            />
          )}

          {/* Education */}
          {(user || fieldVisibility.sections.education) && (
            <EducationSection
              education={cvData.education}
              isLoggedIn={!!user}
              isEditing={editingSection === 'education'}
              onEdit={() => handleEdit('education')}
              onSave={handleSave}
              onUpdate={updateEducation}
            />
          )}

          {/* Skills */}
          {(user || fieldVisibility.sections.skills) && (
            <SkillsSection
              skills={cvData.skills}
              isLoggedIn={!!user}
              isEditing={editingSection === 'skills'}
              onEdit={() => handleEdit('skills')}
              onSave={handleSave}
              onUpdate={updateSkill}
            />
          )}

          {/* Languages */}
          {(user || fieldVisibility.sections.languages) && (
            <LanguagesSection
              languages={cvData.languages}
              isLoggedIn={!!user}
              isEditing={editingSection === 'languages'}
              onEdit={() => handleEdit('languages')}
              onSave={handleSave}
              onUpdate={updateLanguage}
            />
          )}

          {/* Certificates */}
          {(user || fieldVisibility.sections.certificates) && (
            <CertificatesSection
              certificates={cvData.certificates}
              isLoggedIn={!!user}
              isEditing={editingSection === 'certificates'}
              onEdit={() => handleEdit('certificates')}
              onSave={handleSave}
              onUpdate={updateCertificate}
            />
          )}
        </div>

        {/* Projects */}
        {(user || fieldVisibility.sections.projects) && (
          <ProjectsSection
            projects={cvData.projects}
            isLoggedIn={!!user}
            isEditing={editingSection === 'projects'}
            onEdit={() => handleEdit('projects')}
            onSave={handleSave}
            onUpdate={updateProject}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
