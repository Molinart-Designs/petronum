import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/query", destination: "/app/ask", permanent: false },
      { source: "/profile", destination: "/app/profile", permanent: false },
      { source: "/ingest", destination: "/app/admin/ingest", permanent: false },
    ];
  },
};

export default nextConfig;
