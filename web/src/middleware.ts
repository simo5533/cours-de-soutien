import { auth } from "@/auth";
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import type { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

function homeForRole(role: string | undefined) {
  switch (role) {
    case "ELEVE":
      return "/eleve";
    case "PROFESSEUR":
      return "/professeur";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}

const protectedPrefixes = [
  { prefix: "/eleve", role: "ELEVE" as const },
  { prefix: "/professeur", role: "PROFESSEUR" as const },
  { prefix: "/admin", role: "ADMIN" as const },
];

/**
 * Utiliser `auth()` (session Auth.js) au lieu de `getToken()` :
 * `role` et les claims customs sont alignés avec `auth()` / SiteHeader — évite « connecté » dans le header mais pas sur /eleve.
 */
export default auth(async function middleware(request: NextAuthRequest) {
  const pathname = request.nextUrl.pathname;

  /** Routes App Router sous `[locale]` : sans `/fr|ar/` → 404 */
  const hasLocalePrefix = /^\/(fr|ar)(\/|$)/.test(pathname);
  if (
    pathname !== "/" &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/_vercel") &&
    !hasLocalePrefix
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/fr${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    return NextResponse.redirect(url);
  }

  const intlResponse = intlMiddleware(request);
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const session = request.auth;
  const role = session?.user?.role;

  const pathWithoutLocale =
    pathname.replace(/^\/(fr|ar)(?=\/|$)/, "") || "/";

  const pathClean =
    pathWithoutLocale.replace(/\/$/, "") || "/";

  const locale = pathname.split("/")[1] || routing.defaultLocale;

  const rule = protectedPrefixes.find(
    (p) =>
      pathWithoutLocale === p.prefix ||
      pathWithoutLocale.startsWith(`${p.prefix}/`),
  );

  if (pathClean === "/connexion" && session?.user) {
    return NextResponse.redirect(
      new URL(`/${locale}/apres-connexion`, request.url),
    );
  }

  if (pathClean === "/apres-connexion" && !session?.user) {
    return NextResponse.redirect(new URL(`/${locale}/connexion`, request.url));
  }

  if (rule) {
    if (!session?.user) {
      const u = new URL(`/${locale}/connexion`, request.url);
      u.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(u);
    }

    if (role !== rule.role) {
      return NextResponse.redirect(
        new URL(`/${locale}${homeForRole(role)}`, request.url),
      );
    }
  }

  return intlResponse;
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
