
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { SupabaseConfig } from '@/components/SupabaseConfig';
import { Header } from '@/components/Header';
import { CVContent } from '@/components/CVContent';
import { useAuthActions } from '@/components/AuthActions';
import { useLanguage } from '@/contexts/LanguageContext';
import { isConfiguredViaEnv } from '@/lib/supabase';
import { useCVData } from '@/hooks/useCVData';

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
    isLoading: cvLoading,
    error: cvError,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateLanguage,
    updateProject,
    updateCertificate,
    updateFieldVisibility
  } = useCVData();

  const { handleLogin, handleLogout, handleEdit } = useAuthActions({
    user,
    signIn,
    signOut,
    setShowLogin,
    setShowSupabaseConfig,
    setEditingSection
  });

  const handleSupabaseConfigured = () => {
    setShowSupabaseConfig(false);
    // Reload the page to reinitialize Supabase client
    window.location.reload();
  };

  const handleSave = () => {
    setEditingSection(null);
    toast({
      title: t('saved'),
      description: t('saved_desc'),
    });
  };

  const onEdit = (section: string) => {
    handleEdit(section, editingSection, setEditingSection);
  };

  // Show Supabase configuration only when explicitly requested and not configured via env
  if (showSupabaseConfig && !isConfiguredViaEnv()) {
    return <SupabaseConfig onConfigured={handleSupabaseConfigured} />;
  }

  // Show login form as overlay if requested
  if (showLogin && !user && !loading) {
    return <LoginForm onLogin={handleLogin} loading={loading} onCancel={() => setShowLogin(false)} />;
  }

  // Show loading state for CV data
  if (cvLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('loading')}...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header
        user={user}
        loading={loading}
        showVisibilitySettings={showVisibilitySettings}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        onVisibilityToggle={() => setShowVisibilitySettings(!showVisibilitySettings)}
      />

      <CVContent
        cvData={cvData}
        fieldVisibility={fieldVisibility}
        user={user}
        editingSection={editingSection}
        showVisibilitySettings={showVisibilitySettings}
        cvError={cvError}
        onEdit={onEdit}
        onSave={handleSave}
        updatePersonalInfo={updatePersonalInfo}
        updateExperience={updateExperience}
        updateEducation={updateEducation}
        updateSkill={updateSkill}
        updateLanguage={updateLanguage}
        updateProject={updateProject}
        updateCertificate={updateCertificate}
        updateFieldVisibility={updateFieldVisibility}
      />
    </div>
  );
};

export default Index;
