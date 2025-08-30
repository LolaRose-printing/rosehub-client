"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Service } from "@/types/service";

const ServicePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`)
      .then(res => res.json())
      .then(data => setService(data))
      .catch(console.error);
  }, [slug]);

  if (!service) return <p>Loading service...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-white">{service.title}</h1>
      <p className="mt-2 text-gray-300">{service.description}</p>
      <p className="mt-2 font-semibold text-white">Price: ${service.price / 100}</p>
    </div>
  );
};

export default ServicePage;
