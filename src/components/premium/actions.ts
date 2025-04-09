"use server"

import razorpay from "@/lib/razorpay";
import { currentUser } from "@clerk/nextjs/server"


export async function createSubscription(priceId: string) {
    const user = await currentUser();

    console.log("User", user, priceId);

    if(!user) {
        throw new Error("Unauthorized");
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id: priceId,
        total_count: 12,
        customer_notify: 1,
    });

    return { id: subscription.id}
    
}

    // console.log("url", `${env.NEXT_PUBLIC_BASE_URL}/api/subscription`);
    // const res = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/subscription`, {
    //         method: "POST",
    //         body: JSON.stringify({ userId: user.id, priceId }),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     });
    //   console.log("Response", res);
// export async function createSubscription(priceId: string){
//     const user = await currentUser();

//     console.log("User", user, priceId);

//     if(!user) {
//         throw new Error("Unauthorized");
//     }
    
//     const CustomerId = user.privateMetadata?.CustomerId as string | undefined;

    
//     const subscription = await razorpay.subscriptions.create({
//             plan_id: priceId,
//             customer_notify: 1,
//             quantity: 1,
//             total_count: 4,
//         })
//         console.log("Subscription", subscription);
//         const subscriptionId = subscription.id;
//         const subscriptionStatus = subscription.status;

//         console.log(`Subscription ID: ${subscriptionId}`);
//         console.log(`Subscription Status: ${subscriptionStatus}`);
//     // const session = await stripe.checkout.sessions.create({
//     //     line_items: [{price: priceId, quantity: 1}],
//     //     mode: "subscription",
//     //     success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
//     //     cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
//     //     customer: stripeCustomerId,
//     //     customer_email: stripeCustomerId ? undefined : user.emailAddresses[0].emailAddress,
//     //     metadata: {
//     //         userId: user.id,
//     //     },
//     //     subscription_data: {
//     //         metadata: {
//     //             userId: user.id
//     //         }
//     //     },
//     //     custom_text: {
//     //         terms_of_service_acceptance: {
//     //             message: `I have read AI Resume Builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`
//     //         }
//     //     },
//     //     consent_collection: {
//     //         terms_of_service: "required"
//     //     }
//     // });

//     // if(!session.url){
//     //     throw new Error("Failed to create checkout session");
//     // }
//     // return session.url;
// }

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