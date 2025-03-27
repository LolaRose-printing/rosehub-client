import { FC } from "react";
import Image from "next/image";
import { Service } from "@/types/service";

type Props = {
  services: Service[];
};

export const ListServices: FC<Readonly<Props>> = ({ services }: Readonly<Props>) => {

  return (
    <div className="mt-6">
      {services.length
        ? <div className="relative flex flex-col w-full h-full text-gray-700 bg-white dark:text-white dark:bg-[#101010] shadow-md rounded-2xl bg-clip-border"><table className="w-full text-sm text-gray-500 dark:text-white table-none md:table-fixed rounded-2xl">
        <thead>
        <tr className="border-b border-gray-900 bg-slate-50 dark:bg-[#101010] rounded-full">
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Product</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Id</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Title</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Price per Item</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Discount</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Creation</th>
            <th className="p-4 text-sm font-normal leading-none text-slate-500 dark:text-white">Options</th>
        </tr>
        </thead>
        <tbody>
        {services.map(service => {
          const createdAt = new Date(service.created_at);
          const formatDate = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;

          return (
            <tr className="hover:bg-slate-50 dark:hover:bg-gray-900" key={service.id}>
            <td className="p-4 border-b border-gray-900 py-5">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/${service.image.split("/")[1]}`}
                alt="Product 1"
                width={350}
                height={350}
                className="w-16 h-16 object-cover rounded"
              />
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="block font-semibold text-sm text-slate-800 dark:text-white">{service.id}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="text-sm text-slate-500 dark:text-white">{service.title}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="text-sm text-slate-500 dark:text-white">${service.price}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="text-sm text-slate-500 dark:text-white">${service.discount}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <p className="text-sm text-slate-500 dark:text-white">{formatDate}</p>
            </td>
            <td className="p-4 border-b border-gray-900 py-5">
            <button type="button" className="text-slate-500 hover:text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            </td>
        </tr>
          );
        })}
        </tbody>
      </table></div>
        : <p className="font-light text-gray-400">There is not services so far.</p>
      }
    </div>
  );
}
