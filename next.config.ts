import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.livemosque.live",
        pathname: "/uploads/**",
      },
      // {
      //   protocol: 'https',
      //   hostname: 'images.unsplash.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'plus.unsplash.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'unsplash.com',
      //   pathname: '/**',
      // },
      {
        protocol: "https",
        hostname: "livemosque-be.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "livemosque-be.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  eslint: {
    // ✅ This makes `next build` skip linting completely
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
