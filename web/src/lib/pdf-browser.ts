/**
 * Préparation d'un PDF dans le navigateur, avant envoi :
 * - PDF avec texte et assez léger → envoyé tel quel (le serveur extrait le texte) ;
 * - PDF scanné (pages sans texte) ou trop lourd → chaque page est convertie en JPEG compressé.
 * Vercel refuse les requêtes de plus de 4,5 Mo : l'envoi total reste sous UPLOAD_BUDGET_BYTES.
 */

const UPLOAD_BUDGET_BYTES = 3.8 * 1024 * 1024;
const MIN_TEXT_CHARS_PER_PAGE = 30;
const RENDER_STEPS = [
  { maxSide: 1600, quality: 0.75 },
  { maxSide: 1300, quality: 0.65 },
  { maxSide: 1050, quality: 0.6 },
  { maxSide: 850, quality: 0.55 },
];

export class PdfPrepareError extends Error {
  constructor(public readonly userMessage: string) {
    super(userMessage);
    this.name = "PdfPrepareError";
  }
}

export type PreparedPdf =
  | { mode: "pdf"; file: File; pages: number }
  | { mode: "images"; files: File[]; pages: number };

type PdfDoc = Awaited<ReturnType<typeof import("unpdf").getDocumentProxy>>;

async function renderPage(doc: PdfDoc, pageNumber: number, maxBytes: number, baseName: string): Promise<File> {
  const page = await doc.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  let last: Blob | null = null;
  for (const step of RENDER_STEPS) {
    const scale = Math.min(3, step.maxSide / Math.max(base.width, base.height));
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new PdfPrepareError("Votre navigateur ne permet pas de lire ce PDF. Envoyez des photos des pages.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport, canvas } as Parameters<typeof page.render>[0]).promise;
    last = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", step.quality));
    canvas.width = 0;
    canvas.height = 0;
    if (last && last.size <= maxBytes) break;
  }
  page.cleanup();
  if (!last) throw new PdfPrepareError("Une page du PDF n'a pas pu être convertie. Envoyez des photos des pages.");
  return new File([last], `${baseName}-page-${pageNumber}.jpg`, { type: "image/jpeg" });
}

export async function preparePdfForUpload(file: File, maxPages: number): Promise<PreparedPdf> {
  const { getDocumentProxy, extractText } = await import("unpdf");
  let doc: PdfDoc;
  try {
    doc = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
  } catch {
    throw new PdfPrepareError(
      "Ce PDF n'a pas pu être ouvert (fichier protégé par mot de passe ou endommagé). Essayez un autre fichier ou envoyez des photos.",
    );
  }

  try {
    const pages = doc.numPages;
    if (pages > maxPages) {
      throw new PdfPrepareError(
        `Ce document compte ${pages} pages. L'analyse des PDF se fait jusqu'à ${maxPages} pages : envoyez uniquement les pages de l'exercice.`,
      );
    }

    let hasTextOnEveryPage = false;
    try {
      const { text } = await extractText(doc, { mergePages: false });
      hasTextOnEveryPage = text.every((t) => t.replace(/\s+/g, "").length >= MIN_TEXT_CHARS_PER_PAGE);
    } catch {
      hasTextOnEveryPage = false;
    }

    if (hasTextOnEveryPage && file.size <= UPLOAD_BUDGET_BYTES) {
      return { mode: "pdf", file, pages };
    }

    const baseName = file.name.replace(/\.pdf$/i, "").slice(0, 60) || "document";
    const perPage = Math.floor(UPLOAD_BUDGET_BYTES / pages);
    const files: File[] = [];
    for (let i = 1; i <= pages; i++) {
      files.push(await renderPage(doc, i, perPage, baseName));
    }
    return { mode: "images", files, pages };
  } finally {
    void doc.destroy();
  }
}
