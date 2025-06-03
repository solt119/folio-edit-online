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

  // Simple translation: always from German to English when language is English
  useEffect(() => {
    if (enableTranslation && !isUserEditing && value && value.trim() !== '') {
      console.log(`Current language: ${language}`);
      console.log(`Value to translate: "${value}"`);
      
      // Only translate from German to English
      if (language === 'en' && originalLanguage === 'de') {
        console.log('Translating from German to English');
        const translatedValue = translateText(value, 'de', 'en');
        
        console.log(`Translation result: "${translatedValue}"`);
        
        if (translatedValue !== value) {
          setLocalValue(translatedValue);
          onChange(translatedValue);
        }
      } else if (language === 'de') {
        // When switching back to German, keep the original German text
        console.log('Keeping original German text');
        setLocalValue(value);
      }
    }
  }, [language, enableTranslation, value, isUserEditing, onChange, originalLanguage]);

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
