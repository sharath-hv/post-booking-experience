import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname),
  // next.config redirects() are not supported with output: "export".
  // Legacy URLs are handled by app/kyc/car-allocation-* routes.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
