
import { useCallback } from 'react';
import { CVData } from '@/types/cv';
import { translateCVData } from '@/utils/translationService';

export const useDataTranslation = () => {
  // Auto-translate function - wird nur beim Speichern aufgerufen
  const autoTranslateData = useCallback(async (
    newCvData: CVData,
    fromLanguage: 'de' | 'en',
    customData: { [key: string]: CVData }
  ): Promise<{ [key: string]: CVData }> => {
    const otherLanguage = fromLanguage === 'de' ? 'en' : 'de';
    
    console.log('🔄 Auto-Übersetzung von', fromLanguage, 'nach', otherLanguage);
    
    // Update the source language data
    const newCustomData = {
      ...customData,
      [fromLanguage]: newCvData
    };
    
    // Auto-translate to the other language
    console.log('🔄 Übersetze Inhalt nach', otherLanguage);
    try {
      const translatedData = await translateCVData(newCvData, otherLanguage);
      newCustomData[otherLanguage] = translatedData;
      console.log('✅ Auto-Übersetzung erfolgreich abgeschlossen');
    } catch (error) {
      console.error('❌ Übersetzung fehlgeschlagen:', error);
      // If translation fails, don't add faulty data
      console.log('⚠️ Verwende keine fehlerhaften Übersetzungsdaten');
    }
    
    console.log('✅ Daten-Synchronisation abgeschlossen');
    return newCustomData;
  }, []);

  return {
    autoTranslateData
  };
};
