"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChapterProduct } from "@/hooks/use-chapter-product";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loadRazorpayScript } from "@/lib/razorpay";
import { api } from "@/lib/axios";
import { Loader2, Unlock } from "lucide-react";

interface BuyChapterButtonProps {
  chapterId: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export function BuyChapterButton({ chapterId, className, variant = "outline" }: BuyChapterButtonProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: product, isLoading: productLoading } = useChapterProduct(chapterId);
  const [isProcessing, setIsProcessing] = useState(false);

  // If user is already PRO/ELITE, they don't need to buy chapters
  if (user && user.subscriptionTier !== "FREE") {
    return null;
  }

  // If there's no product for this chapter, don't show the button
  if (!product && !productLoading) {
    return null;
  }

  const handleBuy = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    if (!product) return;

    setIsProcessing(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Are you online?");
        setIsProcessing(false);
        return;
      }

      const orderRes = await api.post("/payments/create-order", { productId: product.id });
      const { orderId, amount, currency } = orderRes.data.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amount,
        currency: currency,
        name: "Code Zest SSC",
        description: `Unlock Chapter`,
        order_id: orderId,
        handler: async function (response: Record<string, string>) {
          try {
            await api.post("/payments/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success(`Successfully unlocked chapter!`);
            
            // Reload the page to clear the lock screen
            window.location.reload();
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
          color: "#0f172a", // slate-950
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      });
      
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      className={className} 
      onClick={handleBuy}
      disabled={isProcessing || productLoading}
    >
      {isProcessing ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
      ) : productLoading ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading price...</>
      ) : (
        <>
          <Unlock className="w-4 h-4 mr-2" />
          Unlock this Chapter — 
          {product?.originalPrice && (
            <span className="line-through text-muted-foreground/60 font-medium ml-1 mr-1">
              ₹{product.originalPrice}
            </span>
          )}
          ₹{product?.price}
        </>
      )}
    </Button>
  );
}
