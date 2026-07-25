import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/materials/visnyk-1-2-2020-50b2542a1.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1-2_2020.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-3-4-2020-5ac217cef.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3-4_2020.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-1-2019-e0ba72738.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_1_2019.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-2-2019-643fbc683.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_2_2019.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-3-2019-665fcaf31.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3_2019.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-4-2019-012fd0cbb.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2019.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-2-2018-c27f342ff.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_2_2018.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-3-2018-0ecc8ab18.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_3_2018.pdf",
        permanent: false,
      },
      {
        source: "/materials/visnyk-4-2018-d95ccb926.html",
        destination: "https://www.socosvita.kiev.ua/sites/default/files/Visnyk_4_2018.pdf",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
