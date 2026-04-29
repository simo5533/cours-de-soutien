import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const cwd = process.cwd();
const parentDir = path.join(cwd, "..");
/** True uniquement si l’app Next est dans `…/repo/web` (monorepo plein repo), pas si Vercel Root Directory = `web`. */
const isNestedWebFolderInRepo =
  path.basename(cwd) === "web" &&
  fs.existsSync(path.join(parentDir, "package.json")) &&
  fs.existsSync(path.join(cwd, "package.json"));

/**
 * Déploiement Git depuis la racine du repo : Vercel attend `.next` sous `path0`, pas `path0/web/.next`.
 * Si Root Directory Vercel = `web`, ne pas dévier `distDir` (sinon écriture hors projet).
 */
const nextConfig: NextConfig = {
  ...(process.env.VERCEL === "1" && isNestedWebFolderInRepo ? { distDir: "../.next" } : {}),
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
