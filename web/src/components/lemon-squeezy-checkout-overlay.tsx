"use client";

import Script from "next/script";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useRef } from "react";
import {
  isLemonSqueezyReady,
  openLemonSqueezyCheckout,
  setupLemonSqueezyCheckout,
} from "@/lib/lemon-squeezy-client";

type Props = {
  checkoutUrl: string;
  successPath: string;
};

/** Ouvre le paiement Lemon Squeezy en overlay (l’utilisateur reste sur le site). */
export function LemonSqueezyCheckoutOverlay({ checkoutUrl, successPath }: Props) {
  const router = useRouter();
  const openedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setupLemonSqueezyCheckout((orderId) => {
      router.push(`${successPath}?order_id=${encodeURIComponent(orderId)}`);
    });
  }, [router, successPath]);

  useEffect(() => {
    if (!checkoutUrl || openedUrlRef.current === checkoutUrl) return;

    const tryOpen = () => {
      if (!isLemonSqueezyReady()) return false;
      setupLemonSqueezyCheckout((orderId) => {
        router.push(`${successPath}?order_id=${encodeURIComponent(orderId)}`);
      });
      openLemonSqueezyCheckout(checkoutUrl);
      openedUrlRef.current = checkoutUrl;
      return true;
    };

    if (tryOpen()) return;

    const interval = window.setInterval(() => {
      if (tryOpen()) window.clearInterval(interval);
    }, 80);

    return () => window.clearInterval(interval);
  }, [checkoutUrl, router, successPath]);

  return (
    <Script
      src="https://app.lemonsqueezy.com/js/lemon.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.createLemonSqueezy?.();
        if (checkoutUrl && openedUrlRef.current !== checkoutUrl && isLemonSqueezyReady()) {
          setupLemonSqueezyCheckout((orderId) => {
            router.push(`${successPath}?order_id=${encodeURIComponent(orderId)}`);
          });
          openLemonSqueezyCheckout(checkoutUrl);
          openedUrlRef.current = checkoutUrl;
        }
      }}
    />
  );
}
