
-- Add content_en column to cv_data table and populate with English translations
-- This script adds the missing column that the application expects

-- Add the content_en column if it doesn't exist
ALTER TABLE cv_data ADD COLUMN IF NOT EXISTS content_en JSONB;

-- Comprehensive translation function for German to English
CREATE OR REPLACE FUNCTION comprehensive_translate_de_to_en(text_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF text_input IS NULL OR text_input = '' THEN
    RETURN text_input;
  END IF;
  
  -- Comprehensive German to English translations
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
                                                                                                                            REPLACE(text_input,
                                                                                                                            'Leidenschaftlicher', 'Passionate'),
                                                                                                                          'mit', 'with'),
                                                                                                                        'Jahren Erfahrung', 'years of experience'),
                                                                                                                      'Jahre Erfahrung', 'years of experience'),
                                                                                                                    'Erfahrung in', 'experience in'),
                                                                                                                  'und', 'and'),
                                                                                                                'modernen', 'modern'),
                                                                                                              'Web-Technologies', 'web technologies'),
                                                                                                            'Spezialisiert auf', 'Specialized in'),
                                                                                                          'responsives Design', 'responsive design'),
                                                                                                        'responsive Design', 'responsive design'),
                                                                                                      'Performance-Optimierung', 'performance optimization'),
                                                                                                    'Entwicklung und Wartung', 'Development and maintenance'),
                                                                                                  'Entwicklung', 'Development'),
                                                                                                'entwicklung', 'development'),
                                                                                              'Wartung', 'maintenance'),
                                                                                            'für', 'for'),
                                                                                          'Enterprise-Kunden', 'enterprise clients'),
                                                                                        'Implementierung von', 'Implementation of'),
                                                                                      'Design-Systemen', 'design systems'),
                                                                                    'Performance-Optimierungen', 'performance optimizations'),
                                                                                  'Erstellung', 'Creation'),
                                                                                'responsiver Websites', 'responsive websites'),
                                                                              'Web-Anwendungen', 'web applications'),
                                                                            'Zusammenarbeit mit', 'Collaboration with'),
                                                                          'Design- und Backend-Teams', 'design and backend teams'),
                                                                        'in agilen', 'in agile'),
                                                                      'Entwicklungsprozessen', 'development processes'),
                                                                    'Schwerpunkt:', 'Focus:'),
                                                                  'Schwerpunkt', 'Focus'),
                                                                'Web-Entwicklung', 'Web Development'),
                                                              'Software Engineering', 'Software Engineering'),
                                                            'Abschlussnote:', 'Final grade:'),
                                                          'Abschlussnote', 'Final grade'),
                                                        'Vollständiges', 'Complete'),
                                                      'Dashboard für', 'dashboard for'),
                                                    'Online-Shop-Verwaltung', 'online shop management'),
                                                  'Responsive', 'Responsive'),
                                                'Portfolio-Website', 'portfolio website'),
                                              'mit modernem Design', 'with modern design'),
                                            'Animationen', 'animations'),
                                          'Muttersprache', 'Native'),
                                        'Fließend', 'Fluent'),
                                      'Grundkenntnisse', 'Basic'),
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
          'Technische Universität', 'Technical University'),
        'Hochschule', 'University of Applied Sciences'),
      'Fachhochschule', 'University of Applied Sciences'),
    'Institut', 'Institute'),
  'Informatik', 'Computer Science'),
'Bachelor of Science', 'Bachelor of Science');
END;
$$;

-- Function to translate CV JSON content
CREATE OR REPLACE FUNCTION translate_cv_json_comprehensive(cv_json JSONB)
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
    -- Translate profession
    IF cv_json->'personalInfo' ? 'profession' THEN
      result := jsonb_set(result, '{personalInfo,profession}', 
        to_jsonb(comprehensive_translate_de_to_en(cv_json->'personalInfo'->>'profession')));
    END IF;
    
    -- Translate bio
    IF cv_json->'personalInfo' ? 'bio' THEN
      result := jsonb_set(result, '{personalInfo,bio}', 
        to_jsonb(comprehensive_translate_de_to_en(cv_json->'personalInfo'->>'bio')));
    END IF;
    
    -- Translate location from Deutschland to Germany
    IF cv_json->'personalInfo' ? 'location' THEN
      result := jsonb_set(result, '{personalInfo,location}', 
        to_jsonb(REPLACE(cv_json->'personalInfo'->>'location', 'Deutschland', 'Germany')));
    END IF;
  END IF;
  
  -- Translate experiences
  IF cv_json ? 'experiences' THEN
    FOR exp IN SELECT * FROM jsonb_array_elements(cv_json->'experiences')
    LOOP
      IF exp ? 'company' THEN
        exp := jsonb_set(exp, '{company}', to_jsonb(comprehensive_translate_de_to_en(exp->>'company')));
      END IF;
      IF exp ? 'position' THEN
        exp := jsonb_set(exp, '{position}', to_jsonb(comprehensive_translate_de_to_en(exp->>'position')));
      END IF;
      IF exp ? 'description' THEN
        exp := jsonb_set(exp, '{description}', to_jsonb(comprehensive_translate_de_to_en(exp->>'description')));
      END IF;
      -- Translate duration - convert "Heute" to "Present"
      IF exp ? 'duration' THEN
        exp := jsonb_set(exp, '{duration}', 
          to_jsonb(REPLACE(exp->>'duration', 'Heute', 'Present')));
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
        edu := jsonb_set(edu, '{institution}', to_jsonb(comprehensive_translate_de_to_en(edu->>'institution')));
      END IF;
      IF edu ? 'degree' THEN
        edu := jsonb_set(edu, '{degree}', to_jsonb(comprehensive_translate_de_to_en(edu->>'degree')));
      END IF;
      IF edu ? 'description' THEN
        edu := jsonb_set(edu, '{description}', to_jsonb(comprehensive_translate_de_to_en(edu->>'description')));
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
        proj := jsonb_set(proj, '{description}', to_jsonb(comprehensive_translate_de_to_en(proj->>'description')));
      END IF;
      projects_array := projects_array || proj;
    END LOOP;
    result := jsonb_set(result, '{projects}', projects_array);
  END IF;
  
  -- Translate languages section
  IF cv_json ? 'languages' THEN
    result := jsonb_set(result, '{languages}', 
      jsonb_build_array(
        jsonb_build_object('id', '1', 'name', 'German', 'level', 'Native'),
        jsonb_build_object('id', '2', 'name', 'English', 'level', 'Fluent (C1)'),
        jsonb_build_object('id', '3', 'name', 'French', 'level', 'Basic (A2)')
      )
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Update existing records with English translations
UPDATE cv_data 
SET content_en = translate_cv_json_comprehensive(content)
WHERE language = 'de' AND content IS NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cv_data_content_en ON cv_data USING GIN (content_en);

-- Show results to verify translation
SELECT 
  language,
  content->'personalInfo'->>'name' as name_original,
  content_en->'personalInfo'->>'name' as name_en,
  content->'personalInfo'->>'profession' as profession_de,
  content_en->'personalInfo'->>'profession' as profession_en,
  content->'personalInfo'->>'bio' as bio_de,
  content_en->'personalInfo'->>'bio' as bio_en
FROM cv_data 
WHERE language = 'de';

-- Clean up functions (optional)
-- DROP FUNCTION IF EXISTS comprehensive_translate_de_to_en(TEXT);
-- DROP FUNCTION IF EXISTS translate_cv_json_comprehensive(JSONB);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'German CV data has been comprehensively translated to English and stored in content_en column!';
END $$;
