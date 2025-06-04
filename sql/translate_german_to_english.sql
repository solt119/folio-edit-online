
-- SQL Script to translate German CV data to English
-- This script copies German data, translates key fields, and inserts as English data

-- Function to translate common German terms to English
CREATE OR REPLACE FUNCTION translate_german_text(german_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF german_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Replace common German job titles and terms
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
  'Ausbildung', 'Education');
END;
$$;

-- Function to translate JSON content
CREATE OR REPLACE FUNCTION translate_cv_json(cv_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  translated_data JSONB;
  experience JSONB;
  education JSONB;
  project JSONB;
  experiences JSONB := '[]'::jsonb;
  educations JSONB := '[]'::jsonb;
  projects JSONB := '[]'::jsonb;
BEGIN
  -- Start with the original data
  translated_data := cv_data;
  
  -- Translate personal info
  IF cv_data ? 'personalInfo' THEN
    translated_data := jsonb_set(
      translated_data,
      '{personalInfo,profession}',
      to_jsonb(translate_german_text(cv_data->'personalInfo'->>'profession'))
    );
    
    translated_data := jsonb_set(
      translated_data,
      '{personalInfo,bio}',
      to_jsonb(translate_german_text(cv_data->'personalInfo'->>'bio'))
    );
  END IF;
  
  -- Translate experiences
  IF cv_data ? 'experiences' THEN
    FOR experience IN SELECT * FROM jsonb_array_elements(cv_data->'experiences')
    LOOP
      experience := jsonb_set(experience, '{company}', to_jsonb(translate_german_text(experience->>'company')));
      experience := jsonb_set(experience, '{position}', to_jsonb(translate_german_text(experience->>'position')));
      experience := jsonb_set(experience, '{description}', to_jsonb(translate_german_text(experience->>'description')));
      experiences := experiences || experience;
    END LOOP;
    translated_data := jsonb_set(translated_data, '{experiences}', experiences);
  END IF;
  
  -- Translate education
  IF cv_data ? 'education' THEN
    FOR education IN SELECT * FROM jsonb_array_elements(cv_data->'education')
    LOOP
      education := jsonb_set(education, '{institution}', to_jsonb(translate_german_text(education->>'institution')));
      education := jsonb_set(education, '{degree}', to_jsonb(translate_german_text(education->>'degree')));
      education := jsonb_set(education, '{description}', to_jsonb(translate_german_text(education->>'description')));
      educations := educations || education;
    END LOOP;
    translated_data := jsonb_set(translated_data, '{education}', educations);
  END IF;
  
  -- Translate projects (only descriptions, keep names and technologies unchanged)
  IF cv_data ? 'projects' THEN
    FOR project IN SELECT * FROM jsonb_array_elements(cv_data->'projects')
    LOOP
      project := jsonb_set(project, '{description}', to_jsonb(translate_german_text(project->>'description')));
      projects := projects || project;
    END LOOP;
    translated_data := jsonb_set(translated_data, '{projects}', projects);
  END IF;
  
  -- Keep skills, languages, and certificates unchanged
  
  RETURN translated_data;
END;
$$;

-- Main translation script
DO $$
DECLARE
  german_record RECORD;
  translated_content JSONB;
BEGIN
  -- Get German CV data
  FOR german_record IN 
    SELECT * FROM cv_data WHERE language = 'de'
  LOOP
    -- Translate the content
    translated_content := translate_cv_json(german_record.content);
    
    -- Insert or update English version
    INSERT INTO cv_data (language, content, updated_at)
    VALUES ('en', translated_content, NOW())
    ON CONFLICT (language) 
    DO UPDATE SET 
      content = EXCLUDED.content,
      updated_at = EXCLUDED.updated_at;
      
    RAISE NOTICE 'German CV data translated and saved as English version';
  END LOOP;
  
  -- Also copy visibility settings if they exist
  INSERT INTO visibility_settings (language, visibility)
  SELECT 'en', visibility 
  FROM visibility_settings 
  WHERE language = 'de'
  ON CONFLICT (language) 
  DO UPDATE SET visibility = EXCLUDED.visibility;
  
  RAISE NOTICE 'Translation completed successfully';
END;
$$;

-- Clean up functions (optional - remove if you want to keep them for future use)
-- DROP FUNCTION IF EXISTS translate_german_text(TEXT);
-- DROP FUNCTION IF EXISTS translate_cv_json(JSONB);
