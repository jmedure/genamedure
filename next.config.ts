import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phone / LAN testing hits the dev server by IP; allow those origins
  // so client bundles hydrate (ticker, stats, gallery JS).
  allowedDevOrigins: ["192.168.1.229", "127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
