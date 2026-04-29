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

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  // Redirections i18n (locale manquante, etc.) — ne pas s’appuyer uniquement sur l’en-tête Location.
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const pathname = request.nextUrl.pathname;
  const pathWithoutLocale =
    pathname.replace(/^\/(fr|ar)(?=\/|$)/, "") || "/";

  const rule = protectedPrefixes.find(
    (p) =>
      pathWithoutLocale === p.prefix ||
      pathWithoutLocale.startsWith(`${p.prefix}/`),
  );

  const locale = pathname.split("/")[1] || routing.defaultLocale;

  if (rule) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    });

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
