export interface TranslatableString {
  en: string;
  sl: string;
}

export interface ContentMeta {
  name: string;
  title: TranslatableString;
  email: string;
  phone: string;
}

export interface ExperienceEntry {
  company: string;
  role: TranslatableString;
  period: string;
  description: TranslatableString;
}

export interface SkillCategory {
  category: TranslatableString;
  items: string[];
}

export interface EducationEntry {
  institution: string;
  degree: TranslatableString;
  period: string;
}

export interface ProjectEntry {
  name: string;
  description: TranslatableString;
  url?: string;
  tech: string[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface CvContent {
  meta: ContentMeta;
  about: TranslatableString;
  experience: ExperienceEntry[];
  skills: SkillCategory[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  social: SocialLink[];
}
