"use client";

import { Check } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createSubscription, getSubscriptionStatus } from "./actions";
import { env } from "@/env";
// import { ListenForSubscription } from "./ListenForSubscription";


const freeFeatures = ["Create Resume", "Only 1 resume", "No AI tools", "No Pdf download"];
// const premiumFeatures = ["AI Tools", "Up to 3 resumes"];
const premiumPlusFeatures = [
    "Infinite resumes", 
    "Design customizations",
    "AI Tools",
    "Download in PDF",
];

export default function PremiumModal() {
    const {open, setOpen} = usePremiumModal();
    // const [showPolling, setShowPolling] = useState(false);

    const {toast} = useToast();

    const [loading, setLoading] = useState(false);

    async function handlePremiumClick(priceId: string){
        setOpen(false);
        // console.log("handlePremiumClick called");
        try {
            setLoading(true);
            // console.log("Price ID", priceId);
            const { id: subscriptionId } = await createSubscription(priceId);
            const options = {
                key: env.NEXT_PUBLIC_RAZORPAY_KEY, // must be public key
                subscription_id: subscriptionId,
                name: "Resume Builder AI",
                description: "Premium Subscription",
                handler: function (response: any) {
                    // ✅ Payment was successful
                    // setShowListen(true); 
                    // Start polling for subscription
                    // setShowPolling(true);
                    // console.log("Razorpay response", response); 
                    // let dummyres ={
                    //     "razorpay_payment_id": "pay_QHOl3kp3SYAeYU",
                    //     "razorpay_subscription_id": "sub_QHOk2S8K4TKWZL",
                    //     "razorpay_signature": "d5308791887f2302baf53b77a04d5db2eb476484f4961751533aeda0789728ed"
                    // }
                    const query = new URLSearchParams({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_subscription_id: response.razorpay_subscription_id,
                        razorpay_signature: response.razorpay_signature,
                      }).toString();
                    
                    window.location.href = `/billing/success?${query}`;
                },
                // prefill: {
                //   email: email,
                // },
                theme: {
                  color: "#00C853",
                },
              };
          
              const razor = new (window as any).Razorpay(options);
              razor.open();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                description: "Something went wrong. Please try again."
            });
        } finally {
            setLoading(false);
        }
    }
   
    return (
        <>
        {/* {showPolling && <ListenForSubscription />} */}

        <Dialog open={open} onOpenChange={(open)=>{
            if(!loading) {
                setOpen(open);
            }
        }}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Resume Builder AI Premium</DialogTitle> 
                </DialogHeader>
            
                <div className="space-y-6">
                    <p>
                        Get a premium subscription to unlock more features.
                    </p>
                    <div className="flex">
                    <div className="flex w-1/3 flex-col space-y-5">
                            <h3 className="text-center text-lg font-bold">
                                Free
                            </h3>
                            <ul className="list-inside space-y-2">
                                {freeFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="size-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-1 mx-6" />
                        {/* <div className="flex w-1/2 flex-col space-y-5">
                            <h3 className="text-center text-lg font-bold">
                                Premium
                            </h3>
                            <ul className="list-inside space-y-2">
                                {premiumFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="size-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                onClick={() =>{ 
                                    console.log("Pro clicked")
                                    handlePremiumClick(env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PRO)
                                }}
                                disabled={loading}
                            >
                                Get Premium
                            </Button>
                        </div> */}
                        <div className="border-1 mx-6" />
                        <div className="flex w-1/2 flex-col space-y-5">
                            <h3 className="text-center text-lg font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                                Premium Plus
                            </h3>
                            <ul className="list-inside space-y-2">
                                {premiumPlusFeatures.map(feature => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="size-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                onClick={()=> {
                                    // console.log("Premium Plus clicked")
                                    handlePremiumClick(env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PREMIUM)
                                }}
                                variant={"premium"}
                                disabled={loading}
                            >
                                Get Premium 
                            </Button>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}