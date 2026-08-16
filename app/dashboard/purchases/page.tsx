"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Loader2, Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Purchase } from "@/types/api";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

function PurchasesSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="w-48 h-8 mb-2 rounded-xl" />
        <Skeleton className="w-80 h-4 rounded-md" />
      </div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="w-48 h-6 rounded-md" />
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="w-32 h-4 rounded-md" />
                <Skeleton className="w-40 h-4 rounded-md" />
              </div>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end">
              <Skeleton className="w-24 h-8 rounded-md mb-2" />
              <Skeleton className="w-20 h-4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PurchasesPage() {
  const { isHydrated, user } = useAuthStore();
  const router = useRouter();

  const { data: purchases, isLoading, error, refetch } = useQuery({
    queryKey: ["user-purchases"],
    queryFn: async () => {
      const res = await api.get("/payments/history");
      return res.data.data as Purchase[];
    },
    enabled: isHydrated && !!user,
  });

  if (!isHydrated || isLoading) {
    return <PurchasesSkeleton />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load purchases" 
        description={(error as Error).message || "An error occurred while loading purchases."} 
        retry={() => refetch()} 
      />
    );
  }

  if (!user) {
    router.push("/login?redirect=/dashboard/purchases");
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-display">My Purchases</h1>
        <p className="text-muted-foreground mt-1">View your transaction history and active products.</p>
      </div>

      {!purchases || purchases.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-xl border border-border border-dashed">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No purchases yet</h3>
          <p className="text-muted-foreground mb-6">You haven't bought any premium content or combos.</p>
          <a href="/pricing" className="text-primary font-medium hover:underline">
            View Premium Plans
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase: Purchase) => (
            <div key={purchase.id} className="bg-card rounded-xl border border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground text-lg">
                    {purchase.product?.name || "Unknown Product"}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    purchase.status === "SUCCESS" ? "bg-success/10 text-success" :
                    purchase.status === "FAILED" ? "bg-destructive/10 text-destructive" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {purchase.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(purchase.createdAt), "MMM d, yyyy h:mm a")}
                  </span>
                  <span>Order ID: {purchase.razorpayOrderId || purchase.id}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  ₹{purchase.amountPaid}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  {purchase.paymentGateway}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
