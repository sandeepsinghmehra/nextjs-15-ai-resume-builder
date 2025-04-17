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
    isPhotoSection: data.isPhotoSection || false, 
    isSummarySection: data.isSummarySection || true,        
    isEmailSection: data.isEmailSection || true,          
    isLocationSection: data.isLocationSection || true,      
    isPhoneSection:  data.isPhoneSection || true,          
    isJobTitleSection: data.isJobTitleSection || true,      
    isLinkedinSection:  data.isLinkedinSection || true,       
    isGithubSection: data.isGithubSection || true,        
    isSocialLinkSection: data.isSocialLinkSection || true,  
    isWebsiteSection:  data.isWebsiteSection || true,      
    isWorkSection: data.isWorkSection || true,          
    isEducationSection: data.isEducationSection || true,     
    isSkillSection: data.isSkillSection || true,          
    isLanguageSection: data.isLanguageSection || false,      
    isInterestSection: data.isInterestSection || false,        
    isKeyachivementSection: data.isKeyachivementSection || false, 
    interests: data.interests.map(interest => ({
      id: interest.id,
      resumeId: interest.resumeId,
      name: interest.name || undefined,
    })),
    languages: data.languages.map(language => ({
      id: language.id,
      resumeId: language.resumeId,
      name: language.name || undefined,
    })),
    languagesSectionName: data.languagesSectionName || undefined,
    interestsSectionName: data.interestsSectionName || undefined,
    workExperiences: data.workExperiences.map(exp => ({
      id: exp.id,
      resumeId: exp.resumeId,
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate || undefined,
      endDate: exp.endDate || undefined,
      description: exp.description || undefined,
    })),
    educations: data.educations.map(edu => ({
      id: edu.id,
      resumeId: edu.resumeId,
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate || undefined,
      endDate: edu.endDate || undefined,
    })),
    skills: data.skills.map(skill => ({
      id: skill.id,
      resumeId: skill.resumeId,
      name: skill.name || undefined
    })),
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
    summaryName: data.summaryName || "About Me",
    layoutStyle: data.layoutStyle,
    personalDetailName: data.personalDetailName || "Personal Details",
    fontFamily: data.fontFamily || "Arial",
    fontSize: data.fontSize || "medium",
  }
}

export function getUnsavedExperiences(
  resumeData: any,
  lastSavedData: any
) {
  return resumeData.workExperiences.filter((currentExp:any) => {
    const savedExp = lastSavedData.workExperiences.find(
      (exp:any) => exp.id === currentExp.id
    );

    if (!savedExp) return true; // new entry not in last saved

    // Compare fields
    return (
      (currentExp.company?.trim() ?? "") !== (savedExp.company?.trim() ?? "") ||
      (currentExp.position?.trim() ?? "") !== (savedExp.position?.trim() ?? "") ||
      (currentExp.description?.trim() ?? "") !== (savedExp.description?.trim() ?? "") ||
      (currentExp.startDate?.trim() ?? "") !== (savedExp.startDate?.trim() ?? "") ||
      (currentExp.endDate?.trim() ?? "") !== (savedExp.endDate?.trim() ?? "")
    );
  });
}

export function getUnsavedEducations(
  resumeData: any,
  lastSavedData: any
) {
  return resumeData.educations.filter((currentEdu:any) => {
    const savedEdu = lastSavedData.educations.find(
      (edu:any) => edu.id === currentEdu.id
    );

    if (!savedEdu) return true; // new entry not in last saved

    // Compare fields
    return (
      (currentEdu.degree?.trim() ?? "") !== (savedEdu.degree?.trim() ?? "") ||
      (currentEdu.school?.trim() ?? "") !== (savedEdu.school?.trim() ?? "") ||
      (currentEdu.startDate?.trim() ?? "") !== (savedEdu.startDate?.trim() ?? "") ||
      (currentEdu.endDate?.trim() ?? "") !== (savedEdu.endDate?.trim() ?? "")
    );
  });
}

export function getUnsavedSkills(
  resumeData: any,
  lastSavedData: any
) {
  return resumeData.skills.filter((currentSkill:any) => {
    const savedSkill = lastSavedData.skills.find(
      (skill:any) => skill.id === currentSkill.id
    );

    if (!savedSkill) return true; // new entry not in last saved

    // Compare fields
    return (
      (currentSkill.name?.trim() ?? "") !== (savedSkill.name?.trim() ?? "")
    );
  });
}

export function getUnsavedLanguage(
  resumeData: any,
  lastSavedData: any
) {
  return resumeData.languages.filter((currentLanguage:any) => {
    const savedLanguage = lastSavedData.languages.find(
      (language:any) => language.id === currentLanguage.id
    );

    if (!savedLanguage) return true; // new entry not in last saved

    // Compare fields
    return (
      (currentLanguage.name?.trim() ?? "") !== (savedLanguage.name?.trim() ?? "")
    );
  });
}

export function getUnsavedHobby(
  resumeData: any,
  lastSavedData: any
) {
  return resumeData.interests.filter((currentInterest:any) => {
    const savedInterest = lastSavedData.interests.find(
      (interest:any) => interest.id === currentInterest.id
    );

    if (!savedInterest) return true; // new entry not in last saved

    // Compare fields
    return (
      (currentInterest.name?.trim() ?? "") !== (savedInterest.name?.trim() ?? "")
    );
  });
}