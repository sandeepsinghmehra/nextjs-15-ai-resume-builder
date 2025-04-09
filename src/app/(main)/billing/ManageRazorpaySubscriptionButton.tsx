"use client";

import { useState } from "react";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);

    const res = await fetch("/api/subscription", {
      method: "POST",
      body: JSON.stringify({ customerEmail: "user@example.com" }),
    });

    const { subscriptionId } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      subscription_id: subscriptionId,
      name: "Your App",
      description: "Monthly Subscription",
      theme: { color: "#528FF0" },
      handler: function (response: any) {
        console.log("Payment success", response);
      },
      prefill: {
        name: "John Doe",
        email: "user@example.com",
      },
    };

    const razor = new (window as any).Razorpay(options);
    razor.open();
    setLoading(false);
  };

  return (
    <button onClick={handleSubscribe} disabled={loading}>
      {loading ? "Processing..." : "Subscribe ₹500/mo"}
    </button>
  );
}
