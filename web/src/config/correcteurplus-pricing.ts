/**
 * Packs CorrecteurPlus — correction d'exercices (affichage marketing).
 * Les IDs `legacyElevePlan` mappent vers Lemon Squeezy / Paddle / Stripe existants.
 *
 * TODO Lemon Squeezy : créer un variant par pack et renseigner les env :
 * - LEMONSQUEEZY_VARIANT_ID_ELEVE_ESSENTIAL → Essentiel IA (69 MAD)
 * - LEMONSQUEEZY_VARIANT_ID_ELEVE_BAC_PLUS → Réussite IA + Prof (249 MAD)
 * - LEMONSQUEEZY_VARIANT_ID_ELEVE_FAMILY → Famille (599 MAD)
 * - Bac Intensif (399 MAD) : variant dédié à ajouter
 */

export type PricingPlanId =
  | "free"
  | "essential_ai"
  | "success_ai_teacher"
  | "bac_intensive"
  | "family";

/** Plan envoyé au checkout existant (auth.ts). `free` = inscription sans paiement. */
export type LegacyElevePlan = "free" | "essential" | "bacplus" | "family";

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  price: number;
  currency: "MAD";
  period: "gratuit" | "mois";
  badge: string;
  forWho: string;
  aiCorrections: number | "illimité";
  teacherCredits: number;
  quiz: string;
  liveSessions?: number;
  profiles?: number;
  features: string[];
  limits: string[];
  cta: string;
  highlighted: boolean;
  secondary?: boolean;
  /** Mapping paiement backend — null si pas encore de variant Lemon */
  legacyElevePlan: LegacyElevePlan;
  lemonVariantEnvKey?: string;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Découverte",
    price: 0,
    currency: "MAD",
    period: "gratuit",
    badge: "Gratuit",
    forWho: "Tester CorrecteurPlus sans engagement",
    aiCorrections: 3,
    teacherCredits: 0,
    quiz: "illimité",
    features: [
      "Quiz gratuits illimités",
      "3 corrections IA offertes à l'inscription",
      "Accès aux exercices gratuits",
      "Historique limité des corrections",
    ],
    limits: [
      "Pas de correction professeur",
      "Pas de correction urgente",
      "Pas de session live",
    ],
    cta: "Tester gratuitement",
    highlighted: false,
    legacyElevePlan: "free",
  },
  {
    id: "essential_ai",
    name: "Essentiel IA",
    price: 69,
    currency: "MAD",
    period: "mois",
    badge: "Idéal pour s'entraîner seul",
    forWho: "Élèves autonomes qui veulent corriger souvent avec l'IA",
    aiCorrections: 100,
    teacherCredits: 0,
    quiz: "illimité",
    features: [
      "100 corrections IA par mois",
      "Quiz illimités",
      "Correction étape par étape",
      "Explication des erreurs",
      "Historique des exercices",
      "Toutes les matières principales",
      "Recommandations simples après correction",
    ],
    limits: [
      "Pas de correction professeur incluse",
      "Pas de session live",
      "Pas de priorité",
    ],
    cta: "Corriger avec l'IA",
    highlighted: false,
    legacyElevePlan: "essential",
    lemonVariantEnvKey: "LEMONSQUEEZY_VARIANT_ID_ELEVE_ESSENTIAL",
  },
  {
    id: "success_ai_teacher",
    name: "Réussite IA + Prof",
    price: 249,
    currency: "MAD",
    period: "mois",
    badge: "Le plus populaire",
    forWho: "Le meilleur choix pour progresser avec l'IA et l'aide d'un professeur",
    aiCorrections: 150,
    teacherCredits: 12,
    quiz: "illimité",
    features: [
      "150 corrections IA par mois",
      "12 crédits professeur par mois",
      "Correction IA + validation professeur",
      "Réponse professeur sous 24h",
      "Suivi des erreurs fréquentes",
      "Quiz illimités",
      "Recommandations d'exercices selon les lacunes",
      "Support prioritaire",
    ],
    limits: [],
    cta: "Choisir le pack recommandé",
    highlighted: true,
    legacyElevePlan: "bacplus",
    lemonVariantEnvKey: "LEMONSQUEEZY_VARIANT_ID_ELEVE_BAC_PLUS",
  },
  {
    id: "bac_intensive",
    name: "Bac Intensif",
    price: 399,
    currency: "MAD",
    period: "mois",
    badge: "Spécial examens",
    forWho: "Préparer le Bac avec corrections type examen",
    aiCorrections: 300,
    teacherCredits: 25,
    quiz: "illimité",
    liveSessions: 2,
    features: [
      "300 corrections IA par mois",
      "25 crédits professeur par mois",
      "Réponse prioritaire sous 12 à 24h",
      "Corrections d'exercices type examen",
      "Corrections de sujets Bac",
      "2 sessions live de correction par mois (30 min)",
      "Suivi de progression",
      "Conseils méthode et erreurs à éviter",
    ],
    limits: [],
    cta: "Préparer mon Bac",
    highlighted: false,
    secondary: true,
    legacyElevePlan: "bacplus",
    lemonVariantEnvKey: "LEMONSQUEEZY_VARIANT_ID_ELEVE_BAC_PLUS",
  },
  {
    id: "family",
    name: "Famille",
    price: 599,
    currency: "MAD",
    period: "mois",
    badge: "Jusqu'à 3 élèves",
    forWho: "Familles avec plusieurs enfants au lycée",
    aiCorrections: 500,
    teacherCredits: 35,
    quiz: "illimité",
    profiles: 3,
    features: [
      "Jusqu'à 3 profils élèves",
      "500 corrections IA partagées",
      "35 crédits professeur partagés",
      "Quiz illimités",
      "Tableau de bord parent",
      "Suivi par enfant",
      "Réponse professeur sous 24h",
      "Support prioritaire",
    ],
    limits: [],
    cta: "Inscrire mes enfants",
    highlighted: false,
    secondary: true,
    legacyElevePlan: "family",
    lemonVariantEnvKey: "LEMONSQUEEZY_VARIANT_ID_ELEVE_FAMILY",
  },
];

