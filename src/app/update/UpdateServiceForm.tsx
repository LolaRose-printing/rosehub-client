"use client";

import { useState, useReducer, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoMdAdd, IoMdRemove, IoMdImage } from "react-icons/io";
import { useAuth } from "@/hooks/useAuth";

type PrintDimension = {
  width: number;
  height: number;
  unit: "px" | "in" | "cm";
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
  image?: FileList | null;
  dimensions: PrintDimension;
  hasFrontBack: boolean;
  configurations: PrintConfiguration[];
  category: "brochure" | "booklet" | "other";
  response?: string;
  existingImage?: string; // for existing service image
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const dimensionSchema = z.object({
  width: z.number().min(1, "Width must be at least 1"),
  height: z.number().min(1, "Height must be at least 1"),
  unit: z.enum(["px", "in", "cm"]),
});

const configurationItemSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  additionalPrice: z.number().min(0, "Price cannot be negative").default(0),
});

const configurationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  items: z.array(configurationItemSchema).min(1, "At least one item is required"),
});

const serviceSchema = z.object({
  title: z.string().min(1, "Service title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0.01, "Price must be at least $0.01"),
  discount: z.number().min(0, "Discount cannot be negative"),
  image: z
    .any()
    .optional()
    .refine((file: FileList | null) => !file || file.length <= 1, "Only one image is allowed")
    .refine(
      (file: FileList | null) => !file || !file[0] || file[0].size <= MAX_FILE_SIZE,
      "Max file size is 15MB"
    )
    .refine(
      (file: FileList | null) => !file || !file[0] || ALLOWED_IMAGE_TYPES.includes(file[0].type),
      "Only JPG, JPEG, PNG and WEBP formats are allowed"
    ),
  dimensions: dimensionSchema,
  hasFrontBack: z.boolean(),
  configurations: z.array(configurationSchema).min(1, "At least one configuration is required"),
  category: z.enum(["brochure", "booklet", "other"]).default("other"),
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
        idx === action.payload.configId ? { ...config, items: [...config.items, action.payload.item] } : config
      );
    case ConfigActionType.LOAD_TEMPLATE_CONFIGS:
      return action.payload;
    case ConfigActionType.REMOVE_ITEM:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? { ...config, items: config.items.filter((_, i) => i !== action.payload.itemIdx) }
          : config
      );
    case ConfigActionType.UPDATE_TITLE:
      return state.map((config, idx) => (idx === action.payload.configId ? { ...config, title: action.payload.title } : config));
    case ConfigActionType.UPDATE_ITEM_NAME:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? {
              ...config,
              items: config.items.map((item, i) => (i === action.payload.itemIdx ? { ...item, name: action.payload.name } : item)),
            }
          : config
      );
    case ConfigActionType.UPDATE_ITEM_PRICE:
      return state.map((config, idx) =>
        idx === action.payload.configId
          ? {
              ...config,
              items: config.items.map((item, i) =>
                i === action.payload.itemIdx ? { ...item, additionalPrice: action.payload.price } : item
              ),
            }
          : config
      );
    default:
      return state;
  }
}

