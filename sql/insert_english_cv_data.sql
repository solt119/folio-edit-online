
-- Insert pre-translated English CV data into content_en column
-- This script contains manually translated English content

-- First, ensure the content_en column exists
ALTER TABLE cv_data ADD COLUMN IF NOT EXISTS content_en JSONB;

-- Update the cv_data table with pre-translated English content
UPDATE cv_data 
SET content_en = '{
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
}'::jsonb
WHERE language = 'de';

-- Verify the update
SELECT 
  language,
  content->'personalInfo'->>'name' as name_de,
  content_en->'personalInfo'->>'name' as name_en,
  content->'personalInfo'->>'profession' as profession_de,
  content_en->'personalInfo'->>'profession' as profession_en,
  content->'personalInfo'->>'bio' as bio_de,
  content_en->'personalInfo'->>'bio' as bio_en
FROM cv_data 
WHERE language = 'de';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cv_data_content_en ON cv_data USING GIN (content_en);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'English CV data has been successfully inserted into content_en column!';
END $$;
