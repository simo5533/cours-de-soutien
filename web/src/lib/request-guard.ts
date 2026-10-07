/** Refuse les appels POST provenant d'une autre origine (scripts / sites tiers). */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}
