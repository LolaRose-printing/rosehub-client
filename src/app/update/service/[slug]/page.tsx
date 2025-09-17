"use client"; // if you use client components inside

import UpdateServiceForm from "../../UpdateServiceForm";
import React from "react";

// Define the service shape based on your API response
interface PrintConfigurationItem {
  name: string;
  additionalPrice: number;
}

interface PrintConfiguration {
  title: string;
  items: PrintConfigurationItem[];
}

interface PrintDimension {
  width: number;
  height: number;
  unit: "px" | "in" | "cm";
}

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  hasFrontBack: boolean;
  category: "brochure" | "booklet" | "other";
  dimensions: PrintDimension;
  configurations: PrintConfiguration[];
  image?: string;
  // add any other fields your API returns
}

// Fetch service from your API
async function fetchService(slug: string): Promise<Service> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch service");
  return res.json();
}

// Properly type page props for dynamic route
interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = params;

  let service: Service | null = null;

  try {
    service = await fetchService(slug);
  } catch (err) {
    console.error("[ServicePage] Error fetching service:", err);
    return (
      <div className="p-4 max-w-2xl mx-auto text-red-500 font-medium">
        Error loading service. Please try again later.
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-4 max-w-2xl mx-auto text-gray-300 font-medium">
        Service not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 text-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Service: {service.title}</h1>
      <UpdateServiceForm service={service} slug={slug} />
    </div>
  );
}
