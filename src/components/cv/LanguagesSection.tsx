
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Edit, Save, X } from 'lucide-react';
import { Language } from '@/types/cv';
import { EditableText } from '@/components/EditableText';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguagesSectionProps {
  languages: Language[];
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (index: number, field: keyof Language, value: string) => void;
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
  isLoggedIn,
  isEditing,
  onEdit,
  onSave,
  onUpdate
}) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Globe className="w-5 h-5" />
          {t('languages')}
        </CardTitle>
        {isLoggedIn && (
          <Button
            onClick={onEdit}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {languages.map((language, index) => (
          <div key={language.id} className="flex justify-between items-center">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <EditableText
                  value={language.name}
                  onChange={(value) => onUpdate(index, 'name', value)}
                  className="flex-1"
                />
                <EditableText
                  value={language.level}
                  onChange={(value) => onUpdate(index, 'level', value)}
                  className="flex-1"
                />
              </div>
            ) : (
              <>
                <span className="text-white">{language.name}</span>
                <Badge variant="outline" className="border-blue-600 text-blue-400">
                  {language.level}
                </Badge>
              </>
            )}
          </div>
        ))}
        
        {isEditing && (
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700 w-full">
            <Save className="w-4 h-4 mr-2" />
            {t('save')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
