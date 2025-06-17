"use client";


import { Service } from "@/types/service";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Fragment, use, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type Params = {
  slug: string;
};

type Inputs = {
  title: string;
  description: string;
  price: string;
  discount: string;
  response?: string;
};

const schema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
  description: z.string().min(1, { message: "This field is required" }),
  price: z.string().min(1, { message: "This field is required" }),
  discount: z.string().min(1, { message: "This field is required" }),
  response: z.string().optional(),
});

const Modal = ({ params }: { params: Promise<Params> }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { slug } = use(params);
  const [service, setService] = useState<Service>();
  // const [configurationsComponents, setConfigurationsComponents] = useState<ConfigurationComponent[]>([]);
  // const service = use(getService(slug));


  const { register, setError, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      title: service?.title,
      description: service?.description,
      price: service?.price,
      discount: service?.discount,
      response: undefined,
    },
    mode: "onChange",
    shouldUnregister: true,
    resolver: zodResolver(schema),
  });

  // const reducer = (state: State, action: Action) => {
  //   switch (action.type) {
  //     case Type.Insert:
  //       setValue("configuration", [...state.configurations, action.payload]);
  //       return {
  //         ...state,
  //         configurations: [...state.configurations, action.payload],
  //       };
  //     case Type.Delete:
  //       const removedComponent = configurationsComponents.filter(el => el.id !== action.payload);
  //       setConfigurationsComponents([...removedComponent]);

  //       const removed = state.configurations.filter(el => el.id !== action.payload);
  //       setValue("configuration", [...removed]);
  //       return {
  //         ...state,
  //         configurations: [...removed],
  //       };
  //     default:
  //       throw Error("Unknown action.");
  //   }
  // }

  // const initialState = {
  //   configurations: service?.configurations || [],
  // };
  // const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchService = async (): Promise<Service> => {
       const token = getCookie("auth");
        const headers = new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization:`Bearer ${token}`,
        });
        const requestInit: RequestInit = {
          headers,
          cache: "no-store",
          method: "get",
          mode: "cors",
        };
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`);
        const request = new Request(url, requestInit);
        const response = await fetch(request);
        const service = await response.json();

        return service;
    };

    fetchService()
      .then((service: Service) => setService(service))
      .catch(error => console.error(error));
        
      //   service?.configurations.map(configuration => {
      //     setConfigurationsComponents(prevItem => [
      //       ...prevItem,
      //       {
      //         id: configuration.id,
      //         component: <ConfigurationComponent
      //           key={configuration.id}
      //           configurationState={{
      //             id: configuration.id,
      //             items: configuration.items,
      //             isOnConfiguration: true,
      //             dispatch,
      //             errors,
      //           }} />,
      //       },
      //     ]);
      //   });    
      // })
      // .catch(error => console.error(error));
  }, [slug, errors]);

  if (!service) return;

  // const addConfiguration = (evt: MouseEvent<HTMLButtonElement>) => {
  //     evt.preventDefault();
  //     evt.stopPropagation();
  //     const max = Math.max(...configurationsComponents.map(conf => conf.id));
  //     setConfigurationsComponents(prev => [
  //       ...prev,
  //       {
  //         id: max + 1,
  //         component: <ConfigurationComponent
  //           key={max + 1}
  //           configurationState={{
  //             id: max + 1,
  //             items: [],
  //             isOnConfiguration: false,
  //             dispatch, errors,
  //           }} />,
  //       },
  //     ]);
  // }

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
      setLoading(true);
      try {
        // const formData = new FormData();
        // formData.append("title", data.title);
        // formData.append("description", data.description);
        // formData.append("price", data.price);
        // formData.append("discount", data.discount);
        // if (data.image) {
        //   formData.append("thumbnail", data.image[0]);
        // }
  
        // for (let i = 0; i < state.configurations.length; i++) {
        //   formData.append(`configurations[${i}][title]`, state.configurations[i].title);
        //   for (let j = 0; j < state.configurations[i].items.length; j++) {
        //     formData.append(`configurations[${i}][items][${j}]`, state.configurations[i].items[j]);
        //   }
        // }
  
        const headers = new Headers({
          "Content-Type": "application/json",
          Authorization:`Bearer ${await getCookie("auth")}`,
        });
        const requestInit: RequestInit = {
          headers,
          method: "put",
          cache: "no-store",
          mode: "cors",
          body: JSON.stringify(data),
        };
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${service.id}`);
        const request = new Request(url, requestInit);
        const response = await fetch(request);

        if (response.status !== 200) {
          setError("response", {
            message: "There was a problem trying to update.",
          });
          return;
        }
  
        router.refresh();
        router.back();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: unknown) {
        throw Error("There was a problem trying to create a service.");
      } finally {
        setLoading(false);
      }
    }

  if (typeof window === "object") {
    return createPortal(
      <div>
        <Transition
          appear={true}
          show={true}
          as={Fragment}
        >
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => router.back()}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="shadow-2xl bg-gray-900 text-gray-100 w-full max-w-xl transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all text-center">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-white-900 text-center m-auto justify-center items-center"
                    >
                      <span className="font-bold">Update Service {service.title}</span>
                    </DialogTitle>
                    <form className="space-y-6">
                      <div className="text-center">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-100">Title</label>
                        </div>
                        <div>
                          <input id="title" type="text" autoComplete="title" defaultValue={service.title} className="px-2 w-full max-w-82 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md bg-[#79889e] ring-0 highlight-white/5" {...register("title", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.title && <span>{errors.title.message}</span>}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-100">Description</label>
                        </div>
                        <div>
                          <textarea
                            defaultValue={service.description} {...register("description", { required: true })}
                            className="shadow appearance-none border rounded px-2 w-full max-w-82 py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-[#79889e]"
                            rows={5}
                          ></textarea>
                        </div>
                        <div className="mt-2">
                          {errors.description && <span>{errors.description.message}</span>}
                        </div>
                      </div>
                      <div className="flex flex-row gap-6 justify-center">
                        <div className="text-center">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-100">Price ($)</label>
                        </div>
                        <div>
                          <input id="price" type="text" autoComplete="price" defaultValue={+service.price / 100} className="px-2 w-full max-w-22 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md bg-[#79889e] ring-0 highlight-white/5" {...register("price", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.price && <span>{errors.price.message}</span>}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-100">Discount ($)</label>
                        </div>
                        <div>
                          <input id="discount" type="text" defaultValue={+service.discount / 100} autoComplete="discount" className="px-2 w-full max-w-22 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md bg-[#79889e] ring-0 highlight-white/5" {...register("discount", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.discount && <span>{errors.discount.message}</span>}
                        </div>
                      </div>
                      </div>
                      <div className="text-center justify-center items-center m-auto">
                        <div>
                          <label htmlFor="configuration" className="block text-sm font-medium leading-6 text-gray-100">Configuration</label>
                        </div>
                        {/* <div>
                          {configurationsComponents.map((configuration, i) => {
                            return (
                              <div key={i} className="bg-gray-700 my-3 rounded py-3">
                                {configuration.component}
                              </div>
                            );
                          })}
                        </div> */}
                        {/* <div>
                          <button
                            className="flex flex-row gap-2 items-center justify-center mt-6 bg-gray-800 rounded-lg shadow-md px-6 py-3 max-w-52 m-auto" onClick={addConfiguration}>
                            <IoMdAdd />
                          </button>
                          <div className="mt-2">
                            {errors.configuration && <span>{errors.configuration.message}</span>}
                          </div>
                        </div>
                        <div className="my-8 text-center">
                          {errors.response && <span>{errors.response.message}</span>}
                        </div> */}
                        <div>
                          <button
                            type="submit"
                            className="flex flex-row gap-2 items-center justify-center mt-6 bg-[#612ad5] hover:bg-[#612ad5ed] rounded-lg shadow-md px-6 py-3 w-full max-w-52 m-auto"
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                          >
                            <span>Update</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>,
      document.getElementById("modal-root") as HTMLElement,
    );
  }
}

export default Modal;
