"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { StoreAPI, StoreItem } from "@/lib/store-api";
import { useAuthStore } from "@/store/auth";
import { 
  ShoppingBag, 
  Coins, 
  MapPin, 
  Box, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function RewardsStorePage() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  
  // Use a sensible default if the API user hasn't updated their coins immediately
  const userCoins = user?.coins || 0;

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["store-items-public"],
    queryFn: StoreAPI.getItems,
  });

  const [checkoutItem, setCheckoutItem] = useState<StoreItem | null>(null);
  const [addressForm, setAddressForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phone || "",
  });

  const placeOrderMutation = useMutation({
    mutationFn: (data: any) => StoreAPI.placeOrder(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["store-items-public"] });
      try {
        const res = await api.get("/auth/me");
        if (res.data?.data) {
          setUser(res.data.data);
        }
      } catch (e) {
        console.error("Failed to update user coins", e);
      }
      toast.success("Order placed successfully!");
      setCheckoutItem(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to place order");
    },
  });

  const handleBuy = (item: StoreItem) => {
    if (userCoins < item.cost) {
      toast.error("You don't have enough coins for this item.");
      return;
    }
    setCheckoutItem(item);
  };

  const confirmPurchase = () => {
    if (!checkoutItem) return;
    placeOrderMutation.mutate({
      storeItemId: checkoutItem.id,
      ...addressForm,
    });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading rewards...</div>;

  return (
    <div className="space-y-8 pb-12 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      
      {/* Header with Floating Coin Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-30 bg-background/80 backdrop-blur-md py-4 border-b border-border/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Rewards Store
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Exchange your hard-earned XP coins for exclusive merch.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => window.location.href = "/store/orders"}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            My Orders
          </Button>
          <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 border border-amber-200/20 px-4 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Coins className="w-5 h-5 fill-amber-500" />
            <span>{userCoins.toLocaleString()} Coins</span>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <ShoppingBag className="w-10 h-10 mb-4 opacity-20" />
            <p className="font-medium">No rewards available right now.</p>
            <p className="text-sm">Check back later for new exclusive merch!</p>
          </div>
        ) : (
          items.map((item) => {
            const canAfford = userCoins >= item.cost;
            const isOutOfStock = item.stock <= 0;

            return (
              <div 
                key={item.id} 
                className={`group relative flex flex-col bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 ${
                  canAfford && !isOutOfStock ? 'hover:shadow-lg hover:border-primary/30 hover:-translate-y-1' : 'opacity-80 grayscale-[30%]'
                }`}
              >
                {/* Image Section */}
                <div className="aspect-square relative bg-muted/30 overflow-hidden">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                      <Box className="w-16 h-16" />
                    </div>
                  )}
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {isOutOfStock ? (
                      <Badge variant="destructive" className="shadow-sm uppercase tracking-wider font-bold">
                        Out of Stock
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs font-medium shadow-sm">
                        {item.stock} left
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2">{item.name}</h3>
                    <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-md font-bold text-sm shrink-0">
                      <Coins className="w-3.5 h-3.5 fill-amber-500" />
                      {item.cost}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {item.description}
                  </p>

                  <Button 
                    className="w-full font-bold shadow-sm" 
                    disabled={!canAfford || isOutOfStock}
                    variant={canAfford && !isOutOfStock ? 'default' : 'secondary'}
                    onClick={() => handleBuy(item)}
                  >
                    {isOutOfStock ? (
                      "Out of Stock"
                    ) : !canAfford ? (
                      "Not Enough Coins"
                    ) : (
                      "Redeem Now"
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={!!checkoutItem} onOpenChange={(open) => !open && setCheckoutItem(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Shipping Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            {checkoutItem && (
              <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border">
                {checkoutItem.imageUrl ? (
                  <img src={checkoutItem.imageUrl} alt={checkoutItem.name} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center"><Box className="w-6 h-6 text-muted-foreground" /></div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm leading-tight">{checkoutItem.name}</p>
                  <p className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-1">
                    <Coins className="w-3 h-3 fill-amber-600" /> {checkoutItem.cost} Coins
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address Line 1</Label>
                <Input 
                  placeholder="Flat, House no., Building, Company, Apartment"
                  value={addressForm.addressLine1}
                  onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2 (Optional)</Label>
                <Input 
                  placeholder="Area, Street, Sector, Village"
                  value={addressForm.addressLine2}
                  onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input 
                    placeholder="Town/City"
                    value={addressForm.city}
                    onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input 
                    placeholder="State"
                    value={addressForm.state}
                    onChange={e => setAddressForm({...addressForm, state: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input 
                    placeholder="6 digits"
                    maxLength={6}
                    value={addressForm.pincode}
                    onChange={e => setAddressForm({...addressForm, pincode: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input 
                    placeholder="10 digits"
                    value={addressForm.phone}
                    onChange={e => setAddressForm({...addressForm, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 text-blue-600 p-3 rounded-lg text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Make sure your shipping address is accurate. Returns or re-shipping are not supported for Rewards Store items.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutItem(null)}>Cancel</Button>
            <Button 
              disabled={
                placeOrderMutation.isPending || 
                !addressForm.addressLine1 || 
                !addressForm.city || 
                !addressForm.state || 
                !addressForm.pincode || 
                !addressForm.phone
              }
              onClick={confirmPurchase}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {placeOrderMutation.isPending ? "Processing..." : "Confirm & Pay Coins"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
