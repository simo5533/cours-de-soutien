/**
 * Permet d'exécuter la CLI Prisma depuis la racine du dépôt (`COURS SOUTIEN`)
 * alors que le schéma et la base sont dans `web/`.
 */
const path = require("node:path");
const { config } = require("dotenv");
const { defineConfig } = require("prisma/config");

const repoRoot = __dirname;
config({ path: path.join(repoRoot, "web", ".env") });

let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl?.startsWith("file:")) {
  const raw = databaseUrl.slice("file:".length);
  if (!path.isAbsolute(raw)) {
    databaseUrl = "file:" + path.join(repoRoot, "web", raw.replace(/^\.\//, ""));
  }
}

module.exports = defineConfig({
  schema: "web/prisma/schema.prisma",
  migrations: {
    path: "web/prisma/migrations",
    seed: "npm run db:seed --prefix web",
  },
  datasource: {
    url:
      databaseUrl ??
      "file:" + path.join(repoRoot, "web", "prisma", "dev.db"),
  },
});
