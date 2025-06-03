
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Calendar, Edit, Save, X } from 'lucide-react';
import { Education } from '@/types/cv';
import { EditableText } from '@/components/EditableText';

interface EducationSectionProps {
  education: Education[];
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (index: number, field: keyof Education, value: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  isLoggedIn,
  isEditing,
  onEdit,
  onSave,
  onUpdate
}) => {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <GraduationCap className="w-5 h-5" />
          Ausbildung
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
        {education.map((edu, index) => (
          <div key={edu.id} className="border-l-2 border-blue-600 pl-4">
            {isEditing ? (
              <div className="space-y-3">
                <EditableText
                  value={edu.institution}
                  onChange={(value) => onUpdate(index, 'institution', value)}
                  className="font-semibold"
                />
                <EditableText
                  value={edu.degree}
                  onChange={(value) => onUpdate(index, 'degree', value)}
                />
                <EditableText
                  value={edu.duration}
                  onChange={(value) => onUpdate(index, 'duration', value)}
                />
                <EditableText
                  value={edu.description}
                  onChange={(value) => onUpdate(index, 'description', value)}
                  multiline
                />
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-white">{edu.institution}</h3>
                <p className="text-blue-400">{edu.degree}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {edu.duration}
                </p>
                <p className="text-slate-300 text-sm mt-2">{edu.description}</p>
              </>
            )}
          </div>
        ))}
        
        {isEditing && (
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700 w-full">
            <Save className="w-4 h-4 mr-2" />
            Speichern
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
