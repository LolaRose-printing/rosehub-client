/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['client.lolaprint.us', 'localhost:3001'],
  },
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'server.lolaprint.us' },
      { protocol: 'https', hostname: 's.gravatar.com' },
      { protocol: 'https', hostname: 'cdn.auth0.com' },
      { protocol: 'https', hostname: 'client.lolaprint.us' },
    ],
  },
  
  serverActions: {
    bodySizeLimit: '10mb',
  },
  
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;