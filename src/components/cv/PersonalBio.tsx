
import React from 'react';
import { EditableText } from '@/components/EditableText';

interface PersonalBioProps {
  bio: string;
  isEditing: boolean;
  isVisible: boolean;
  onUpdate: (value: string) => void;
}

export const PersonalBio: React.FC<PersonalBioProps> = ({
  bio,
  isEditing,
  isVisible,
  onUpdate
}) => {
  if (isEditing) {
    return (
      <EditableText
        value={bio}
        onChange={onUpdate}
        multiline
        className="mt-4"
      />
    );
  }

  if (!isVisible) return null;

  return (
    <p className="text-slate-300 text-center leading-relaxed">{bio}</p>
  );
};
