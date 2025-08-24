"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { getCookie } from "cookies-next";

type QuickServiceInputs = {
  title: string;
  description: string;
  price: number;
  category: 'brochure' | 'booklet' | 'other';
  response?: string;
};

const quickServiceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be at least $0.01"),
  category: z.enum(['brochure', 'booklet', 'other']).default('other'),
  response: z.string().optional(),
});

export const CreateServiceForm = () => {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<QuickServiceInputs>({
    resolver: zodResolver(quickServiceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: 'other'
    }
  });

  const onSubmit: SubmitHandler<QuickServiceInputs> = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Basic fields for quick service creation
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("discount", "0");
      formData.append("category", data.category);
      formData.append("hasFrontBack", "false");
      
      // Default dimensions
      formData.append("dimensions[width]", "1050");
      formData.append("dimensions[height]", "600");
      formData.append("dimensions[unit]", "px");
      
      // Default configuration
      formData.append("configurations", JSON.stringify([
        {
          title: "Standard Options",
          items: [
            { name: "Standard", additionalPrice: 0 }
          ]
        }
      ]));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/create`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${getCookie("auth")}` 
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create service");
      }

      // Reset form on success
      reset();
      
      // Trigger a page refresh to update services list
      window.location.reload();
      
    } catch (error) {
      console.error("Service creation error:", error);
      setError("response", {
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to create service"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Quick Create Service</h2>
        <Link
          href="/create/service"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          Advanced Create
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Service Title *
          </label>
          <input
            {...register("title")}
            className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#612ad5] focus:border-transparent"
            placeholder="e.g., Business Cards"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#612ad5] focus:border-transparent"
            placeholder="Describe your service..."
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Base Price ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#612ad5] focus:border-transparent"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            {...register("category")}
            className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#612ad5] focus:border-transparent"
          >
            <option value="other">Other</option>
            <option value="brochure">Brochure</option>
            <option value="booklet">Booklet</option>
          </select>
          {errors.category && (
            <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#612ad5] hover:bg-[#612ad5ed] text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : "Create Service"}
          </button>
        </div>

        {errors.response && (
          <p className="text-red-400 text-sm text-center">{errors.response.message}</p>
        )}
      </form>

      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-sm font-medium text-white mb-2">Quick Create Info</h3>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Uses default dimensions (1050×600px)</li>
          <li>• No image upload (can be added later)</li>
          <li>• Basic configuration options</li>
          <li>• Single-sided printing</li>
        </ul>
        <p className="text-xs text-blue-400 mt-2">
          Use <Link href="/create/service" className="underline">Advanced Create</Link> for full customization
        </p>
      </div>
    </div>
  );
};