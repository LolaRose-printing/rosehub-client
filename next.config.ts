import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "20.65.161.118", "server.lolaprint.us", "s.gravatar.com", "cdn.auth0.com"],
  },

  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
};

export default nextConfig;

