import { FC } from "react";
import { Order, Selection } from "@/types/order";
import Image from "next/image";
import clsx from "clsx";

enum Status {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

type Props = {
  orders: Order[];
};

export const ListOrders: FC<Readonly<Props>> = ({ orders }: Readonly<Props>) => {
  return (
    <div>
      {orders.length
        ?
          <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
            <table className="w-full table-auto text-justify">
              <thead>
                <tr className="bg-gray-100">
                  <th className=" py-4 px-12 text-left text-gray-600 font-bold uppercase">Id</th>
                  <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">Quantity</th>
                  <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">Customer Email</th>
                  <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">Service</th>
                  <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">Status</th>
                  <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">Creation</th>
                  <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">Selection</th>
                  <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">Image</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
              {orders.map(order => {
                const createdAt = new Date(order.createdAt);
                const formatDate = new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }).format(createdAt);

                return (
                  <tr key={order.id} className="hover:bg-gray-700">
                    <td className=" py-4 px-12 border-b border-gray-200">{order.id}</td>
                    <td className=" py-4 px-6 border-b border-gray-200 truncate">{order.quantity}</td>
                    <td className=" py-4 px-6 border-b border-gray-200">{order.customerEmail}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{order.service.title}</td>
                    <td className=" py-4 px-6 border-b border-gray-200">
                      <span className={clsx(
                        "text-white py-1 px-2 rounded-full text-xs",
                        {
                          "bg-[#f39c12]": order.status === Status.PENDING,
                          "bg-[#2ecc71]": order.status === Status.COMPLETED,
                          "bg-[#e74c3c]": order.status === Status.CANCELLED,
                        },
                      )}>{order.status}</span>
                    </td>
                    <td className=" py-4 px-6 border-b border-gray-200">{formatDate}</td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {order.selection.map((selection: Selection, i: number) => {
                        return (
                          <span
                            key={i}
                            id="badge-dismiss-default"
                            className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
                          >
                            {selection.title}
                          </span>
                        );
                      })}
                    </td>
                    <td className=" py-4 px-6 border-b border-gray-200">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${order.image.split("/")[1]}`}
                        alt="image"
                        width={350}
                        height={350}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
       : <p className="font-light text-gray-400">There is not orders so far.</p>
      }
    </div>
  );
}
