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
    dangerouslyAllowSVG: true,
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
