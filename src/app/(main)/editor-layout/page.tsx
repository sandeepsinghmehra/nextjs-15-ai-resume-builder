import { Metadata } from "next"
import ResumeEditor from "./ResumeEditor"
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import { createEmptyResume } from "./actions";

interface PageProps {
  searchParams: Promise<{resumeId?: string}>
}
export const metadata: Metadata = {
    title: "Design your resume",
}

export default async function Page({searchParams}: PageProps) {
  const {resumeId} = await searchParams;
  const {userId} = await auth();

  if(!userId){
    return null;
  }

  console.log("!resumeId", !resumeId);

  const resumeToEdit = !resumeId ? null :  await prisma.resume.findUnique({
    where: {
      id: resumeId, userId
    },
    include: resumeDataInclude 
  });
  
  return (
    <ResumeEditor 
      resumeToEdit={resumeToEdit}
    />
  )
}
