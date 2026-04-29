/**
 * Build Vercel / prod : migrations + comptes démo si base vide + next build.
 * SKIP_DB_ON_BUILD=1 → next build uniquement (ex. CI sans Postgres).
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
    env: process.env,
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

let code = run("prisma migrate deploy", "npx", ["prisma", "migrate", "deploy"]);
if (code !== 0) process.exit(code);

code = run(
  "ensure-demo-users",
  process.execPath,
  [ensureDemoScript],
);
if (code !== 0) process.exit(code);

process.exit(run("next build", "npx", ["next", "build"]));
