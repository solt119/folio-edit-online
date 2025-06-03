
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
  const [lastLanguage, setLastLanguage] = useState(language);

  // Update local value when language changes and translation is enabled
  useEffect(() => {
    if (enableTranslation && language !== lastLanguage && value) {
      console.log(`Translating text from ${lastLanguage} to ${language}:`, value);
      const translatedValue = translateText(value, lastLanguage, language);
      setLocalValue(translatedValue);
      onChange(translatedValue);
    } else {
      setLocalValue(value);
    }
    setLastLanguage(language);
  }, [language, value, enableTranslation, lastLanguage, onChange]);

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
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
