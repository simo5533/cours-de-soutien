import type { MetadataRoute } from "next";
import { getAppBaseUrl } from "@/lib/stripe-server";

export default function robots(): MetadataRoute.Robots {
  const base = getAppBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/fr/eleve", "/ar/eleve", "/fr/admin", "/ar/admin", "/fr/professeur", "/ar/professeur"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
