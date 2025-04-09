import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSig) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.entity === "event") {
    const payload = event.payload.subscription.entity;
    if (event.event === "payment.authorized") {
      const paymentId = event.payload.payment.entity.id;
      const subscriptionId = event.payload.payment.entity.subscription_id;
  
      // ✅ Save to DB securely
      console.log("Payment success webhook received", { paymentId, subscriptionId });
  
      // Example: update user subscription in DB
      // await db.user.update({ where: { razorpaySubId: subscriptionId }, data: { isPremium: true } });
    }
  
    if (event.event === "subscription.charged") {
      await prisma.userSubscriptionForRazorPay.update({
        where: { razorpaySubId: payload.id },
        data: {
          status: payload.status,
          currentPeriodEnd: new Date(payload.current_end * 1000),
        },
      });
    }

    if (event.event === "subscription.cancelled") {
      await prisma.userSubscriptionForRazorPay.update({
        where: { razorpaySubId: payload.id },
        data: { status: "cancelled" },
      });
    }
  }

  return new Response("OK", { status: 200 });
}

