import { FC } from "react";
import Image from "next/image";
import { Configuration, Service } from "@/types/service";

type Props = {
  services: Service[];
};

export const ListServices: FC<Readonly<Props>> = ({ services }: Readonly<Props>) => {
  return (
    <div className="mt-12">
      {services.length
        ?       <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
          <table className="w-full table-auto text-justify">
        <thead>
            <tr className="bg-gray-100">
                <th className="py-4 px-12 text-left text-gray-600 font-bold uppercase">Id</th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Product</th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Title</th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Price</th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Discount</th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Creation</th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Options</th>
            </tr>
        </thead>
        <tbody className="bg-gray-800">
          {services.map(service => {
            const createdAt = new Date(service.createdAt);
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
              <tr key={service.id} className="hover:bg-gray-700">
                <td className="py-4 px-12 border-b border-gray-200">{service.id}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${service.thumbnail.split("/")[1]}`}
                    alt="thumbnail"
                    width={350}
                    height={350}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="py-4 px-6 border-b border-gray-200 truncate">{service.title}</td>
                <td className="py-4 px-6 border-b border-gray-200">${+service.price / 100}</td>
                <td className="py-4 px-6 border-b border-gray-200">${+service.discount / 100}</td>
                <td className="py-4 px-6 border-b border-gray-200">{formatDate}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {service.configurations.map((configuration: Configuration, i: number) => {
                    return (
                      <span
                        key={i}
                        id="badge-dismiss-default"
                        className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300"
                      >
                        {configuration.title}
                      </span>
                    );
                  })}
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
