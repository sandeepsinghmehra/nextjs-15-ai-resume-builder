import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ResumeServerData } from "./types";
import { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File ?
  {
    // ...value,
    name: value.name,
    size: value.size,
    type: value.type,
    lastModified: value.lastModified,
  }
  : value;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    location: data.location || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperienceSectionName: data.workExperienceSectionName || undefined,
    educationSectionName: data.educationSectionName || undefined,
    skillsSectionName: data.skillsSectionName || undefined,
    linkedin: data.linkedin || undefined,
    github: data.github || undefined,
    website: data.website || undefined,
    // interests: data.interests,
    // languages: data.languages,
    languagesSectionName: data.languagesSectionName || undefined,
    interestsSectionName: data.interestsSectionName || undefined,
    workExperiences: data.workExperiences.map(exp => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate || undefined,
      endDate: exp.endDate || undefined,
      description: exp.description || undefined,
    })),
    educations: data.educations.map(edu => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate || undefined,
      endDate: edu.endDate || undefined,
    })),
    skills: data.skills.map(skill => ({
      name: skill.name || undefined
    })),
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
    layoutStyle: data.layoutStyle,
  }
}