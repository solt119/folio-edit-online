
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { PersonalInfo } from '@/types/cv';
import { FieldVisibility } from '@/types/visibility';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfileImage } from './ProfileImage';
import { PersonalDetails } from './PersonalDetails';
import { ContactInfo } from './ContactInfo';
import { PersonalBio } from './PersonalBio';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  visibility?: FieldVisibility['personalInfo'];
  currentEditingLanguage?: 'de' | 'en';
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  isLoggedIn,
  isEditing,
  onEdit,
  onSave,
  onUpdate,
  visibility,
  currentEditingLanguage = 'de'
}) => {
  const { t } = useLanguage();

  const isVisible = (field: keyof PersonalInfo) => {
    return isLoggedIn || !visibility || visibility[field];
  };

  return (
    <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
      <CardHeader className="relative">
        {isLoggedIn && (
          <Button
            onClick={onEdit}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          </Button>
        )}
        
        <div className="text-center space-y-4">
          <ProfileImage
            image={personalInfo.image}
            name={personalInfo.name}
            isEditing={isEditing}
            isVisible={isVisible('image')}
            onUpdate={(value) => onUpdate('image', value)}
          />

          {isEditing ? (
            <div className="space-y-4">
              <PersonalDetails
                name={personalInfo.name}
                profession={personalInfo.profession}
                isEditing={isEditing}
                isNameVisible={isVisible('name')}
                isProfessionVisible={isVisible('profession')}
                onUpdate={onUpdate}
              />
              <ContactInfo
                personalInfo={personalInfo}
                isEditing={isEditing}
                isVisible={isVisible}
                onUpdate={onUpdate}
              />
              <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {t('save')}
              </Button>
            </div>
          ) : (
            <>
              <PersonalDetails
                name={personalInfo.name}
                profession={personalInfo.profession}
                isEditing={isEditing}
                isNameVisible={isVisible('name')}
                isProfessionVisible={isVisible('profession')}
                onUpdate={onUpdate}
              />
              <ContactInfo
                personalInfo={personalInfo}
                isEditing={isEditing}
                isVisible={isVisible}
                onUpdate={onUpdate}
              />
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <PersonalBio
          bio={personalInfo.bio}
          isEditing={isEditing}
          isVisible={isVisible('bio')}
          onUpdate={(value) => onUpdate('bio', value)}
        />
      </CardContent>
    </Card>
  );
};
