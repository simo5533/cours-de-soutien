import { SiteHeader } from "@/components/site-header";
import {
  BLOG_POSTS,
  getBlogPostBySlug,
  type BlogLocale,
} from "@/content/blog-posts";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    BLOG_POSTS.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Blog" };
  }
  const lang = locale as BlogLocale;
  return {
    title: post.title[lang],
    description: post.excerpt[lang],
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations("Blog");
  const lang = locale as BlogLocale;
  const paragraphs = post.paragraphs[lang];

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
        <p>
          <Link
            href="/blog"
            className="text-sm font-semibold text-brandblue underline-offset-2 hover:underline dark:text-gold"
          >
            {t("back")}
          </Link>
        </p>

        <article className="mt-6 rounded-3xl border border-navy/10 bg-white/90 px-6 py-10 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 sm:px-10">
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
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy dark:text-white sm:text-4xl">
            {post.title[lang]}
          </h1>
          <p className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-300">
            {post.excerpt[lang]}
          </p>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-navy/10 pt-8 dark:border-slate-700">
            <p className="font-semibold text-navy dark:text-gold">{t("ctaTitle")}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {t("ctaBody")}
            </p>
            <Link href="/inscription" className="btn-primary mt-4 inline-flex">
              {t("ctaButton")}
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
