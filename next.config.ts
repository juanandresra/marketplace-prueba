import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // permite cualquier hostname http
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**", // permite cualquier hostname https
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
