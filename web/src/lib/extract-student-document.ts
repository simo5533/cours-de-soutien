import mammoth from "mammoth";
import { extractText } from "unpdf";

const MAX_BYTES = 8 * 1024 * 1024;

export type StudentUploadKind = "pdf" | "docx";

function collapseWhitespace(s: string): string {
  return s.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
}

function isPdfMagic(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  );
}

/**
 * Extrait du texte brut depuis un PDF ou un Word .docx (fichier élève).
 */
export async function extractTextFromStudentUpload(
  bytes: Uint8Array,
  fileName: string,
  mimeType: string,
): Promise<{ text: string; kind: StudentUploadKind }> {
  if (bytes.length === 0) {
    throw new Error("Fichier vide.");
  }
  if (bytes.length > MAX_BYTES) {
    throw new Error("Fichier trop volumineux (maximum 8 Mo).");
  }

  const name = fileName.trim().toLowerCase();
  const mime = (mimeType || "").toLowerCase();

  if (name.endsWith(".doc") && !name.endsWith(".docx")) {
    throw new Error(
      "Le format Word ancien (.doc) n’est pas pris en charge. Enregistrez le fichier en .docx ou en PDF.",
    );
  }

  const isDocx =
    name.endsWith(".docx") ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isPdf =
    name.endsWith(".pdf") || mime === "application/pdf" || isPdfMagic(bytes);

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
    const text = (result.value || "").replace(/\u0000/g, "").trim();
    if (!text.length) {
      throw new Error("Impossible de lire le texte dans ce document Word.");
    }
    return { text: collapseWhitespace(text), kind: "docx" };
  }

  if (isPdf) {
    const { text } = await extractText(bytes, { mergePages: true });
    const cleaned = String(text || "").replace(/\u0000/g, "").trim();
    if (!cleaned.length) {
      throw new Error(
        "Aucun texte lisible n’a été extrait du PDF (document scanné, protégé ou vide ?).",
      );
    }
    return { text: collapseWhitespace(cleaned), kind: "pdf" };
  }

  throw new Error("Format non pris en charge. Envoyez un fichier PDF ou Word (.docx).");
}
