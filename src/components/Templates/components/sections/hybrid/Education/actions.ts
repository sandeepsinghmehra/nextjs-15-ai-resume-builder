"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";



export const handleAddNewEducation = async (resumeId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
      
    const created = await prisma.education.create({
        data: {
            resumeId,
            degree: "", 
            school: "",
            startDate: "",
            endDate: "",
        },
    });
      
    return created;
};

export async function deleteSingleEducation(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const res = await prisma.education.delete({
        where: { id },
    });
    return res;
}
  