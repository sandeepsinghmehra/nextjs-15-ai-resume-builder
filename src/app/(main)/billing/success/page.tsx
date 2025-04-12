"use client";

import { useRouter } from "next/navigation";

import { useUser } from "@clerk/nextjs";
import { useSubscriptionSocket } from "@/hooks/use-subscription-socket";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function Page() {
    const {toast} = useToast();
    const router = useRouter();
    const { user } = useUser();
    const [redirect, setRedirect] = useState(false);
    
  
    useSubscriptionSocket(user?.id!, () => {
        toast({
            title: "Subscription Activated",
            description: "Your subscription has been activated successfully.",
        });
        setRedirect(true); 
        // window.location.href = `/my-resumes`;
    });
    // console.log("ridrect", redirect);
    useEffect(() => {
        if (redirect) {
          // do not wrap in setTimeout
          router.push("/my-resumes");
        }
      }, [redirect, router]);
  
    return (
      <main className="text-center py-20">
        <h1 className="text-3xl font-bold">Waiting for Payment confirmation...</h1>
        <p className="text-muted-foreground">We'll redirect you automatically.</p>
      </main>
    );
    // return (
    //     <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
    //         <h1 className="text-3xl font-bold">Billing Success</h1>
    //         <p>
    //             The checkout was successfull and your Pro account has been activated. Enjoy!
    //         </p>
    //         <Button asChild>
    //             <Link href="/my-resumes">Go to resumes</Link>
    //         </Button>
    //     </main>
    // )
}