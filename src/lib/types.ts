import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface EditorFormProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}

export const resumeDataInclude = {
    workExperiences: true,
    educations: true,
    skills: true,
    interests: true,
    languages: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
    include: typeof resumeDataInclude
}>;


export type TimelineItemType = {
    id: number;
    title: string;
    description?: string;
    time: string;
};

export type WorkExperiences = {
    id: string;
    resumeId: string;
    description?: string | undefined;
    position?: string | undefined;
    company?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}
export type EducationType = {
    id: string;
    resumeId: string;
    school?: string | undefined;
    degree?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}
export type SkillType = {
    id: string;
    resumeId: string;
    name?: string | undefined;
}

export type InterestType = {
    id: string;
    resumeId: string;
    name?: string | undefined;
}
export type LanguageType = {
    id: string;
    resumeId: string;
    name?: string | undefined;
}