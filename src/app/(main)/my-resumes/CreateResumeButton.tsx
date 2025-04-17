"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEmptyResume } from "../editor-layout/actions";


interface CreateResumeButtonProps {
    canCreate: boolean;
    userId: string;
}
export default function CreateResumeButton({canCreate, userId}: CreateResumeButtonProps){

    const premiumModal = usePremiumModal();
    const router = useRouter();

    const handleCreate = async () => {
        try {
          const newResume = await createEmptyResume(userId); // must return { id }
          router.push(`/editor-layout?resumeId=${newResume.id}`);
        } catch (error) {
          console.error("Failed to create resume", error);
          // optional: show toast or error message
        }
    };
    return (
        <Button
          onClick={canCreate ? handleCreate : () => premiumModal.setOpen(true)}
          className="mx-auto flex w-fit gap-2"
        >
          <PlusSquare className="size-5" />
          New Resume
        </Button>
      );

}