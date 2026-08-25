import { api } from './axios';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cost: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface StoreOrder {
  id: string;
  userId: string;
  storeItemId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  coinsSpent: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  createdAt: string;
  item: StoreItem;
}

export const StoreAPI = {
  // Student Facing
  getItems: () => api.get<{ data: StoreItem[] }>('/store/items').then((res) => res.data.data),
  getMyOrders: () => api.get<{ data: StoreOrder[] }>('/store/orders/my-orders').then((res) => res.data.data),
  placeOrder: (data: {
    storeItemId: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  }) => api.post<{ data: StoreOrder }>('/store/orders', data).then((res) => res.data.data),
};
