
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Calendar, Edit, Save, X } from 'lucide-react';
import { Experience } from '@/types/cv';
import { EditableText } from '@/components/EditableText';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExperienceSectionProps {
  experiences: Experience[];
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (index: number, field: keyof Experience, value: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  isLoggedIn,
  isEditing,
  onEdit,
  onSave,
  onUpdate
}) => {
  const { t } = useLanguage();

  const formatText = (text: string) => {
    const lines = text.split('\n');
    const totalLength = text.length;
    const hasMultipleLines = lines.length > 1;
    
    // Use justify only for longer texts with multiple lines
    const shouldUseJustify = totalLength > 200 && hasMultipleLines;
    
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
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Briefcase className="w-5 h-5" />
          {t('experience')}
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
      <CardContent className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="border-l-2 border-blue-600 pl-4">
            {isEditing ? (
              <div className="space-y-3">
                <EditableText
                  value={exp.company}
                  onChange={(value) => onUpdate(index, 'company', value)}
                  className="font-semibold"
                />
                <EditableText
                  value={exp.position}
                  onChange={(value) => onUpdate(index, 'position', value)}
                />
                <EditableText
                  value={exp.duration}
                  onChange={(value) => onUpdate(index, 'duration', value)}
                />
                <EditableText
                  value={exp.description}
                  onChange={(value) => onUpdate(index, 'description', value)}
                  multiline
                  className="min-h-[100px]"
                />
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-white">{exp.company}</h3>
                <p className="text-blue-400">{exp.position}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {exp.duration}
                </p>
                <div className="text-slate-300 text-sm mt-3 leading-relaxed space-y-2">
                  {formatText(exp.description)}
                </div>
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
