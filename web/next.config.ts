import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/:locale/eleve/aide-maths",
        destination: "/:locale/eleve/aide-scolaire",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/eleve/aide-maths-fichier",
        destination: "/api/eleve/aide-scolaire-fichier",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
