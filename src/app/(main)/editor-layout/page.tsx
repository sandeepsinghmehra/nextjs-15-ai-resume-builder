import { Metadata } from "next"
import ResumeEditor from "./ResumeEditor"
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import { canCreateResume } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";

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

  // console.log("!resumeId", !resumeId);

  const resumeToEdit = !resumeId ? null :  await prisma.resume.findUnique({
    where: {
      id: resumeId, userId
    },
    include: resumeDataInclude 
  });
  const [totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.count({
      where: {
        userId
      }
    }),
    getUserSubscriptionLevel(userId)
  ]);
  
  return (
    <ResumeEditor 
      resumeToEdit={resumeToEdit}
      canDownload={canCreateResume(subscriptionLevel, totalCount)}
    />
  )
}
