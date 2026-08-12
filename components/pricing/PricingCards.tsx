"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { loadRazorpayScript } from "@/lib/razorpay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Crown, Zap, Star, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/types/api";

export function PricingCards() {
  const { user, isHydrated, setAuth } = useAuthStore();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data.data as Product[];
    },
  });

  const handleBuy = async (product: Product, tierStr: string) => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setProcessingId(product.id);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Are you online?");
        setProcessingId(null);
        return;
      }

      const orderRes = await api.post("/payments/create-order", { productId: product.id });
      const { orderId, amount, currency } = orderRes.data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", 
        amount: amount,
        currency: currency,
        name: "Code Zest SSC",
        description: `Upgrade to ${product.name}`,
        order_id: orderId,
        handler: async function (response: Record<string, string>) {
          try {
            await api.post("/payments/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success(`Successfully upgraded to ${product.name}!`);
            
            // Update local auth store so UI reflects changes immediately
            if (user) {
              setAuth({
                ...user,
                subscriptionTier: tierStr as "PRO" | "ELITE",
              }, "mock-token-kept"); // The token doesn't matter for client cache here, but ideally we'd re-fetch the user
            }
            
            router.push("/dashboard");
          } catch (error) {
            console.error("Verification failed", error);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3b82f6", // Primary blue
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: { error: { description: string } }) {
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const [isYearly, setIsYearly] = useState(false);

  const proProductMonthly = products?.find(p => p.id === "prod-pro-monthly");
  const proProductYearly = products?.find(p => p.id === "prod-pro-yearly");
  const eliteProductMonthly = products?.find(p => p.id === "prod-elite-monthly");
  const eliteProductYearly = products?.find(p => p.id === "prod-elite-yearly");

  const proProduct = isYearly ? proProductYearly : proProductMonthly;
  const eliteProduct = isYearly ? eliteProductYearly : eliteProductMonthly;

  if (isLoading || !isHydrated) {
    return (
      <div className="grid md:grid-cols-3 gap-8 items-start w-full">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[450px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Monthly / Yearly Toggle */}
      <div className="mb-12 flex items-center gap-3 bg-muted/50 p-1 rounded-full border border-border">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isYearly ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isYearly ? 'bg-primary shadow-md text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Yearly <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${isYearly ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>Save 20%</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start w-full">
      {/* Free/Basic Plan */}
      <Card className="border-border shadow-sm flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">Basic</CardTitle>
          <CardDescription>Perfect for getting started.</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-slate-900">₹0</span>
            <span className="text-slate-500 font-medium">/ forever</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 mt-4">
          <ul className="space-y-3 text-sm text-slate-600 font-medium">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              Access to all free lessons
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              Limited practice sets
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              Basic performance analytics
            </li>
          </ul>
        </CardContent>
        <CardFooter className="pt-8 mt-auto">
          <Button className="w-full" variant="outline" disabled>
            {user?.subscriptionTier === "FREE" ? "Current Plan" : "Included"}
          </Button>
        </CardFooter>
      </Card>

      {/* Pro Plan */}
      <Card className="border-primary shadow-lg relative transform md:-translate-y-4 flex flex-col bg-slate-900 text-white min-h-[480px]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" /> Most Popular
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            {proProduct ? proProduct.name : "Pro"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {proProduct ? proProduct.description : "Unlock your true potential."}
          </CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-white">₹{proProduct ? proProduct.price : "499"}</span>
            <span className="text-slate-400 font-medium">{isYearly ? '/ year' : '/ month'}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 mt-4">
          <ul className="space-y-3 text-sm text-slate-300 font-medium">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-white">Everything in Basic</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
              All Premium Video Lessons & PDFs
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
              50+ Full-Length Mock Tests
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
              Advanced Analytics & AI insights
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
              Doubt solving within 24 hours
            </li>
          </ul>
        </CardContent>
        <CardFooter className="pt-8 mt-auto">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            onClick={() => proProduct && handleBuy(proProduct, "PRO")}
            disabled={!proProduct || processingId !== null || user?.subscriptionTier === "PRO" || user?.subscriptionTier === "ELITE"}
          >
            {processingId === proProduct?.id ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : user?.subscriptionTier === "PRO" ? (
              "Current Plan"
            ) : user ? (
              "Upgrade to Pro"
            ) : (
              "Get Started"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Elite Plan */}
      <Card className="border-amber-200 shadow-md flex flex-col bg-gradient-to-b from-amber-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            {eliteProduct ? eliteProduct.name : "Elite"}
          </CardTitle>
          <CardDescription className="text-amber-700/80">
            {eliteProduct ? eliteProduct.description : "For guaranteed selection."}
          </CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-extrabold text-amber-900">₹{eliteProduct ? eliteProduct.price : "999"}</span>
            <span className="text-amber-700 font-medium">{isYearly ? '/ year' : '/ month'}</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 mt-4">
          <ul className="space-y-3 text-sm text-slate-700 font-medium">
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="text-amber-950 font-bold">Everything in Pro</span>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
              1-on-1 Mentorship sessions
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
              Live doubt solving instantly
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
              Printed study material delivery
            </li>
          </ul>
        </CardContent>
        <CardFooter className="pt-8 mt-auto">
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            onClick={() => eliteProduct && handleBuy(eliteProduct, "ELITE")}
            disabled={!eliteProduct || processingId !== null || user?.subscriptionTier === "ELITE"}
          >
            {processingId === eliteProduct?.id ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : user?.subscriptionTier === "ELITE" ? (
              "Current Plan"
            ) : user ? (
              "Upgrade to Elite"
            ) : (
              "Get Started"
            )}
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}
