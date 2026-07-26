import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/portfolio",
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
  /* config options here */
};

export default nextConfig;
