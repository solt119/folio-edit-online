
import React from 'react';
import { EditableText } from '@/components/EditableText';

interface PersonalDetailsProps {
  name: string;
  profession: string;
  isEditing: boolean;
  isNameVisible: boolean;
  isProfessionVisible: boolean;
  onUpdate: (field: 'name' | 'profession', value: string) => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  name,
  profession,
  isEditing,
  isNameVisible,
  isProfessionVisible,
  onUpdate
}) => {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <EditableText
          value={name}
          onChange={(value) => onUpdate('name', value)}
          className="text-center text-3xl font-bold"
        />
        <EditableText
          value={profession}
          onChange={(value) => onUpdate('profession', value)}
          className="text-center text-xl"
        />
      </div>
    );
  }

  return (
    <>
      {isNameVisible && name && name.trim() !== '' && (
        <h1 className="text-4xl font-bold text-white">{name}</h1>
      )}
      {isProfessionVisible && profession && profession.trim() !== '' && (
        <p className="text-xl text-blue-400">{profession}</p>
      )}
    </>
  );
};
