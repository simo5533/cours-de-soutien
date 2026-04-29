/**
 * Vérifie la config aide scolaire IA (toutes matières) : OpenAI et/ou Ollama.
 */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(__dirname, "..");
const envPath = resolve(webRoot, ".env");

if (!existsSync(envPath)) {
  console.error("Fichier introuvable :", envPath);
  process.exit(1);
}

config({ path: envPath });

const openai = process.env.OPENAI_API_KEY?.trim();
const prefer = process.env.MATHS_AI_PROVIDER?.trim().toLowerCase();
const host = (process.env.OLLAMA_HOST || "http://127.0.0.1:11434").replace(/\/$/, "");
const ollamaModel = process.env.OLLAMA_MODEL?.trim() || "llama3.2";

if (openai) {
  console.log("OPENAI_API_KEY : OK (longueur", openai.length, "caractères).");
  console.log("  Modèle :", process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini (défaut)");
}

if (prefer === "openai" || prefer === "ollama") {
  console.log("MATHS_AI_PROVIDER :", prefer, "(nom historique — couvre toutes les matières)");
}

if (prefer === "openai" && !openai) {
  console.error("MATHS_AI_PROVIDER=openai mais OPENAI_API_KEY est vide.");
  process.exit(1);
}

if (!openai || prefer === "ollama") {
  console.log("Mode / secours Ollama :", host, "| modèle :", ollamaModel);
  try {
    const r = await fetch(`${host}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!r.ok) {
      console.error("Ollama : HTTP", r.status);
      if (!openai) process.exit(1);
    } else {
      const j = await r.json();
      const names = (j.models || []).map((m) => m.name);
      console.log("  Modèles :", names.length ? names.join(", ") : "(aucun — ollama pull " + ollamaModel + ")");
    }
  } catch {
    console.error("Ollama inaccessible sur", host);
    if (!openai) {
      console.error("Ajoutez OPENAI_API_KEY dans web/.env ou installez Ollama : https://ollama.com");
      process.exit(1);
    }
    console.warn("(OpenAI est configuré — Ollama optionnel.)");
  }
}

if (openai && (!prefer || prefer === "openai")) {
  console.log("→ L’app utilisera OpenAI pour l’aide aux devoirs (toutes matières).");
} else if (prefer === "ollama" || !openai) {
  console.log("→ L’app utilisera Ollama pour l’aide aux devoirs (si Ollama tourne).");
}

process.exit(0);
