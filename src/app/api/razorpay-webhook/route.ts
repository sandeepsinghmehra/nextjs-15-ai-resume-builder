import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { env } from "@/env";
import { clerkClient } from "@clerk/nextjs/server";
import { Subscriptions } from "razorpay/dist/types/subscriptions";


export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  const expectedSig = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSig) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  try {
    switch (event.event) {
      case "subscription.activated":
        await handleSubscriptionActivated(event.payload.subscription.entity, event.payload.payment.entity);
        break;
      // case "subscription.charged":
      //   await handleSubscriptionCharged(event.payload.subscription.entity);
      //   break;
      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
      default:
        console.log("Unhandled event", event.event);
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook error", error);
    return new Response("Webhook handler error", { status: 500 });
  }
}

export async function handleSubscriptionActivated(
  subscription: Subscriptions.RazorpaySubscription,
  payment: any
) {
  const userId: any = subscription?.notes?.userId;
  console.log("Subscription activated webhook called");
  if (!userId) throw new Error("Missing userId in notes");

  await prisma.userSubscriptionForRazorPay.upsert({
    where: { razorpaySubId: subscription.id },
    create: {
      userId,
      razorpaySubId: subscription.id,
      razorpayCustomerId: subscription.customer_id,
      razorpayPaymentId: payment.id,
      razorpayPlanId: subscription.plan_id,
      currentPeriodEnd: subscription.current_end ? new Date(subscription.current_end * 1000) : null,
      razorpayCancelAtPeriodEnd: subscription.status === "cancelled" && !!subscription.end_at,  //subscription.status === "cancelled" && subscription.end_at > Date.now() / 1000
      status: "active",
    },
    update: {
      razorpayPaymentId: payment.id,
      currentPeriodEnd: subscription.current_end ? new Date(subscription.current_end * 1000) : null,
      razorpayCancelAtPeriodEnd: subscription.status === "cancelled" && !!subscription.end_at, //subscription.status === "cancelled" && subscription.end_at > Date.now() / 1000
      status: "active",
    },
  });

  await(await clerkClient()).users.updateUserMetadata(userId as string, {
    privateMetadata: {
      razorpayCustomerId: subscription.customer_id,
      razorpaySubscriptionId: subscription.id,
      isSubscribed: true,
    },
  });
  
  await fetch(`${env.NEXT_PUBLIC_WEBSOCKET_BACKEND_URL}/emit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      event: "subscription-activated",
      payload: {
        success: true,
        timestamp: Date.now(),
      },
    }),
  });
}

// export async function handleSubscriptionCharged(subscription: Subscriptions.RazorpaySubscription) {
//   await prisma.userSubscriptionForRazorPay.update({
//     where: { razorpaySubId: subscription.id },
//     data: {
//       currentPeriodEnd: subscription.current_end ? new Date(subscription.current_end * 1000) : null,
//       status: subscription.status,
//     },
//   });
// }

export async function handleSubscriptionCancelled(subscription: Subscriptions.RazorpaySubscription) {
  
    await prisma.userSubscriptionForRazorPay.update({
      where: { razorpaySubId: subscription.id  },
      data: {
        status: "cancelled",
      },
    });
}
