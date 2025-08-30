"use client";

import { useEffect, useState, useReducer, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IoMdAdd, IoMdRemove, IoMdImage } from "react-icons/io";

type PrintDimension = { width: number; height: number; unit: 'px' | 'in' | 'cm' };
type PrintConfigurationItem = { name: string; additionalPrice: number };
type PrintConfiguration = { title: string; items: PrintConfigurationItem[] };
type Service = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  category: 'brochure' | 'booklet' | 'other';
  hasFrontBack: boolean;
  dimensions: PrintDimension;
  configurations: PrintConfiguration[];
  imageUrl?: string;
};

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schemas
const dimensionSchema = z.object({
  width: z.number().min(1),
  height: z.number().min(1),
  unit: z.enum(['px','in','cm'])
});

const configurationItemSchema = z.object({
  name: z.string().min(1),
  additionalPrice: z.number().min(0)
});

const configurationSchema = z.object({
  title: z.string().min(1),
  items: z.array(configurationItemSchema).min(1)
});

const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0.01),
  discount: z.number().min(0),
  dimensions: dimensionSchema,
  hasFrontBack: z.boolean(),
  configurations: z.array(configurationSchema).min(1),
  category: z.enum(['brochure','booklet','other']),
  image: z.any().optional()
});

enum ConfigActionType {
  ADD_CONFIG, REMOVE_CONFIG, ADD_ITEM, REMOVE_ITEM, UPDATE_TITLE, UPDATE_ITEM_NAME, UPDATE_ITEM_PRICE, LOAD_CONFIGS
}

type ConfigAction = 
  | { type: ConfigActionType.ADD_CONFIG }
  | { type: ConfigActionType.REMOVE_CONFIG; payload: number }
  | { type: ConfigActionType.ADD_ITEM; payload: { configId: number; item: PrintConfigurationItem } }
  | { type: ConfigActionType.REMOVE_ITEM; payload: { configId: number; itemIdx: number } }
  | { type: ConfigActionType.UPDATE_TITLE; payload: { configId: number; title: string } }
  | { type: ConfigActionType.UPDATE_ITEM_NAME; payload: { configId: number; itemIdx: number; name: string } }
  | { type: ConfigActionType.UPDATE_ITEM_PRICE; payload: { configId: number; itemIdx: number; price: number } }
  | { type: ConfigActionType.LOAD_CONFIGS; payload: PrintConfiguration[] };

