import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
      // Add your production API domain too
      {
        protocol: 'https',
        hostname: 'api.yourdomain.com',
        pathname: '/uploads/**',
      },
      // Unsplash for placeholder images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Additional image CDNs (if needed)
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '/**',
      },
    ],
    // Optimize images
    formats: ['image/webp', 'image/avif'],
    // Cache optimized images for 31 days
    minimumCacheTTL: 31536000,
    // Enable static imports
    disableStaticImages: false,
  },

  // Other Next.js config
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers for image optimization
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects (optional)
  async redirects() {
    return [];
  },

  // Rewrites (optional)
  async rewrites() {
    return [];
  },
};

export default nextConfig;
