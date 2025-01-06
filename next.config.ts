import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "analytixapp.vercel.app",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
