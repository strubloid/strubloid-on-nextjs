/**
 * Strubloid Service Types
 * Types for Strubloid profile, skills, and experience data
 */

export interface SpokenLanguage {
    name: string;
    level: string;
}

export interface Profile {
    name: string;
    title: string;
    location: string;
    yearsOfExperience: number;
    summary: string;
    website: string;
    github: string;
    email: string;
    languages: SpokenLanguage[];
}

export interface SkillLink {
    text: string;
    url: string;
}

export interface SkillUsage {
    project?: string;
    company?: string;
    period: string;
    detail: string;
}

export interface Skill {
    id: string;
    icon: string;
    title: string;
    accent: string;
    description: string;
    description_short?: string;
    usages?: SkillUsage[];
    relatedSkills?: string[];
    link?: SkillLink;
}

export interface Experience {
    company: string;
    location: string;
    role: string;
    period: string;
    technologies: string[];
}

export interface Education {
    institution: string;
    location: string;
    degree: string;
    period: string;
    highlights: string[];
}

export interface ProgrammingLanguage {
    name: string;
    color: string;
}

export interface StrubloidData {
    profile: Profile;
    skills: Skill[];
    experience: Experience[];
    education: Education;
    concepts: string[];
    programmingLanguages: ProgrammingLanguage[];
    managedWebsites: string[];
}