function configReducer(state: PrintConfiguration[], action: ConfigAction): PrintConfiguration[] {
  switch(action.type){
    case ConfigActionType.ADD_CONFIG: return [...state, { title: "New Option Group", items: [{ name:"New Option", additionalPrice:0 }] }];
    case ConfigActionType.REMOVE_CONFIG: return state.filter((_, idx)=>idx!==action.payload);
    case ConfigActionType.ADD_ITEM: return state.map((c,i)=>i===action.payload.configId?{...c, items:[...c.items, action.payload.item]}:c);
    case ConfigActionType.REMOVE_ITEM: return state.map((c,i)=>i===action.payload.configId?{...c, items:c.items.filter((_,j)=>j!==action.payload.itemIdx)}:c);
    case ConfigActionType.UPDATE_TITLE: return state.map((c,i)=>i===action.payload.configId?{...c, title:action.payload.title}:c);
    case ConfigActionType.UPDATE_ITEM_NAME: return state.map((c,i)=>i===action.payload.configId?{...c, items:c.items.map((item,j)=>j===action.payload.itemIdx?{...item,name:action.payload.name}:item)}:c);
    case ConfigActionType.UPDATE_ITEM_PRICE: return state.map((c,i)=>i===action.payload.configId?{...c, items:c.items.map((item,j)=>j===action.payload.itemIdx?{...item,additionalPrice:action.payload.price}:item)}:c);
    case ConfigActionType.LOAD_CONFIGS: return action.payload;
    default: return state;
  }
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [configs, dispatch] = useReducer(configReducer, []);
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState:{ errors }, trigger } = useForm<Service>({
    resolver: zodResolver(serviceSchema)
  });

  const watchDimensions = watch("dimensions");
  const watchImage = watch("image");

  // Load service by slug
  useEffect(()=>{
    const fetchService = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${params.slug}`);
        const data = await res.json();
        setService(data);
        // populate form
        setValue("title", data.title);
        setValue("description", data.description);
        setValue("price", data.price);
        setValue("discount", data.discount);
        setValue("category", data.category);
        setValue("hasFrontBack", data.hasFrontBack);
        setValue("dimensions", data.dimensions);
        setValue("configurations", data.configurations);
        dispatch({ type: ConfigActionType.LOAD_CONFIGS, payload: data.configurations });
        if(data.imageUrl) setImagePreview(data.imageUrl);
      } catch(e) { console.error(e); }
    };
    fetchService();
  }, [params.slug, setValue]);

  // Image preview
  useEffect(()=>{
    if(watchImage?.[0]){
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = ()=> setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  },[watchImage]);

  const onSubmit: SubmitHandler<Service> = async(data)=>{
    setLoading(true);
    try{
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("discount", data.discount.toString());
      formData.append("category", data.category);
      formData.append("hasFrontBack", data.hasFrontBack.toString());
      formData.append("dimensions", JSON.stringify(data.dimensions));
      formData.append("configurations", JSON.stringify(configs));
      if(data.image?.[0]) formData.append("thumbnail", data.image[0]);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${service?.id}/update`,{
        method:"PUT",
        body: formData
      });

      if(!response.ok) throw new Error("Update failed");

      router.push("/services");
    }catch(e){
      console.error(e);
      alert("Service update failed");
    }finally{ setLoading(false); }
  };

  if(!service) return <p className="text-white text-center p-6">Loading service...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Update Service: {service.title}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label>Title</label>
              <input {...register("title")} className="w-full rounded bg-gray-700 p-2"/>
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>
            <div>
              <label>Description</label>
              <textarea {...register("description")} className="w-full rounded bg-gray-700 p-2"/>
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          {/* Price, Discount, Category */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label>Price</label><input type="number" {...register("price",{valueAsNumber:true})} className="w-full rounded bg-gray-700 p-2"/></div>
            <div><label>Discount</label><input type="number" {...register("discount",{valueAsNumber:true})} className="w-full rounded bg-gray-700 p-2"/></div>
            <div>
              <label>Category</label>
              <select {...register("category")} className="w-full rounded bg-gray-700 p-2">
                <option value="other">Other</option>
                <option value="brochure">Brochure</option>
                <option value="booklet">Booklet</option>
              </select>
            </div>
            <div className="flex items-center"><label><input type="checkbox" {...register("hasFrontBack")}/> Double-sided</label></div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label>Width</label><input type="number" {...register("dimensions.width",{valueAsNumber:true})} className="w-full rounded bg-gray-700 p-2"/></div>
            <div><label>Height</label><input type="number" {...register("dimensions.height",{valueAsNumber:true})} className="w-full rounded bg-gray-700 p-2"/></div>
            <div>
              <label>Unit</label>
              <select {...register("dimensions.unit")} className="w-full rounded bg-gray-700 p-2">
                <option value="px">px</option>
                <option value="in">in</option>
                <option value="cm">cm</option>
              </select>
            </div>
          </div>

          {/* Image */}
          <div>
            <label>Thumbnail</label>
            <input type="file" {...register("image")} accept={ALLOWED_IMAGE_TYPES.join(",")} className="block"/>
            {imagePreview && <img src={imagePreview} className="w-48 h-48 object-cover mt-2 rounded"/>}
          </div>

          {/* Configurations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Configurations</h2>
            {configs.map((conf, idx)=>(
              <div key={idx} className="border p-4 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    value={conf.title}
                    onChange={(e)=>dispatch({type:ConfigActionType.UPDATE_TITLE,payload:{configId:idx,title:e.target.value}})}
                    className="w-full bg-gray-700 p-2 rounded"
                  />
                  <button type="button" onClick={()=>dispatch({type:ConfigActionType.REMOVE_CONFIG,payload:idx})} className="text-red-500 ml-2"><IoMdRemove /></button>
                </div>
                <div className="space-y-2">
                  {conf.items.map((item,j)=>(
                    <div key={j} className="flex gap-2 items-center">
                      <input
                        value={item.name}
                        onChange={(e)=>dispatch({type:ConfigActionType.UPDATE_ITEM_NAME,payload:{configId:idx,itemIdx:j,name:e.target.value}})}
                        className="flex-1 bg-gray-700 p-2 rounded"
                      />
                      <input
                        type="number"
                        value={item.additionalPrice}
                        onChange={(e)=>dispatch({type:ConfigActionType.UPDATE_ITEM_PRICE,payload:{configId:idx,itemIdx:j,price:parseFloat(e.target.value)}})}
                        className="w-24 bg-gray-700 p-2 rounded"
                      />
                      <button type="button" onClick={()=>dispatch({type:ConfigActionType.REMOVE_ITEM,payload:{configId:idx,itemIdx:j}})} className="text-red-500"><IoMdRemove /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={()=>dispatch({type:ConfigActionType.ADD_ITEM,payload:{configId:idx,item:{name:"New Option",additionalPrice:0}}})} className="flex items-center gap-1 text-green-400"><IoMdAdd /> Add Item</button>
              </div>
            ))}
            <button type="button" onClick={()=>dispatch({type:ConfigActionType.ADD_CONFIG})} className="flex items-center gap-1 text-green-400"><IoMdAdd /> Add Configuration Group</button>
          </div>

          <button type="submit" disabled={loading} className="bg-blue-600 px-6 py-3 rounded mt-6">{loading ? "Updating..." : "Update Service"}</button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
