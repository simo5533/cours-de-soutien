/**
 * Copie web/.next → .next à la racine du dépôt pour Vercel lorsque le projet
 * Git est à la racine mais Next vit dans web/.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "web", ".next");
const dest = path.join(root, ".next");

if (!fs.existsSync(src)) {
  console.error("[sync-web-next-output] Absent:", src);
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log("[sync-web-next-output] Copié vers", dest);
