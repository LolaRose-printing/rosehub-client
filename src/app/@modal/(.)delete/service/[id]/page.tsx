"use client";

import { Fragment, MouseEvent, use, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { createPortal } from "react-dom";
import { getCookie } from "cookies-next";

type Params = {
  id: string;
};

const Modal = ({ params }: { params: Promise<Params> }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = use(params);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClose = (_evt: MouseEvent<HTMLButtonElement>) => {
    router.back();
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onConfirm = async (_evt: MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    try {
      const headers = new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:`Bearer ${await getCookie("auth")}`,
      });
      const requestInit: RequestInit = {
        headers,
        cache: "no-store",
        method: "delete",
        mode: "cors",
      };
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${id}`);
      const request = new Request(url, requestInit); 
      const response = await fetch(request);

      if (response.status === 200) {
        location.href = "/services";
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
                     <span className="font-bold">Are you sure you want to delete this service?</span>
                    </DialogTitle>
                    <div className="space-y-6">
                      <div className="text-center justify-center items-center flex flex-row gap-3">
                        <button type="submit" className="flex flex-row gap-2 items-center justify-center mt-6 bg-[#612ad5] hover:bg-[#612ad5ed] rounded-lg shadow-md px-6 py-2 w-full max-w-20" disabled={loading} onClick={onConfirm}>
                          <span>Yes</span> 
                        </button>
                        <button type="submit" className="flex flex-row gap-2 items-center justify-center mt-6 bg-[#612ad5] hover:bg-[#612ad5ed] rounded-lg shadow-md px-6 py-2 w-full max-w-20" onClick={onClose}>
                          <span>No</span>
                        </button>
                      </div>
                    </div>
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
