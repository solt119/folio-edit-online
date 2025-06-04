
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn, Settings } from 'lucide-react';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  user: any;
  loading: boolean;
  showVisibilitySettings: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onVisibilityToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  loading,
  showVisibilitySettings,
  onLoginClick,
  onLogoutClick,
  onVisibilityToggle
}) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/80 border-b border-slate-700">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{t('curriculum_vitae')}</h1>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          {user ? (
            <>
              <span className="text-slate-400 text-sm">{t('logged_in_as')}: {user.email}</span>
              <Button 
                onClick={onVisibilityToggle}
                variant="outline" 
                size="sm"
                className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t('visibility')}
              </Button>
              <Button 
                onClick={onLogoutClick}
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
              onClick={onLoginClick}
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
  );
};
