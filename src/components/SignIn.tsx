"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import { z } from "zod";
import clsx from "clsx";
import { useAuthStore } from "@/hooks/useAuthStore";

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
  const { setAuth } = useAuthStore();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    try {
      // Перенаправляем на Auth0 логин
      window.location.href = "/api/auth/login";
      return;
    } catch (error: unknown) {
      setError("response", {
        message: "Произошла ошибка при подключении к Auth0",
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
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-200">Sign in to RoseHub Admin</h2>
          <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-200 text-center">
              <strong>Authentication via Auth0</strong><br />
              Click "Sign In" button to proceed to secure Auth0 login
            </p>
          </div>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm px-6 md:px-0">
          <div className="text-center">
            <button
              onClick={() => window.location.href = "/api/auth/login"}
              disabled={loading}
              className={clsx(
                "w-full transition ease-in-out duration-150 flex justify-center items-center bg-[#612ad5] hover:bg-[#612ad5ed] rounded-lg shadow-md px-6 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
                {
                  "cursor-not-allowed opacity-50": loading,
                },
              )}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Sign in via Auth0
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
