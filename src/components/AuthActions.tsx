
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthActionsProps {
  user: any;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signOut: () => Promise<{ error?: any }>;
  setShowLogin: (show: boolean) => void;
  setShowSupabaseConfig: (show: boolean) => void;
  setEditingSection: (section: string | null) => void;
}

export const useAuthActions = ({
  user,
  signIn,
  signOut,
  setShowLogin,
  setShowSupabaseConfig,
  setEditingSection
}: AuthActionsProps) => {
  const { t } = useLanguage();

  const handleLogin = async (email: string, password: string) => {
    // Direkt anmelden, da Supabase immer konfiguriert ist
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

  const handleEdit = (section: string, editingSection: string | null, setEditingSection: (section: string | null) => void) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setEditingSection(editingSection === section ? null : section);
  };

  return {
    handleLogin,
    handleLogout,
    handleEdit
  };
};
