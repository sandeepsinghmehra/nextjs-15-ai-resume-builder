"use client";

import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Loader2, PlusSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEmptyResume } from "../editor-layout/actions";
import { useEffect, useState } from "react";


interface CreateResumeButtonProps {
    canCreate: boolean;
    userId: string;
}
export default function CreateResumeButton({canCreate, userId}: CreateResumeButtonProps){

  const [loading, setLoading] = useState(false);
  const premiumModal = usePremiumModal();
  const router = useRouter();

  const handleCreate = async () => {
    try {
      setLoading(true);
      const newResume = await createEmptyResume(userId); // must return { id }
      router.push(`/editor-layout?resumeId=${newResume.id}`);
    } catch (error) {
      console.error("Failed to create resume", error);
      // optional: show toast or error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    router.prefetch("/editor-layout");
  }, []);
  return (
    <Button
      onClick={canCreate ? handleCreate : () => premiumModal.setOpen(true)}
      className="mx-auto flex w-fit gap-2"
    >
      {loading ? <><Loader2 className="mx-auto my-6 animate-spin" /> Creating</> : <><PlusSquare className="size-5" /> New Resume</>}
    </Button>
  );

}