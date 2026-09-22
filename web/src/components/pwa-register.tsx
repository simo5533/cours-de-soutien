"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Enregistre le service worker et propose « Installer l’app » quand le navigateur le permet.
 */
export function PwaRegister() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* ignore — HTTPS requis hors localhost */
    });

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <div className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[180] mx-auto max-w-md rounded-2xl border border-border-soft bg-white/95 p-4 shadow-xl shadow-electric/15 backdrop-blur-md dark:bg-zinc-900/95">
      <p className="text-sm font-semibold text-navy dark:text-white">
        Installer CorrecteurPlus
      </p>
      <p className="mt-1 text-xs text-muted-text">
        Ajoute l’app sur ton écran d’accueil pour un accès rapide, comme une application mobile.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn-primary flex-1 !py-2.5 text-sm"
          onClick={async () => {
            await deferred.prompt();
            await deferred.userChoice;
            setVisible(false);
            setDeferred(null);
          }}
        >
          Installer
        </button>
        <button
          type="button"
          className="btn-secondary flex-1 !py-2.5 text-sm"
          onClick={() => {
            setVisible(false);
            setDeferred(null);
          }}
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
