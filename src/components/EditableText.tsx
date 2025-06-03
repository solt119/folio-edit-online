
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText } from '@/utils/translationService';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  enableTranslation?: boolean;
  originalLanguage?: 'de' | 'en';
}

export const EditableText = React.memo(({ 
  value, 
  onChange, 
  multiline = false, 
  className = "",
  enableTranslation = true,
  originalLanguage = 'de'
}: EditableTextProps) => {
  const { language } = useLanguage();
  const [localValue, setLocalValue] = useState(value);
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Update local value when prop value changes from parent
  useEffect(() => {
    if (!isUserEditing) {
      setLocalValue(value);
    }
  }, [value, isUserEditing]);

  // Handle translation when language changes
  useEffect(() => {
    if (enableTranslation && !isUserEditing && value && value.trim() !== '') {
      console.log(`Translating from current language to ${language}:`, value);
      
      // Determine source language based on current content
      const sourceLanguage = language === 'de' ? 'en' : 'de';
      const translatedValue = translateText(value, sourceLanguage, language);
      
      console.log(`Translation result:`, translatedValue);
      
      if (translatedValue !== value) {
        setLocalValue(translatedValue);
        onChange(translatedValue);
      }
    }
  }, [language, enableTranslation, value, isUserEditing, onChange]);

  const handleChange = (newValue: string) => {
    setIsUserEditing(true);
    setLocalValue(newValue);
    onChange(newValue);
    
    // Reset editing flag after a short delay
    setTimeout(() => setIsUserEditing(false), 500);
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
