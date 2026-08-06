"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Loader2, Package, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function PurchasesPage() {
  const { data: purchases, isLoading } = useQuery({
    queryKey: ["user-purchases"],
    queryFn: async () => {
      const res = await api.get("/payments/history");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Purchases</h1>
        <p className="text-slate-500 mt-1">View your transaction history and active products.</p>
      </div>

      {!purchases || purchases.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No purchases yet</h3>
          <p className="text-slate-500 mb-6">You haven't bought any premium content or combos.</p>
          <a href="/pricing" className="text-primary font-medium hover:underline">
            View Premium Plans
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase: any) => (
            <div key={purchase.id} className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {purchase.product?.name || "Unknown Product"}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    purchase.status === "SUCCESS" ? "bg-green-100 text-green-700" :
                    purchase.status === "FAILED" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {purchase.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-500 gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(purchase.createdAt), "MMM d, yyyy h:mm a")}
                  </span>
                  <span>Order ID: {purchase.razorpayOrderId || purchase.id}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  ₹{purchase.amountPaid}
                </div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">
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
