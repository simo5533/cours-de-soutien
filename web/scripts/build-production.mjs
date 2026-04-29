/**
 * Build Vercel / prod : migrations + comptes démo si base vide + next build.
 * SKIP_DB_ON_BUILD=1 → next build uniquement (ex. CI sans Postgres).
 */
import { spawnSync } from "node:child_process";

function run(cmd, args) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  return r.status ?? 1;
}

if (process.env.SKIP_DB_ON_BUILD === "1") {
  process.exit(run("npx", ["next", "build"]));
}

if (!process.env.DATABASE_URL?.trim()) {
  console.warn("[build-production] DATABASE_URL absent — build Next uniquement.");
  process.exit(run("npx", ["next", "build"]));
}

let code = run("npx", ["prisma", "migrate", "deploy"]);
if (code !== 0) process.exit(code);

code = run("npx", ["tsx", "prisma/ensure-demo-users.ts"]);
if (code !== 0) process.exit(code);

process.exit(run("npx", ["next", "build"]));
