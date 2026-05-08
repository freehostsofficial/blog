import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `output: 'export'` is removed — OpenNext handles the build for Cloudflare Workers.
  // All pages are still statically generated at build time via generateStaticParams.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
