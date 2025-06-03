
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { FieldVisibility } from '@/types/visibility';

interface VisibilityControlsProps {
  visibility: FieldVisibility;
  onUpdate: (section: keyof FieldVisibility, field: string, visible: boolean) => void;
}

export const VisibilityControls: React.FC<VisibilityControlsProps> = ({
  visibility,
  onUpdate
}) => {
  return (
    <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Eye className="w-5 h-5" />
          Sichtbarkeitseinstellungen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Info Visibility */}
        <div>
          <h3 className="font-semibold text-white mb-3">Persönliche Informationen</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(visibility.personalInfo).map(([field, visible]) => (
              <div key={field} className="flex items-center space-x-2">
                <Switch
                  id={`personal-${field}`}
                  checked={visible}
                  onCheckedChange={(checked) => onUpdate('personalInfo', field, checked)}
                />
                <Label htmlFor={`personal-${field}`} className="text-slate-300 capitalize">
                  {field === 'image' ? 'Profilbild' :
                   field === 'bio' ? 'Beschreibung' : 
                   field === 'profession' ? 'Beruf' : 
                   field === 'location' ? 'Standort' : 
                   field === 'email' ? 'E-Mail' : 
                   field === 'phone' ? 'Telefon' : field}
                </Label>
                {!visible && <EyeOff className="w-4 h-4 text-slate-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Sections Visibility */}
        <div>
          <h3 className="font-semibold text-white mb-3">Bereiche</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(visibility.sections).map(([section, visible]) => (
              <div key={section} className="flex items-center space-x-2">
                <Switch
                  id={`section-${section}`}
                  checked={visible}
                  onCheckedChange={(checked) => onUpdate('sections', section, checked)}
                />
                <Label htmlFor={`section-${section}`} className="text-slate-300 capitalize">
                  {section === 'experience' ? 'Berufserfahrung' :
                   section === 'education' ? 'Ausbildung' :
                   section === 'skills' ? 'Fähigkeiten' :
                   section === 'languages' ? 'Sprachen' :
                   section === 'projects' ? 'Projekte' :
                   section === 'certificates' ? 'Zertifikate' : section}
                </Label>
                {!visible && <EyeOff className="w-4 h-4 text-slate-500" />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
