"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  imageUrl?: string;
  category: "brochure" | "booklet" | "other";
};

export default function ServiceDetailPage() {
  const { slug } = useParams(); // ✅ safer than destructuring props
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchService() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch service");
        const data: Service = await res.json();
        setService(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, String(value));
      }
    });
    if (file) body.append("image", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${service?.id}`, {
        method: "PUT",
        body,
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Service updated successfully!");
      router.push("/services");
    } catch (err) {
      console.error(err);
      alert("Failed to update service");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading service details...</div>;
  }

  if (!service) {
    return <div className="flex justify-center items-center min-h-screen">Service not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg my-12">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6"
      >
        <IoMdArrowBack size={20} /> Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Update Service</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {service.imageUrl && (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-48 h-48 object-cover rounded-lg shadow mb-4"
          />
        )}

        <Input type="file" accept="image/*" onChange={handleFileChange} />

        <Input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          placeholder="Title"
        />

        <Textarea
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Description"
        />

        <Input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={handleChange}
          placeholder="Price"
        />

        <Input
          type="number"
          name="discount"
          value={formData.discount || ""}
          onChange={handleChange}
          placeholder="Discount"
        />

        <Button type="submit" className="w-full">
          Update Service
        </Button>
      </form>
    </div>
  );
}
