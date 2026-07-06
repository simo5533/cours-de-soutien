import { CtaPremiumSection } from "@/components/cta-premium-section";
import { PublicPageFrame } from "@/components/public-page-frame";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

type LangBlock = {
  title: string;
  teaser: string;
  freeTitle: string;
  freeBullets: string[];
  programTitle: string;
  programBullets: string[];
};

const LANG_LAYOUT = [
  { key: "french", slug: "francais", accent: "from-premium to-electric" },
  { key: "spanish", slug: "espagnol", accent: "from-electric to-cyan-ai" },
  { key: "english", slug: "anglais", accent: "from-cyan-ai to-electric" },
  {
    key: "englishUS",
    slug: "anglais-americain",
    accent: "from-electric via-premium to-cyan-ai",
  },
  { key: "german", slug: "allemand", accent: "from-premium via-electric to-cyan-ai" },
  {
    key: "chinese",
    slug: "chinois-mandarin",
    accent: "from-red-600/90 via-electric to-cyan-ai",
  },
] as const;

const STEM_LAYOUT = [
  {
    key: "mathematics",
    slug: "mathematiques",
    accent: "from-violet-500 to-electric",
  },
  {
    key: "physics",
    slug: "physique-chimie",
    accent: "from-cyan-500 to-electric",
  },
  { key: "svt", slug: "svt", accent: "from-success to-cyan-ai" },
  {
    key: "historyGeo",
    slug: "histoire-geographie",
    accent: "from-amber-500 to-electric",
  },
] as const;

type PageProps = { params: Promise<{ locale: string }> };

function SubjectBlockSection({
  slug,
  accent,
  block,
}: {
  slug: string;
  accent: string;
  block: LangBlock;
}) {
  return (
    <section
      id={slug}
      className="scroll-mt-[calc(var(--header-h)+1rem)]"
      aria-labelledby={`heading-${slug}`}
    >
      <div
        className={`mb-4 h-1 w-16 rounded-full bg-gradient-to-r ${accent}`}
        aria-hidden
      />
      <h2
        id={`heading-${slug}`}
        className="text-xl font-bold text-navy dark:text-white"
      >
        {block.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
        {block.teaser}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5 dark:border-emerald-400/20 dark:bg-emerald-500/[0.07]">
          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            {block.freeTitle}
          </h3>
          <ul className="mt-3 list-disc space-y-2 ps-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {block.freeBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 dark:border-slate-600/60 dark:bg-slate-900/50">
          <h3 className="text-sm font-bold text-navy dark:text-white">
            {block.programTitle}
          </h3>
          <ul className="mt-3 list-disc space-y-2 ps-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {block.programBullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FreeLangCourses" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CoursGratuitsLanguesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("FreeLangCourses");
  const tCatalog = await getTranslations("CatalogPage");
  const messages = await getMessages();
  const freeBlock = (
    messages as {
      FreeLangCourses?: {
        languages?: Record<string, LangBlock>;
        stemSubjects?: Record<string, LangBlock>;
      };
    }
  ).FreeLangCourses;
  const packs = freeBlock?.languages;
  const packsStem = freeBlock?.stemSubjects;

  return (
    <PublicPageFrame mainClassName="page-bg page-x mx-auto flex w-full max-w-3xl flex-1 flex-col pb-12 pb-safe pt-6 sm:pb-16 sm:pt-12">
        <article
          className="site-card-bg relative overflow-hidden rounded-[24px] border border-border-soft px-6 py-10 shadow-md backdrop-blur-md sm:px-10 sm:py-12"
          itemScope
          itemType="https://schema.org/Article"
        >
          <div
            className="pointer-events-none absolute -end-24 -top-20 h-72 w-72 rounded-full bg-cyan-ai/12 blur-3xl"
            aria-hidden
          />
          <header className="relative border-b border-border-soft pb-8">
            <p className="brand-section-title">
              {t("kicker")}
            </p>
            <h1
              className="font-display mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl sm:leading-tight"
              itemProp="headline"
            >
              {t("title")}
            </h1>
            <p
              className="mt-5 text-base leading-relaxed text-muted-text"
              itemProp="description"
            >
              {t("lead")}
            </p>
            <nav
              className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6 dark:border-slate-800"
              aria-label={t("tocAriaLabel")}
            >
              {LANG_LAYOUT.map(({ key, slug }) => {
                const title = packs?.[key]?.title ?? key;
                return (
                  <a
                    key={`lang-${key}`}
                    href={`#${slug}`}
                    className="inline-flex items-center rounded-full border border-brandblue/25 bg-brandblue/5 px-3 py-1 text-xs font-semibold text-navy transition hover:border-brandblue/40 hover:bg-brandblue/10 dark:border-brandblue/30 dark:bg-brandblue/10 dark:text-brandblue dark:hover:bg-brandblue/18"
                  >
                    {title}
                  </a>
                );
              })}
              {STEM_LAYOUT.map(({ key, slug }) => {
                const title = packsStem?.[key]?.title ?? key;
                return (
                  <a
                    key={`stem-${key}`}
                    href={`#${slug}`}
                    className="inline-flex items-center rounded-full border border-brandblue/25 bg-brandblue/5 px-3 py-1 text-xs font-semibold text-navy transition hover:border-brandblue/40 hover:bg-brandblue/10 dark:border-brandblue/30 dark:bg-brandblue/10 dark:text-brandblue dark:hover:bg-brandblue/18"
                  >
                    {title}
                  </a>
                );
              })}
            </nav>
          </header>

          <section className="relative mt-10" aria-labelledby="free-global">
            <h2
              id="free-global"
              className="text-lg font-bold text-navy dark:text-white"
            >
              {t("freeSectionTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              {t("freeSectionBody")}
            </p>
          </section>

          <div className="relative mt-12 space-y-14">
            <h2 className="text-lg font-bold text-navy dark:text-white">
              {tCatalog("livingLanguagesTitle")}
            </h2>
            {LANG_LAYOUT.map(({ key, slug, accent }) => {
              const block = packs?.[key];
              if (!block) return null;
              return (
                <SubjectBlockSection
                  key={key}
                  slug={slug}
                  accent={accent}
                  block={block}
                />
              );
            })}

            <div className="space-y-3 border-t border-slate-200/80 pt-14 dark:border-slate-700/80">
              <h2 className="text-lg font-bold text-navy dark:text-white">
                {t("stemProgramsTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                {t("stemProgramsIntro")}
              </p>
            </div>

            {STEM_LAYOUT.map(({ key, slug, accent }) => {
              const block = packsStem?.[key];
              if (!block) return null;
              return (
                <SubjectBlockSection
                  key={key}
                  slug={slug}
                  accent={accent}
                  block={block}
                />
              );
            })}
          </div>

          <p className="relative mt-12 border-t border-slate-200/80 pt-8 text-xs leading-relaxed text-slate-500 dark:border-slate-700 dark:text-slate-500">
            {t("footnote")}
          </p>
        </article>

        <CtaPremiumSection
          className="mt-12"
          title={t("ctaTitle")}
          subtitle={t("ctaBody")}
          primaryHref="/inscription"
          primaryLabel={t("ctaRegister")}
          secondaryHref="/cours"
          secondaryLabel={t("ctaCatalog")}
        />
    </PublicPageFrame>
  );
}
