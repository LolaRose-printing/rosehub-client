"use client";

import { useState, useEffect } from "react";
import { Service } from "@/types/service";
import { getServices } from "@/lib/client-fetcher";
import Link from "next/link";
import Image from "next/image";

export const ServicesList = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError("Failed to load services");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const refreshServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError("Failed to refresh services");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Services</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex space-x-4">
                  <div className="bg-gray-600 rounded-lg w-24 h-24"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-600 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-600 h-3 rounded w-1/2"></div>
                    <div className="bg-gray-600 h-3 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Services</h2>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={refreshServices}
            className="bg-[#612ad5] hover:bg-[#612ad5ed] text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Services ({services.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={refreshServices}
            className="text-gray-300 hover:text-white px-3 py-1 rounded"
          >
            Refresh
          </button>
          <Link
            href="/create/service"
            className="bg-[#612ad5] hover:bg-[#612ad5ed] text-white px-4 py-2 rounded-lg text-sm"
          >
            Create New Service
          </Link>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No services yet</h3>
          <p className="text-gray-400 mb-4">Get started by creating your first service</p>
          <Link
            href="/create/service"
            className="bg-[#612ad5] hover:bg-[#612ad5ed] text-white px-6 py-2 rounded-lg inline-block"
          >
            Create Your First Service
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
              <div className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-600 rounded-lg overflow-hidden">
                    {service.thumbnail && service.thumbnail.startsWith('http') ? (
                      <Image
                        src={service.thumbnail}
                        alt={service.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : service.thumbnail ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${service.thumbnail}`}
                        alt={service.title}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white truncate">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-400 capitalize">
                          {service.category}
                        </span>
                        {service.dimensions && (
                          <span className="text-sm text-gray-400">
                            {service.dimensions.width}×{service.dimensions.height}{service.dimensions.unit}
                          </span>
                        )}
                        {service.hasFrontBack && (
                          <span className="text-xs bg-blue-600 text-blue-100 px-2 py-1 rounded">
                            Double-sided
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right">
                        {service.discount > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            ${service.price.toFixed(2)}
                          </span>
                        )}
                        <div className="text-lg font-semibold text-white">
                          ${(service.price - service.discount).toFixed(2)}
                        </div>
                        {service.discount > 0 && (
                          <div className="text-xs text-green-400">
                            Save ${service.discount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-gray-400">
                      Created {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/update/service/${service.slug}`}
                        className="text-sm text-yellow-400 hover:text-yellow-300"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};