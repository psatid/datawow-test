import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/admin/home",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
