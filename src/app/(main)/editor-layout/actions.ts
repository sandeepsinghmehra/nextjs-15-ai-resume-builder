"use server"

import { canCreateResume } from "@/lib/permissions"; // Removed unused canUseCustomizations
import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { EducationType, InterestType, LanguageType, resumeDataInclude, SkillType, WorkExperiences } from "@/lib/types";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

// export async function saveResume(values: ResumeValues){
//     const {id} = values;

//     // console.log("recieved values", values);

//     const {
//         photo, workExperiences, educations, skills, languages, interests,  ...resumeValues
//     } = resumeSchema.parse(values);
//     // console.log("workExperiences", workExperiences);
//     // console.log("educations", educations);
//     const { userId} = await auth();

//     if(!userId) {
//         throw new Error("User not authenticated");
//     }

//     //TODO: Check resume count for non-premium users->done
//     const subscriptionLevel = await getUserSubscriptionLevel(userId);

//     if(!id){
//         const resumeCount = await prisma.resume.count({where: {userId}});
//         if(!canCreateResume(subscriptionLevel, resumeCount)){
//             throw new Error("Maximum resume count reached for this subscription level");
//         }
//     }

//     // console.log("id", id);
//     const existingResume = id ? await prisma.resume.findUnique({where: {id, userId}}): null;
//     // console.log("existingResume", existingResume);
//     if(id && !existingResume) {
//         throw new Error('Resume not found');
//     }

//     // const hasCustomizations = (
//     //     resumeValues.borderStyle && resumeValues.borderStyle !== existingResume?.borderStyle
//     // ) || (
//     //     resumeValues.colorHex && resumeValues.colorHex !== existingResume?.colorHex
//     // );

//     // if(hasCustomizations && !canUseCustomizations(subscriptionLevel)){
//     //     throw new Error("Customization not allowed for this subscription level.")
//     // }
//     let newPhotoUrl: string|undefined|null = undefined;

//     if(photo instanceof File) {
//         if(existingResume?.photoUrl){
//             await del(existingResume.photoUrl);
//         }

//         const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
//             access: "public"
//         });

//         newPhotoUrl = blob.url;
//     } else if(photo === null) {
//         if(existingResume?.photoUrl){
//             await del(existingResume.photoUrl);
//         }
//         newPhotoUrl = null;
//     }

//     if(id){
//         const updateResume = await prisma.$transaction(async (tx) => {
//             // Update resume base data
//             await tx.resume.update({
//               where: { id },
//               data: {
//                 ...resumeValues,
//                 photoUrl: newPhotoUrl,
//                 updatedAt: new Date(),
//               },
//             });

//              // Step 3: Fetch the fully updated resume including related data
//             return tx.resume.findUnique({
//                 where: { id },
//                 include: resumeDataInclude
//             });
//           });
//         //   console.log("updateResume in action", updateResume);
//         return updateResume;  
//     }
// }

export async function saveResume(values: Partial<ResumeValues> & { id?: string }){ // Allow partial values
    const { id } = values;
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const subscriptionLevel = await getUserSubscriptionLevel(userId);

    // --- Create Logic ---
    if (!id) {
        // Check creation permissions
        const resumeCount = await prisma.resume.count({ where: { userId } });
        if (!canCreateResume(subscriptionLevel, resumeCount)) {
            throw new Error("Maximum resume count reached for this subscription level");
        }

        // For creation, we expect the full schema (or defaults)
        // This part is likely handled by a different flow/button, not autosave.
        // If autosave somehow triggers creation, it needs the full data.
        const validatedData = resumeSchema.parse(values);
        const { photo, workExperiences, educations, skills, languages, interests, ...resumeValues } = validatedData;

        let newPhotoUrl: string | undefined | null = undefined;
        if (photo instanceof File) {
            const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, { access: "public" });
            newPhotoUrl = blob.url;
        }

        // Create the resume (simplified, assumes create logic exists elsewhere if needed)
        // This function primarily focuses on updates now for autosave.
        // Consider throwing an error or returning if creation is attempted via autosave.
        console.warn("Attempted to create resume via saveResume, which is primarily for updates. Ensure this is intended.");
        // Example creation (adjust as needed based on actual create logic):
        const newResume = await prisma.resume.create({
            data: {
                ...resumeValues,
                userId,
                photoUrl: newPhotoUrl,
                // Add default relations if necessary
            },
            include: resumeDataInclude,
        });
        return newResume;
    }

    // --- Update Logic ---
    const existingResume = await prisma.resume.findUnique({ where: { id, userId } });
    if (!existingResume) {
        throw new Error('Resume not found');
    }

    // Validate only the provided fields for the update
    const partialSchema = resumeSchema.partial();
    const validationResult = partialSchema.safeParse(values);

    if (!validationResult.success) {
        console.error("Invalid data provided for resume update:", validationResult.error);
        throw new Error("Invalid data provided for update.");
    }

    // Use only the validated, provided data for the update
    const { photo, workExperiences, educations, skills, languages, interests, ...validatedUpdateData } = validationResult.data;

    let newPhotoUrl: string | undefined | null = existingResume.photoUrl; // Default to existing

    if (values.photo instanceof File) { // Check incoming values for photo changes
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }
        const blob = await put(`resume_photos/${path.extname(values.photo.name)}`, values.photo, { access: "public" });
        newPhotoUrl = blob.url;
    } else if (values.photo === null) { // Check incoming values for photo deletion
        if (existingResume?.photoUrl) {
            await del(existingResume.photoUrl);
        }
        newPhotoUrl = null;
    }

    // Perform the update using only validated fields
    const updatedResume = await prisma.resume.update({
        where: { id },
        data: {
            ...validatedUpdateData, // Use validated partial data
            photoUrl: newPhotoUrl, // Update photo URL if changed
            updatedAt: new Date(),
        },
        include: resumeDataInclude, // Include relations in the returned object
    });

    return updatedResume;
}

