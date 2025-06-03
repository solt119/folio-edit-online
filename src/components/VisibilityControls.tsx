
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { FieldVisibility } from '@/types/visibility';
import { useLanguage } from '@/contexts/LanguageContext';

interface VisibilityControlsProps {
  visibility: FieldVisibility;
  onUpdate: (section: keyof FieldVisibility, field: string, visible: boolean) => void;
}

export const VisibilityControls: React.FC<VisibilityControlsProps> = ({
  visibility,
  onUpdate
}) => {
  const { t } = useLanguage();

  const getPersonalInfoLabel = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      image: 'profile_image',
      bio: 'description',
      profession: 'profession',
      location: 'location',
      email: 'email',
      phone: 'phone',
      name: 'name',
      linkedin: 'linkedin',
      github: 'github'
    };
    return t(fieldMap[field] || field);
  };

  const getSectionLabel = (section: string) => {
    const sectionMap: { [key: string]: string } = {
      experience: 'experience',
      education: 'education',
      skills: 'skills',
      languages: 'languages',
      projects: 'projects',
      certificates: 'certificates'
    };
    return t(sectionMap[section] || section);
  };

  return (
    <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Eye className="w-5 h-5" />
          {t('visibility_settings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Info Visibility */}
        <div>
          <h3 className="font-semibold text-white mb-3">{t('personal_information')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(visibility.personalInfo).map(([field, visible]) => (
              <div key={field} className="flex items-center space-x-2">
                <Switch
                  id={`personal-${field}`}
                  checked={visible}
                  onCheckedChange={(checked) => onUpdate('personalInfo', field, checked)}
                />
                <Label htmlFor={`personal-${field}`} className="text-slate-300 capitalize">
                  {getPersonalInfoLabel(field)}
                </Label>
                {!visible && <EyeOff className="w-4 h-4 text-slate-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Sections Visibility */}
        <div>
          <h3 className="font-semibold text-white mb-3">{t('sections')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(visibility.sections).map(([section, visible]) => (
              <div key={section} className="flex items-center space-x-2">
                <Switch
                  id={`section-${section}`}
                  checked={visible}
                  onCheckedChange={(checked) => onUpdate('sections', section, checked)}
                />
                <Label htmlFor={`section-${section}`} className="text-slate-300 capitalize">
                  {getSectionLabel(section)}
                </Label>
                {!visible && <EyeOff className="w-4 h-4 text-slate-500" />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
