/** Contenu SEO de la landing CorrecteurPlus (FR / AR). Les CTA restent dans messages/*.json. */
import { FILE_LIMITS } from "@/lib/ai/config";
import { PLANS } from "@/lib/plans";

export type CorrecteurPlusHomeBlock = {
  heroTitle: string;
  heroSubtitle: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

function fr(): CorrecteurPlusHomeBlock {
  const pages = FILE_LIMITS.maxPdfPages;
  const { AI_PLUS: particulier, PROF: prof, CENTRE: centre, FREE: free } = PLANS;
  return {
    heroTitle: "Corrigez vos exercices dans toutes les matières avec l'IA",
    heroSubtitle:
      "Photo ou PDF : obtenez une correction expliquée étape par étape, identifiez vos erreurs et entraînez-vous sur les notions à améliorer.",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Qu'est-ce que CorrecteurPlus ?",
        a: "CorrecteurPlus est un correcteur d'exercices par intelligence artificielle. Vous envoyez une photo ou un PDF, vous obtenez une correction expliquée (résultat, étapes, erreurs, conseil), puis un exercice similaire ou un quiz pour vous entraîner sur la notion à améliorer.",
      },
      {
        q: "À qui s'adresse CorrecteurPlus ?",
        a: "Aux professeurs de soutien qui veulent corriger et préparer leurs exercices plus vite, aux centres de soutien qui équipent leur équipe pédagogique, et aux parents qui aident leur enfant à la maison. Les élèves l'utilisent directement pour comprendre leurs erreurs.",
      },
      {
        q: "Quelles matières et quels formats sont acceptés ?",
        a: `Toutes les matières : mathématiques, physique-chimie, SVT, langues, histoire-géographie et plus. Vous pouvez envoyer des photos (JPG, PNG, WebP) ou un PDF jusqu'à ${pages} pages. Pour un PDF scanné sans texte, envoyez plutôt une photo de chaque page.`,
      },
      {
        q: "Comment sont comptées les analyses ?",
        a: `1 photo = 1 analyse et 1 page de PDF = 1 analyse. Le nombre de pages est vérifié avant l'envoi, et une correction déjà faite se rouvre gratuitement depuis l'historique.`,
      },
      {
        q: "Combien coûte CorrecteurPlus ?",
        a: `L'inscription est gratuite avec ${free.monthlyCredits} analyses offertes, sans carte bancaire. Ensuite : ${particulier.name} ${particulier.priceMAD} DH/mois (${particulier.monthlyCredits} analyses), ${prof.name} ${prof.priceMAD} DH/mois (${prof.monthlyCredits} analyses), ${centre.name} ${centre.priceMAD} DH/mois (${centre.monthlyCredits} analyses partagées, jusqu'à ${centre.seats} comptes).`,
      },
      {
        q: "Comment fonctionne l'offre Centre ?",
        a: `Le responsable du centre crée les comptes de son équipe (jusqu'à ${centre.seats}), partage un quota mensuel commun et suit la consommation de chaque membre ainsi que les corrections de l'équipe.`,
      },
      {
        q: "Les quiz sont-ils gratuits ?",
        a: "Oui. La bibliothèque « Quiz & entraînement » est accessible gratuitement, par matière et par niveau. Après une correction, CorrecteurPlus propose les quiz liés à la notion travaillée.",
      },
      {
        q: "Puis-je utiliser CorrecteurPlus sur mon téléphone ?",
        a: "Oui. Le site est optimisé pour le mobile : vous pouvez photographier un exercice directement depuis votre téléphone.",
      },
    ],
  };
}

function ar(): CorrecteurPlusHomeBlock {
  const pages = FILE_LIMITS.maxPdfPages;
  const { AI_PLUS: particulier, PROF: prof, CENTRE: centre, FREE: free } = PLANS;
  return {
    heroTitle: "صحّح تمارينك في جميع المواد بالذكاء الاصطناعي",
    heroSubtitle:
      "صورة أو PDF: احصل على تصحيح مشروح خطوة بخطوة، حدّد أخطاءك وتدرّب على المفاهيم التي تحتاج تحسيناً.",
    faqTitle: "أسئلة شائعة",
    faq: [
      {
        q: "ما هو CorrecteurPlus؟",
        a: "CorrecteurPlus مصحح تمارين بالذكاء الاصطناعي. ترسل صورة أو ملف PDF فتحصل على تصحيح مشروح (النتيجة، المراحل، الأخطاء، نصيحة)، ثم تمرين مشابه أو اختبار للتدرّب على المفهوم.",
      },
      {
        q: "لمن يوجَّه CorrecteurPlus؟",
        a: "لأساتذة الدعم الذين يريدون التصحيح والتحضير بسرعة، ولمراكز الدعم لتجهيز فريقها التربوي، وللآباء الذين يساعدون أطفالهم في البيت. ويستعمله التلاميذ مباشرة لفهم أخطائهم.",
      },
      {
        q: "ما المواد والصيغ المقبولة؟",
        a: `جميع المواد: الرياضيات، الفيزياء والكيمياء، علوم الحياة والأرض، اللغات وغيرها. يمكنك إرسال صور (JPG وPNG وWebP) أو ملف PDF حتى ${pages} صفحات. بالنسبة لملف PDF ممسوح بدون نص، أرسل صورة لكل صفحة.`,
      },
      {
        q: "كيف تُحتسب التحليلات؟",
        a: "صورة واحدة = تحليل واحد، وصفحة PDF واحدة = تحليل واحد. يُتحقق من عدد الصفحات قبل الإرسال، ويُعاد فتح أي تصحيح سابق مجاناً من السجل.",
      },
      {
        q: "كم يكلف CorrecteurPlus؟",
        a: `التسجيل مجاني مع ${free.monthlyCredits} تحليلات هدية دون بطاقة. بعد ذلك: العرض الفردي ${particulier.priceMAD} درهم/شهر (${particulier.monthlyCredits} تحليلاً)، عرض الأستاذ ${prof.priceMAD} درهم/شهر (${prof.monthlyCredits} تحليلاً)، عرض المركز ${centre.priceMAD} درهم/شهر (${centre.monthlyCredits} تحليلاً مشتركاً، حتى ${centre.seats} حسابات).`,
      },
      {
        q: "كيف يعمل عرض المركز؟",
        a: `ينشئ مسؤول المركز حسابات فريقه (حتى ${centre.seats})، ويتقاسمون حصة شهرية مشتركة، ويتابع استهلاك كل عضو وتصحيحات الفريق.`,
      },
      {
        q: "هل الاختبارات مجانية؟",
        a: "نعم. مكتبة «اختبارات وتدريب» متاحة مجاناً حسب المادة والمستوى، وبعد كل تصحيح تُقترح الاختبارات المرتبطة بالمفهوم.",
      },
      {
        q: "هل يعمل على الهاتف؟",
        a: "نعم، الموقع مُحسّن للهاتف ويمكنك تصوير التمرين مباشرة.",
      },
    ],
  };
}

export function getCorrecteurPlusHomeSeo(locale: string): CorrecteurPlusHomeBlock {
  return locale === "ar" ? ar() : fr();
}
