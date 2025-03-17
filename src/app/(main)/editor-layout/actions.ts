"use server"

import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import {del, put} from "@vercel/blob";
import path from "path";

export async function saveResume(values: ResumeValues){
    const {id} = values;

    console.log("recieved values", values);

    const {
        photo, workExperiences, educations, skills, languages, interests,  ...resumeValues
    } = resumeSchema.parse(values);

    const { userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }

    //TODO: Check resume count for non-premium users->done
    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    if(!id){
        const resumeCount = await prisma.resume.count({where: {userId}});
        if(!canCreateResume(subscriptionLevel, resumeCount)){
            throw new Error("Maximum resume count reached for this subscription level");
        }
    }


    const existingResume = id ? await prisma.resume.findUnique({where: {id, userId}}): null;

    if(id && !existingResume) {
        throw new Error('Resume not found');
    }

    // const hasCustomizations = (
    //     resumeValues.borderStyle && resumeValues.borderStyle !== existingResume?.borderStyle
    // ) || (
    //     resumeValues.colorHex && resumeValues.colorHex !== existingResume?.colorHex
    // );

    // if(hasCustomizations && !canUseCustomizations(subscriptionLevel)){
    //     throw new Error("Customization not allowed for this subscription level.")
    // }
    let newPhotoUrl: string|undefined|null = undefined;

    if(photo instanceof File) {
        if(existingResume?.photoUrl){
            await del(existingResume.photoUrl);
        }

        const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
            access: "public"
        });

        newPhotoUrl = blob.url;
    } else if(photo === null) {
        if(existingResume?.photoUrl){
            await del(existingResume.photoUrl);
        }
        newPhotoUrl = null;
    }

    if(id){
        return prisma.resume.update({
            where: {id},
            data: {
                ...resumeValues,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    deleteMany: {},
                    create: workExperiences?.map(exp => ({
                        ...exp,
                        startDate: exp.startDate ? exp.startDate: undefined,
                        endDate: exp.endDate ? exp.endDate: undefined,
                    }))
                },
                educations: {
                    deleteMany: {},
                    create: educations?.map(edu => ({
                        ...edu,
                        startDate: edu.startDate ? edu.startDate: undefined,
                        endDate: edu.endDate ? edu.endDate: undefined,
                    }))
                }, 
                skills: {
                    deleteMany: {},
                    create: skills?.map(skill => ({
                        ...skill,
                        name: skill.name ? skill.name : undefined,
                    }))
                },
                interests: {
                    deleteMany: {},
                    create: interests?.map(interest => ({
                        ...interest,
                        name: interest.name ? interest.name : undefined,
                    }))
                },
                languages: {
                    deleteMany: {},
                    create: languages?.map(language => ({
                        ...language,
                        name: language?.name ? language.name : undefined,
                    }))
                },
                updatedAt: new Date(),
            }
        })
    } else {
        return prisma.resume.create({
            data: {
                ...resumeValues,
                userId,
                photoUrl: newPhotoUrl,
                workExperiences: {
                    create: workExperiences?.map(exp => ({
                        ...exp,
                        startDate: exp.startDate ? exp.startDate: undefined,
                        endDate: exp.endDate ? exp.endDate: undefined,
                    }))
                },
                educations: {
                    create: educations?.map(edu => ({
                        ...edu,
                        startDate: edu.startDate ? edu.startDate: undefined,
                        endDate: edu.endDate ? edu.endDate: undefined,
                    }))
                },
                skills: {
                    create: skills?.map(skill => ({
                        ...skill,
                        name: skill.name ? skill.name : undefined,
                    }))
                },
                interests: {
                    create: interests?.map(interest => ({
                        ...interest,
                        name: interest.name ? interest.name : undefined,
                    }))
                },
                languages: {
                    create: languages?.map(language => ({
                        ...language,
                        name: language?.name ? language.name : undefined,
                    }))
                },
            }
        })
    }
}