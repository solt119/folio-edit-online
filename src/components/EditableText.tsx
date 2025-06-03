
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
  const [lastTranslationFrom, setLastTranslationFrom] = useState<'de' | 'en' | null>(null);

  // Update local value when prop value changes from parent
  useEffect(() => {
    if (!isUserEditing) {
      setLocalValue(value);
    }
  }, [value, isUserEditing]);

  // Handle translation when language changes
  useEffect(() => {
    if (enableTranslation && !isUserEditing && value && value.trim() !== '') {
      console.log(`Current language: ${language}, Original language: ${originalLanguage}`);
      console.log(`Value to translate: "${value}"`);
      
      // Only translate if we're switching to a different language
      if (language !== originalLanguage) {
        // If this is the first translation or we're switching back
        if (!lastTranslationFrom || lastTranslationFrom !== originalLanguage) {
          console.log(`Translating from ${originalLanguage} to ${language}`);
          const translatedValue = translateText(value, originalLanguage, language);
          
          console.log(`Translation result: "${translatedValue}"`);
          
          if (translatedValue !== value) {
            setLocalValue(translatedValue);
            onChange(translatedValue);
            setLastTranslationFrom(originalLanguage);
          }
        } else {
          // We're switching back to original language, translate back
          console.log(`Translating back from ${language === 'de' ? 'en' : 'de'} to ${language}`);
          const translatedValue = translateText(value, language === 'de' ? 'en' : 'de', language);
          
          if (translatedValue !== value) {
            setLocalValue(translatedValue);
            onChange(translatedValue);
            setLastTranslationFrom(language === 'de' ? 'en' : 'de');
          }
        }
      } else {
        // We're in the original language, reset translation tracking
        setLastTranslationFrom(null);
      }
    }
  }, [language, enableTranslation, value, isUserEditing, onChange, originalLanguage, lastTranslationFrom]);

  const handleChange = (newValue: string) => {
    setIsUserEditing(true);
    setLocalValue(newValue);
    onChange(newValue);
    
    // Reset editing flag and translation tracking after a short delay
    setTimeout(() => {
      setIsUserEditing(false);
      setLastTranslationFrom(null);
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
