import { routing } from "@/i18n/routing";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

function homeForRole(role: string) {
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

const AUTH_SECRET = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export default async function middleware(request: NextRequest) {
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
  // Redirections i18n (locale manquante, etc.) — ne pas s’appuyer uniquement sur l’en-tête Location.
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const pathWithoutLocale =
    pathname.replace(/^\/(fr|ar)(?=\/|$)/, "") || "/";

  /** Sans slash final pour comparer chemins (/connexion vs /connexion/). */
  const pathClean =
    pathWithoutLocale.replace(/\/$/, "") || "/";

  const locale = pathname.split("/")[1] || routing.defaultLocale;

  const rule = protectedPrefixes.find(
    (p) =>
      pathWithoutLocale === p.prefix ||
      pathWithoutLocale.startsWith(`${p.prefix}/`),
  );

  /**
   * Connexion / apres-connexion : même JWT que les routes protégées (Edge).
   * Évite ERR_TOO_MANY_REDIRECTS quand auth() (RSC) et getToken (middleware) diverge.
   */
  const authGatePaths =
    pathClean === "/connexion" ||
    pathClean === "/apres-connexion" ||
    !!rule;

  let token: Awaited<ReturnType<typeof getToken>> = null;
  if (authGatePaths) {
    token = await getToken({
      req: request,
      secret: AUTH_SECRET,
    });
  }

  if (pathClean === "/connexion" && token) {
    return NextResponse.redirect(
      new URL(`/${locale}/apres-connexion`, request.url),
    );
  }

  if (pathClean === "/apres-connexion" && !token) {
    return NextResponse.redirect(new URL(`/${locale}/connexion`, request.url));
  }

  if (rule) {
    if (!token) {
      const u = new URL(`/${locale}/connexion`, request.url);
      u.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(u);
    }

    if (token.role !== rule.role) {
      return NextResponse.redirect(
        new URL(`/${locale}${homeForRole(String(token.role))}`, request.url),
      );
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
