import { Metadata } from "next"
import ResumeEditor from "./ResumeEditor"
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";

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
  // const [resumes] = await Promise.all([
  //   prisma.resume.findMany({
  //     where: {
  //       userId
  //     },
  //     orderBy: {
  //       updatedAt: "desc"
  //     }, 
  //     include: resumeDataInclude
  //   }),
  // ]);
  // console.log(" resumes[0].id", resumes[0].id)
  // const resumeId = resumes[0].id;
  // const resumeToEdit = resumeId ? await prisma.resume.findUnique({
  //   where: {
  //     id: resumeId, userId
  //   },
  //   include: resumeDataInclude 
  // }): null;
  // const resumeId = "cm7psve77000113rwbepd1v0z";
  const resumeToEdit = await prisma.resume.findUnique({
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
