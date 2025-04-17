"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";



export const handleAddNewExperience = async (resumeId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
      
    const created = await prisma.workExperience.create({
        data: {
            resumeId,
            position: "",
            company: "",
            startDate: "",
            endDate: "",
            description: "",
        },
    });
      
    return created;
};

export async function deleteSingleWorkExperience(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const res = await prisma.workExperience.delete({
        where: { id },
    });
    return res;
}
  