export const MAIN_PRICING_PLANS = PRICING_PLANS.filter((p) => !p.secondary);
export const SECONDARY_PRICING_PLANS = PRICING_PLANS.filter((p) => p.secondary);

export type OneShotOffer = {
  id: string;
  name: string;
  price: number;
  credits: number;
};

export const ONE_SHOT_OFFERS: OneShotOffer[] = [
  { id: "one_teacher_correction", name: "1 correction professeur", price: 29, credits: 1 },
  { id: "five_teacher_corrections", name: "5 corrections professeur", price: 119, credits: 5 },
  { id: "ten_teacher_corrections", name: "10 corrections professeur", price: 199, credits: 10 },
  { id: "live_session_30", name: "Session live 30 min", price: 99, credits: 4 },
  { id: "bac_full_subject", name: "Correction sujet Bac complet", price: 149, credits: 5 },
];

export const TEACHER_CREDIT_ROWS = [
  { label: "Exercice court", credits: "1 crédit" },
  { label: "Exercice long avec plusieurs questions", credits: "2 crédits" },
  { label: "Devoir complet", credits: "3 à 5 crédits" },
  { label: "Correction urgente", credits: "+1 crédit" },
  { label: "Session live 30 min", credits: "4 crédits" },
] as const;

export const VALUE_PROPOSITION =
  "Chez CorrecteurPlus, tu ne paies pas seulement pour regarder des cours. Tu paies pour comprendre tes erreurs et progresser exercice après exercice.";

export function getPlanById(id: PricingPlanId): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === id);
}

export function legacyPlanFromPricingId(id: PricingPlanId): LegacyElevePlan {
  return getPlanById(id)?.legacyElevePlan ?? "essential";
}
