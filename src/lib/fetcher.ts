import { Service } from "@/types/service";
import { Token } from "@/types/token";

function getRequest(url: URL): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  const requestInit: RequestInit = {
    headers,
    method: "get",
    mode: "cors",
  };
  const request = new Request(url, requestInit);

  return fetch(request);
}

export const getServices = async (): Promise<Service[]> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`);
  const response = await getRequest(url);
  const services = await response.json();

  return services || [];
}

export const getTokens = async (): Promise<Token[]> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/options/tokens`);
  const response = await getRequest(url);
  const tokens = await response.json();

  return tokens || [];
}
