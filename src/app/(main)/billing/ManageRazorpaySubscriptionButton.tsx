"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { updateSubscriptionStatus } from "./actions";
import { useRouter } from "next/navigation";

export default function ManageRazorpaySubscriptionButton({ subscription }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (type: "cancel" | "pause" | "resume") => {
    setLoading(true);
    const res = await updateSubscriptionStatus(type);
    if (res.ok) {
      if(type === "cancel") {
        toast({ description: "Subscription will be cancelled at the end of the current billing cycle." });
      }else{
        toast({ description: `Subscription ${type}d.` });
      }
      router.refresh();
    } else {
      toast({ variant: "destructive", description: `Failed to ${type}` });
    }
    setLoading(false);
  };

  return (
    <>
      
      {subscription && (
        <div className="space-y-2">
          
          <div className="flex gap-4 mt-4">
            <Button className="bg-[#FF3D00] text-white" onClick={() => handleAction("cancel")} disabled={loading}>
              Cancel
            </Button>
            <Button className="bg-[#FFEA00] text-white" onClick={() => handleAction("pause")} disabled={loading}>
              Pause
            </Button>
            <Button className="bg-[#00C853] text-white" onClick={() => handleAction("resume")} disabled={loading}>
              Resume
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
