
-- Add content_en column to cv_data table and populate with English translations
-- This script adds the missing column that the application expects

-- Add the content_en column if it doesn't exist
ALTER TABLE cv_data ADD COLUMN IF NOT EXISTS content_en JSONB;

-- Simple translation function for common German terms
CREATE OR REPLACE FUNCTION simple_translate_de_to_en(text_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF text_input IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Basic German to English translations
  RETURN REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  REPLACE(
                    REPLACE(text_input,
                    'Softwareentwickler', 'Software Developer'),
                  'Frontend-Entwickler', 'Frontend Developer'),
                'Backend-Entwickler', 'Backend Developer'),
              'Projektmanager', 'Project Manager'),
            'Teamleiter', 'Team Lead'),
          'Universität', 'University'),
        'Informatik', 'Computer Science'),
      'Jahre Erfahrung', 'years of experience'),
    'verantwortlich für', 'responsible for'),
  'entwickelt', 'developed');
END;
$$;

-- Function to translate CV JSON content
CREATE OR REPLACE FUNCTION translate_cv_json_simple(cv_json JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
  exp JSONB;
  edu JSONB;
  proj JSONB;
  experiences_array JSONB := '[]'::jsonb;
  education_array JSONB := '[]'::jsonb;
  projects_array JSONB := '[]'::jsonb;
BEGIN
  result := cv_json;
  
  -- Translate personalInfo
  IF cv_json ? 'personalInfo' THEN
    IF cv_json->'personalInfo' ? 'profession' THEN
      result := jsonb_set(result, '{personalInfo,profession}', 
        to_jsonb(simple_translate_de_to_en(cv_json->'personalInfo'->>'profession')));
    END IF;
    
    IF cv_json->'personalInfo' ? 'bio' THEN
      result := jsonb_set(result, '{personalInfo,bio}', 
        to_jsonb(simple_translate_de_to_en(cv_json->'personalInfo'->>'bio')));
    END IF;
  END IF;
  
  -- Translate experiences
  IF cv_json ? 'experiences' THEN
    FOR exp IN SELECT * FROM jsonb_array_elements(cv_json->'experiences')
    LOOP
      IF exp ? 'company' THEN
        exp := jsonb_set(exp, '{company}', to_jsonb(simple_translate_de_to_en(exp->>'company')));
      END IF;
      IF exp ? 'position' THEN
        exp := jsonb_set(exp, '{position}', to_jsonb(simple_translate_de_to_en(exp->>'position')));
      END IF;
      IF exp ? 'description' THEN
        exp := jsonb_set(exp, '{description}', to_jsonb(simple_translate_de_to_en(exp->>'description')));
      END IF;
      experiences_array := experiences_array || exp;
    END LOOP;
    result := jsonb_set(result, '{experiences}', experiences_array);
  END IF;
  
  -- Translate education
  IF cv_json ? 'education' THEN
    FOR edu IN SELECT * FROM jsonb_array_elements(cv_json->'education')
    LOOP
      IF edu ? 'institution' THEN
        edu := jsonb_set(edu, '{institution}', to_jsonb(simple_translate_de_to_en(edu->>'institution')));
      END IF;
      IF edu ? 'degree' THEN
        edu := jsonb_set(edu, '{degree}', to_jsonb(simple_translate_de_to_en(edu->>'degree')));
      END IF;
      IF edu ? 'description' THEN
        edu := jsonb_set(edu, '{description}', to_jsonb(simple_translate_de_to_en(edu->>'description')));
      END IF;
      education_array := education_array || edu;
    END LOOP;
    result := jsonb_set(result, '{education}', education_array);
  END IF;
  
  -- Translate projects
  IF cv_json ? 'projects' THEN
    FOR proj IN SELECT * FROM jsonb_array_elements(cv_json->'projects')
    LOOP
      IF proj ? 'description' THEN
        proj := jsonb_set(proj, '{description}', to_jsonb(simple_translate_de_to_en(proj->>'description')));
      END IF;
      projects_array := projects_array || proj;
    END LOOP;
    result := jsonb_set(result, '{projects}', projects_array);
  END IF;
  
  RETURN result;
END;
$$;

-- Update existing records with English translations
UPDATE cv_data 
SET content_en = translate_cv_json_simple(content)
WHERE language = 'de' AND content IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cv_data_content_en ON cv_data USING GIN (content_en);

-- Show results
SELECT 
  language,
  content->'personalInfo'->>'name' as name_de,
  content_en->'personalInfo'->>'name' as name_en,
  content->'personalInfo'->>'profession' as profession_de,
  content_en->'personalInfo'->>'profession' as profession_en
FROM cv_data 
WHERE language = 'de';

-- Clean up functions (optional)
-- DROP FUNCTION IF EXISTS simple_translate_de_to_en(TEXT);
-- DROP FUNCTION IF EXISTS translate_cv_json_simple(JSONB);

