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

  // Form state
  const [formData, setFormData] = useState<Partial<Service>>({});

  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${params.slug}`);
        if (!res.ok) throw new Error("Failed to fetch service");
        const data: Service = await res.json();
        setService(data);
        setFormData(data); // prefill form
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imageUrl: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) body.append(key, value as any);
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${service?.id}`, {
        method: "PUT",
        body,
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Service updated successfully!");
      router.push("/services"); // back to list
    } catch (err) {
      console.error(err);
      alert("Failed to update service");
    }
  };

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

      <h1 className="text-2xl font-bold mb-6">Update Service</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {service.imageUrl && typeof service.imageUrl === "string" && (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-48 h-48 object-cover rounded-lg shadow-lg mb-4"
          />
        )}

        <input
          type="file"
          name="imageUrl"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />

        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />

        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />

        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />

        <input
          type="number"
          name="discount"
          value={formData.discount || ""}
          onChange={handleChange}
          placeholder="Discount"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition"
        >
          Update Service
        </button>
      </form>
    </div>
  );
}
