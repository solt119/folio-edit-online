
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
}

export const EditableText = React.memo(({ 
  value, 
  onChange, 
  multiline = false, 
  className = ""
}: EditableTextProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update local value when prop value changes from parent
  useEffect(() => {
    if (!isUserEditing) {
      setLocalValue(value);
    }
  }, [value, isUserEditing]);

  const handleChange = (newValue: string) => {
    setIsUserEditing(true);
    setLocalValue(newValue);
    onChange(newValue);
    
    // Reset editing flag after a short delay
    setTimeout(() => {
      setIsUserEditing(false);
    }, 500);
  };

  if (multiline) {
    return (
      <Textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className={`bg-slate-800 border-slate-600 text-white ${className}`}
      />
    );
  }
  
  return (
    <Input
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      className={`bg-slate-800 border-slate-600 text-white ${className}`}
    />
  );
});

EditableText.displayName = 'EditableText';
