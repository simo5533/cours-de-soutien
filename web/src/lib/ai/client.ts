/**
 * Client chat/completions unique (OpenAI, ou Ollama local sans clé pour le texte).
 * La clé OpenAI reste strictement côté serveur.
 */
import { parseOpenaiUsageFromResponse, type OpenaiUsageMetrics } from "@/lib/ai/pricing";

export type ChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail?: "low" | "high" | "auto" } };

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | ChatContentPart[];
};

export type ChatResult = {
  content: string;
  usage: OpenaiUsageMetrics;
  durationMs: number;
  provider: "openai" | "ollama";
};

/** Erreur IA : `userMessage` est affichable, `detail` reste dans les logs serveur. */
export class AiServiceError extends Error {
  constructor(
    public readonly userMessage: string,
    public readonly detail: string,
    public readonly status: number = 502,
  ) {
    super(detail);
    this.name = "AiServiceError";
  }
}

const GENERIC_UNAVAILABLE =
  "Le service de correction est momentanément indisponible. Réessayez dans quelques instants — aucun crédit n'a été décompté.";

function hasOpenAiKey(): boolean {
  return !!process.env.OPENAI_API_KEY?.trim();
}

function shouldUseOllama(): boolean {
  if (hasOpenAiKey()) return false;
  if (process.env.VERCEL === "1") return false;
  return process.env.MATHS_AI_PROVIDER?.trim().toLowerCase() === "ollama";
}

function abortAfterMs(ms: number): AbortSignal {
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

function hasImage(messages: ChatMessage[]): boolean {
  return messages.some(
    (m) => Array.isArray(m.content) && m.content.some((p) => p.type === "image_url"),
  );
}

export async function callChat(params: {
  model: string;
  messages: ChatMessage[];
  maxTokens: number;
  temperature?: number;
  json?: boolean;
  timeoutMs?: number;
}): Promise<ChatResult> {
  const ollama = shouldUseOllama();
  if (!ollama && !hasOpenAiKey()) {
    throw new AiServiceError(GENERIC_UNAVAILABLE, "OPENAI_API_KEY manquante côté serveur.", 503);
  }
  if (ollama && hasImage(params.messages)) {
    throw new AiServiceError(
      "L'analyse de photos n'est pas disponible sur cette installation.",
      "Ollama local : images non prises en charge.",
      503,
    );
  }

  const url = ollama
    ? `${(process.env.OLLAMA_HOST || "http://127.0.0.1:11434").replace(/\/$/, "")}/v1/chat/completions`
    : "https://api.openai.com/v1/chat/completions";
  const model = ollama ? process.env.OLLAMA_MODEL?.trim() || "llama3.2" : params.model;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!ollama) headers.Authorization = `Bearer ${process.env.OPENAI_API_KEY!.trim()}`;

  const started = Date.now();
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature: params.temperature ?? 0.2,
        max_tokens: params.maxTokens,
        messages: params.messages,
        ...(params.json ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: abortAfterMs(params.timeoutMs ?? 100_000),
    });
  } catch (e) {
    const timeout = e instanceof Error && e.name === "AbortError";
    throw new AiServiceError(
      timeout
        ? "L'analyse a pris trop de temps. Réessayez — aucun crédit n'a été décompté."
        : GENERIC_UNAVAILABLE,
      `fetch ${ollama ? "ollama" : "openai"}: ${e instanceof Error ? e.message : String(e)}`,
      504,
    );
  }

  const raw = await res.text();
  if (!res.ok) {
    let detail = raw.slice(0, 400);
    try {
      const j = JSON.parse(raw) as { error?: { message?: string } };
      if (j.error?.message) detail = j.error.message;
    } catch {
      /* corps non JSON */
    }
    const userMessage =
      res.status === 429
        ? "Le service est très sollicité en ce moment. Réessayez dans une minute — aucun crédit n'a été décompté."
        : res.status === 400 && hasImage(params.messages)
          ? "Cette image n'a pas pu être lue. Essayez une photo plus nette, bien cadrée, au format JPG ou PNG."
          : GENERIC_UNAVAILABLE;
    throw new AiServiceError(userMessage, `HTTP ${res.status}: ${detail}`, res.status === 429 ? 503 : 502);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new AiServiceError(GENERIC_UNAVAILABLE, "Réponse IA non JSON.");
  }
  const content = (
    data as { choices?: Array<{ message?: { content?: string | null } }> }
  ).choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new AiServiceError(GENERIC_UNAVAILABLE, "Réponse IA vide.");
  }

  const usage = parseOpenaiUsageFromResponse(data);
  if (!usage.model) usage.model = model;

  return {
    content,
    usage,
    durationMs: Date.now() - started,
    provider: ollama ? "ollama" : "openai",
  };
}
