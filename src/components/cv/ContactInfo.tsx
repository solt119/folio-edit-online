
import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import { EditableText } from '@/components/EditableText';
import { PersonalInfo } from '@/types/cv';

interface ContactInfoProps {
  personalInfo: PersonalInfo;
  isEditing: boolean;
  isVisible: (field: keyof PersonalInfo) => boolean;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  personalInfo,
  isEditing,
  isVisible,
  onUpdate
}) => {
  if (isEditing) {
    return (
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
    );
  }

  return (
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
  );
};
