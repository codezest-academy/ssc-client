"use client";

import { useQuery } from "@tanstack/react-query";
import { StoreAPI } from "@/lib/store-api";
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function MyOrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["store-my-orders"],
    queryFn: StoreAPI.getMyOrders,
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>;

  return (
    <div className="space-y-8 pb-12 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/store">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Rewards Orders</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track the status of your gamification store purchases.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <Package className="w-10 h-10 mb-4 opacity-20" />
            <p className="font-medium">No orders placed yet.</p>
            <p className="text-sm">Head over to the Rewards Store to redeem your XP coins!</p>
            <Link href="/store">
              <Button className="mt-6">Browse Store</Button>
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-muted/30 p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {order.item.imageUrl ? (
                    <img src={order.item.imageUrl} alt={order.item.name} className="w-16 h-16 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Box className="w-6 h-6" /></div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{order.item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.slice(-8).toUpperCase()} • {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-bold text-amber-600">
                    {order.coinsSpent} Coins
                  </div>
                  {order.status === 'CANCELLED' && (
                    <Badge variant="destructive">Cancelled</Badge>
                  )}
                </div>
              </div>

              {order.status !== 'CANCELLED' && (
                <div className="p-6">
                  <OrderStatusTimeline status={order.status} />
                  
                  {order.trackingNumber && (
                    <div className="mt-6 bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex items-start gap-3">
                      <Truck className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Your package is on the way!</p>
                        <p className="text-sm mt-1">
                          Shipped via <strong>{order.courierName}</strong>. 
                          Tracking number: <span className="font-mono font-medium tracking-wide bg-background/50 px-2 py-0.5 rounded">{order.trackingNumber}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function OrderStatusTimeline({ status }: { status: string }) {
  const steps = [
    { id: 'PENDING', label: 'Order Placed', icon: Clock },
    { id: 'PROCESSING', label: 'Processing', icon: Package },
    { id: 'SHIPPED', label: 'Shipped', icon: Truck },
    { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentIndex = steps.findIndex(s => s.id === status) !== -1 ? steps.findIndex(s => s.id === status) : 0;

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
      
      <div 
        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out" 
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />

      <div className="relative flex justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-card transition-colors duration-500 z-10 ${
                  isCompleted ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground'
                } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
              >
                <step.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
