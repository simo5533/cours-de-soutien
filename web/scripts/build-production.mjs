/**
 * Build Vercel / prod : migrations + comptes démo si base vide + next build.
 * SKIP_DB_ON_BUILD=1 → next build uniquement (ex. CI sans Postgres).
 * Sur Neon : si migrate deploy échoue avec le pooler, définir DIRECT_URL (connexion
 * sans pooler du dashboard Neon) ; seule l’étape migrate utilisera cette URL.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const ensureDemoScript = path.join(__dirname, "ensure-demo-users.mjs");

function run(label, cmd, args, opts = {}) {
  const shell =
    opts.shell ??
    cmd === "npx";
  console.log(`[build-production] ${label}…`);
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    env: opts.env ?? process.env,
    cwd: opts.cwd ?? webRoot,
    shell,
  });
  const code = r.status ?? 1;
  if (code !== 0) {
    console.error(`[build-production] Échec (code ${code}) — étape : ${label}`);
  }
  return code;
}

if (process.env.SKIP_DB_ON_BUILD === "1") {
  process.exit(run("next build", "npx", ["next", "build"]));
}

if (!process.env.DATABASE_URL?.trim()) {
  console.warn("[build-production] DATABASE_URL absent — build Next uniquement.");
  process.exit(run("next build", "npx", ["next", "build"]));
}

const migrateDbUrl =
  process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();
if (process.env.DIRECT_URL?.trim()) {
  console.log(
    "[build-production] migrations : DIRECT_URL → utilisé pour prisma migrate deploy (Neon sans pooler).",
  );
}
let code = run("prisma migrate deploy", "npx", ["prisma", "migrate", "deploy"], {
  env: { ...process.env, DATABASE_URL: migrateDbUrl },
});
if (code !== 0) process.exit(code);

code = run(
  "ensure-demo-users",
  process.execPath,
  [ensureDemoScript],
);
if (code !== 0) process.exit(code);

process.exit(run("next build", "npx", ["next", "build"]));
