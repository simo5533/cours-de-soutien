"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function detectPlatform() {
  if (typeof window === "undefined") {
    return { ios: false, android: false, standalone: false };
  }
  const ua = window.navigator.userAgent;
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
  return { ios, android, standalone };
}

/**
 * Enregistre le service worker + UI d’installation (Android / iOS / desktop).
 * Chrome n’émet `beforeinstallprompt` que si le SW est valide — d’où l’UI manuelle aussi.
 */
export function PwaRegister() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [swReady, setSwReady] = useState(false);
  const [swError, setSwError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const platform = useMemo(() => detectPlatform(), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("pwa-install-dismissed") === "1") {
        setDismissed(true);
      }
    } catch {
      /* */
    }

    if (!("serviceWorker" in navigator)) {
      setSwError("Ce navigateur ne supporte pas l’installation d’application.");
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(async (reg) => {
        setSwReady(true);
        await reg.update().catch(() => undefined);
      })
      .catch((e: unknown) => {
        setSwError(e instanceof Error ? e.message : "Échec enregistrement service worker");
      });

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  if (platform.standalone || dismissed) return null;

  const showFab = !open;

  return (
    <>
      {showFab ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed end-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[180] rounded-full border border-border-soft bg-white/95 px-4 py-2.5 text-sm font-semibold text-navy shadow-lg shadow-electric/20 backdrop-blur-md dark:bg-zinc-900/95 dark:text-white"
          aria-label="Installer l’application"
        >
          Installer l’app
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[190] mx-auto max-w-md rounded-2xl border border-border-soft bg-white/98 p-4 shadow-xl shadow-electric/15 backdrop-blur-md dark:bg-zinc-900/98">
          <p className="text-sm font-semibold text-navy dark:text-white">
            Installer CorrecteurPlus
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-text">
            Ajoute l’application sur ton écran d’accueil pour l’ouvrir comme une app mobile.
          </p>

          {deferred ? (
            <button
              type="button"
              className="btn-primary mt-3 w-full !py-2.5 text-sm"
              onClick={async () => {
                await deferred.prompt();
                await deferred.userChoice;
                setOpen(false);
                setDeferred(null);
                try {
                  sessionStorage.setItem("pwa-install-dismissed", "1");
                } catch {
                  /* */
                }
                setDismissed(true);
              }}
            >
              Installer maintenant
            </button>
          ) : platform.ios ? (
            <ol className="mt-3 list-decimal space-y-1.5 ps-4 text-xs text-muted-text">
              <li>
                Appuie sur <strong className="text-navy dark:text-white">Partager</strong>{" "}
                (carré avec flèche ↑) en bas de Safari
              </li>
              <li>
                Choisis <strong className="text-navy dark:text-white">Sur l’écran d’accueil</strong>
              </li>
              <li>
                Confirme avec <strong className="text-navy dark:text-white">Ajouter</strong>
              </li>
            </ol>
          ) : platform.android ? (
            <ol className="mt-3 list-decimal space-y-1.5 ps-4 text-xs text-muted-text">
              <li>
                Menu <strong className="text-navy dark:text-white">⋮</strong> en haut à droite de Chrome
              </li>
              <li>
                Touche{" "}
                <strong className="text-navy dark:text-white">Installer l’application</strong> ou{" "}
                <strong className="text-navy dark:text-white">Ajouter à l’écran d’accueil</strong>
              </li>
            </ol>
          ) : (
            <p className="mt-3 text-xs text-muted-text">
              Sur ordinateur : menu du navigateur →{" "}
              <strong className="text-navy dark:text-white">Installer CorrecteurPlus</strong>{" "}
              (icône ⊕ dans la barre d’adresse Chrome).
              {swReady ? " Application prête à être installée." : null}
            </p>
          )}

          {swError ? (
            <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">{swError}</p>
          ) : null}

          <button
            type="button"
            className="btn-secondary mt-3 w-full !py-2.5 text-sm"
            onClick={() => {
              setOpen(false);
              try {
                sessionStorage.setItem("pwa-install-dismissed", "1");
              } catch {
                /* */
              }
              setDismissed(true);
            }}
          >
            Plus tard
          </button>
        </div>
      ) : null}
    </>
  );
}
