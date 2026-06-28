import { PublicPageFrame } from "@/components/public-page-frame";
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
    <PublicPageFrame mainClassName="page-bg page-x mx-auto flex w-full max-w-3xl flex-1 flex-col pb-12 pb-safe pt-6 sm:pb-16 sm:pt-12">
        <p>
          <Link
            href="/blog"
            className="text-sm font-semibold text-electric underline-offset-2 hover:underline"
          >
            {t("back")}
          </Link>
        </p>

        <article className="card-elevated mt-6 px-6 py-10 sm:px-10">
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
          <h1 className="font-display mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            {post.title[lang]}
          </h1>
          <p className="mt-4 text-lg font-medium text-muted-text">
            {post.excerpt[lang]}
          </p>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-navy/90">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-border-soft pt-8">
            <p className="font-semibold text-navy">{t("ctaTitle")}</p>
            <p className="mt-2 text-sm text-muted-text">
              {t("ctaBody")}
            </p>
            <Link href="/inscription" className="btn-primary mt-4 inline-flex">
              {t("ctaButton")}
            </Link>
          </div>
        </article>
    </PublicPageFrame>
  );
}
