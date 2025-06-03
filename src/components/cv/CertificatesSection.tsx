
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, ExternalLink, Edit, Save, X } from 'lucide-react';
import { Certificate } from '@/types/cv';
import { EditableText } from '@/components/EditableText';
import { useLanguage } from '@/contexts/LanguageContext';

interface CertificatesSectionProps {
  certificates: Certificate[];
  isLoggedIn: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (index: number, field: keyof Certificate, value: string) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
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
          <Award className="w-5 h-5" />
          {t('certificates')}
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
        {certificates.map((certificate, index) => (
          <div key={certificate.id} className="border-l-2 border-blue-600 pl-4">
            {isEditing ? (
              <div className="space-y-3">
                <EditableText
                  value={certificate.name}
                  onChange={(value) => onUpdate(index, 'name', value)}
                  className="font-semibold"
                />
                <EditableText
                  value={certificate.issuer}
                  onChange={(value) => onUpdate(index, 'issuer', value)}
                />
                <EditableText
                  value={certificate.issueDate}
                  onChange={(value) => onUpdate(index, 'issueDate', value)}
                />
                <EditableText
                  value={certificate.expiryDate || ''}
                  onChange={(value) => onUpdate(index, 'expiryDate', value)}
                />
                <EditableText
                  value={certificate.credentialId || ''}
                  onChange={(value) => onUpdate(index, 'credentialId', value)}
                />
                <EditableText
                  value={certificate.link || ''}
                  onChange={(value) => onUpdate(index, 'link', value)}
                />
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-white">{certificate.name}</h3>
                <p className="text-blue-400">{certificate.issuer}</p>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Ausgestellt: {certificate.issueDate}</span>
                  {certificate.expiryDate && (
                    <span>• Läuft ab: {certificate.expiryDate}</span>
                  )}
                </div>
                {certificate.credentialId && (
                  <Badge variant="outline" className="border-slate-600 text-slate-400 mt-2">
                    ID: {certificate.credentialId}
                  </Badge>
                )}
                {certificate.link && (
                  <a 
                    href={certificate.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1 mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Zertifikat anzeigen
                  </a>
                )}
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
