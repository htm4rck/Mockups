import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    // Include all .md files so they're available in standalone runtime
    "/**": ["**/*.md"],
  },
};

export default nextConfig;
