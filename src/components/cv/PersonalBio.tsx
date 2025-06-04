
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
    const lines = text.split('\n');
    const totalLength = text.length;
    const hasMultipleLines = lines.length > 1;
    
    // Use justify only for longer texts with multiple lines
    const shouldUseJustify = totalLength > 150 && hasMultipleLines;
    
    return lines.map((line, index) => {
      const isLongLine = line.length > 80;
      const shouldJustifyLine = shouldUseJustify && isLongLine;
      
      return (
        <React.Fragment key={index}>
          <span className={shouldJustifyLine ? 'text-justify' : 'text-left'}>
            {line}
          </span>
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="text-slate-300 leading-relaxed">
      <div className="space-y-3">
        {formatText(bio)}
      </div>
    </div>
  );
};
