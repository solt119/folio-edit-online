
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

  const contactItems = [
    {
      field: 'location' as keyof PersonalInfo,
      icon: MapPin,
      value: personalInfo.location
    },
    {
      field: 'email' as keyof PersonalInfo,
      icon: Mail,
      value: personalInfo.email
    },
    {
      field: 'phone' as keyof PersonalInfo,
      icon: Phone,
      value: personalInfo.phone
    },
    {
      field: 'linkedin' as keyof PersonalInfo,
      icon: Linkedin,
      value: personalInfo.linkedin
    },
    {
      field: 'github' as keyof PersonalInfo,
      icon: Github,
      value: personalInfo.github
    }
  ].filter(item => isVisible(item.field) && item.value && item.value.trim() !== '');

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
      {contactItems.map(({ field, icon: Icon, value }) => (
        <div key={field} className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};
