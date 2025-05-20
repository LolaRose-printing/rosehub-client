"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { createPortal } from "react-dom";
import { z } from "zod";

type Inputs = {
  name: string;
  expiration: string;
  response?: string;
};

const schema = z.object({
  name: z.string().min(1, { message: "This field is required" }),
  expiration: z.string().min(1, { message: "This field is required" }),
  response: z.string().optional(),
});

const Modal = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, setValue, setError, handleSubmit, formState: { errors } } = useForm<Inputs>({
    mode: "onChange",
    shouldUnregister: true,
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    try {
      const headers = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      });
      const requestInit: RequestInit = {
        headers,
        method: "post",
        cache: "no-store",
        mode: "cors",
        body: JSON.stringify(data),
      };
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/options/tokens/create`);
      const request = new Request(url, requestInit);
      const response = await fetch(request);

      if (response.status !== 201) {
        setError("response", {
          message: "There was a problem trying to create.",
        });
        return;
      }

    location.href = "/options/tokens";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      throw new Error("error");
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
                     <span className="font-bold">Create Token</span>
                    </DialogTitle>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                      <div className="text-center">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-100">Name</label>
                        </div>
                        <div>
                          <input id="name" type="text" autoComplete="name" className="px-2 w-full max-w-82 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md bg-[#79889e] ring-0 highlight-white/5" {...register("name", { required: true })} />
                        </div>
                        <div className="mt-2">
                          {errors.name && <span>{errors.name.message}</span>}
                        </div>
                      </div>
                      <div className="w-full max-w-82 m-auto">      
                        <div className="relative text-center">
                          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-100">Duration</label>
                          <select
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
                            onChange={evt => {
                              setValue("expiration", evt.target.value);
                            }}
                            defaultValue=""
                          >
                            <option value="">-- Choose an expiration--</option>
                            <option value="1 Day">1 Day</option>
                            <option value="1 Month">1 Month</option>
                            <option value="No Expiration">No Expiration</option>
                          </select>
                          <div className="mt-2">
                          {errors.expiration && <span>{errors.expiration.message}</span>}
                        </div>              
                        </div>
                      </div>
                      <div className="my-8 text-center">
                        {errors.response && <span>{errors.response.message}</span>}
                      </div>
                      <div className="text-center justify-center items-center m-auto">
                        <button type="submit" className="flex flex-row gap-2 items-center justify-center mt-6 bg-[#612ad5] hover:bg-[#612ad5ed] rounded-lg shadow-md px-6 py-3 w-full max-w-52 m-auto" disabled={loading}>
                          <span>Create</span>
                        </button>
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
