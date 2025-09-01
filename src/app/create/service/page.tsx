"use client";

import { useState, useReducer, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getCookie } from "cookies-next";
import { IoMdAdd, IoMdRemove, IoMdImage } from "react-icons/io";
import { getAccessToken } from "@auth0/nextjs-auth0";

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
    .refine(file => file?.length === 1, "Image is required")
    .refine(file => file?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 15MB")
    .refine(
      file => ALLOWED_IMAGE_TYPES.includes(file?.[0]?.type),
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

    case ConfigActionType.LOAD_TEMPLATE_CONFIGS:
      return action.payload;


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

    default:
      return state;
  }
}

const PRINT_TEMPLATES = [
  {
    name: "Business Card",
    dimensions: { width: 1050, height: 600, unit: 'px' as const },
    hasFrontBack: true,
    category: 'other' as const,
    configurations: [
      {
        title: "Paper Type",
        items: [
          { name: "Matte", additionalPrice: 0 },
          { name: "Glossy", additionalPrice: 5.00 },
          { name: "Recycled", additionalPrice: 2.50 },
          { name: "Premium", additionalPrice: 10.00 }
        ]
      },
      {
        title: "Finish",
        items: [
          { name: "Rounded Corners", additionalPrice: 3.00 },
          { name: "Spot UV", additionalPrice: 8.00 },
          { name: "Foil Stamping", additionalPrice: 12.00 }
        ]
      }
    ]
  },
  {
    name: "Brochure",
    dimensions: { width: 1275, height: 1650, unit: 'px' as const },
    hasFrontBack: false,
    category: 'brochure' as const,
    configurations: [
      {
        title: "Paper Quality",
        items: [
          { name: "Standard", additionalPrice: 0 },
          { name: "Premium", additionalPrice: 15.00 },
          { name: "Glossy", additionalPrice: 10.00 }
        ]
      },
      {
        title: "Folding",
        items: [
          { name: "Half Fold", additionalPrice: 5.00 },
          { name: "Tri-Fold", additionalPrice: 7.00 },
          { name: "Z-Fold", additionalPrice: 8.00 },
          { name: "Gate Fold", additionalPrice: 9.00 }
        ]
      }
    ]
  },
  {
    name: "Booklet",
    dimensions: { width: 1800, height: 2400, unit: 'px' as const },
    hasFrontBack: false,
    category: 'booklet' as const,
    configurations: [
      {
        title: "Binding",
        items: [
          { name: "Saddle Stitch", additionalPrice: 0 },
          { name: "Perfect Binding", additionalPrice: 20.00 },
          { name: "Spiral Binding", additionalPrice: 15.00 }
        ]
      },
      {
        title: "Cover",
        items: [
          { name: "Soft Cover", additionalPrice: 0 },
          { name: "Hard Cover", additionalPrice: 25.00 }
        ]
      }
    ]
  }
];

