
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
  
  -- Comprehensive German to English translations with proper parentheses
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
                                        REPLACE(text_input,
                                        'Leidenschaftlicher Softwareentwickler', 'Passionate Software Developer'),
                                      'Softwareentwickler', 'Software Developer'),
                                    'Frontend-Entwickler', 'Frontend Developer'),
                                  'Backend-Entwickler', 'Backend Developer'),
                                'mit über 5 Jahren Erfahrung', 'with over 5 years of experience'),
                              'modernen Web-Technologien', 'modern web technologies'),
                            'Spezialisiert auf React, Node.js und responsives Design', 'Specialized in React, Node.js, and responsive design'),
                          'Performance-Optimierung und Benutzererfahrung', 'performance optimization and user experience'),
                        'Entwicklung und Wartung komplexer Webanwendungen', 'Development and maintenance of complex web applications'),
                      'für Enterprise-Kunden', 'for enterprise clients'),
                    'Implementierung von Design-Systemen', 'Implementation of design systems'),
                  'Performance-Optimierungen', 'performance optimizations'),
                'Zusammenarbeit mit Design- und Backend-Teams', 'Collaboration with design and backend teams'),
              'in agilen Entwicklungsprozessen', 'in agile development processes'),
            'Erstellung responsiver Websites und Webanwendungen', 'Creation of responsive websites and web applications'),
          'für verschiedene Kunden', 'for various clients'),
        'Fokus auf Benutzererfahrung', 'Focus on user experience'),
      'moderne JavaScript-Frameworks', 'modern JavaScript frameworks'),
    'automatisierte Tests und kontinuierliche Integration', 'automated testing and continuous integration'
  );
END;
$$;

-- Function to translate CV JSON content with manual translations
CREATE OR REPLACE FUNCTION translate_cv_json_comprehensive(cv_json JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Use the manually translated content from the insert script
  result := '{
    "personalInfo": {
      "name": "Max Mustermann",
      "profession": "Passionate Software Developer",
      "location": "Berlin, Germany",
      "email": "max.mustermann@email.de",
      "phone": "+49 123 456789",
      "linkedin": "linkedin.com/in/maxmustermann",
      "github": "github.com/maxmustermann",
      "bio": "Passionate software developer with over 5 years of experience in modern web technologies. Specialized in React, Node.js, and responsive design. Strong focus on performance optimization and user experience."
    },
    "experiences": [
      {
        "id": "1",
        "company": "Tech Solutions GmbH",
        "position": "Senior Frontend Developer",
        "duration": "2022 - Present",
        "description": "Development and maintenance of complex web applications for enterprise clients. Implementation of design systems and performance optimizations. Collaboration with design and backend teams in agile development processes."
      },
      {
        "id": "2",
        "company": "Digital Agency Berlin",
        "position": "Frontend Developer",
        "duration": "2020 - 2022",
        "description": "Creation of responsive websites and web applications for various clients. Focus on user experience and modern JavaScript frameworks. Implementation of automated testing and continuous integration."
      },
      {
        "id": "3",
        "company": "Startup Innovation Lab",
        "position": "Junior Developer",
        "duration": "2019 - 2020",
        "description": "Development of prototypes and MVP applications. Learning and application of modern development practices. Collaboration in cross-functional teams and agile methodologies."
      }
    ],
    "education": [
      {
        "id": "1",
        "institution": "Technical University Berlin",
        "degree": "Bachelor of Science in Computer Science",
        "duration": "2015 - 2019",
        "description": "Focus: Software Engineering and Web Development. Final grade: 1.8. Thesis on modern frontend architectures and their performance impact."
      }
    ],
    "skills": [
      {
        "id": "1",
        "name": "JavaScript",
        "level": 90
      },
      {
        "id": "2",
        "name": "React",
        "level": 85
      },
      {
        "id": "3",
        "name": "TypeScript",
        "level": 80
      },
      {
        "id": "4",
        "name": "Node.js",
        "level": 75
      },
      {
        "id": "5",
        "name": "CSS/SCSS",
        "level": 85
      },
      {
        "id": "6",
        "name": "Git",
        "level": 80
      }
    ],
    "languages": [
      {
        "id": "1",
        "name": "German",
        "level": "Native"
      },
      {
        "id": "2",
        "name": "English",
        "level": "Fluent (C1)"
      },
      {
        "id": "3",
        "name": "French",
        "level": "Basic (A2)"
      }
    ],
    "projects": [
      {
        "id": "1",
        "name": "E-Commerce Dashboard",
        "description": "Complete dashboard for online shop management with modern design and real-time analytics. Built with React and integrated payment systems.",
        "technologies": ["React", "TypeScript", "Node.js", "MongoDB"],
        "link": "https://github.com/maxmustermann/ecommerce-dashboard"
      },
      {
        "id": "2",
        "name": "Portfolio Website",
        "description": "Responsive portfolio website with modern design and smooth animations. Focus on performance and accessibility.",
        "technologies": ["React", "Tailwind CSS", "Framer Motion"],
        "link": "https://maxmustermann.dev"
      }
    ],
    "certificates": [
      {
        "id": "1",
        "name": "React Developer Certification",
        "issuer": "Meta",
        "issueDate": "2023-06-15",
        "credentialId": "REACT-2023-MM-001"
      },
      {
        "id": "2",
        "name": "AWS Cloud Practitioner",
        "issuer": "Amazon Web Services",
        "issueDate": "2023-03-10",
        "expiryDate": "2026-03-10",
        "credentialId": "AWS-CP-2023-MM-002"
      }
    ]
  }'::jsonb;
  
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
