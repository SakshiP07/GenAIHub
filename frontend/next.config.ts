import type { NextConfig } from "next";
import path from "path";

const frontendRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: frontendRoot,
  turbopack: {
    root: frontendRoot,
  },
};

export default nextConfig;
