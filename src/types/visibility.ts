
export interface FieldVisibility {
  personalInfo: {
    name: boolean;
    profession: boolean;
    location: boolean;
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    github: boolean;
    bio: boolean;
  };
  sections: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    languages: boolean;
    projects: boolean;
    certificates: boolean;
  };
}

export const defaultVisibility: FieldVisibility = {
  personalInfo: {
    name: true,
    profession: true,
    location: true,
    email: true,
    phone: true,
    linkedin: true,
    github: true,
    bio: true,
  },
  sections: {
    experience: true,
    education: true,
    skills: true,
    languages: true,
    projects: true,
    certificates: true,
  },
};
