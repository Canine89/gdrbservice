import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
        pathname: "/uc**",
      },
      {
        protocol: "https",
        hostname: "fresh-elbow-78a.notion.site",
        port: "",
        pathname: "/image/**",
      },
    ],
  },
};

export default nextConfig;
