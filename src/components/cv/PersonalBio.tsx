
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
        className="mt-4 min-h-[120px]"
      />
    );
  }

  if (!isVisible) return null;

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="text-slate-300 leading-relaxed space-y-2">
      <p className="text-justify">
        {formatText(bio)}
      </p>
    </div>
  );
};
