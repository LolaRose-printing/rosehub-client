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

// Notice: no custom PageProps interface
export default async function ServicePage({ params }: { params: { slug: string } }): Promise<JSX.Element> {
  const { slug } = params;

  let service: Service | null = null;

  try {
    service = await fetchService(slug);
  } catch (err) {
    console.error("[ServicePage] Error fetching service:", err);
    return <div className="p-4 text-red-500">Error loading service.</div>;
  }

  if (!service) {
    return <div className="p-4 text-gray-400">Service not found.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Service: {service.title}</h1>
      <UpdateServiceForm service={service} slug={slug} />
    </div>
  );
}
