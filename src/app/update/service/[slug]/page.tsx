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

// Function to convert the service data to the expected format
function convertServiceToFormData(service: Service) {
  return {
    ...service,
    dimensions: {
      ...service.dimensions,
      // Ensure unit is one of the expected values, default to "px" if not
      unit: (service.dimensions.unit === "in" || service.dimensions.unit === "cm" || service.dimensions.unit === "px") 
        ? service.dimensions.unit 
        : "px" as const
    }
  };
}

// Generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `Edit Service ${slug} - RoseHub`,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params promise
  const { slug } = await params;
  
  let service: Service | null = null;
  try {
    service = await fetchService(slug);
  } catch (err) {
    console.error("[ServicePage] Error fetching service:", err);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Service</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-yellow-50 rounded-lg">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">Service Not Found</h2>
          <p className="text-gray-600">The service you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Convert the service data to the expected format
  const formattedService = convertServiceToFormData(service);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Service: {service.title}</h1>
          <p className="text-gray-600">Update your print service details</p>
        </div>
        
        <UpdateServiceForm service={formattedService} />
      </div>
    </div>
  );
}