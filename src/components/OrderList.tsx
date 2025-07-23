"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  note: string;
  invoiceId: string;
  status: string;
  totalAmount: number | null;
  createdAt: string;
  shippingAddress: {
    line1: string;
    line2?: string | null;
    city?: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: OrderItem[];
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  service?: {
    title?: string;
  };
}

interface Props {
  orders: Order[];
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const OrderList: React.FC<Props> = ({ orders }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      return order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(search.toLowerCase());
    });
  }, [orders, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or email..."
          className="w-full p-2 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
        />
      </div>

      <AnimatePresence>
        {paginated.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {order.customerName || "Unnamed Customer"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{order.customerEmail}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerPhone}</p>
              </div>

              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-300"
                      : "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-300"
                      }`}
                  >
                    {order.status}
                  </span>
                </span>
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>{" "}
                  {formatDate(order.createdAt)}
                </span>
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>{" "}
                  {`$${(
                    order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) / 100
                  ).toFixed(2)}`}
                </span>

                <Link
                  href={`/orders/${order.id}`}
                  className="ml-auto px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Details
                </Link>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="font-medium text-gray-800 dark:text-gray-300">Shipping:</span>{" "}
              {[
                order.shippingAddress.line1,
                order.shippingAddress.line2,
                order.shippingAddress.city,
                order.shippingAddress.state,
                order.shippingAddress.postalCode,
                order.shippingAddress.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border border-gray-100 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <Image
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image.replace(/^\/?uploads\//, "")}`
                      }
                      alt={item.name || item.service?.title || "Item"}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.name || item.service?.title || "Unnamed Product"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity} • ${(item.price / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-md text-sm ${i + 1 === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;