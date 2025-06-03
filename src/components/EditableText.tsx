
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
  const [lastTranslatedValue, setLastTranslatedValue] = useState('');
  const [lastLanguage, setLastLanguage] = useState(language);

  // Handle translation when language changes
  useEffect(() => {
    if (enableTranslation && language !== lastLanguage && value && value.trim() !== '') {
      console.log(`Translating EditableText from ${lastLanguage} to ${language}:`, value);
      
      // Only translate if the current value hasn't been manually changed from the last translated value
      if (value === lastTranslatedValue || lastTranslatedValue === '') {
        const translatedValue = translateText(value, lastLanguage, language);
        console.log(`Translated result:`, translatedValue);
        
        if (translatedValue !== value) {
          setLocalValue(translatedValue);
          setLastTranslatedValue(translatedValue);
          onChange(translatedValue);
        }
      }
    }
    setLastLanguage(language);
  }, [language, value, enableTranslation, lastLanguage, lastTranslatedValue, onChange]);

  // Update local value when prop value changes (but not during translation)
  useEffect(() => {
    if (value !== lastTranslatedValue) {
      setLocalValue(value);
    }
  }, [value, lastTranslatedValue]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setLastTranslatedValue(''); // Reset translation tracking when user manually edits
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
