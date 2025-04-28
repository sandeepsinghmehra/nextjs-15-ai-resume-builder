"use server"

import prisma from "@/lib/prisma";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server"
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteResume(id:string) {
    const {userId} = await auth();

    if(!userId){
        throw new Error("User not authenticated");
    }

    const resume = await prisma.resume.findUnique({
        where: {
            id,
            userId
        }
    });

    if(!resume) {
        throw new Error("Resume not found");
    }
    if(resume.photoUrl){
        await del(resume.photoUrl);
    }
    await prisma.resume.delete({
        where: {
            id
        }
    });

    revalidatePath("/resumes");
}

export async function getUserResumes(userId: string) {
    const [resumes, totalCount, subscriptionLevel] = await Promise.all([
      prisma.resume.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        include: resumeDataInclude,
      }),
      prisma.resume.count({ where: { userId } }),
      getUserSubscriptionLevel(userId),
    ]);
  
    return { resumes, totalCount, subscriptionLevel };
  }