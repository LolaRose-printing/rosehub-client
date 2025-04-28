"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { z } from "zod";
import clsx from "clsx";

type Inputs = {
  email: string;
  password: string;
  response?: string;
}

const schema = z.object({
  email: z.string().min(1, { message: "This field is required" }),
  password: z.string().min(1, { message: "This field is required" }),
  response: z.string().optional(),
});

export const SignIn: FC = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
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
        mode: "cors",
        body: JSON.stringify(data),
      };
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`);
      const request = new Request(url, requestInit);
      const response = await fetch(request);

      if (response.status !== 200) {
        setError("response", {
          message: "Invalid Credentials",
        });
        return;
      }

      const { accessToken } = await response.json();

      setCookie("auth", accessToken);
      setCookie("expiration", new Date(Date.now() + 1 * (60 * 60 * 1000)).getTime());

      router.push("/");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setError("response", {
        message: "There was a problem trying to connect",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            alt="logo"
            src={"/logo.png"}
            width={350}
            height={350}
            className="m-auto"
          />
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">Enter your credentials to Sign In on RoseHub</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm px-6 md:px-0">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-100">Email</label>
              </div>
              <div className="mt-2">
                <input id="email" type="email" autoComplete="email" className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md bg-[#79889e] ring-0 highlight-white/5" {...register("email", { required: true })} />
              </div>
              <div className="mt-2">
                {errors.email && <span>This field is required</span>}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-100">Password</label>
              </div>
              <div className="mt-2">
                <input id="password" type="password" autoComplete="current-password" className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 shadow-sm rounded-md bg-[#79889e] ring-0 highlight-white/5" {...register("password", { required: true })} />
              </div>
              <div className="mt-2">
                {errors.password && <span>This field is required</span>}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className={clsx(
                  "mt-10 transition ease-in-out duration-150 flex w-full justify-center items-center bg-gray-900 rounded-lg shadow-md px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
                  {
                    "cursor-not-allowed": loading,
                  },
                )}
                disabled={loading}
              >
              {loading &&
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>}
                Sign In
              </button>
            </div>
            <div className="text-center mt-2">
              {errors.response && <span>{errors.response?.message}</span>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
