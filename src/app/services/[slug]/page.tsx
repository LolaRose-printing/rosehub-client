"use client";

import { useState, useReducer, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoMdAdd, IoMdRemove, IoMdImage } from "react-icons/io";

type PrintDimension = {
  width: number;
  height: number;
  unit: 'px' | 'in' | 'cm';
};

type PrintConfigurationItem = {
  name: string;
  additionalPrice: number;
};

type PrintConfiguration = {
  title: string;
  items: PrintConfigurationItem[];
};

type ServiceInputs = {
  title: string;
  description: string;
  price: number;
  discount: number;
  image?: FileList;
  dimensions: PrintDimension;
  hasFrontBack: boolean;
  configurations: PrintConfiguration[];
  category: 'brochure' | 'booklet' | 'other';
  response?: string;
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const dimensionSchema = z.object({
  width: z.number().min(1, "Width must be at least 1"),
  height: z.number().min(1, "Height must be at least 1"),
  unit: z.enum(['px', 'in', 'cm'])
});

const configurationItemSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  additionalPrice: z.number().min(0, "Price cannot be negative").default(0)
});

const configurationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  items: z.array(configurationItemSchema).min(1, "At least one item is required")
});

const serviceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be at least $0.01"),
  discount: z.number().min(0, "Discount cannot be negative"),
  image: z
    .any()
    .optional()
    .refine(file => !file || file?.length === 1, "Image is required")
    .refine(file => !file || file?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 15MB")
    .refine(
      file => !file || ALLOWED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only JPG, JPEG, PNG and WEBP formats are allowed"
    ),
  dimensions: dimensionSchema,
  hasFrontBack: z.boolean(),
  configurations: z.array(configurationSchema).min(1, "At least one configuration is required"),
  category: z.enum(['brochure', 'booklet', 'other']).default('other')
});

enum ConfigActionType {
  ADD_CONFIG,
  REMOVE_CONFIG,
  ADD_ITEM,
  REMOVE_ITEM,
  LOAD_TEMPLATE_CONFIGS,
  UPDATE_TITLE,
  UPDATE_ITEM_NAME,
  UPDATE_ITEM_PRICE,
}

type ConfigAction =
  | { type: ConfigActionType.ADD_CONFIG }
  | { type: ConfigActionType.REMOVE_CONFIG; payload: number }
  | { type: ConfigActionType.ADD_ITEM; payload: { configId: number; item: PrintConfigurationItem } }
  | { type: ConfigActionType.REMOVE_ITEM; payload: { configId: number; itemIdx: number } }
  | { type: ConfigActionType.UPDATE_TITLE; payload: { configId: number; title: string } }
  | { type: ConfigActionType.UPDATE_ITEM_NAME; payload: { configId: number; itemIdx: number; name: string } }
  | { type: ConfigActionType.UPDATE_ITEM_PRICE; payload: { configId: number; itemIdx: number; price: number } }
  | { type: ConfigActionType.LOAD_TEMPLATE_CONFIGS; payload: PrintConfiguration[] };

function configReducer(state: PrintConfiguration[], action: ConfigAction): PrintConfiguration[] {
  switch (action.type) {
    case ConfigActionType.ADD_CONFIG:
      return [...state, { title: "New Option Group", items: [{ name: "New Option", additionalPrice: 0 }] }];
    case ConfigActionType.REMOVE_CONFIG:
      return state.filter((_, idx) => idx !== action.payload);
    case ConfigActionType.ADD_ITEM:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? { ...config, items: [...config.items, action.payload.item] }
          : config
      );
    case ConfigActionType.REMOVE_ITEM:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? { ...config, items: config.items.filter((_, i) => i !== action.payload.itemIdx) }
          : config
      );
    case ConfigActionType.UPDATE_TITLE:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? { ...config, title: action.payload.title }
          : config
      );
    case ConfigActionType.UPDATE_ITEM_NAME:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? {
            ...config,
            items: config.items.map((item, i) =>
              i === action.payload.itemIdx
                ? { ...item, name: action.payload.name }
                : item
            )
          }
          : config
      );
    case ConfigActionType.UPDATE_ITEM_PRICE:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? {
            ...config,
            items: config.items.map((item, i) =>
              i === action.payload.itemIdx
                ? { ...item, additionalPrice: action.payload.price }
                : item
            )
          }
          : config
      );
    case ConfigActionType.LOAD_TEMPLATE_CONFIGS:
      return action.payload;
    default:
      return state;
  }
}

