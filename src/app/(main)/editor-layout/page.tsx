import { Metadata } from "next"
import ResumeEditor from "./ResumeEditor"
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
import { canCreateResume } from "@/lib/permissions";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { Suspense } from "react";
import LoadingEditor from "./LoadingEditor";

interface PageProps {
  searchParams: Promise<{resumeId?: string}>
}
export const metadata: Metadata = {
    title: "Design your resume",
}

// export default async function Page({searchParams}: PageProps) {
//   const {resumeId} = await searchParams;
//   const {userId} = await auth();

//   if(!userId){
//     return null;
//   }

//   // console.log("!resumeId", !resumeId);

//   const resumeToEdit = !resumeId ? null :  await prisma.resume.findUnique({
//     where: {
//       id: resumeId, userId
//     },
//     include: resumeDataInclude 
//   });
//   const [totalCount, subscriptionLevel] = await Promise.all([
//     prisma.resume.count({
//       where: {
//         userId
//       }
//     }),
//     getUserSubscriptionLevel(userId)
//   ]);
  
//   return (
//     <ResumeEditor 
//       resumeToEdit={resumeToEdit}
//       canDownload={canCreateResume(subscriptionLevel, totalCount)}
//     />
//   )
// }

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen w-full p-4">
      <Suspense fallback={<LoadingEditor />}>
        <EditorContent userId={userId} resumeId={resumeId} />
      </Suspense>
    </div>
  );
}

// Actual heavy DB logic moved here
async function EditorContent({ userId, resumeId }: { userId: string, resumeId?: string }) {
  const resumeToEdit = !resumeId ? null : await prisma.resume.findUnique({
    where: { id: resumeId, userId },
    include: resumeDataInclude
  });

  const [totalCount, subscriptionLevel] = await Promise.all([
    prisma.resume.count({ where: { userId } }),
    getUserSubscriptionLevel(userId)
  ]);

  return (
    <ResumeEditor 
      resumeToEdit={resumeToEdit}
      canDownload={canCreateResume(subscriptionLevel, totalCount)}
    />
  )
}