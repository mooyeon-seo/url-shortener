import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
