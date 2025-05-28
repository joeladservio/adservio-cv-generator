export interface Education {
  degree: string;
  school: string;
  startYear: number;
  endYear: number;
  description: string;
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
}

export interface Skill {
  name: string;
  level: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Certification {
  name: string;
  organization: string;
  dateObtained: string;
  expiryDate: string;
}

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  position: string;
  department: string;
  hireDate?: string;
  contractType?: string;
  salary?: number;
  level?: string;
  educationList?: Education[];
  experienceList?: Experience[];
  skillsList?: Skill[];
  languagesList?: Language[];
  certificationsList?: Certification[];
} 