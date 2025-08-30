"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  imageUrl?: string;
  category: "brochure" | "booklet" | "other";
  configurations?: { title: string; items: { name: string; additionalPrice: number }[] }[];
};

type Props = { params: { slug: string } };

export default function ServiceDetailPage({ params }: Props) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${params.slug}`);
        if (!res.ok) throw new Error("Failed to fetch service");
        const data: Service = await res.json();
        setService(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
        <p>Service not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg my-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6"
      >
        <IoMdArrowBack size={20} /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {service.imageUrl && (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full md:w-1/3 h-64 object-cover rounded-lg shadow-lg"
          />
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
          <p className="text-gray-400 mb-4 capitalize">{service.category}</p>
          <p className="text-gray-300 mb-4">{service.description}</p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-800 p-4 rounded-lg min-w-[120px]">
              <p className="text-gray-400 text-sm">Price</p>
              <p className="text-white font-bold text-lg">${service.price.toFixed(2)}</p>
            </div>

            {service.discount && (
              <div className="bg-gray-800 p-4 rounded-lg min-w-[120px]">
                <p className="text-gray-400 text-sm">Discount</p>
                <p className="text-white font-bold text-lg">${service.discount.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configurations */}
      {service.configurations && service.configurations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Configurations</h2>
          <div className="space-y-4">
            {service.configurations.map((conf, idx) => (
              <div key={idx} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">{conf.title}</h3>
                <ul className="list-disc list-inside text-gray-300">
                  {conf.items.map((item, i) => (
                    <li key={i}>
                      {item.name} {item.additionalPrice > 0 && `(+$${item.additionalPrice.toFixed(2)})`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Button */}
      <div className="mt-8 flex justify-center">
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition">
          Order Now
        </button>
      </div>
    </div>
  );
}