export default function UpdateServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id"); // Pass ?id=<serviceId> in the URL

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [configs, dispatch] = useReducer(configReducer, [{ title: "Default Options", items: [{ name: "Standard", additionalPrice: 0 }] }]);
  const [loading, setLoading] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    trigger
  } = useForm<ServiceInputs>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discount: 0,
      dimensions: { width: 0, height: 0, unit: 'px' },
      hasFrontBack: false,
      configurations: configs,
      category: 'other'
    }
  });

  // Load existing service for update
  useEffect(() => {
    if (!serviceId) return;

    const fetchService = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}`);
        if (!res.ok) throw new Error("Failed to fetch service data");
        const service = await res.json();

        setValue("title", service.title);
        setValue("description", service.description);
        setValue("price", service.price);
        setValue("discount", service.discount);
        setValue("category", service.category);
        setValue("hasFrontBack", service.hasFrontBack);
        setValue("dimensions", service.dimensions);
        dispatch({ type: ConfigActionType.LOAD_TEMPLATE_CONFIGS, payload: service.configurations });

        if (service.imageUrl) setImagePreview(service.imageUrl);
      } catch (err) {
        console.error(err);
      }
    };

    fetchService();
  }, [serviceId, setValue]);

  useEffect(() => {
    setValue("configurations", configs);
  }, [configs, setValue]);

  const watchDimensions = watch("dimensions");
  const watchImage = watch("image");

  useEffect(() => {
    if (watchImage?.[0]) {
      const file = watchImage[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          setImagePreview(img.src);
          if (previewCanvasRef.current && watchDimensions.width > 0 && watchDimensions.height > 0) {
            const canvas = previewCanvasRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = 300;
            canvas.height = 300;

            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              const scaleX = canvas.width / watchDimensions.width;
              const scaleY = canvas.height / watchDimensions.height;
              const scale = Math.min(scaleX, scaleY);

              const newWidth = watchDimensions.width * scale;
              const newHeight = watchDimensions.height * scale;

              const offsetX = (canvas.width - newWidth) / 2;
              const offsetY = (canvas.height - newHeight) / 2;

              ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

              ctx.strokeStyle = '#f87171';
              ctx.lineWidth = 2;
              ctx.setLineDash([5, 5]);
              ctx.strokeRect(offsetX, offsetY, newWidth, newHeight);
              ctx.setLineDash([]);

              ctx.fillStyle = '#f87171';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(
                `${watchDimensions.width}×${watchDimensions.height}${watchDimensions.unit}`,
                canvas.width / 2,
                offsetY + newHeight + 20
              );
            }
          }
        };
      };

      reader.readAsDataURL(file);
    }
  }, [watchImage, watchDimensions]);

  const onSubmit: SubmitHandler<ServiceInputs> = async (data) => {
    if (!serviceId) return;

    setLoading(true);
    try {
      const tokenRes = await fetch("/auth/access-token");
      if (!tokenRes.ok) throw new Error("Failed to get access token");
      const { access_token } = await tokenRes.json();

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("discount", data.discount.toString());
      formData.append("category", data.category);
      formData.append("hasFrontBack", data.hasFrontBack.toString());
      formData.append("dimensions", JSON.stringify(data.dimensions));

      if (data.image?.[0]) formData.append("thumbnail", data.image[0]);

      formData.append("configurations", JSON.stringify(data.configurations));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/update/${serviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Update failed");
      }

      router.push("/services");
    } catch (error) {
      console.error("[DEBUG] Update error:", error);
      setError("response", {
        type: "manual",
        message: error instanceof Error ? error.message : "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-8">{serviceId ? "Update Service" : "Create New Service"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Include all fields from your original form here --- */}
        {/* For brevity, you can reuse the same JSX as your CreateServicePage */}
        {/* Just keep the same watch, register, configs, image preview logic */}
      </form>
    </div>
  );
}
