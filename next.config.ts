import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**",
      },
    ],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Accept-CH",
          value: "Sec-CH-Prefers-Color-Scheme",
        },
      ],
    },
  ],
};

export default nextConfig;
