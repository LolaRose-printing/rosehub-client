import { Service } from '@/types/service';
import { Order } from '@/types/order';
import { Token } from '@/types/token';

// Helper function for making authenticated requests
async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
  // Get access token from our profile endpoint
  let accessToken = '';
  try {
    const profileResponse = await fetch('/api/auth/access-token');
    if (profileResponse.ok) {
      const tokenData = await profileResponse.json();
      accessToken = tokenData.access_token;
    }
  } catch (error) {
    console.warn('Failed to get access token:', error);
  }

  // Always use Headers object (safe for mutation)
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  });

  // Merge any custom headers passed in options
  if (options.headers) {
    const extraHeaders = new Headers(options.headers);
    extraHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  // Add Authorization header if we have a token
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// -----------------------------
// Services API
// -----------------------------
export async function getServices(): Promise<Service[]> {
  return makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`);
}

export async function getService(slug: string): Promise<Service> {
  return makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/${slug}`);
}

// -----------------------------
// Orders API
// -----------------------------
export async function getOrders(): Promise<Order[]> {
  return makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`);
}

export async function getOrder(orderId: string): Promise<Order> {
  return makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderId}`);
}

// -----------------------------
// Tokens API
// -----------------------------
export async function getTokens(): Promise<Token[]> {
  return makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/options/tokens`);
}

// -----------------------------
// Auth API
// -----------------------------
export async function fetchProfile() {
  const response = await fetch('/api/auth/profile');
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
}

export async function checkAdminAccess() {
  const response = await fetch('/api/auth/admin');
  if (!response.ok) {
    throw new Error('Failed to check admin access');
  }
  return response.json();
}

// -----------------------------
// Service creation
// -----------------------------
export async function createService(serviceData: FormData): Promise<Service> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services/create`, {
    method: 'POST',
    body: serviceData,
  });

  if (!response.ok) {
    throw new Error('Failed to create service');
  }

  return response.json();
}
