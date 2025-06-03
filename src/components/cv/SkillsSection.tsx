
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, Edit, Save, X } from 'lucide-react';
import { Skill } from '@/types/cv';
import { EditableText } from '@/components/EditableText';

interface SkillsSectionProps {
  skills: Skill[];
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (index: number, field: keyof Skill, value: string | number) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
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
          <Code className="w-5 h-5" />
          Fähigkeiten
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
      <CardContent className="space-y-4">
        {skills.map((skill, index) => (
          <div key={skill.id}>
            {isEditing ? (
              <div className="space-y-2">
                <EditableText
                  value={skill.name}
                  onChange={(value) => onUpdate(index, 'name', value)}
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => onUpdate(index, 'level', parseInt(e.target.value) || 0)}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-white">{skill.name}</span>
                  <span className="text-slate-400 text-sm">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
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
