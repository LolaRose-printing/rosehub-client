import { Order, OrderStatus } from "@/types/order";

export const mockOrders: Order[] = [
  {
    id: "ord_001",
    customer: {
      id: "CUST-001",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "555-123-4567",
    },
    items: [
      {
        id: "ITEM-001",
        product: {
          id: "PROD-PRINT-001",
          title: "Business Card Printing (Double-Sided)",
          description: "Full-color double-sided business cards",
          price: 45.0,
          imageUrl: "",
        },
        quantity: 100,
        price: 0.45,
      },
    ],
    printFiles: [
      {
        name: "business-card-front.png",
        url: "https://example.com/uploads/business-card-front.png",
        type: "image",
      },
      {
        name: "business-card-back.png",
        url: "https://example.com/uploads/business-card-back.png",
        type: "image",
      },
    ],
    total: 45.0,
    status: OrderStatus.COMPLETED,
    shippingAddress: "123 Main St, Springfield, IL, 62704",
    createdAt: new Date("2025-06-01T14:30:00Z").toISOString(),
    updatedAt: new Date("2025-06-02T09:15:00Z").toISOString(),
  },
  // ... repeat for other orders ...
];

