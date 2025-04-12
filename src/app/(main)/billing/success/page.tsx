"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@clerk/nextjs";
import { useSubscriptionSocket } from "@/hooks/use-subscription-socket";

export default function Page() {
    const router = useRouter();
    const { userId } = useAuth(); // or from session
  
    useSubscriptionSocket(userId!, () => {
      router.push("/my-resumes");
    });
  
    return (
      <main className="text-center py-20">
        <h1 className="text-3xl font-bold">Waiting for Razorpay confirmation...</h1>
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