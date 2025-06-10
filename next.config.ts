const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "20.65.161.118", "server.lolaprint.us"],
  },

  publicRuntimeConfig: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
};

export default nextConfig;
