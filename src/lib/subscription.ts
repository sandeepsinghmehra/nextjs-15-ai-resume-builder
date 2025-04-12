import { cache } from 'react'
import prisma from './prisma';
import { env } from '@/env';

// export type SubscriptionLevel = "free" | "pro" | "pro_plus";
export type SubscriptionLevel = "free" | "pro_plus";

// export const getUserSubscriptionLevel = cache(
//     async(userId: string): Promise<SubscriptionLevel> => {
//         const subscription = await prisma.userSubscription.findUnique({
//             where: {
//                 userId
//             }
//         });
//         if(!subscription || subscription.stripeCurrentPeriodEnd < new Date()){
//             return "free";
//         }

//         if(subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY){
//             return "pro";
//         }
         
//         if(subscription.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY){
//             return "pro_plus";
//         }
//         throw new Error("Invalid subscription");
//     }
// )

export const getUserSubscriptionLevel = cache(
    async(userId: string): Promise<SubscriptionLevel> => {
        const subscription = await prisma.userSubscriptionForRazorPay.findUnique({
            where: {
                userId
            }
        });
        // console.log("subscription", subscription);
        if(!subscription || (subscription?.currentPeriodEnd && subscription?.currentPeriodEnd < new Date())){
            return "free";
        }

        // if(subscription.razorpayPlanId === env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PRO){
        //     return "pro";
        // }
         
        if(subscription.razorpayPlanId === env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PREMIUM){
            return "pro_plus";
        }
        throw new Error("Invalid subscription");
    }
)