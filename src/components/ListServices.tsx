"use client";

import { FC, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Service } from "@/types/service";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  services: Service[];
}

export const ListServices: FC<Readonly<Props>> = ({ services }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 5;

  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredServices.slice(start, start + perPage);
  }, [filteredServices, page]);

  const pageCount = Math.ceil(filteredServices.length / perPage);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="px-4 py-2 rounded-md border w-full
            bg-white text-gray-900 border-gray-300
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {paginated.length ? (
        <div
          className="overflow-x-auto rounded-2xl shadow-2xl border
          border-gray-300 bg-white
          dark:border-gray-700 dark:bg-gray-900"
        >
          <table className="w-full table-auto">
            <thead>
              <tr
                className="bg-gray-100 dark:bg-gray-800
                bg-gradient-to-r from-gray-100 to-gray-200
                dark:from-gray-800 dark:to-gray-900"
              >
                {[
                  "ID",
                  "Product",
                  "Title",
                  "Price",
                  "Discount",
                  "Creation",
                  "Configurations",
                  "Options",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-6 py-4 text-left text-xs font-bold tracking-widest
                    text-gray-700 dark:text-gray-300 uppercase"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.map((service, idx) => {
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

                  const thumbnail = service.thumbnail
                    ? `${process.env.NEXT_PUBLIC_API_URL}/${service.thumbnail.split("/")[1]}`
                    : null;

                  return (
                    <motion.tr
                      key={service.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`${idx % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-900"
                        } hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-900 dark:text-gray-100`}
                    >
                      <td className="px-6 py-4">{service.id}</td>
                      <td className="px-6 py-4">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt="thumbnail"
                            width={64}
                            height={64}
                            className="w-14 h-14 rounded-lg object-cover ring-1 ring-gray-300 dark:ring-gray-600"
                          />
                        ) : (
                          <span className="italic text-gray-500 dark:text-gray-400">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 truncate">{service.title}</td>
                      <td className="px-6 py-4 font-medium">
                        ${(service.price / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ${(service.discount / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate}
                      </td>
                      <td className="px-6 py-4">
                        {service.configurations?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {service.configurations.map((config, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded text-xs font-medium bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-300"
                              >
                                {config.title}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm italic text-gray-500 dark:text-gray-400">
                            No configurations
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-row gap-2">
                          <Link
                            href={`/update/service/${service.slug}`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-xs font-semibold shadow"
                          >
                            Update
                          </Link>
                          <Link
                            href={`/delete/service/${service.id}`}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs font-semibold shadow"
                          >
                            Delete
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-light text-gray-600 dark:text-gray-400 text-center mt-8">
          No services match your criteria.
        </p>
      )}

      {pageCount > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${page === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 text-gray-900 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
