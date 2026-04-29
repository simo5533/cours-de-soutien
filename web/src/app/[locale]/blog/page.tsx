import { SiteHeader } from "@/components/site-header";
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
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <header className="relative overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-br from-white via-white to-brandblue/[0.07] px-6 py-10 shadow-lg shadow-navy/[0.06] ring-1 ring-gold/20 dark:border-slate-700/80 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-brandblue/[0.08] sm:px-10 sm:py-12">
          <div
            className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-brandblue/15 blur-3xl dark:bg-brandblue/10"
            aria-hidden
          />
          <p className="relative inline-flex items-center rounded-full border border-navy/15 bg-navy/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy dark:border-gold/30 dark:bg-gold/10 dark:text-gold">
            {t("badge")}
          </p>
          <h1 className="relative mt-4 text-3xl font-extrabold tracking-tight text-navy dark:text-white sm:text-4xl">
            {t("indexTitle")}
          </h1>
          <p className="relative mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("indexSubtitle")}
          </p>
        </header>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white/90 p-6 shadow-sm transition hover:border-brandblue/25 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-brandblue/30">
                <time
                  dateTime={post.publishedAt}
                  className="text-xs font-semibold uppercase tracking-wide text-brandblue dark:text-brandblue/90"
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
                <h2 className="mt-3 text-lg font-bold text-navy dark:text-white">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition hover:text-brandblue dark:hover:text-gold"
                  >
                    {post.title[lang]}
                  </Link>
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {post.excerpt[lang]}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-semibold text-brandblue underline-offset-2 hover:underline dark:text-gold"
                >
                  {t("readArticle")}
                </Link>
              </article>
            </li>
          ))}
        </ul>

        <section className="mt-14 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-white to-brandblue/5 px-6 py-8 dark:border-gold/25 dark:from-gold/10 dark:via-slate-900/80 dark:to-navy/40 sm:px-10">
          <h2 className="text-xl font-bold text-navy dark:text-gold">{t("ctaTitle")}</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-700 dark:text-slate-300">
            {t("ctaBody")}
          </p>
          <Link href="/inscription" className="btn-primary mt-5 inline-flex">
            {t("ctaButton")}
          </Link>
        </section>
      </main>
    </>
  );
}
