// src/app/orders/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { Order } from "@/app/types";
import { mockOrders } from "@/lib/mockOrders";

export default function Page() {
  const params = useParams() as { id: string };
  const order = mockOrders.find((o: Order) => o.id === params.id);

  if (!order) {
    // you’ll need to handle “not found” on the client yourself,
    // e.g. render a 404 message or redirect
    return <p>Order not found</p>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <OrderDetails order={order} />
    </main>
  );
}

