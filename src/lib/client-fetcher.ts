import { Service } from '@/types/service';
import { Order } from '@/types/order';
import { Token } from '@/types/token';

// Helper function for making authenticated requests
async function makeAuthenticatedRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Get access token from our profile endpoint
  let accessToken: string | null = null;
  try {
    const profileResponse = await fetch('/api/auth/access-token');
    if (profileResponse.ok) {
      const tokenData: { access_token: string } = await profileResponse.json();
      accessToken = tokenData.access_token;
    }
  } catch (error) {
    console.warn('Failed to get access token:', error);
  }

  // Make a type-safe headers object
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status} - ${errorText || response.statusText}`
    );
  }

  // Handle empty responses
  if (response.status === 204) return {} as T;

  return response.json() as Promise<T>;
}

// Services API
export async function getServices(): Promise<Service[]> {
  return makeAuthenticatedRequest<Service[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`
  );
}

export async function getService(slug: string): Promise<Service> {
  return makeAuthenticatedRequest<Service>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`
  );
}

// Orders API
export async function getOrders(): Promise<Order[]> {
  return makeAuthenticatedRequest<Order[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`
  );
}

export async function getOrder(orderId: string): Promise<Order> {
  return makeAuthenticatedRequest<Order>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderId}`
  );
}

// Tokens API
export async function getTokens(): Promise<Token[]> {
  return makeAuthenticatedRequest<Token[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/options/tokens`
  );
}

// Auth API
export async function fetchProfile() {
  return makeAuthenticatedRequest<Record<string, unknown>>('/api/auth/profile');
}

export async function checkAdminAccess() {
  return makeAuthenticatedRequest<Record<string, unknown>>('/api/auth/admin');
}

// Service creation
export async function createService(serviceData: FormData): Promise<Service> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/create`,
    {
      method: 'POST',
      body: serviceData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create service: ${errorText || response.statusText}`);
  }

  return response.json() as Promise<Service>;
}
