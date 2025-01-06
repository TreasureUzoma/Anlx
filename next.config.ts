import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "analyticsapp.vercel.app",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
