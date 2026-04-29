/**
 * Build Vercel / prod : migrations + comptes démo si base vide + next build.
 * SKIP_DB_ON_BUILD=1 → next build uniquement (ex. CI sans Postgres).
 * SKIP_PRISMA_MIGRATE_ON_BUILD=1 → saut de prisma migrate deploy (appliquer les migrations ailleurs).
 * Neon : si DIRECT_URL est absent, on tente une URL « directe » en retirant « -pooler » du hostname
 * et le paramètre pgbouncer (schéma courant Neon + Prisma migrate).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const ensureDemoScript = path.join(__dirname, "ensure-demo-users.mjs");

/**
 * Neon : host « pooled » contient souvent « -pooler » ; prisma migrate deploy a besoin de la connexion directe.
 * @param {string} databaseUrl
 * @returns {string | null}
 */
function neonMigrateUrlFromPooled(databaseUrl) {
  try {
    const u = new URL(databaseUrl);
    if (!u.hostname.includes("neon.tech")) return null;
    let changed = false;
    if (u.hostname.includes("-pooler")) {
      u.hostname = u.hostname.replace("-pooler", "");
      changed = true;
    }
    if (u.searchParams.has("pgbouncer")) {
      u.searchParams.delete("pgbouncer");
      changed = true;
    }
    /* Souvent incompatible avec prisma migrate ; la connexion directe Neon n’en a généralement pas besoin. */
    if (u.searchParams.has("channel_binding")) {
      u.searchParams.delete("channel_binding");
      changed = true;
    }
    return changed ? u.toString() : null;
  } catch {
    return null;
  }
}

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

const pooledUrl = process.env.DATABASE_URL.trim();
const explicitDirect = process.env.DIRECT_URL?.trim();
const neonDerived =
  !explicitDirect && pooledUrl ? neonMigrateUrlFromPooled(pooledUrl) : null;
const migrateDbUrl = explicitDirect || neonDerived || pooledUrl;

if (explicitDirect) {
  console.log(
    "[build-production] migrations : DIRECT_URL → utilisé pour prisma migrate deploy (Neon sans pooler).",
  );
} else if (neonDerived) {
  console.log(
    "[build-production] migrations : Neon — URL dérivée pour migrate (hostname sans « -pooler », pgbouncer retiré si présent).",
  );
}

if (process.env.SKIP_PRISMA_MIGRATE_ON_BUILD === "1") {
  console.warn(
    "[build-production] SKIP_PRISMA_MIGRATE_ON_BUILD=1 — prisma migrate deploy ignoré. Appliquer les migrations en prod (Neon SQL Editor, CI ou machine locale avec DATABASE_URL).",
  );
} else {
  const migrateCode = run("prisma migrate deploy", "npx", ["prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: migrateDbUrl },
  });
  if (migrateCode !== 0) {
    console.error(
      "[build-production] Migrate deploy : vérifiez DATABASE_URL (prod Neon), ajoutez DIRECT_URL si vous utilisez le pooler, ou appliquez SKIP_PRISMA_MIGRATE_ON_BUILD=1 après migration manuelle.",
    );
    process.exit(migrateCode);
  }
}

let code = run(
  "ensure-demo-users",
  process.execPath,
  [ensureDemoScript],
);
if (code !== 0) process.exit(code);

process.exit(run("next build", "npx", ["next", "build"]));
