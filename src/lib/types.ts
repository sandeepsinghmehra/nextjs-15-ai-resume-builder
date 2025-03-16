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