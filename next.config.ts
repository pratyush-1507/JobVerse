import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // 🔧 disable strict mode to fix findDOMNode crash
};

export default nextConfig;
