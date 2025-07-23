export type Configuration = {
  id: number;
  title: string;
  items: string[];
  serviceId: number;
  createdAt: string;
  updatedAt: string;
};

export type Dimensions = {
  id: number;
  width: number;
  height: number;
  unit: string;
  serviceId: number;
  createdAt: string;
  updatedAt: string;
};

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  productId: string;
  priceId: string;
  thumbnail: string;
  slug: string;
  hasFrontBack: boolean;
  createdAt: string;
  updatedAt: string;
  category: string;
  configurations: Configuration[];
  dimensions: Dimensions;
}
