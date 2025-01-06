import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "analytix.vercel.app",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
