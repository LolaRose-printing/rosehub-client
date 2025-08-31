"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoMdImage } from "react-icons/io";

// Schema for validation
const serviceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be at least $0.01"),
  discount: z.number().min(0, "Discount cannot be negative"),
});

type ServiceInputs = {
  title: string;
  description: string;
  price: number;
  discount: number;
};

// Service Details Card Component
const ServiceDetailsCard = ({ service }: { service: any }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold text-white mb-2">{service?.title}</h2>
    <p className="text-gray-400 mb-4">{service?.description}</p>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-300">Price: ${service?.price}</p>
        {service?.discount > 0 && (
          <p className="text-green-400">Discount: ${service?.discount}</p>
        )}
      </div>
      <span className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">
        {service?.category || "General"}
      </span>
    </div>
  </div>
);

// Update Service Form Component
const UpdateServiceForm = ({ service, onUpdate }: { service: any; onUpdate: () => void }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceInputs>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title || "",
      description: service?.description || "",
      price: service?.price || 0,
      discount: service?.discount || 0,
    },
  });

  useEffect(() => {
    if (service) {
      setValue("title", service.title);
      setValue("description", service.description);
      setValue("price", service.price);
      setValue("discount", service.discount);

      if (service.imageUrl) {
        setImagePreview(service.imageUrl);
      }
    }
  }, [service, setValue]);

  const onSubmit: SubmitHandler<ServiceInputs> = async (data) => {
    if (!user?.token) {
      setMessage({ type: "error", text: "You must be logged in to update the service" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services/${service.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      setMessage({ type: "success", text: "Service updated successfully!" });
      onUpdate(); // Refresh the service data
    } catch (error) {
      console.error("Update error:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Update failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Update Service</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Service Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700 border-gray-600 hover:bg-gray-600 transition">
              {imagePreview ? (
                <div
                  className="w-full h-full rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${imagePreview})` }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <IoMdImage className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Click to upload image</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Service Name *
          </label>
          <input
            type="text"
            {...register("title")}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Service Name"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Service Description"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Discount ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("discount", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="0.00"
            />
            {errors.discount && (
              <p className="text-red-400 text-sm mt-1">{errors.discount.message}</p>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded font-semibold disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </>
          ) : (
            "Update Service"
          )}
        </button>
      </form>
    </div>
  );
};

const ServiceDetailPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const [service, setService] = useState<any>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      setLoadingService(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Service not found");
          }
          throw new Error(`Failed to fetch service: ${res.status}`);
        }

        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        setLoadingService(false);
      }
    };

    fetchService();
  }, [slug]);

  const handleServiceUpdate = async () => {
    if (!slug) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${slug}`);
      const data = await res.json();
      setService(data);
    } catch (err) {
      console.error("Error refetching service:", err);
    }
  };

  if (isLoading || loadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-900 text-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={() => router.push("/services")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-md"
            >
              Back to Services
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!user || !service) return null;

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-white">{service.title}</h1>
          <p className="text-gray-400 text-lg">
            Manage your service details and configurations
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Selected Service Details */}
          <div className="xl:col-span-2">
            <ServiceDetailsCard service={service} />
          </div>

          {/* Update Service Form */}
          <UpdateServiceForm service={service} onUpdate={handleServiceUpdate} />
        </div>
      </div>
    </main>
  );
};

export default ServiceDetailPage;
