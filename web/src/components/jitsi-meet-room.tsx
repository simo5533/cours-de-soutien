"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (
      domain: string,
      options: Record<string, unknown>,
    ) => { dispose: () => void };
  }
}

type JitsiMeetRoomProps = {
  roomName: string;
  displayName: string;
  domain?: string;
  isTeacher?: boolean;
};

export function JitsiMeetRoom({
  roomName,
  displayName,
  domain = "meet.jit.si",
  isTeacher = false,
}: JitsiMeetRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ dispose: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current) return;

      if (!window.JitsiMeetExternalAPI) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector(
            'script[src*="external_api.js"]',
          );
          if (existing) {
            existing.addEventListener("load", () => resolve());
            return;
          }
          const script = document.createElement("script");
          script.src = `https://${domain}/external_api.js`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Jitsi"));
          document.body.appendChild(script);
        });
      }

      if (cancelled || !containerRef.current || !window.JitsiMeetExternalAPI) {
        return;
      }

      apiRef.current?.dispose();

      apiRef.current = new window.JitsiMeetExternalAPI(domain, {
        roomName,
        parentNode: containerRef.current,
        width: "100%",
        height: "100%",
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          MOBILE_APP_PROMO: false,
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "desktop",
            "chat",
            "raisehand",
            "tileview",
            "fullscreen",
            "hangup",
          ],
        },
      });
    }

    init().catch(() => {
      if (!cancelled) setError("Impossible de charger la visioconférence.");
    });

    return () => {
      cancelled = true;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [roomName, displayName, domain, isTeacher]);

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
        {error}
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[min(70vh,560px)] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900 dark:border-zinc-700"
    />
  );
}
