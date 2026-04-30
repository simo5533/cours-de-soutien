import { SiteHeader } from "@/components/site-header";
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
  { key: "french", slug: "francais", accent: "from-navy to-brandblue" },
  { key: "spanish", slug: "espagnol", accent: "from-brandblue to-navy" },
  { key: "english", slug: "anglais", accent: "from-gold/90 to-navy" },
  {
    key: "englishUS",
    slug: "anglais-americain",
    accent: "from-brandblue via-navy to-brandblue",
  },
  { key: "german", slug: "allemand", accent: "from-navy via-gold/70 to-navy" },
  {
    key: "chinese",
    slug: "chinois-mandarin",
    accent: "from-red-700/90 via-gold to-navy",
  },
] as const;

type PageProps = { params: Promise<{ locale: string }> };

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
  const messages = await getMessages();
  const packs = (
    messages as { FreeLangCourses?: { languages?: Record<string, LangBlock> } }
  ).FreeLangCourses?.languages;

  return (
    <>
      <SiteHeader />
      <main className="page-bg mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <article
          className="relative overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-br from-white via-white to-brandblue/[0.06] px-6 py-10 shadow-lg shadow-navy/[0.05] ring-1 ring-gold/15 dark:border-slate-700/80 dark:from-slate-900/90 dark:via-slate-900/75 dark:to-brandblue/[0.08] sm:px-10 sm:py-12"
          itemScope
          itemType="https://schema.org/Article"
        >
          <div
            className="pointer-events-none absolute -end-24 -top-20 h-72 w-72 rounded-full bg-brandblue/12 blur-3xl dark:bg-brandblue/10"
            aria-hidden
          />
          <header className="relative border-b border-slate-200/80 pb-8 dark:border-slate-700/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brandblue dark:text-gold">
              {t("kicker")}
            </p>
            <h1
              className="mt-3 text-2xl font-extrabold tracking-tight text-navy dark:text-white sm:text-3xl sm:leading-tight"
              itemProp="headline"
            >
              {t("title")}
            </h1>
            <p
              className="mt-5 text-base leading-relaxed text-slate-700 dark:text-slate-300"
              itemProp="description"
            >
              {t("lead")}
            </p>
            <nav
              className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-6 dark:border-slate-800"
              aria-label="Sommaire"
            >
              {LANG_LAYOUT.map(({ key, slug }) => {
                const title = packs?.[key]?.title ?? key;
                return (
                  <a
                    key={key}
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
            {LANG_LAYOUT.map(({ key, slug, accent }) => {
              const block = packs?.[key];
              if (!block) return null;
              return (
                <section
                  key={key}
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
            })}
          </div>

          <p className="relative mt-12 border-t border-slate-200/80 pt-8 text-xs leading-relaxed text-slate-500 dark:border-slate-700 dark:text-slate-500">
            {t("footnote")}
          </p>
        </article>

        <section className="mt-12 overflow-hidden rounded-3xl border border-gold/30 bg-navy px-6 py-10 text-center shadow-xl sm:px-10">
          <h2 className="text-xl font-bold text-gold sm:text-2xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85">
            {t("ctaBody")}
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/inscription" className="btn-primary !px-8">
              {t("ctaRegister")}
            </Link>
            <Link
              href="/cours"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              {t("ctaCatalog")}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
