
-- SQL Script to add English translation column and populate it
-- This adds a separate column for English content alongside German content

-- Add English content column to cv_data table
ALTER TABLE cv_data ADD COLUMN IF NOT EXISTS content_en JSONB;

-- Function to translate German text to English
CREATE OR REPLACE FUNCTION translate_text_de_to_en(german_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF german_text IS NULL OR german_text = '' THEN
    RETURN german_text;
  END IF;
  
  -- Replace common German terms with English equivalents
  RETURN REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(
                      REPLACE(
                        REPLACE(
                          REPLACE(
                            REPLACE(
                              REPLACE(
                                REPLACE(
                                  REPLACE(
                                    REPLACE(
                                      REPLACE(
                                        REPLACE(
                                          REPLACE(
                                            REPLACE(
                                              REPLACE(
                                                REPLACE(
                                                  REPLACE(
                                                    REPLACE(
                                                      REPLACE(
                                                        REPLACE(
                                                          REPLACE(
                                                            REPLACE(
                                                              REPLACE(
                                                                REPLACE(
                                                                  REPLACE(
                                                                    REPLACE(
                                                                      REPLACE(
                                                                        REPLACE(
                                                                          REPLACE(
                                                                            REPLACE(
                                                                              REPLACE(
                                                                                REPLACE(german_text,
                                                                                'Softwareentwickler', 'Software Developer'),
                                                                              'Frontend-Entwickler', 'Frontend Developer'),
                                                                            'Backend-Entwickler', 'Backend Developer'),
                                                                          'Full-Stack-Entwickler', 'Full Stack Developer'),
                                                                        'Projektmanager', 'Project Manager'),
                                                                      'UI/UX Designer', 'UI/UX Designer'),
                                                                    'DevOps Engineer', 'DevOps Engineer'),
                                                                  'Systemadministrator', 'System Administrator'),
                                                                'Qualitätssicherung', 'Quality Assurance'),
                                                              'Teamleiter', 'Team Lead'),
                                                            'Senior Entwickler', 'Senior Developer'),
                                                          'Junior Entwickler', 'Junior Developer'),
                                                        'Universität', 'University'),
                                                      'Hochschule', 'University of Applied Sciences'),
                                                    'Fachhochschule', 'University of Applied Sciences'),
                                                  'Institut', 'Institute'),
                                                'Informatik', 'Computer Science'),
                                              'Wirtschaftsinformatik', 'Business Informatics'),
                                            'Berufserfahrung', 'Professional Experience'),
                                          'Ausbildung', 'Education'),
                                        'Fähigkeiten', 'Skills'),
                                      'Sprachen', 'Languages'),
                                    'Projekte', 'Projects'),
                                  'Zertifikate', 'Certificates'),
                                'verantwortlich für', 'responsible for'),
                              'zuständig für', 'responsible for'),
                            'im Bereich', 'in the field of'),
                          'mehr als', 'more than'),
                        'weniger als', 'less than'),
                      'Jahre Erfahrung', 'years of experience'),
                    'seit', 'since'),
                  'bis', 'until'),
                'heute', 'present'),
              'aktuell', 'current'),
            'entwickelt', 'developed'),
          'implementiert', 'implemented'),
        'verwaltet', 'managed'),
      'geleitet', 'led'),
    'erstellt', 'created'),
  'und', 'and');
END;
$$;

-- Function to translate entire CV JSON structure
CREATE OR REPLACE FUNCTION translate_cv_content_to_english(cv_content JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
  experience JSONB;
  education JSONB;
  project JSONB;
  experiences_en JSONB := '[]'::jsonb;
  education_en JSONB := '[]'::jsonb;
  projects_en JSONB := '[]'::jsonb;
BEGIN
  -- Start with original content
  result := cv_content;
  
  -- Translate personalInfo
  IF cv_content ? 'personalInfo' THEN
    result := jsonb_set(
      result,
      '{personalInfo,profession}',
      to_jsonb(translate_text_de_to_en(cv_content->'personalInfo'->>'profession'))
    );
    
    result := jsonb_set(
      result,
      '{personalInfo,bio}',
      to_jsonb(translate_text_de_to_en(cv_content->'personalInfo'->>'bio'))
    );
  END IF;
  
  -- Translate experiences
  IF cv_content ? 'experiences' THEN
    FOR experience IN SELECT * FROM jsonb_array_elements(cv_content->'experiences')
    LOOP
      experience := jsonb_set(
        experience, 
        '{company}', 
        to_jsonb(translate_text_de_to_en(experience->>'company'))
      );
      experience := jsonb_set(
        experience, 
        '{position}', 
        to_jsonb(translate_text_de_to_en(experience->>'position'))
      );
      experience := jsonb_set(
        experience, 
        '{description}', 
        to_jsonb(translate_text_de_to_en(experience->>'description'))
      );
      experiences_en := experiences_en || experience;
    END LOOP;
    result := jsonb_set(result, '{experiences}', experiences_en);
  END IF;
  
  -- Translate education
  IF cv_content ? 'education' THEN
    FOR education IN SELECT * FROM jsonb_array_elements(cv_content->'education')
    LOOP
      education := jsonb_set(
        education, 
        '{institution}', 
        to_jsonb(translate_text_de_to_en(education->>'institution'))
      );
      education := jsonb_set(
        education, 
        '{degree}', 
        to_jsonb(translate_text_de_to_en(education->>'degree'))
      );
      education := jsonb_set(
        education, 
        '{description}', 
        to_jsonb(translate_text_de_to_en(education->>'description'))
      );
      education_en := education_en || education;
    END LOOP;
    result := jsonb_set(result, '{education}', education_en);
  END IF;
  
  -- Translate projects (only descriptions, keep names and technologies)
  IF cv_content ? 'projects' THEN
    FOR project IN SELECT * FROM jsonb_array_elements(cv_content->'projects')
    LOOP
      project := jsonb_set(
        project, 
        '{description}', 
        to_jsonb(translate_text_de_to_en(project->>'description'))
      );
      projects_en := projects_en || project;
    END LOOP;
    result := jsonb_set(result, '{projects}', projects_en);
  END IF;
  
  -- Keep skills, languages, and certificates unchanged
  -- (These typically don't need translation or are already in international format)
  
  RETURN result;
END;
$$;

-- Update all German CV data records with English translations
UPDATE cv_data 
SET content_en = translate_cv_content_to_english(content)
WHERE language = 'de' AND content IS NOT NULL;

-- Also add English column to visibility_settings table
ALTER TABLE visibility_settings ADD COLUMN IF NOT EXISTS visibility_en JSONB;

-- Copy German visibility settings to English column
UPDATE visibility_settings 
SET visibility_en = visibility
WHERE language = 'de' AND visibility IS NOT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cv_data_content_en ON cv_data USING GIN (content_en);

-- Display results
SELECT 
  language,
  content->'personalInfo'->>'name' as name_de,
  content_en->'personalInfo'->>'name' as name_en,
  content->'personalInfo'->>'profession' as profession_de,
  content_en->'personalInfo'->>'profession' as profession_en
FROM cv_data 
WHERE language = 'de' AND content_en IS NOT NULL;

-- Clean up functions (uncomment if you want to remove them after use)
-- DROP FUNCTION IF EXISTS translate_text_de_to_en(TEXT);
-- DROP FUNCTION IF EXISTS translate_cv_content_to_english(JSONB);

RAISE NOTICE 'English translation column added and populated successfully!';