export async function saveExperiencResume(values: WorkExperiences){
    const {id, resumeId, ...data} = values;
    const { userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }

    if(id){
        const updateResume = await prisma.$transaction(async (tx) => {
            await tx.workExperience.update({
                where: { id: id, resumeId: resumeId },
                data,
            })

             // Step 2: Fetch the fully updated resume including related data
            return tx.resume.findUnique({
                where: { id: resumeId },
                include: resumeDataInclude
            });
          });
        //   console.log("updateResume in action", updateResume);
        return updateResume;  
    } 
}

export async function saveEducationResume(values: EducationType){
    const {id, resumeId, ...data} = values;
    const { userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }

    if(id){
        const updateResume = await prisma.$transaction(async (tx) => {
            await tx.education.update({
                where: { id: id, resumeId: resumeId },
                data,
            })

             // Step 2: Fetch the fully updated resume including related data
            return tx.resume.findUnique({
                where: { id: resumeId },
                include: resumeDataInclude
            });
          });
        //   console.log("updateResume in action", updateResume);
        return updateResume;  
    } 
}

export async function saveSkillResume(values: SkillType){
    const {id, resumeId, ...data} = values;
    const { userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }

    if(id){
        const updateResume = await prisma.$transaction(async (tx) => {
            await tx.skill.update({
                where: { id: id, resumeId: resumeId },
                data,
            })

             // Step 2: Fetch the fully updated resume including related data
            return tx.resume.findUnique({
                where: { id: resumeId },
                include: resumeDataInclude
            });
          });
        //   console.log("updateResume in action skill", updateResume);
        return updateResume;  
    } 
}

export async function saveInterestResume(values: InterestType){
    const {id, resumeId, ...data} = values;
    const { userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }

    if(id){
        const updateResume = await prisma.$transaction(async (tx) => {
            await tx.interest.update({
                where: { id: id, resumeId: resumeId },
                data,
            })

             // Step 2: Fetch the fully updated resume including related data
            return tx.resume.findUnique({
                where: { id: resumeId },
                include: resumeDataInclude
            });
          });
        //   console.log("updateResume in action skill", updateResume);
        return updateResume;  
    } 
}

export async function saveLanguageResume(values: LanguageType){
    const {id, resumeId, ...data} = values;
    const { userId} = await auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }

    if(id){
        const updateResume = await prisma.$transaction(async (tx) => {
            await tx.language.update({
                where: { id: id, resumeId: resumeId },
                data,
            })

             // Step 2: Fetch the fully updated resume including related data
            return tx.resume.findUnique({
                where: { id: resumeId },
                include: resumeDataInclude
            });
          });
        //   console.log("updateResume in action skill", updateResume);
        return updateResume;  
    } 
}

export async function createEmptyResume(userId:string) {

    const newResume = await prisma.resume.create({
        data: {
            userId,
            photoUrl: null,
            title: null,
            workExperiences: {
                create: {
                    position: '',
                    company: '',
                    description: '',
                    startDate: null,
                    endDate: null,
                },
            },
            educations: {
                create: {
                    degree: '',
                    school: '',
                    startDate: null,
                    endDate: null,
                },
            },
            skills: {
                create: {
                    name: "",
                }
            },
            interests: {
                create: {
                    name: "",
                }
            },
            languages: {
                create: {
                    name: "",
                }
            },
        },
        include: resumeDataInclude
    });

    // console.log("newResume", newResume);

    return newResume;
}
