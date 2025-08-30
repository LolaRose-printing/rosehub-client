"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { CreateServiceForm } from "@/components/CreateServiceForm"; // reuse form
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  width?: number;
  height?: number;
};

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // fetch the service details
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`);
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error("Failed to load service", err);
      }
    }
    if (id) fetchService();
  }, [id]);

  if (!service) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      {!isEditing ? (
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {service.imageUrl && (
              <div className="mb-4">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  width={400}
                  height={300}
                  className="rounded-lg shadow"
                />
              </div>
            )}
            <p className="text-gray-700 mb-2">{service.description}</p>
            <p className="text-lg font-semibold mb-2">
              ${service.price.toFixed(2)}
            </p>
            {service.width && service.height && (
              <p className="text-sm text-gray-500">
                Dimensions: {service.width} × {service.height}
              </p>
            )}
            <Button className="mt-4" onClick={() => setIsEditing(true)}>
              Update Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Update Service</h2>
          <CreateServiceForm
            service={service} // pass existing data for editing
            onSuccess={(updated) => {
              setService(updated);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}
    </div>
  );
}
