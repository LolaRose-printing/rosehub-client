'use client';

import { getCookie } from 'cookies-next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  frontImageFilePath?: string | null;
  backImageFilePath?: string | null;
  service?: {
    title?: string;
    description?: string;
  };
}

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
  paymentDate?: string | null;
  paymentMethod?: string | null;
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

interface Props {
  order: Order;
}

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : '—';

const OrderDetails: React.FC<Props> = ({ order }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete order #${order.id}?`)) return;

    setLoading(true);
    try {
      const token = getCookie("auth");
      const headers = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      });
      const requestInit: RequestInit = {
        headers,
        cache: "no-store",
        method: "delete",
        mode: "cors",
      };
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${order.id}`);
      const request = new Request(url, requestInit);
      const res = await fetch(request);

      if (!res.ok) throw new Error('Failed to delete order');

      router.push('/orders');
    } catch (err) {
      alert('Error deleting order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">

      <div className="flex justify-between items-start">
        <Link
          href="/orders"
          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          ← Back to orders
        </Link>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete Order'}
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.id}</h1>

      {/* Customer Info */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white">Customer</h2>
          <p>{order.customerName}</p>
          <p>{order.customerEmail}</p>
          <p>{order.customerPhone}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white">Shipping Address</h2>
          <p>
            {[order.shippingAddress.line1, order.shippingAddress.line2, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode, order.shippingAddress.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 dark:text-white">Order Info</h2>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Created:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Paid:</strong> {formatDate(order.paymentDate)}</p>
          <p>
            <strong>Total:</strong>{' '}
            {`$${(
              order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) / 100
            ).toFixed(2)}`}
          </p>

        </div>

        {order.note && (
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white">Note</h2>
            <p>{order.note}</p>
          </div>
        )}
      </section>

      {/* Items */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Items</h2>
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded overflow-hidden bg-white dark:bg-gray-700 border">
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
              <div>
                <p className="text-md font-medium text-gray-800 dark:text-white">
                  {item.name || item.service?.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Qty: {item.quantity} • ${(item.price / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Customer Files */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {item.frontImageFilePath && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Front Image
                  </h3>
                  <div className="relative w-full h-56 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={`http://localhost:5001/${item.frontImageFilePath}`}
                      alt="Front Image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {item.backImageFilePath && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Back Image
                  </h3>
                  <div className="relative w-full h-56 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={`http://localhost:5001/${item.backImageFilePath}`}
                      alt="Back Image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default OrderDetails;
