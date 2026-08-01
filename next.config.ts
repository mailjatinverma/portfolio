import type { NextConfig } from 'next';

// const isProd = process.env.NODE_ENV === 'production';

// const nextConfig: NextConfig = {
//   basePath: "/portfolio",
//   output: "export",  // <=== enables static exports
//   reactStrictMode: true,
//   /* config options here */
// };

// export default nextConfig;

const nextConfig: NextConfig = {
  output: 'export', // Outputs a static 'out' folder instead of a Node server
  basePath: process.env.PAGES_BASE_PATH,
  images: {
    unoptimized: true, // GitHub Pages does not support the default Next.js image optimization API
  },
};

export default nextConfig;
