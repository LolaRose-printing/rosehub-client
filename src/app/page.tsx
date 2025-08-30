"use client";

import { NextPage } from "next";
import { Header } from "@/components/Header";
import { ServicesList } from "@/components/ServicesList";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Page: NextPage = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/auth";
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">RoseHub Services</h1>
          <p className="text-gray-400 text-lg">Manage your print services and create new ones</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Services List Card */}
          <div className="xl:col-span-2 bg-gray-800 rounded-lg shadow-lg p-6">
            <ServicesList />
          </div>

          {/* Create/Update Service Form Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <CreateServiceForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
