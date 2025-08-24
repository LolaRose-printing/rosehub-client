import { Order } from "@/types/order";
import { Service } from "@/types/service";
import { Token } from "@/types/token";
import { cookies } from "next/headers";
// import { getAccessToken } from '@auth0/nextjs-auth0/server';
//import { getCookie } from "cookies-next";

// Common request wrapper for server-side usage
async function getRequest(url: URL | string): Promise<Response> {
  // Get access token from our auth cookies
  const token = (await cookies()).get("auth_access_token")?.value;

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
  console.log('Fetching orders from:', url);
  
  const res = await getRequest(url);
  console.log('Orders response status:', res.status);
  
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    console.error('Orders fetch failed:', res.status, errorText);
    throw new Error(`Failed to fetch orders: ${res.status} ${errorText}`);
  }
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

// -----------------------------
// Service Creation
// -----------------------------

export const createService = async (serviceData: FormData): Promise<Service> => {
  // Get access token from our auth cookies
  const token = (await cookies()).get("auth_access_token")?.value;
  
  const headers = new Headers({
    Accept: "application/json",
  });

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/create`, {
    method: "POST",
    headers,
    body: serviceData,
    cache: "no-store",
    mode: "cors",
  });

  if (!response.ok) throw new Error("Failed to create service");
  return response.json();
};
