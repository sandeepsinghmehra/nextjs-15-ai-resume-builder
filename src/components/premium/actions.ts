"use server"

import prisma from "@/lib/prisma";
import razorpay from "@/lib/razorpay";
import { currentUser } from "@clerk/nextjs/server";
// import { headers } from "next/headers"
import { Subscriptions } from "razorpay/dist/types/subscriptions";


export async function createSubscription(planId: string) {

    const user = await currentUser();

    console.log("User", user, planId);

    if(!user) {
        throw new Error("Unauthorized");
    }
    
    
    const subscription: Subscriptions.RazorpaySubscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 12,
        notes: {
            userId: user.id, // 👈 again
        },
    });
    
    // console.log("Subscription", subscription);

    return { id: subscription.id}
    
}

export async function getSubscriptionStatus() {
    const user = await currentUser();
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }
  
    const dbSub = await prisma.userSubscriptionForRazorPay.findFirst({
        where: {
            userId: user.id,
            status: "active",
        },
    });
  
    return { active: dbSub?.status === "active" };
}

// const dummySubscriptionPayload = {
//     id: 'sub_QHOk2S8K4TKWZL',
//     entity: 'subscription',
//     plan_id: 'plan_QDgRqIL0afqwCt',
//     status: 'created',
//     current_start: null,
//     current_end: null,
//     ended_at: null,
//     quantity: 1,
//     notes: [],
//     charge_at: null,
//     start_at: null,
//     end_at: null,
//     auth_attempts: 0,
//     total_count: 12,
//     paid_count: 0,
//     customer_notify: true,
//     created_at: 1744297565,
//     expire_by: null,
//     short_url: 'https://rzp.io/rzp/p9eyJ08',
//     has_scheduled_changes: false,
//     change_scheduled_at: null,
//     source: 'api',
//     remaining_count: 11
//   }
// export async function createCheckoutSession(priceId: string){
//     const user = await currentUser();

//     if(!user) {
//         throw new Error("Unauthorized");
//     }
    
//     const stripeCustomerId = user.privateMetadata?.stripeCustomerId as string | undefined;

//     const session = await stripe.checkout.sessions.create({
//         line_items: [{price: priceId, quantity: 1}],
//         mode: "subscription",
//         success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
//         cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
//         customer: stripeCustomerId,
//         customer_email: stripeCustomerId ? undefined : user.emailAddresses[0].emailAddress,
//         metadata: {
//             userId: user.id,
//         },
//         subscription_data: {
//             metadata: {
//                 userId: user.id
//             }
//         },
//         custom_text: {
//             terms_of_service_acceptance: {
//                 message: `I have read AI Resume Builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`
//             }
//         },
//         consent_collection: {
//             terms_of_service: "required"
//         }
//     });

//     if(!session.url){
//         throw new Error("Failed to create checkout session");
//     }
//     return session.url;
// }