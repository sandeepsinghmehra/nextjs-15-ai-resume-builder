"use server";

import { currentUser } from "@clerk/nextjs/server";
import { env } from "@/env";
import razorpay from "@/lib/razorpay";
import prisma from "@/lib/prisma";

export async function updateSubscriptionStatus(action: "cancel" | "pause" | "resume") {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const razorpaySubscriptionId = user.privateMetadata.razorpaySubscriptionId as string | undefined;
  if (!razorpaySubscriptionId) throw new Error("Missing subscription ID");

  try {
    switch (action) {
      case "cancel":
        await razorpay.subscriptions.cancel(razorpaySubscriptionId, 
          { cancel_at_cycle_end: 1 } as any
        );
        await prisma.userSubscriptionForRazorPay.update({
          where: { razorpaySubId: razorpaySubscriptionId },
          data: {
            razorpayCancelAtPeriodEnd: true,
          },
        });
        break;

      case "pause":
        const resPause = await razorpay.subscriptions.pause(razorpaySubscriptionId, {
          pause_at_cycle_end: 1,
        } as any);
        console.log("Pause response", resPause);
        await prisma.userSubscriptionForRazorPay.update({
          where: { razorpaySubId: razorpaySubscriptionId },
          data: { status: "paused" },
        });
        break;

      case "resume":
        const resResume = await razorpay.subscriptions.resume(razorpaySubscriptionId, {
          resume_at_cycle_end: 1,
        } as any);
        console.log("Resume response", resResume);
        await prisma.userSubscriptionForRazorPay.update({
          where: { razorpaySubId: razorpaySubscriptionId },
          data: { status: "active" },
        });
        break;
    }

    return { ok: true };
  } catch (err) {
    console.error("Razorpay action error:", err);
    return { ok: false };
  }
}




// export async function createCustomerPortalSession() {
//   const user = await currentUser();

//   if (!user) {
//     throw new Error("Unauthorized");
//   }

//   const stripeCustomerId = user.privateMetadata.stripeCustomerId as
//     | string
//     | undefined;

//   if (!stripeCustomerId) {
//     throw new Error("Stripe customer ID not found");
//   }

//   const session = await stripe.billingPortal.sessions.create({
//     customer: stripeCustomerId,
//     return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
//   });

//   if (!session.url) {
//     throw new Error("Failed to create customer portal session");
//   }

//   return session.url;
// }
