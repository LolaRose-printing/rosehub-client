import { Order } from "@/types/order";
import { Service } from "@/types/service";
import { Token } from "@/types/token";
import { cookies } from "next/headers";
//import { getCookie } from "cookies-next";

// Common request wrapper using Next.js `cookies()` for server-side usage
async function getRequest(url: URL | string): Promise<Response> {
  const token = (await cookies()).get("auth")?.value;

  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  return fetch(url.toString(), {
    method: "GET",
    headers,
    cache: "no-store",
    mode: "cors",
  });
}

// -----------------------------
// Services
// -----------------------------

export const getServices = async (): Promise<Service[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`;
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
};

export const getService = async (slug: string): Promise<Service> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`;
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch service");
  return res.json();
};

// -----------------------------
// Orders
// -----------------------------

export const getOrders = async (): Promise<Order[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`;
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderId}`;
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
};

// -----------------------------
// Tokens (Options)
// -----------------------------

export const getTokens = async (): Promise<Token[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/options/tokens`;
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch tokens");
  return res.json();
};

// -----------------------------
// Auth
// -----------------------------

export const verify = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`;
  const res = await getRequest(url);
  return res;
};
