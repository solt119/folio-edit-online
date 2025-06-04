
import React from 'react';
import { VisibilityControls } from '@/components/VisibilityControls';
import { PersonalInfoSection } from '@/components/cv/PersonalInfoSection';
import { ExperienceSection } from '@/components/cv/ExperienceSection';
import { EducationSection } from '@/components/cv/EducationSection';
import { SkillsSection } from '@/components/cv/SkillsSection';
import { LanguagesSection } from '@/components/cv/LanguagesSection';
import { ProjectsSection } from '@/components/cv/ProjectsSection';
import { CertificatesSection } from '@/components/cv/CertificatesSection';
import { CVData } from '@/types/cv';
import { FieldVisibility } from '@/types/visibility';
import { useLanguage } from '@/contexts/LanguageContext';

interface CVContentProps {
  cvData: CVData;
  fieldVisibility: FieldVisibility;
  user: any;
  editingSection: string | null;
  showVisibilitySettings: boolean;
  cvError: string | null;
  isTranslating?: boolean;
  onEdit: (section: string) => void;
  onSave: () => void;
  updatePersonalInfo: (field: any, value: string) => void;
  updateExperience: (index: number, field: any, value: string) => void;
  updateEducation: (index: number, field: any, value: string) => void;
  updateSkill: (index: number, field: any, value: string | number) => void;
  updateLanguage: (index: number, field: any, value: string) => void;
  updateProject: (index: number, field: string, value: string | string[]) => void;
  updateCertificate: (index: number, field: any, value: string) => void;
  updateFieldVisibility: (section: any, field: string, visible: boolean) => void;
}

export const CVContent: React.FC<CVContentProps> = ({
  cvData,
  fieldVisibility,
  user,
  editingSection,
  showVisibilitySettings,
  cvError,
  isTranslating = false,
  onEdit,
  onSave,
  updatePersonalInfo,
  updateExperience,
  updateEducation,
  updateSkill,
  updateLanguage,
  updateProject,
  updateCertificate,
  updateFieldVisibility
}) => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Translation status */}
      {isTranslating && (
        <div className="mb-4 p-4 bg-blue-600/20 border border-blue-600 rounded-lg text-blue-300 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          <span>Automatische Übersetzung läuft...</span>
        </div>
      )}

      {/* Error message */}
      {cvError && (
        <div className="mb-4 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-300">
          {cvError}
        </div>
      )}

      {/* Visibility Controls - only show when logged in and toggled */}
      {user && showVisibilitySettings && (
        <VisibilityControls
          visibility={fieldVisibility}
          onUpdate={updateFieldVisibility}
        />
      )}

      {/* Personal Information */}
      <PersonalInfoSection
        personalInfo={cvData.personalInfo}
        isLoggedIn={!!user}
        isEditing={editingSection === 'personal'}
        onEdit={() => onEdit('personal')}
        onSave={onSave}
        onUpdate={updatePersonalInfo}
        visibility={fieldVisibility.personalInfo}
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Experience */}
        {(user || fieldVisibility.sections.experience) && (
          <ExperienceSection
            experiences={cvData.experiences}
            isLoggedIn={!!user}
            isEditing={editingSection === 'experience'}
            onEdit={() => onEdit('experience')}
            onSave={onSave}
            onUpdate={updateExperience}
          />
        )}

        {/* Education */}
        {(user || fieldVisibility.sections.education) && (
          <EducationSection
            education={cvData.education}
            isLoggedIn={!!user}
            isEditing={editingSection === 'education'}
            onEdit={() => onEdit('education')}
            onSave={onSave}
            onUpdate={updateEducation}
          />
        )}

        {/* Skills */}
        {(user || fieldVisibility.sections.skills) && (
          <SkillsSection
            skills={cvData.skills}
            isLoggedIn={!!user}
            isEditing={editingSection === 'skills'}
            onEdit={() => onEdit('skills')}
            onSave={onSave}
            onUpdate={updateSkill}
          />
        )}

        {/* Languages */}
        {(user || fieldVisibility.sections.languages) && (
          <LanguagesSection
            languages={cvData.languages}
            isLoggedIn={!!user}
            isEditing={editingSection === 'languages'}
            onEdit={() => onEdit('languages')}
            onSave={onSave}
            onUpdate={updateLanguage}
          />
        )}

        {/* Certificates */}
        {(user || fieldVisibility.sections.certificates) && (
          <CertificatesSection
            certificates={cvData.certificates}
            isLoggedIn={!!user}
            isEditing={editingSection === 'certificates'}
            onEdit={() => onEdit('certificates')}
            onSave={onSave}
            onUpdate={updateCertificate}
          />
        )}
      </div>

      {/* Projects */}
      {(user || fieldVisibility.sections.projects) && (
        <ProjectsSection
          projects={cvData.projects}
          isLoggedIn={!!user}
          isEditing={editingSection === 'projects'}
          onEdit={() => onEdit('projects')}
          onSave={onSave}
          onUpdate={updateProject}
        />
      )}
    </div>
  );
};
