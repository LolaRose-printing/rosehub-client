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

export type Order = {
  id: string;
  quantity?: number;
  customerEmail?: string;
  serviceId?: number;
  frontImage?: string;
  backImage?: string;
  selection?: Selection[];

  customer: Customer;
  items: Item[];
  printFiles: PrintFile[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  service?: Service;
  invoiceId?: string;

  createdAt: string;
  updatedAt: string;
};

