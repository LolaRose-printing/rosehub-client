export type Configuration = {
  id: number;
  title: string;
  items: string[];
  serviceId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Service = {
  id: number;
  title: string;
  price: string;
  description: string;
  discount: string;
  thumbnail: string;
  configurations: Configuration[];
  slug: string;
  createdAt: string;
};
