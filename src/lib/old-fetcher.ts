// import { Order } from "@/types/order";
// import { Service } from "@/types/service";
// import { Token } from "@/types/token";
// import { cookies } from "next/headers";

// async function getRequest(url: URL): Promise<Response> {
//   const token = (await cookies()).get("auth")?.value;
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization:`Bearer ${token}`,
//   });
//   const requestInit: RequestInit = {
//     headers,
//     cache: "no-store",
//     method: "get",
//     mode: "cors",
//   };
//   const request = new Request(url, requestInit);

//   return fetch(request);
// }

// export const getServices = async (): Promise<Service[]> => {
//   const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`);
//   const response = await getRequest(url);
//   const services = await response.json();

//   return services || [];
// }

// export const getService = async (slug: string): Promise<Service> => {
//   const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`);
//   const response = await getRequest(url);
//   const service = await response.json();

//   return service;
// }

// export const getOrders = async (): Promise<Order[]> => {
//   const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`);
//   const response = await getRequest(url);
//   const orders = await response.json();

//   return orders || [];
// }

// export const getTokens = async (): Promise<Token[]> => {
//   const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/options/tokens`);
//   const response = await getRequest(url);
//   const tokens = await response.json();

//   return tokens || [];
// }

// export async function verify() {
//   const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify`);
//   const response = await getRequest(url);

//   return response;
// }
