import { PublicPageFrame } from "@/components/public-page-frame";
import { getAllBlogPostsSorted } from "@/content/blog-posts";
import type { BlogLocale } from "@/content/blog-posts";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Blog");
  const lang = locale as BlogLocale;
  const posts = getAllBlogPostsSorted();

  return (
    <PublicPageFrame>
        <header className="relative overflow-hidden rounded-[24px] border border-border-soft bg-white/[0.74] px-6 py-10 shadow-md backdrop-blur-md sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-cyan-ai/15 blur-3xl"
            aria-hidden
          />
          <p className="brand-section-title relative inline-flex items-center rounded-full border border-border-soft bg-white/70 px-3 py-1">
            {t("badge")}
          </p>
          <h1 className="font-display relative mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {t("indexTitle")}
          </h1>
          <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-muted-text">
            {t("indexSubtitle")}
          </p>
        </header>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="card-elevated flex h-full flex-col p-6">
                <time
                  dateTime={post.publishedAt}
                  className="text-xs font-semibold uppercase tracking-wide text-electric"
                >
                  {new Date(post.publishedAt + "T12:00:00").toLocaleDateString(
                    lang === "ar" ? "ar-MA" : "fr-FR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </time>
                <h2 className="mt-3 text-lg font-bold text-navy">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition hover:text-electric"
                  >
                    {post.title[lang]}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-text">
                  {post.excerpt[lang]}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-electric underline-offset-2 hover:underline"
                >
                  {t("readArticle")}
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <section className="cta-premium-card mt-14">
          <div className="relative">
            <h2 className="font-display text-xl font-bold text-navy">{t("ctaTitle")}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-text">
              {t("ctaBody")}
            </p>
            <Link href="/inscription" className="btn-primary mt-5 inline-flex">
              {t("ctaButton")}
            </Link>
          </div>
        </section>
      </PublicPageFrame>
  );
}
