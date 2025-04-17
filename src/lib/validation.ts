
import {z} from 'zod';

export const optionalString = z.string().trim().optional().or(z.literal(""))
export const generalInfoSchema = z.object({
    title: optionalString,
    description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;


export const personalInfoSchema = z.object({
    photo: z.custom<File | undefined>()
    .refine(
        (file) => !file || (file instanceof File && file.type.startsWith("image/")),
        "Must be an image file"
    )
    .refine(
        (file) => !file || file.size <= 4 * 1024 * 1024, "File size must be less than 4MB",
    ),
    fontFamily: z.string().optional().default("Arial"),
    fontSize: z.string().optional().default("medium"),
    personalDetailName: optionalString,
    firstName: z.string().trim().max(50, "Name must be at most 50 characters").optional().or(z.literal("")),
    lastName: optionalString,
    email: z.string().trim().max(100, "Email must be at most 100 characters").optional().or(z.literal("")),
    phone: z.string().trim().max(16, "Phone must be at most 16 characters").optional().or(z.literal("")),  
    location: z.string().trim().max(60, "Location name must be at most 60 characters").optional().or(z.literal("")),
    jobTitle:  z.string().trim().max(30, "Job role must be at most 30 characters").optional().or(z.literal("")),
    linkedin: z.string().trim().url().optional().or(z.literal("")),
    github: z.string().trim().url().optional().or(z.literal("")),       
    website: z.string().trim().url().optional().or(z.literal("")), 
    isPhotoSection: z.boolean().optional().default(false),
    isSummarySection: z.boolean().optional().default(true),        
    isEmailSection: z.boolean().optional().default(true),         
    isLocationSection: z.boolean().optional().default(true),       
    isPhoneSection: z.boolean().optional().default(true),         
    isJobTitleSection: z.boolean().optional().default(true),       
    isLinkedinSection: z.boolean().optional().default(true),      
    isGithubSection: z.boolean().optional().default(true),        
    isSocialLinkSection: z.boolean().optional().default(true),  
    isWebsiteSection: z.boolean().optional().default(true),      
    isWorkSection: z.boolean().optional().default(true),         
    isEducationSection: z.boolean().optional().default(true),     
    isSkillSection: z.boolean().optional().default(true),         
    isLanguageSection: z.boolean().optional().default(false),      
    isInterestSection: z.boolean().optional().default(false),        
    isKeyachivementSection: z.boolean().optional().default(false),  
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
  
export const workExperienceSchema = z.object({
    workExperienceSectionName: optionalString,
    workExperiences: z.array(
        z.object({
            id: z.string().min(1, "Experience ID is required"),
            resumeId: z.string().min(1, "Resume ID is required"),
            position: optionalString,
            company: optionalString,
            startDate: optionalString,
            endDate: optionalString,
            description: optionalString,
        })
    )
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<z.infer<typeof workExperienceSchema>["workExperiences"]>[number];

export const educationSchema = z.object({
    educationSectionName: optionalString,
    educations: z.array(
        z.object({
            id: z.string().min(1, "Education ID is required"),
            resumeId: z.string().min(1, "Resume ID is required"),
            degree: optionalString,
            school: optionalString,
            startDate: optionalString,
            endDate: optionalString,
        })
    )
});

export type EducationValues = z.infer<typeof educationSchema>;

export type Education = NonNullable<z.infer<typeof educationSchema>["educations"]>[number] & { id?: string }; // Add optional id

export const skillsSchema = z.object({
    skillsSectionName: optionalString,
    skills: z.array(
        z.object({
            id: z.string().min(1, "Skill ID is required"),
            resumeId: z.string().min(1, "Resume ID is required"),
            name: optionalString,
        })
    )
})

export type SkillsValues = z.infer<typeof skillsSchema>;

export type Skill = NonNullable<z.infer<typeof skillsSchema>["skills"]>[number] & { id?: string }; // Add optional id

export const languagesSchema = z.object({
    languagesSectionName: optionalString,
    languages: z.array(
        z.object({
            id: z.string().min(1, "Language ID is required"),
            resumeId: z.string().min(1, "Resume ID is required"),
            name: optionalString,
        })
    )
})

export type LanguagesValues = z.infer<typeof languagesSchema>;

export type Language = NonNullable<z.infer<typeof languagesSchema>["languages"]>[number] & { id?: string }; // Add optional id

export const interestsSchema = z.object({
    interestsSectionName: optionalString,
    interests: z.array(
        z.object({
            id: z.string().min(1, "Hobby ID is required"),
            resumeId: z.string().min(1, "Resume ID is required"),
            name: optionalString,
        })
    )
})

export type InterestsValues = z.infer<typeof interestsSchema>;

export type Interest = NonNullable<z.infer<typeof interestsSchema>["interests"]>[number] & { id?: string }; // Add optional id
  

export const summarySchema = z.object({
    summaryName: optionalString,
    summary: optionalString,
})

export type SummaryValues = z.infer<typeof summarySchema>;

export const resumeSchema = z.object({
    ...generalInfoSchema.shape,
    ...personalInfoSchema.shape,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape,
    ...summarySchema.shape,
    ...languagesSchema.shape,
    ...interestsSchema.shape,
    colorHex: optionalString,
    borderStyle: optionalString, 
    layoutStyle: optionalString,
});

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
    id?: string;
    photo?: File | string | null;
}

export const generateWorkExperiencSchema = z.object({
    description: z.string().trim().min(1, "Required").min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<typeof generateWorkExperiencSchema>;

export const generateSummarySchema = z.object({
    jobTitle: optionalString,
    ...workExperienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;