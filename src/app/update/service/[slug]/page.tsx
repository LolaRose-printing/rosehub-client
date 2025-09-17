import UpdateServiceForm from "../../UpdateServiceForm";
import React from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  hasFrontBack: boolean;
  category: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  configurations: any[];
  imageUrl?: string;
}

// Fetch service from your API
async function fetchService(slug: string): Promise<Service> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch service");
  return res.json();
}

// Let Next.js infer props
export default async function ServicePage(props: any) {
  const slug = props.params?.slug;
  if (!slug) return <div className="p-4 text-red-500">No slug provided</div>;

  let service: Service | null = null;
  try {
    service = await fetchService(slug);
  } catch (err) {
    console.error("[ServicePage] Error fetching service:", err);
    return <div className="p-4 text-red-500">Error loading service.</div>;
  }

  if (!service) return <div className="p-4 text-gray-400">Service not found.</div>;

  // Pass the service data to UpdateServiceForm
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Service: {service.title}</h1>
      <UpdateServiceForm service={service} />
    </div>
  );
}