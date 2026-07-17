import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/materials/visnyk-1-2-2020-50b2542a1.html",
        destination: "https://www.socosvita.kiev.ua/Visnyk_1_2_2020",
        permanent: false,
      },
      {
        source: "/materials/:slug(visnyk-.*)",
        destination: "https://www.socosvita.kiev.ua/publishing/bulletin/issues-list",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
