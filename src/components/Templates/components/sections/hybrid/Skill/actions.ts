"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";



export const handleAddNewSkill = async (resumeId: string) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
      
    const created = await prisma.skill.create({
        data: {
            resumeId,
            name: "",
        },
    });
      
    return created;
};

export async function deleteSingleSkill(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const res = await prisma.skill.delete({
        where: { id },
    });
    return res;
}
  