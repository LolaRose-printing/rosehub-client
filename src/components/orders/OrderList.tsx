import Link from "next/link";
import { Order } from "@/app/types"; // ✅ Capitalized correctly

type OrderListProps = {
  orders: Order[];
};

export const OrderList = ({ orders }: OrderListProps) => {
  const statusStyles: Record<Order["status"], string> = {
    completed: "bg-green-900 text-green-300",
    pending: "bg-yellow-900 text-yellow-300",
    cancelled: "bg-red-900 text-red-300",
  };

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full divide-y divide-gray-700 text-sm">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left font-medium text-gray-300 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left font-medium text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left font-medium text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left font-medium text-gray-300 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left font-medium text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">{order.customer.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(order.total)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-indigo-400 hover:text-indigo-300 underline text-sm"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