export default function UpdateServicePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const serviceId = params.slug; // slug used to fetch service
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [configs, dispatch] = useReducer(configReducer, [
    { title: "Default Options", items: [{ name: "Standard", additionalPrice: 0 }] },
  ]);
  const [loading, setLoading] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
    trigger,
  } = useForm<ServiceInputs>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discount: 0,
      dimensions: { width: 0, height: 0, unit: "px" },
      hasFrontBack: false,
      configurations: configs,
      category: "other",
      existingImage: null,
    },
  });

  // Load existing service
  useEffect(() => {
    async function fetchService() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${serviceId}`);
        if (!res.ok) throw new Error("Failed to fetch service");
        const data = await res.json();

        setValue("title", data.title);
        setValue("description", data.description);
        setValue("price", data.price);
        setValue("discount", data.discount);
        setValue("category", data.category);
        setValue("hasFrontBack", data.hasFrontBack);
        setValue("dimensions", data.dimensions);
        dispatch({ type: ConfigActionType.LOAD_TEMPLATE_CONFIGS, payload: data.configurations });
        if (data.imageUrl) setImagePreview(data.imageUrl);
      } catch (err) {
        console.error(err);
      }
    }
    fetchService();
  }, [serviceId, setValue]);

  // Sync configs with form
  useEffect(() => {
    setValue("configurations", configs);
  }, [configs, setValue]);

  const watchDimensions = watch("dimensions");
  const watchImage = watch("image");

  // Image preview logic
  useEffect(() => {
    if (watchImage?.[0]) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => setImagePreview(img.src);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const ensureLogin = async () => {
    if (!user) {
      window.location.href = `/api/auth/login?returnTo=${encodeURIComponent(window.location.href)}`;
      return false;
    }
    return true;
  };

  const onSubmit: SubmitHandler<ServiceInputs> = async (data) => {
    setLoading(true);
    try {
      const ok = await ensureLogin();
      if (!ok) return;

      const tokenRes = await fetch("/api/auth/access-token", { credentials: "include" });
      if (!tokenRes.ok) throw new Error("Failed to retrieve token");
      const { accessToken } = await tokenRes.json();
      if (!accessToken) throw new Error("No auth token");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("discount", data.discount.toString());
      formData.append("dimensions", JSON.stringify(data.dimensions));
      formData.append("hasFrontBack", data.hasFrontBack.toString());
      formData.append("configurations", JSON.stringify(data.configurations));
      formData.append("category", data.category);
      if (data.image?.[0]) formData.append("image", data.image[0]);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/update/${serviceId}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Failed to update service");
      }

      router.push("/services"); // redirect after update
    } catch (err: any) {
      console.error(err);
      setError("response", { message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Service</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-semibold">Title</label>
          <input {...register("title")} className="border p-2 w-full" />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea {...register("description")} className="border p-2 w-full" />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block font-semibold">Price</label>
            <input type="number" step="0.01" {...register("price", { valueAsNumber: true })} className="border p-2" />
            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block font-semibold">Discount</label>
            <input type="number" step="0.01" {...register("discount", { valueAsNumber: true })} className="border p-2" />
            {errors.discount && <p className="text-red-500">{errors.discount.message}</p>}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Category</label>
          <select {...register("category")} className="border p-2 w-full">
            <option value="brochure">Brochure</option>
            <option value="booklet">Booklet</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Has Front/Back</label>
          <input type="checkbox" {...register("hasFrontBack")} />
        </div>

        <div className="flex gap-4">
          <div>
            <label>Width</label>
            <input type="number" {...register("dimensions.width", { valueAsNumber: true })} className="border p-2" />
          </div>
          <div>
            <label>Height</label>
            <input type="number" {...register("dimensions.height", { valueAsNumber: true })} className="border p-2" />
          </div>
          <div>
            <label>Unit</label>
            <select {...register("dimensions.unit")} className="border p-2">
              <option value="px">px</option>
              <option value="in">in</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold">Image</label>
          <input type="file" accept="image/*" {...register("image")} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 max-h-40" />}
        </div>

        {/* Configurations */}
        <div>
          <h2 className="font-semibold mb-2">Configurations</h2>
          {configs.map((config, idx) => (
            <div key={idx} className="border p-2 mb-2">
              <div className="flex justify-between items-center mb-2">
                <input
                  value={config.title}
                  onChange={(e) => dispatch({ type: ConfigActionType.UPDATE_TITLE, payload: { configId: idx, title: e.target.value } })}
                  className="border p-1 flex-1 mr-2"
                />
                <button type="button" onClick={() => dispatch({ type: ConfigActionType.REMOVE_CONFIG, payload: idx })}>
                  <IoMdRemove />
                </button>
              </div>
              {config.items.map((item, i) => (
                <div key={i} className="flex gap-2 mb-1">
                  <input
                    value={item.name}
                    onChange={(e) =>
                      dispatch({
                        type: ConfigActionType.UPDATE_ITEM_NAME,
                        payload: { configId: idx, itemIdx: i, name: e.target.value },
                      })
                    }
                    className="border p-1 flex-1"
                  />
                  <input
                    type="number"
                    value={item.additionalPrice}
                    onChange={(e) =>
                      dispatch({
                        type: ConfigActionType.UPDATE_ITEM_PRICE,
                        payload: { configId: idx, itemIdx: i, price: Number(e.target.value) },
                      })
                    }
                    className="border p-1 w-24"
                  />
                  <button
                    type="button"
                    onClick={() => dispatch({ type: ConfigActionType.REMOVE_ITEM, payload: { configId: idx, itemIdx: i } })}
                  >
                    <IoMdRemove />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: ConfigActionType.ADD_ITEM,
                    payload: { configId: idx, item: { name: "New Option", additionalPrice: 0 } },
                  })
                }
                className="flex items-center gap-1 text-sm text-blue-600 mt-1"
              >
                <IoMdAdd /> Add Option
              </button>
            </div>
          ))}
          <button type="button" onClick={() => dispatch({ type: ConfigActionType.ADD_CONFIG })} className="flex items-center gap-1 text-blue-600">
            <IoMdAdd /> Add Option Group
          </button>
        </div>

        {errors.response && <p className="text-red-500">{errors.response.message}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2" disabled={loading}>
          {loading ? "Updating..." : "Update Service"}
        </button>
      </form>
    </div>
  );
}
