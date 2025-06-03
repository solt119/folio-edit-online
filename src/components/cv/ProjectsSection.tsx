
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Globe, Edit, Save, X } from 'lucide-react';
import { Project } from '@/types/cv';
import { EditableText } from '@/components/EditableText';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProjectsSectionProps {
  projects: Project[];
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (index: number, field: string, value: string | string[]) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isLoggedIn,
  isEditing,
  onEdit,
  onSave,
  onUpdate
}) => {
  const { t } = useLanguage();

  return (
    <Card className="mt-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Code className="w-5 h-5" />
          {t('projects')}
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
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div key={project.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              {isEditing ? (
                <div className="space-y-3">
                  <EditableText
                    value={project.name}
                    onChange={(value) => onUpdate(index, 'name', value)}
                    className="font-semibold"
                  />
                  <EditableText
                    value={project.description}
                    onChange={(value) => onUpdate(index, 'description', value)}
                    multiline
                  />
                  <EditableText
                    value={project.technologies.join(', ')}
                    onChange={(value) => onUpdate(index, 'technologies', value.split(', ').filter(t => t.trim()))}
                  />
                  <EditableText
                    value={project.link || ''}
                    onChange={(value) => onUpdate(index, 'link', value || undefined)}
                  />
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-white mb-2">{project.name}</h3>
                  <p className="text-slate-300 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="bg-blue-900/50 text-blue-400">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      Live Demo
                    </a>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        
        {isEditing && (
          <Button onClick={onSave} className="bg-green-600 hover:bg-green-700 w-full mt-6">
            <Save className="w-4 h-4 mr-2" />
            {t('save')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
