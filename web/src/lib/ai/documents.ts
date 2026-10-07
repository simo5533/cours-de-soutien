/**
 * Contrôle des fichiers AVANT tout appel IA : type, poids, nombre de pages, crédits.
 * Un fichier hors limites n'est jamais transmis au modèle.
 */
import { createHash } from "crypto";
import mammoth from "mammoth";
import { extractText, getDocumentProxy } from "unpdf";
import { ACCEPTED_IMAGE_MIME, FILE_LIMITS } from "@/lib/ai/config";

export class FileRejectedError extends Error {
  constructor(public readonly userMessage: string) {
    super(userMessage);
    this.name = "FileRejectedError";
  }
}

export type InspectedSource =
  | {
      kind: "images";
      dataUrls: string[];
      pages: number;
      credits: number;
      hash: string;
      fileName: string;
    }
  | {
      kind: "pdf" | "docx";
      text: string;
      pages: number;
      credits: number;
      hash: string;
      fileName: string;
    };

function isPdfMagic(b: Uint8Array): boolean {
  return b.length >= 4 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46;
}

function isJpeg(b: Uint8Array): boolean {
  return b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
}

function isPng(b: Uint8Array): boolean {
  return b.length >= 4 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
}

function isWebp(b: Uint8Array): boolean {
  return (
    b.length >= 12 &&
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  );
}

function sniffImageMime(b: Uint8Array): (typeof ACCEPTED_IMAGE_MIME)[number] | null {
  if (isJpeg(b)) return "image/jpeg";
  if (isPng(b)) return "image/png";
  if (isWebp(b)) return "image/webp";
  return null;
}

function collapse(s: string): string {
  return s
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const mb = (n: number) => n * 1024 * 1024;

export async function inspectUploads(files: File[]): Promise<InspectedSource> {
  if (files.length === 0) {
    throw new FileRejectedError("Ajoutez une photo ou un document PDF.");
  }

  const buffers = await Promise.all(files.map(async (f) => new Uint8Array(await f.arrayBuffer())));
  const first = buffers[0];
  const firstName = files[0].name.trim().toLowerCase();

  const allImages = buffers.every((b) => sniffImageMime(b) !== null);
  if (allImages) {
    if (files.length > FILE_LIMITS.maxImagesPerAnalysis) {
      throw new FileRejectedError(
        `Jusqu'à ${FILE_LIMITS.maxImagesPerAnalysis} photos par analyse. Envoyez les autres dans une nouvelle analyse.`,
      );
    }
    const hash = createHash("sha256");
    const dataUrls: string[] = [];
    for (const b of buffers) {
      if (b.length === 0) throw new FileRejectedError("Une des photos est vide.");
      if (b.length > mb(FILE_LIMITS.maxImageMb)) {
        throw new FileRejectedError(
          `Photo trop lourde : jusqu'à ${FILE_LIMITS.maxImageMb} Mo par photo. Réessayez avec une photo moins lourde.`,
        );
      }
      hash.update(b);
      const mime = sniffImageMime(b)!;
      dataUrls.push(`data:${mime};base64,${Buffer.from(b).toString("base64")}`);
    }
    return {
      kind: "images",
      dataUrls,
      pages: dataUrls.length,
      credits: dataUrls.length,
      hash: hash.digest("hex"),
      fileName: files.length > 1 ? `${files.length} photos` : files[0].name,
    };
  }

  if (files.length > 1) {
    throw new FileRejectedError("Envoyez un seul document PDF à la fois (ou plusieurs photos).");
  }

  if (first.length === 0) throw new FileRejectedError("Fichier vide.");
  if (first.length > mb(FILE_LIMITS.maxDocumentMb)) {
    throw new FileRejectedError(
      `Document trop lourd : jusqu'à ${FILE_LIMITS.maxDocumentMb} Mo. Compressez le PDF ou envoyez des photos des pages.`,
    );
  }

  const hash = createHash("sha256").update(first).digest("hex");

  if (firstName.endsWith(".doc") && !firstName.endsWith(".docx")) {
    throw new FileRejectedError(
      "Le format Word ancien (.doc) n'est pas pris en charge. Enregistrez le fichier en PDF ou en .docx.",
    );
  }

  if (isPdfMagic(first) || firstName.endsWith(".pdf")) {
    let pages: number;
    let pdf: Awaited<ReturnType<typeof getDocumentProxy>>;
    try {
      pdf = await getDocumentProxy(new Uint8Array(first));
      pages = pdf.numPages;
    } catch {
      throw new FileRejectedError(
        "Ce PDF n'a pas pu être ouvert (fichier protégé ou endommagé). Essayez un autre fichier ou envoyez des photos.",
      );
    }
    if (pages > FILE_LIMITS.maxPdfPages) {
      throw new FileRejectedError(
        `Ce document compte ${pages} pages. L'analyse des PDF se fait jusqu'à ${FILE_LIMITS.maxPdfPages} pages : envoyez uniquement les pages de l'exercice.`,
      );
    }
    const { text } = await extractText(pdf, { mergePages: true });
    const cleaned = collapse(String(text || ""));
    if (cleaned.length < 20) {
      throw new FileRejectedError(
        "Ce PDF ne contient pas de texte lisible (document scanné). Envoyez plutôt une photo de chaque page.",
      );
    }
    return { kind: "pdf", text: cleaned, pages, credits: pages, hash, fileName: files[0].name };
  }

  const isDocx =
    firstName.endsWith(".docx") ||
    files[0].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (isDocx) {
    const out = await mammoth.extractRawText({ buffer: Buffer.from(first) });
    const text = collapse(out.value || "");
    if (!text.length) throw new FileRejectedError("Impossible de lire le texte de ce document Word.");
    const pages = Math.max(1, Math.ceil(text.length / FILE_LIMITS.docxCharsPerPage));
    if (pages > FILE_LIMITS.maxPdfPages) {
      throw new FileRejectedError(
        `Ce document fait environ ${pages} pages. L'analyse se fait jusqu'à ${FILE_LIMITS.maxPdfPages} pages : gardez uniquement l'exercice.`,
      );
    }
    return { kind: "docx", text, pages, credits: pages, hash, fileName: files[0].name };
  }

  throw new FileRejectedError(
    "Format non pris en charge. Envoyez une photo (JPG, PNG, WebP) ou un document PDF.",
  );
}
