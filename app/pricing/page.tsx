"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { loadRazorpayScript } from "@/lib/razorpay";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Loader2, Package, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Product, ProductItem } from "@/types/api";

export default function PricingPage() {
  const { user, isHydrated } = useAuthStore();
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data.data as Product[];
    },
  });

  const handleBuy = async (productId: string) => {
    if (!user) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setProcessingId(productId);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK. Are you online?");
        setProcessingId(null);
        return;
      }

      const orderRes = await api.post("/payments/create-order", { productId });
      const { orderId, amount, currency } = orderRes.data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", 
        amount: amount,
        currency: currency,
        name: "CodeZest SSC",
        description: "Purchase product",
        order_id: orderId,
        handler: async function (response: Record<string, string>) {
          try {
            await api.post("/payments/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            alert("Payment successful! Your content is now unlocked.");
            router.push("/dashboard");
          } catch (error) {
            console.error("Verification failed", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: { error: { description: string } }) {
        alert("Payment Failed. " + response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading || !isHydrated) {
    return (
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Unlock Premium Learning</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the right plan or combo package to accelerate your SSC exam preparation.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Unlock Premium Learning</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose the right plan or combo package to accelerate your SSC exam preparation.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {products?.map((product: Product) => (
          <div key={product.id} className="border border-slate-200 rounded-2xl p-8 flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h3>
              <p className="text-slate-500 text-sm h-10">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₹{product.price}</span>
            </div>

            <div className="flex-1">
              <ul className="space-y-3 mb-8">
                {product.items?.map((item: ProductItem, i: number) => (
                  <li key={i} className="flex items-start text-sm text-slate-700">
                    <Check className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    <span>{item.itemType} - Unlock content</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              className="w-full font-bold h-12 rounded-xl"
              onClick={() => handleBuy(product.id)}
              disabled={processingId === product.id}
            >
              {processingId === product.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        ))}
        {(!products || products.length === 0) && (
          <div className="col-span-full">
            <EmptyState 
              icon={Package}
              title="No products available"
              description="Check back later for new offers and combos."
            />
          </div>
        )}
      </div>
    </div>
  );
}
