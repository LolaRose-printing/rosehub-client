"use client";

import { NextPage } from "next";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

// Example placeholder components (replace with your actual components)
const ServiceDetailsCard = ({ service }: { service: any }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-white mb-2">{service?.name}</h2>
    <p className="text-gray-400 mb-4">{service?.description}</p>
    <p className="text-gray-300">Price: ${service?.price}</p>
  </div>
);

const UpdateServiceForm = ({ service }: { service: any }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 className="text-xl font-bold text-white mb-4">Update Service</h3>
    {/* Replace with your actual form */}
    <form className="flex flex-col gap-4">
      <input
        type="text"
        defaultValue={service?.name}
        placeholder="Service Name"
        className="p-2 rounded bg-gray-700 text-white"
      />
      <textarea
        defaultValue={service?.description}
        placeholder="Service Description"
        className="p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="number"
        defaultValue={service?.price}
        placeholder="Price"
        className="p-2 rounded bg-gray-700 text-white"
      />
      <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded font-semibold">
        Update
      </button>
    </form>
  </div>
);

const ServiceDetailPage: NextPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState<any>(null);
  const [loadingService, setLoadingService] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/auth";
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      setLoadingService(true);
      try {
        const res = await fetch(`/api/services/${slug}`);
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingService(false);
      }
    };

    fetchService();
  }, [slug]);

  if (isLoading || loadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !service) return null;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">{service.name}</h1>
          <p className="text-gray-400 text-lg">Manage your service details and configurations</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Selected Service Details */}
          <div className="xl:col-span-2">
            <ServiceDetailsCard service={service} />
          </div>

          {/* Update Service Form */}
          <UpdateServiceForm service={service} />
        </div>
      </div>
    </main>
  );
};

export default ServiceDetailPage;
