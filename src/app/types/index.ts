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
    imageUrl?: string;
  };
  
  export type OrderItem = {
    id: string;
    product: Product;
    quantity: number;
    price: number;
  };
  
  export type PrintFile = {
    name: string;
    url: string;
    type: 'image' | 'pdf';
  };
  
  export type Order = {
    id: string;
    customer: Customer;
    items: OrderItem[];
    printFiles: PrintFile[];
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
  };