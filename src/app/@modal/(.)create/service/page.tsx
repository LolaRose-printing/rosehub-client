"use client";

import { Fragment, JSX, MouseEvent, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdAdd } from "react-icons/io";
import clsx from "clsx";
import { z } from "zod";

type Configuration = {
  items: string[];
};

type Inputs = {
  title: string;
  description: string;
  price: string;
  discount: string;
  image?: FileList;
  configuration: Configuration[];
  response?: string;
};

type ConfigurationComponent = {
  id: number;
  component: JSX.Element;
};

enum Type {
  Insert,
  Delete,
}

type Payload = {
  id: number;
  title: string;
  items: string[];
}

type Action = {
  type: Type,
  payload: number & Payload;
};

type ConfigurationState = {
  id: number;
  title: string;
  items: string[];
}

type State = {
  configurations: ConfigurationState[];
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB.
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const configurationSchema = z.object({
  items: z.array(z.string(), { message: "Items can't be empty." }),
});

const schema = z.object({
  title: z.string().min(1, { message: "This field is required" }),
  description: z.string().min(1, { message: "This field is required" }),
  price: z.string().min(1, { message: "This field is required" }),
  discount: z.string().min(1, { message: "This field is required" }),
  image: z
    .any()
    .refine(file => file?.length == 1, {
      message: "The image can't be empty.",
    })
    .refine(file => file?.[0]?.size <= MAX_FILE_SIZE, {
      message: "The image must be a maximum of 15MB.",
    })
    .refine(
      (files) => ALLOWED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are allowed."
    ),
  configuration: z.array(configurationSchema, { message: "Configuration can't be empty." }),
  response: z.string().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConfigurationComponent = ({ configurationState }: any) => {
  const [item, setItem] = useState("");
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [isOnConfiguration, setIsOnConfiguration] = useState(false);

  const addItem = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (item) {
      setItems([...items, item]);
      setItem("");
    }
  }

  const addConfiguration = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (isOnConfiguration) {
      return;
    }

    configurationState.dispatch({
      type: Type.Insert,
      payload: { id: configurationState.id, title, items } },
    );

    setIsOnConfiguration(true);
  }
  const removeConfiguration = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();

    configurationState.dispatch({
      type: Type.Delete,
      payload: configurationState.id,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center justify-center gap-3">
        <div className="flex flex-col">
          <label htmlFor="title_config" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Title</label>
          <input
            id="title"
            type="text"
            autoComplete="title"
            className="px-2 w-full max-w-22 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md dark:bg-[#79889e] ring-0 highlight-white/5"
            onChange={evt => setTitle(evt.target.value)}
            value={title}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="item_config" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Item</label>
          <input
            id="item"
            type="text"
            autoComplete="item"
            className="px-2 w-full max-w-22 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md dark:bg-[#79889e] ring-0 highlight-white/5"
            onChange={evt => setItem(evt.target.value)}
            value={item}
          />
        </div>
        <div className="flex flex-col">
          <button
            className="flex flex-row gap-2 items-center justify-center mt-6 bg-dark dark:bg-gray-800 rounded-lg shadow-md py-2 px-3 w-full max-w-72 m-auto"
            onClick={addItem}
          >
            <IoMdAdd />
            <span>Add Item</span>
          </button>
        </div>
      </div>
      <div className="flex flex-row m-auto gap-3">
        <button
          className={clsx(
            "flex flex-row gap-2 items-center justify-center rounded-lg shadow-md px-6 py-3 max-w-52 m-auto",
            isOnConfiguration ? "bg-green-600" : "bg-dark dark:bg-gray-800",
          )}
          onClick={addConfiguration}
        >
          <IoMdAdd />
          <span>{isOnConfiguration ? "Added" : "Add"}</span>
        </button>
        <button
          className="flex flex-row gap-2 items-center justify-center bg-dark dark:bg-gray-800 rounded-lg shadow-md px-6 py-3 max-w-52 m-auto"
          onClick={removeConfiguration}
        >
          <IoMdAdd />
          <span>Remove</span>
        </button>
      </div>
      <div className="flex flex-row gap-2 m-auto wrap w-full max-w-96 items-center justify-center flex-wrap">
        {items.map((item, i) => {
          return <span key={i} className="py-2 px-2 bg-gray-600 rounded">{item}</span>;
        })}
      </div>
      <div>
        {configurationState.errors.configuration && <span>{configurationState.errors.configuration.message}</span>}
      </div>
    </div>
  );
}

const Modal = () => {
  const router = useRouter();
  const [configurationsComponents, setConfigurationsComponents] = useState<ConfigurationComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const { register, setValue, setError, handleSubmit, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      discount: "",
      image: undefined,
      configuration: [],
      response: undefined,
    },
    mode: "onChange",
    shouldUnregister: true,
    resolver: zodResolver(schema),
  });
  
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case Type.Insert:
        setValue("configuration", [...state.configurations, action.payload]);
        return {
          ...state,
          configurations: [...state.configurations, action.payload],
        };
      case Type.Delete:
        const removedComponent = configurationsComponents.filter(el => el.id !== action.payload);
        setConfigurationsComponents([...removedComponent]);

        const removed = state.configurations.filter(el => el.id !== action.payload);
        setValue("configuration", [...removed]);
        return {
          ...state,
          configurations: [...removed],
        };
      default:
        throw Error("Unknown action.");
    }
  }
  const initialState = {
    configurations: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const addConfiguration = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setConfigurationsComponents([
      ...configurationsComponents,
      {
        id: counter,
        component: <ConfigurationComponent key={counter} configurationState={{ id: counter, dispatch, errors }} />,
      },
    ]);
    setCounter(counter + 1);
  }
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discount", data.discount);
      formData.append("image", data.image![0]);

      for (let i = 0; i < state.configurations.length; i++) {
        formData.append(`configurations[${i}][title]`, state.configurations[i].title);
        for (let j = 0; j < state.configurations[i].items.length; j++) {
          formData.append(`configurations[${i}][items][${j}]`, state.configurations[i].items[j]);
        }
      }

      const headers = new Headers({});
      const requestInit: RequestInit = {
        headers,
        method: "post",
        mode: "cors",
        body: formData,
      };
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/create`);
      const request = new Request(url, requestInit);
      const response = await fetch(request);

      if (response.status !== 201) {
        setError("response", {
          message: "There was a problem trying to create.",
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
                  <DialogPanel className="shadow-2xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 w-full max-w-xl transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all text-center">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-medium leading-6 text-white-900 text-center m-auto justify-center items-center"
                    >
                     <span className="font-bold">Create Service</span>
                    </DialogTitle>
                    <form className="space-y-6">
                      <div className="text-center">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Title</label>
                        </div>
                        <div>
                          <input id="title" type="text" autoComplete="title" className="px-2 w-full max-w-82 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md dark:bg-[#79889e] ring-0 highlight-white/5" {...register("title", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.title && <span>{errors.title.message}</span>}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Description</label>
                        </div>
                        <div>
                          <textarea
                            defaultValue="" {...register("description", { required: true })}
                            className="shadow appearance-none border rounded px-2 w-full max-w-82 py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline dark:bg-[#79889e]"
                            rows={5}
                            ></textarea>
                        </div>
                        <div className="mt-2">
                          {errors.description && <span>{errors.description.message}</span>}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Price</label>
                        </div>
                        <div>
                          <input id="price" type="text" autoComplete="price" className="px-2 w-full max-w-22 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md dark:bg-[#79889e] ring-0 highlight-white/5" {...register("price", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.price && <span>{errors.price.message}</span>}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Discount</label>
                        </div>
                        <div>
                          <input id="discount" type="text" autoComplete="discount" className="px-2 w-full max-w-22 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md dark:bg-[#79889e] ring-0 highlight-white/5" {...register("discount", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.discount && <span>{errors.discount.message}</span>}
                        </div>
                      </div>
                      <div className="text-center">
                        <div>
                          <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Image</label>
                        </div>
                        <div>
                          <input id="image" type="file" {...register("image", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.image && <span>{errors.image?.message}</span>}
                        </div>
                      </div>
                      <div className="text-center justify-center items-center m-auto">
                        <div>
                          <label htmlFor="configuration" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100">Configuration</label>
                        </div>
                        <div>
                          {configurationsComponents.map((configuration, i) => {
                            return (
                              <div key={i} className="bg-gray-700 my-3 rounded py-3">
                                {configuration.component}
                              </div>
                            );
                          })}
                        </div>
                        <div>
                          <button
                            className="flex flex-row gap-2 items-center justify-center mt-6 bg-dark dark:bg-gray-800 rounded-lg shadow-md px-6 py-3 max-w-52 m-auto" onClick={addConfiguration}>
                            <IoMdAdd />
                          </button>
                          <div className="mt-2">
                            {errors.configuration && <span>{errors.configuration.message}</span>}
                          </div>
                        </div>
                        <div className="my-8 text-center">
                          {errors.response && <span>{errors.response.message}</span>}
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="flex flex-row gap-2 items-center justify-center mt-6 bg-dark dark:bg-gray-700 rounded-lg shadow-md px-6 py-3 w-full max-w-52 m-auto"
                            onClick={handleSubmit(onSubmit)}
                            disabled={loading}
                          >
                            <span>Create</span>
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

  return null;
}

export default Modal;
