"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";



export const handleAddNewLanguage = async (resumeId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
      
    const created = await prisma.language.create({
        data: {
            resumeId,
            name: "", 
        },
    });
      
    return created;
};

export async function deleteSingleLanguage(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const res = await prisma.language.delete({
        where: { id },
    });
    return res;
}
  