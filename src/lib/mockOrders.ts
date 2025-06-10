import { Order } from "./index"; // or wherever your types live

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
          price: 45.00,
          imageUrl: "",
        },
        quantity: 100,
        price: 0.45, // per card
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
    total: 45.00,
    status: "completed",
    shippingAddress: "123 Main St, Springfield, IL, 62704",
    createdAt: new Date("2025-06-01T14:30:00Z").toISOString(),
    updatedAt: new Date("2025-06-02T09:15:00Z").toISOString(),
  },
  {
    id: "ord_002",
    customer: {
      id: "CUST-002",
      name: "Bob Smith",
      email: "bob.smith@example.com",
      phone: "555-987-6543",
    },
    items: [
      {
        id: "ITEM-002",
        product: {
          id: "PROD-PRINT-002",
          title: "Document Printing (B&W)",
          description: "Black & white document printing on A4",
          price: 0.10,
          imageUrl: "",
        },
        quantity: 30, // 30 pages
        price: 0.10,
      },
    ],
    printFiles: [
      {
        name: "my-report.pdf",
        url: "https://example.com/uploads/my-report.pdf",
        type: "pdf",
      },
    ],
    total: 3.00,
    status: "pending",
    shippingAddress: "456 Oak Ave, Metropolis, NY, 10001",
    createdAt: new Date("2025-06-05T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-06-05T10:00:00Z").toISOString(),
  },
  {
    id: "ord_003",
    customer: {
      id: "CUST-003",
      name: "Carol Lee",
      email: "carol.lee@example.com",
      phone: "555-321-4321",
    },
    items: [
      {
        id: "ITEM-003",
        product: {
          id: "PROD-PRINT-003",
          title: "Photocopy Service",
          description: "Standard black & white photocopies",
          price: 0.05,
          imageUrl: "",
        },
        quantity: 50,
        price: 0.05,
      },
    ],
    printFiles: [],
    total: 2.50,
    status: "in_progress",
    shippingAddress: "789 Elm St, Gotham, NJ, 07001",
    createdAt: new Date("2025-06-07T09:45:00Z").toISOString(),
    updatedAt: new Date("2025-06-07T10:15:00Z").toISOString(),
  },
  {
    id: "ord_004",
    customer: {
      id: "CUST-004",
      name: "Diana Moore",
      email: "diana.moore@example.com",
      phone: "555-222-3333",
    },
    items: [
      {
        id: "ITEM-004",
        product: {
          id: "PROD-PRINT-004",
          title: "Business Card Printing (Single-Sided)",
          description: "Premium matte single-sided cards",
          price: 0.40,
          imageUrl: "",
        },
        quantity: 50,
        price: 0.40,
      },
    ],
    printFiles: [
      {
        name: "card-front.png",
        url: "https://example.com/uploads/card-front.png",
        type: "image",
      },
    ],
    total: 20.00,
    status: "completed",
    shippingAddress: "321 Pine Rd, Star City, CA, 90001",
    createdAt: new Date("2025-06-06T13:00:00Z").toISOString(),
    updatedAt: new Date("2025-06-06T14:00:00Z").toISOString(),
  },
];
