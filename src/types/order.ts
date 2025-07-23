import { Service } from "./service";

// Replaces the type-only version
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type Item = {
  id: string;
  product: Product;
  quantity: number;
  price: number;
};

export type PrintFile = {
  name: string;
  url: string;
  type: "image" | "pdf";
};

export type Selection = {
  id: number;
  title: string;
  orderId: number;
};

export interface OrderItemConfiguration {
  selectedOptions: string[];
}

export interface ShippingAddress {
  id: number;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: number;
  integrationId: string | null;
  orderId: number;
  serviceId: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
  configuration: OrderItemConfiguration;
  productId: string;
  priceId: string;
  frontImageFilePath: string;
  backImageFilePath: string | null;
  createdAt: string;
  updatedAt: string;
  service: Service;
}


export interface Order {
  id: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  note: string;
  invoiceId: string;
  paymentMethod: string | null;
  paymentIntentId: string | null;
  refundDate: string | null;
  paymentDate: string | null;
  status: 'PENDING' | 'PAID' | 'REFUNDED' | 'CANCELLED';
  stripeSessionId: string | null;
  totalAmount: number | null;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  shippingAddressId: number;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
}


