import { Header } from "@/components/Header";
import { OrderList } from "@/components/orders/OrderList";
import { Order } from "@/app/types";

const mockOrders: Order[] = [
  {
    id: "ord_001",
    customer: {
      id: "cust_001",
      name: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
    },
    items: [
      {
        id: "item_001",
        product: {
          id: "prod_001",
          title: "Custom T-Shirt",
          description: "Comfortable cotton T-Shirt",
          price: 19.99,
          imageUrl: "https://via.placeholder.com/150",
        },
        quantity: 2,
        price: 19.99,
      },
      {
        id: "item_002",
        product: {
          id: "prod_002",
          title: "Coffee Mug",
          description: "Ceramic mug with logo",
          price: 9.99,
          imageUrl: "",
        },
        quantity: 1,
        price: 9.99,
      },
    ],
    printFiles: [
      {
        name: "design1.png",
        url: "https://via.placeholder.com/300",
        type: "image",
      },
      {
        name: "specs.pdf",
        url: "https://example.com/specs.pdf",
        type: "pdf",
      },
    ],
    total: 49.97,
    status: "completed",
    shippingAddress: "123 Main St, Springfield, USA",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // add more mock orders here if you want
];

export default function OrdersPage() {
  const orders = mockOrders;

  return (
    <main>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Orders</h1>
            <div className="text-sm text-gray-400">
              {orders.length} {orders.length === 1 ? "order" : "orders"} found
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium text-gray-300">No orders found</h2>
              <p className="mt-2 text-gray-500">Your orders will appear here</p>
            </div>
          ) : (
            <OrderList orders={orders} />
          )}
        </div>
      </div>
    </main>
  );
}
