"use client";

import { NextPage } from "next";
import { Header } from "@/components/Header";
import { ServicesList } from "@/components/ServicesList";
import { CreateServiceForm } from "@/components/CreateServiceForm";
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const Page: NextPage = () => {
  const { user, isLoading } = useAuth();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/auth';
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a202c]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#612ad5] mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <main>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">RoseHub Services</h1>
          <p className="text-gray-300">Manage your print services and create new ones</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <ServicesList />
          </div>
          <div>
            <CreateServiceForm />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;