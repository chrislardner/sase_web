import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '**',
      },
    ],
    dangerouslyAllowSVG: false,
  },

  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,  

      fs: false,
    };
    
    return config;
  },
};

export default nextConfig;