export default function CreateServicePage() {
  const router = useRouter();
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
    } else {
      setImagePreview(null);
    }
  }, [watchImage, watchDimensions]);

  const applyTemplate = (template: typeof PRINT_TEMPLATES[number]) => {
    if (!template || !Array.isArray(template.configurations)) {
      console.error("Invalid template object:", template);
      return;
    }

    setValue("dimensions", template.dimensions);
    setValue("hasFrontBack", template.hasFrontBack);
    setValue("category", template.category);

    // Batch build of all configs
    const newConfigs: PrintConfiguration[] = template.configurations.map(config => ({
      title: config.title,
      items: [...config.items]
    }));

    dispatch({
      type: ConfigActionType.LOAD_TEMPLATE_CONFIGS,
      payload: newConfigs
    });

    trigger(); // validate new form state
  };


  const onSubmit: SubmitHandler<ServiceInputs> = async (data) => {
    setLoading(true);
    try {
      // 1️⃣ Get Auth0 access token for your API (client-side)
      const accessToken = await getAccessToken(); // just call, no destructure
  
      if (!accessToken) {
        throw new Error("Failed to get access token");
      }
  
      // 2️⃣ Build FormData for submission
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("discount", data.discount.toString());
      formData.append("category", data.category);
      formData.append("hasFrontBack", data.hasFrontBack.toString());
  
      // Send dimensions as JSON string
      formData.append(
        "dimensions",
        JSON.stringify({
          width: data.dimensions.width,
          height: data.dimensions.height,
          unit: data.dimensions.unit,
        })
      );
  
      // Validate and append image if present
      if (data.image?.[0]) {
        const file = data.image[0];
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          throw new Error("Only JPG, JPEG, PNG and WEBP formats are allowed");
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new Error("Max file size is 15MB");
        }
        formData.append("thumbnail", file);
      }
  
      // Send configurations as JSON string
      formData.append("configurations", JSON.stringify(data.configurations));
  
      // 3️⃣ Send request to your backend with proper Authorization
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Creation failed");
      }
  
      // ✅ Success: redirect to services page
      router.push("/services");
    } catch (error) {
      console.error("[DEBUG] Submission error:", error);
      setError("response", {
        type: "manual",
        message: error instanceof Error ? error.message : "Creation failed",
      });
    } finally {
      setLoading(false);
    }
  };
  



  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-8">Create New Print Service</h1>

      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Quick Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRINT_TEMPLATES.map((template, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyTemplate(template)}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-md transition"
            >
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-gray-300">
                {template.dimensions.width}×{template.dimensions.height}{template.dimensions.unit}
                {template.hasFrontBack ? " | Double-sided" : ""}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Service Title *
            </label>
            <input
              {...register("title")}
              className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g., Business Cards"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Describe your print service..."
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Base Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("discount", { valueAsNumber: true })}
              className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="0.00"
            />
            {errors.discount && <p className="text-red-400 text-sm mt-1">{errors.discount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="other">Other</option>
              <option value="brochure">Brochure</option>
              <option value="booklet">Booklet</option>
            </select>
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("hasFrontBack")}
                className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium">Double-sided printing</span>
            </label>
          </div>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Print Dimensions *</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Width</label>
              <input
                type="number"
                min="1"
                {...register("dimensions.width", { valueAsNumber: true })}
                className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g., 1050"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Height</label>
              <input
                type="number"
                min="1"
                {...register("dimensions.height", { valueAsNumber: true })}
                className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g., 600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Unit</label>
              <select
                {...register("dimensions.unit")}
                className="w-full rounded bg-gray-700 border border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="px">Pixels (px)</option>
                <option value="in">Inches (in)</option>
                <option value="cm">Centimeters (cm)</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm bg-gray-700 p-2 rounded w-full">
                <span className="block">Required Size:</span>
                <span className="font-medium">
                  {watchDimensions?.width || 0}×{watchDimensions?.height || 0}
                  {watchDimensions?.unit}
                </span>
                {watchDimensions?.width && watchDimensions?.height && (
                  <span className="block mt-1">
                    Aspect: {(watchDimensions.width / watchDimensions.height).toFixed(2)}:1
                  </span>
                )}
              </div>
            </div>
          </div>
          {(errors.dimensions?.width || errors.dimensions?.height) && (
            <p className="text-red-400 text-sm mt-2">
              Both width and height are required
            </p>
          )}
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Service Image *</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700 border-gray-600 hover:bg-gray-600 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <IoMdImage className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, WEBP (MAX. 15MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    {...register("image")}
                    accept="image/*"
                  />
                </label>
              </div>
              {errors.image && <p className="text-red-400 text-sm mt-2">{errors.image.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Print Preview Guide
              </label>
              <div className="relative w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                {imagePreview ? (
                  <canvas
                    ref={previewCanvasRef}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <p>Upload an image to see</p>
                    <p>how it fits the dimensions</p>
                    {watchDimensions?.width && watchDimensions?.height && (
                      <div className="mt-4 bg-gray-600 p-3 rounded">
                        <p className="text-sm">Required:</p>
                        <p className="font-medium">
                          {watchDimensions.width}×{watchDimensions.height}
                          {watchDimensions.unit}
                        </p>
                        <p className="text-sm mt-1">
                          Aspect: {(watchDimensions.width / watchDimensions.height).toFixed(2)}:1
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Print Options *</h2>
            <button
              type="button"
              onClick={() => dispatch({ type: ConfigActionType.ADD_CONFIG })}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm"
            >
              <IoMdAdd /> Add Option Group
            </button>
          </div>

          {configs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No configuration options added yet</p>
              <p className="text-sm mt-2">Add option groups like paper types, finishes, etc.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {configs.map((config, configId) => (
                <div key={configId} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-full">
                      <label className="block text-sm font-medium mb-1">
                        Option Group Name *
                      </label>
                      <input
                        type="text"
                        value={config.title}
                        onChange={(e) => dispatch({
                          type: ConfigActionType.UPDATE_TITLE,
                          payload: { configId, title: e.target.value }
                        })}
                        className="w-full rounded bg-gray-600 border border-gray-500 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g., Paper Type"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => dispatch({
                        type: ConfigActionType.REMOVE_CONFIG,
                        payload: configId
                      })}
                      className="ml-4 text-red-500 hover:text-red-400 mt-7"
                    >
                      <IoMdRemove />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Available Options *
                    </label>
                    <div className="space-y-3 mb-4">
                      {config.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => dispatch({
                              type: ConfigActionType.UPDATE_ITEM_NAME,
                              payload: {
                                configId,
                                itemIdx,
                                name: e.target.value
                              }
                            })}
                            className="flex-1 rounded bg-gray-600 border border-gray-500 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Option name"
                          />

                          <div className="flex items-center w-32">
                            <span className="mr-2">+$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.additionalPrice}
                              onChange={(e) => dispatch({
                                type: ConfigActionType.UPDATE_ITEM_PRICE,
                                payload: {
                                  configId,
                                  itemIdx,
                                  price: parseFloat(e.target.value) || 0
                                }
                              })}
                              className="w-full rounded bg-gray-600 border border-gray-500 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="0.00"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => dispatch({
                              type: ConfigActionType.REMOVE_ITEM,
                              payload: { configId, itemIdx }
                            })}
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <IoMdRemove />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex">
                      <input
                        type="text"
                        placeholder="New option name..."
                        className="flex-1 rounded-l bg-gray-600 border border-gray-500 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (input.value.trim()) {
                              dispatch({
                                type: ConfigActionType.ADD_ITEM,
                                payload: {
                                  configId,
                                  item: {
                                    name: input.value.trim(),
                                    additionalPrice: 0
                                  }
                                }
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-r flex items-center"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input?.value.trim()) {
                            dispatch({
                              type: ConfigActionType.ADD_ITEM,
                              payload: {
                                configId,
                                item: {
                                  name: input.value.trim(),
                                  additionalPrice: 0
                                }
                              }
                            });
                            input.value = '';
                          }
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.configurations && <p className="text-red-400 text-sm mt-2">{errors.configurations.message}</p>}
        </div>

        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-md transition duration-200 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Service...
              </>
            ) : "Create Service"}
          </button>
        </div>

        {errors.response && (
          <p className="text-red-500 text-center py-4">{errors.response.message}</p>
        )}
      </form>
    </div>
  );
}