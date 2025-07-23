import { Header } from "@/components/Header";
import { getOrders } from "@/lib/fetcher";
import OrderList from "../../components/OrderList";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Orders</h1>
            <div className="text-sm text-gray-400">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
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
