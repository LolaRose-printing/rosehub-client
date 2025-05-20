import { Service } from "./service";

export type Selection = {
  id: number;
  title: string;
  orderId: number;
};

export type Order = {
  id: number;
  quantity: number;
  customerEmail: string;
  serviceId: number;
  frontImage: string;
  backImage: string;
  selection: Selection[];
  status: string;
  service: Service;
  invoiceId: string;
  createdAt: Date;
  updatedAt: Date;
};
