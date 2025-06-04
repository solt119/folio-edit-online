
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
    return text.split('\n').map((line, index) => {
      // Use justify only for longer lines (more than 60 characters)
      const shouldJustify = line.length > 60;
      return (
        <React.Fragment key={index}>
          <span className={shouldJustify ? 'text-justify' : 'text-left'}>
            {line}
          </span>
          {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="text-slate-300 leading-relaxed space-y-2">
      <div>
        {formatText(bio)}
      </div>
    </div>
  );
};
