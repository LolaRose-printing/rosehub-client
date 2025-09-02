/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['https://client.lolaprint.us', 'http://localhost:3001'],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'server.lolaprint.us' },
      { protocol: 'https', hostname: 's.gravatar.com' },
      { protocol: 'https', hostname: 'cdn.auth0.com' },
    ],
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

module.exports = nextConfig;
