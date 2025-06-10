import { OrderDetails } from "@/components/orders/OrderDetails";
import { notFound } from "next/navigation";
import { Order } from "@/app/types";

// This could be replaced with a real fetch later
import { mockOrders } from "@/lib/mockOrders"; // ⬅️ Create this if needed

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = mockOrders.find((order: Order) => order.id === params.id);

  if (!order) return notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <OrderDetails order={order} />
    </main>
  );
}
