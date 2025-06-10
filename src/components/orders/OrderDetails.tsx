"use client";

import { useState } from "react";
import { Order } from "@/types";
import JSZip from "jszip";

import { saveAs } from "file-saver";

type OrderDetailsProps = {
  order: Order;
};

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const downloadAllFiles = async () => {
    const zip = new JSZip();
    const folder = zip.folder(`Order-${order.id}`);

    for (const file of order.printFiles) {
      const response = await fetch(file.url);
      const blob = await response.blob();
      folder?.file(file.name, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `Order-${order.id}-Files.zip`);
  };

  const updateStatus = async () => {
    try {
      setUpdating(true);
      await fetch(`/api/orders/${order.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      alert("Status updated!");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Order ID</h3>
              <p className="text-lg">{order.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Date</h3>
              <p className="text-lg">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Status</h3>
              <div className="flex items-center gap-4">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>
                <button
                  onClick={updateStatus}
                  disabled={updating}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Total</h3>
              <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Name</h3>
              <p className="text-lg">{order.customer.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Email</h3>
              <p className="text-lg">{order.customer.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Phone</h3>
              <p className="text-lg">{order.customer.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Shipping Address</h3>
              <p className="text-lg">{order.shippingAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Print Services Ordered</h2>
        <div className="space-y-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-6 p-4 bg-gray-800 rounded-lg">
              <div className="flex-shrink-0">
                {item.product.imageUrl ? (
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.title} 
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="bg-gray-700 border-2 border-dashed rounded-xl w-32 h-32 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold">{item.product.title}</h3>
                <p className="text-gray-300">{item.product.description}</p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Quantity</p>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <p className="text-lg font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {order.printFiles.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Uploaded Print Files</h2>
            <button
              onClick={downloadAllFiles}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.printFiles.map((file, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{file.name}</h3>
                  <span className="text-sm text-gray-400">
                    {file.type.toUpperCase()}
                  </span>
                </div>
                <div className="aspect-video bg-gray-700 rounded flex items-center justify-center">
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt={`Print file ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">📄</div>
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:underline"
                      >
                        Download PDF
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
