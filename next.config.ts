/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lssabz2dh97bsl8f.public.blob.vercel-storage.com"
      }
    ]
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

// export default nextConfig;
export default withBundleAnalyzer(nextConfig);