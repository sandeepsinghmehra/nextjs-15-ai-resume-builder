
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
    firstName: z.string().trim().max(50, "Name must be at most 50 characters").optional().or(z.literal("")),
    lastName: optionalString,
    email: z.string().trim().max(100, "Email must be at most 100 characters").optional().or(z.literal("")),
    phone: z.string().trim().max(16, "Phone must be at most 16 characters").optional().or(z.literal("")),  
    city: z.string().trim().max(30, "City name must be at most 30 characters").optional().or(z.literal("")),
    jobTitle:  z.string().trim().max(30, "Job role must be at most 30 characters").optional().or(z.literal("")),
    country:  z.string().trim().max(20, "Country name must be at most 20 characters").optional().or(z.literal("")),
    linkedin: z.string().trim().url().optional().or(z.literal("")),
    github: z.string().trim().url().optional().or(z.literal("")),       
    website: z.string().trim().url().optional().or(z.literal("")),     
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
  
export const workExperienceSchema = z.object({
    workExperienceSectionName: optionalString,
    workExperiences: z.array(
        z.object({
            position: optionalString,
            company: optionalString,
            startDate: optionalString,
            endDate: optionalString,
            description: optionalString,
        })
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<z.infer<typeof workExperienceSchema>["workExperiences"]>[number];

export const educationSchema = z.object({
    educationSectionName: optionalString,
    educations: z.array(
        z.object({
            degree: optionalString,
            school: optionalString,
            startDate: optionalString,
            endDate: optionalString,
        })
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
    skillsSectionName: optionalString,
    skills: z.array(
        z.object({
            name: optionalString,
        })
    ).optional(),
})

export type SkillsValues = z.infer<typeof skillsSchema>;

export const languagesSchema = z.object({
    languagesSectionName: optionalString,
    languages: z.array(
        z.object({
            name: optionalString,
        })
    ).optional(),
})

export type languagesValues = z.infer<typeof languagesSchema>;

export const interestsSchema = z.object({
    interestsSectionName: optionalString,
    interests: z.array(
        z.object({
            name: optionalString,
        })
    ).optional(),
})

export type interestsValues = z.infer<typeof interestsSchema>;
  

export const summarySchema = z.object({
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