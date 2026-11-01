import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  allowedDevOrigins: ["192.168.1.72"],
};

export default nextConfig;
