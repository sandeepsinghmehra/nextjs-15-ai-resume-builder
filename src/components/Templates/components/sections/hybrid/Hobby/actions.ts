"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";



export const handleAddNewHobby = async (resumeId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
      
    const created = await prisma.interest.create({
        data: {
            resumeId,
            name: "", 
        },
    });
      
    return created;
};

export async function deleteSingleHobby(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const res = await prisma.interest.delete({
        where: { id },
    });
    return res;
}
  