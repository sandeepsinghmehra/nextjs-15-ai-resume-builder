import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Metadata } from "next";
import GetSubscriptionButton from "./GetSubscriptionButton";
import ManageRazorpaySubscriptionButton from "./ManageRazorpaySubscriptionButton";
import razorpay from "@/lib/razorpay";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSubscriptionForRazorPay.findUnique({
    where: { userId },
  });

  // console.log("subscription", subscription);
  // const planInfo = subscription
  //   // ? await stripe.prices.retrieve(subscription.stripePriceId, {
  //   //     expand: ["product"],
  //   //   })
  //   ? await razorpay.subscriptions
  //   : null;
    let planName = "Free";

    if (subscription?.razorpayPlanId) {
      const plan = await razorpay.plans.fetch(subscription.razorpayPlanId);
      planName = plan.item.name;
    }
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold pt-12">Billing</h1>
      <h2 className="text-2xl font-bold">Manage Subscription</h2>
      <p>
        Your current plan:{" "}
        <span className="font-bold">
          {planName ? planName === "ResumeMakerForPremiumReal"? "Premium": "Free" : "Free"}
        </span>
      </p>
      
      {subscription ? (
        <>
          <span className="font-bold">
            Status:{" "} 
            <Badge
              className="bg-black text-white rounded-md hover:bg-black"
              variant="outline"
              // color={subscription.status === "active" ? "green" : subscription.status === "paused" ? "yellow": "red"}
              style={{
                backgroundColor: subscription.status === "active" ? "#00C853" : subscription.status === "paused" ? "#FFEA00": "#FF3D00",
                color: "white",
              }}
              >
                {subscription.status}
            </Badge>
            </span>
          <p>Next Billing: {subscription.currentPeriodEnd && format(subscription?.currentPeriodEnd, "MMMM dd, yyyy")}</p>
          {subscription.razorpayCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will be canceled on{" "}
              {subscription.currentPeriodEnd && format(subscription?.currentPeriodEnd, "MMMM dd, yyyy")}
            </p>
          )}
          <ManageRazorpaySubscriptionButton subscription={subscription} />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  );
}
