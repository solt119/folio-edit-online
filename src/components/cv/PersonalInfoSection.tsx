
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Github, Linkedin, Edit, Save, X } from 'lucide-react';
import { PersonalInfo } from '@/types/cv';
import { FieldVisibility } from '@/types/visibility';
import { EditableText } from '@/components/EditableText';

interface PersonalInfoSectionProps {
  personalInfo: PersonalInfo;
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  visibility?: FieldVisibility['personalInfo'];
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  isLoggedIn,
  isEditing,
  onEdit,
  onSave,
  onUpdate,
  visibility
}) => {
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
          {isEditing ? (
            <div className="space-y-4">
              <EditableText
                value={personalInfo.name}
                onChange={(value) => onUpdate('name', value)}
                className="text-center text-3xl font-bold"
              />
              <EditableText
                value={personalInfo.profession}
                onChange={(value) => onUpdate('profession', value)}
                className="text-center text-xl"
              />
              <div className="space-y-2">
                <EditableText
                  value={personalInfo.location}
                  onChange={(value) => onUpdate('location', value)}
                />
                <EditableText
                  value={personalInfo.email}
                  onChange={(value) => onUpdate('email', value)}
                />
                <EditableText
                  value={personalInfo.phone}
                  onChange={(value) => onUpdate('phone', value)}
                />
                <EditableText
                  value={personalInfo.linkedin}
                  onChange={(value) => onUpdate('linkedin', value)}
                />
                <EditableText
                  value={personalInfo.github}
                  onChange={(value) => onUpdate('github', value)}
                />
              </div>
              <Button onClick={onSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Speichern
              </Button>
            </div>
          ) : (
            <>
              {isVisible('name') && (
                <h1 className="text-4xl font-bold text-white">{personalInfo.name}</h1>
              )}
              {isVisible('profession') && (
                <p className="text-xl text-blue-400">{personalInfo.profession}</p>
              )}
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
                {isVisible('location') && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {isVisible('email') && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {isVisible('phone') && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {isVisible('linkedin') && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    <span>{personalInfo.linkedin}</span>
                  </div>
                )}
                {isVisible('github') && (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <span>{personalInfo.github}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <EditableText
            value={personalInfo.bio}
            onChange={(value) => onUpdate('bio', value)}
            multiline
            className="mt-4"
          />
        ) : (
          isVisible('bio') && (
            <p className="text-slate-300 text-center leading-relaxed">{personalInfo.bio}</p>
          )
        )}
      </CardContent>
    </Card>
  );
};
