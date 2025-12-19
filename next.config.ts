import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "livemosque.live",
      //   pathname: "/uploads/**",
      // },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
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
