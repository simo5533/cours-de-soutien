/** Types et helpers client pour Lemon.js (checkout overlay sur le site). */

export type LemonSqueezyEvent = {
  event: string;
  data?: { id?: string | number };
};

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Setup: (options: { eventHandler: (event: LemonSqueezyEvent) => void }) => void;
      Refresh?: () => void;
      Url: {
        Open: (url: string) => void;
        Close: () => void;
      };
    };
  }
}

let setupDone = false;

/** Enregistre un handler global (une seule fois) pour Checkout.Success. */
export function setupLemonSqueezyCheckout(
  onSuccess: (orderId: string) => void,
): void {
  if (typeof window === "undefined" || !window.LemonSqueezy) return;

  if (!setupDone) {
    window.LemonSqueezy.Setup({
      eventHandler: (event) => {
        if (event.event === "Checkout.Success" && event.data?.id != null) {
          onSuccess(String(event.data.id));
        }
      },
    });
    setupDone = true;
  }

  window.createLemonSqueezy?.();
}

export function openLemonSqueezyCheckout(url: string): void {
  window.LemonSqueezy?.Url.Open(url);
}

export function isLemonSqueezyReady(): boolean {
  return typeof window !== "undefined" && !!window.LemonSqueezy;
}
