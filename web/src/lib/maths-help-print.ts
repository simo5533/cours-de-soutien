/**
 * Page HTML pour impression ou PDF via le navigateur (aide scolaire IA — toutes matières).
 */

/**
 * Retire le Markdown / délimiteurs LaTeX courants pour un affichage texte lisible.
 */
export function sanitizeMathsHelpPlainText(s: string): string {
  let t = s.replace(/\r\n/g, "\n");
  // **gras** et __gras__
  t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
  t = t.replace(/__([^_]+)__/g, "$1");
  // Titres ## ...
  t = t.replace(/^#{1,6}\s+/gm, "");
  // `code`
  t = t.replace(/`([^`]+)`/g, "$1");
  // Blocs $$ ... $$ et $ ... $
  t = t.replace(/\$\$([^$]+)\$\$/g, "$1");
  t = t.replace(/\$([^$\n]+)\$/g, "$1");
  return t.trim();
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildMathsHelpHtmlDocument(reply: string): string {
  const date = new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
  const body = escapeHtml(sanitizeMathsHelpPlainText(reply));
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Aide scolaire (IA)</title>
<style>
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; }
  h1 { font-size: 1.35rem; margin-bottom: 0.5rem; }
  .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
  pre { white-space: pre-wrap; word-break: break-word; font-family: inherit; line-height: 1.6; margin: 0; }
  @media print { body { margin: 1cm; } }
</style>
</head>
<body>
  <h1>Aide scolaire (IA)</h1>
  <p class="meta">Généré le ${escapeHtml(date)}</p>
  <pre>${body}</pre>
</body>
</html>`;
}
