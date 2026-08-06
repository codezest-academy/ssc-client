import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";
import { useAuthStore } from "../store/auth";

export function useAccess() {
  const { user, isHydrated } = useAuthStore();

  const { data: purchases, isLoading } = useQuery({
    queryKey: ["user-purchases"],
    queryFn: async () => {
      const res = await api.get("/payments/history");
      return res.data.data;
    },
    enabled: isHydrated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const canAccess = (accessTier: "FREE" | "PRO" | "EXCLUSIVE", itemId?: string) => {
    if (accessTier === "FREE") return true;

    if (!user) return false;

    // Check PRO subscription
    if (accessTier === "PRO" && (user.subscriptionTier === "PRO" || user.subscriptionTier === "ELITE")) {
      return true;
    }

    // If still here, we need to check specific purchases
    if (!purchases) return false;

    // We check if the user has a SUCCESS purchase for a product that contains this itemId
    const hasPurchased = purchases.some((p: any) => 
      p.status === "SUCCESS" && 
      p.product?.items?.some((pi: any) => pi.itemId === itemId)
    );

    return hasPurchased;
  };

  return { canAccess, isLoading, purchases };
}
