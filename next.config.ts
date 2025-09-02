/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fixed: removed experimental wrapper for allowedDevOrigins
  allowedDevOrigins: ['client.lolaprint.us', 'localhost:3001'],
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'server.lolaprint.us' },
      { protocol: 'https', hostname: 's.gravatar.com' },
      { protocol: 'https', hostname: 'cdn.auth0.com' },
      // Add client domain if you serve images from there too
      { protocol: 'https', hostname: 'client.lolaprint.us' },
    ],
  },
  
  // Add this to fix the "Body exceeded 1 MB limit" error
  serverActions: {
    bodySizeLimit: '10mb',
  },
  
  // Add API configuration for larger payloads
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  
  // Remove publicRuntimeConfig - it's not needed for NEXT_PUBLIC_ variables
};

module.exports = nextConfig;