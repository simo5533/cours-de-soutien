"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { useRef, useState } from "react";

const MAX_IMAGE_SIDE = 1600;
const JPEG_QUALITY = 0.82;

/** Réduit la photo dans le navigateur (moins lourde à envoyer, moins coûteuse à analyser). */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

type Props = {
  remaining: number;
  maxPdfPages: number;
  maxImages: number;
  upgradeHref: string | null;
};

export function CorrecteurUpload({ remaining, maxPdfPages, maxImages, upgradeHref }: Props) {
  const router = useRouter();
  const photoInput = useRef<HTMLInputElement>(null);
  const docInput = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cta, setCta] = useState<{ label: string; href: string } | null>(null);
  const blocked = remaining <= 0;

  function pick(list: FileList | null, kind: "photo" | "doc") {
    setError(null);
    setCta(null);
    if (!list || list.length === 0) return;
    const arr = Array.from(list);
    if (kind === "photo" && arr.length > maxImages) {
      setError(`Jusqu'à ${maxImages} photos par analyse.`);
      return;
    }
    setFiles(kind === "doc" ? arr.slice(0, 1) : arr);
  }

  const isPhotos = files.length > 0 && files.every((f) => f.type.startsWith("image/"));
  const creditsHint = isPhotos
    ? `${files.length} crédit${files.length > 1 ? "s" : ""}`
    : files.length
      ? "1 crédit par page"
      : null;

  async function submit() {
    if (!files.length) {
      setError("Ajoutez une photo ou un PDF.");
      return;
    }
    setPending(true);
    setError(null);
    setCta(null);
    try {
      const prepared = isPhotos ? await Promise.all(files.map(compressImage)) : files;
      const fd = new FormData();
      for (const f of prepared) fd.append("files", f);
      const key =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const res = await fetch("/api/correcteur/analyser", {
        method: "POST",
        body: fd,
        headers: { "X-Idempotency-Key": key },
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        correctionId?: string;
        cta?: string | null;
        href?: string | null;
      };
      if (!res.ok || !data.correctionId) {
        setError(data.error || "La correction n'a pas pu aboutir. Réessayez.");
        if (data.cta && data.href) setCta({ label: data.cta, href: data.href });
        return;
      }
      router.push(`/eleve/historique/${data.correctionId}`);
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="card-elevated space-y-5 p-5 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => photoInput.current?.click()}
          disabled={pending || blocked}
          className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-electric/40 bg-electric/[0.04] px-4 py-4 text-center transition hover:border-electric hover:bg-electric/[0.08] disabled:opacity-50"
        >
          <span className="text-base font-bold text-navy">Prendre ou choisir une photo</span>
          <span className="text-xs text-muted-text">
            JPG, PNG — jusqu&apos;à {maxImages} photos
          </span>
        </button>
        <button
          type="button"
          onClick={() => docInput.current?.click()}
          disabled={pending || blocked}
          className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-border-soft bg-white/60 px-4 py-4 text-center transition hover:border-electric disabled:opacity-50"
        >
          <span className="text-base font-bold text-navy">Envoyer un PDF</span>
          <span className="text-xs text-muted-text">
            Analyse des PDF jusqu&apos;à {maxPdfPages} pages
          </span>
        </button>
      </div>

      <input
        ref={photoInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => pick(e.target.files, "photo")}
      />
      <input
        ref={docInput}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => pick(e.target.files, "doc")}
      />

      {files.length ? (
        <div className="rounded-xl border border-border-soft bg-white/70 px-4 py-3 text-sm">
          <ul className="space-y-1 text-navy">
            {files.map((f) => (
              <li key={`${f.name}-${f.size}`} className="truncate">
                {f.name}
              </li>
            ))}
          </ul>
          {creditsHint ? <p className="mt-2 text-xs text-muted-text">Coût : {creditsHint}</p> : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={submit}
        disabled={pending || blocked || files.length === 0}
        className="btn-primary w-full justify-center !py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Correction en cours…" : "Corriger cet exercice"}
      </button>
      {pending ? (
        <p className="text-center text-xs text-muted-text">
          L&apos;analyse prend en général 10 à 30 secondes.
        </p>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          <p>{error}</p>
          {cta ? (
            <Link href={cta.href} className="mt-2 inline-flex font-semibold underline">
              {cta.label}
            </Link>
          ) : null}
        </div>
      ) : null}

      {blocked && upgradeHref ? (
        <Link href={upgradeHref} className="btn-secondary w-full justify-center">
          Voir les formules
        </Link>
      ) : null}
    </div>
  );
}
