/**
 * QCM maths lycée / Bac Maroc — thèmes alignés sur le programme
 * (nombres complexes, suites, intégrales, probabilités, etc.).
 * Contenu original ; inspiré des filières couvertes par pdfmath.com.
 */
import type { SeedCatalogQcm } from "./seed-catalog-quizzes";

export const PDFMATH_CATALOG_SEED_QCMS: SeedCatalogQcm[] = [
  {
    id: "seed-qcm-pdfmath-1",
    title: "Mathématiques — Nombres complexes (2 Bac PC/SM)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Module · argument · forme exponentielle",
    questions: [
      {
        id: "pm1-q1",
        prompt: "z = 3 + 4i. Le module |z| vaut :",
        options: ["5", "7", "25"],
        correct: 0,
      },
      {
        id: "pm1-q2",
        prompt: "i² égal à :",
        options: ["1", "−1", "i"],
        correct: 1,
      },
      {
        id: "pm1-q3",
        prompt: "Forme algébrique de e^(iπ/2) :",
        options: ["1", "i", "−1"],
        correct: 1,
      },
      {
        id: "pm1-q4",
        prompt: "Conjugué de z = 2 − 5i :",
        options: ["2 + 5i", "−2 + 5i", "5 − 2i"],
        correct: 0,
      },
      {
        id: "pm1-q5",
        prompt: "z₁z₂ = 0 avec z₁, z₂ ≠ 0 impossibles en ℂ. Vrai ou faux ?",
        options: ["Vrai (pas de diviseur de zéro en ℂ)", "Faux", "Vrai seulement pour les réels"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-2",
    title: "Mathématiques — Suites numériques (2 Bac SM)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Suites arithmétiques et géométriques",
    questions: [
      {
        id: "pm2-q1",
        prompt: "Suite arithmétique : u₀ = 5, r = 3. u₄ =",
        options: ["17", "14", "20"],
        correct: 0,
      },
      {
        id: "pm2-q2",
        prompt: "Suite géométrique : v₀ = 2, q = −1. v₃ =",
        options: ["−2", "2", "8"],
        correct: 0,
      },
      {
        id: "pm2-q3",
        prompt: "Somme S = 1 + 2 + … + 100 (arithmétique) :",
        options: ["5050", "5000", "10100"],
        correct: 0,
      },
      {
        id: "pm2-q4",
        prompt: "Si (uₙ) est croissante et uₙ ≤ M pour tout n, alors (uₙ) :",
        options: ["converge toujours", "peut diverger", "est constante"],
        correct: 1,
      },
      {
        id: "pm2-q5",
        prompt: "uₙ₊₁ = ½uₙ, u₀ = 16. Limite quand n → +∞ :",
        options: ["0", "8", "+∞"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-3",
    title: "Mathématiques — Calcul intégral (2 Bac PC)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Primitives · aire sous courbe",
    questions: [
      {
        id: "pm3-q1",
        prompt: "Une primitive de f(x) = 2x sur ℝ :",
        options: ["x² + C", "2 + C", "x²/2 + C"],
        correct: 0,
      },
      {
        id: "pm3-q2",
        prompt: "∫₀¹ x dx =",
        options: ["1/2", "1", "0"],
        correct: 0,
      },
      {
        id: "pm3-q3",
        prompt: "Primitive de cos(x) :",
        options: ["sin(x) + C", "−sin(x) + C", "cos(x) + C"],
        correct: 0,
      },
      {
        id: "pm3-q4",
        prompt: "∫₁ᵉ (1/x) dx =",
        options: ["1", "e − 1", "0"],
        correct: 0,
      },
      {
        id: "pm3-q5",
        prompt: "Aire entre y = 0 et y = f(x) ≥ 0 sur [a,b] :",
        options: ["∫ₐᵇ f(x) dx", "f(b) − f(a)", "f′(b)"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-4",
    title: "Mathématiques — Probabilités (2 Bac PC/SM)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Loi binomiale · espérance",
    questions: [
      {
        id: "pm4-q1",
        prompt: "P(A) = 0,3 et P(B) = 0,5 avec A et B indépendants. P(A ∩ B) =",
        options: ["0,15", "0,8", "0,2"],
        correct: 0,
      },
      {
        id: "pm4-q2",
        prompt: "10 lancers équilibrés : nombre de faces « Pile » suit approx. :",
        options: ["B(10 ; 0,5)", "P(5)", "U(0,10)"],
        correct: 0,
      },
      {
        id: "pm4-q3",
        prompt: "Espérance E(X) d’une variable X avec valeurs 1,2,3 et P = 1/3 chacune :",
        options: ["2", "3", "1,5"],
        correct: 0,
      },
      {
        id: "pm4-q4",
        prompt: "Probabilité complémentaire : P(Ā) =",
        options: ["1 − P(A)", "P(A) − 1", "1/P(A)"],
        correct: 0,
      },
      {
        id: "pm4-q5",
        prompt: "Dé n°1 : 6 faces. P(obtenir un nombre pair) =",
        options: ["1/2", "1/3", "2/3"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-5",
    title: "Mathématiques — Trigonométrie (1 Bac / 2 Bac)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Formules · équations trigonométriques",
    questions: [
      {
        id: "pm5-q1",
        prompt: "cos²x + sin²x =",
        options: ["1", "0", "2"],
        correct: 0,
      },
      {
        id: "pm5-q2",
        prompt: "cos(π/3) =",
        options: ["1/2", "√3/2", "0"],
        correct: 0,
      },
      {
        id: "pm5-q3",
        prompt: "sin(π/2) =",
        options: ["1", "0", "−1"],
        correct: 0,
      },
      {
        id: "pm5-q4",
        prompt: "Période de la fonction x ↦ sin(x) :",
        options: ["2π", "π", "π/2"],
        correct: 0,
      },
      {
        id: "pm5-q5",
        prompt: "tan(x) = sin(x)/cos(x) est défini si :",
        options: ["cos(x) ≠ 0", "sin(x) ≠ 0", "x = π/2"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-6",
    title: "Mathématiques — Dérivation (2 Bac SM)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Taux de variation · tangente · variations",
    questions: [
      {
        id: "pm6-q1",
        prompt: "Dérivée de f(x) = x³ :",
        options: ["3x²", "x²", "3x"],
        correct: 0,
      },
      {
        id: "pm6-q2",
        prompt: "(uv)′ =",
        options: ["u′v + uv′", "u′v′", "u′ + v′"],
        correct: 0,
      },
      {
        id: "pm6-q3",
        prompt: "f′(x) > 0 sur I signifie que f est :",
        options: ["croissante sur I", "décroissante sur I", "constante sur I"],
        correct: 0,
      },
      {
        id: "pm6-q4",
        prompt: "Dérivée de e^x :",
        options: ["e^x", "xe^(x−1)", "ln(x)"],
        correct: 0,
      },
      {
        id: "pm6-q5",
        prompt: "Équation de la tangente à y = f(x) en x₀ :",
        options: ["y = f(x₀) + f′(x₀)(x − x₀)", "y = f′(x₀)x", "y = f(x₀)"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-7",
    title: "Mathématiques — Dénombrement (2 Bac PC)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Arrangements · combinaisons · p-listes",
    questions: [
      {
        id: "pm7-q1",
        prompt: "Nombre de permutations de 3 objets distincts :",
        options: ["6", "3", "9"],
        correct: 0,
      },
      {
        id: "pm7-q2",
        prompt: "C(n,2) = n(n−1)/2 compte :",
        options: ["les paires non ordonnées", "les paires ordonnées", "les triplets"],
        correct: 0,
      },
      {
        id: "pm7-q3",
        prompt: "Code à 2 chiffres (0–9), chiffres distincts :",
        options: ["90", "100", "81"],
        correct: 0,
      },
      {
        id: "pm7-q4",
        prompt: "Principe multiplicatif : 3 chemins × 4 bus =",
        options: ["12 trajets", "7 trajets", "1 trajet"],
        correct: 0,
      },
      {
        id: "pm7-q5",
        prompt: "Combien de sous-ensembles d’un ensemble à 5 éléments ?",
        options: ["32", "25", "10"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-8",
    title: "Mathématiques — Fonction exponentielle (2 Bac SM/PC)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Croissance · équations e^x = k",
    questions: [
      {
        id: "pm8-q1",
        prompt: "e⁰ =",
        options: ["1", "0", "e"],
        correct: 0,
      },
      {
        id: "pm8-q2",
        prompt: "e^(a+b) =",
        options: ["e^a × e^b", "e^a + e^b", "e^(ab)"],
        correct: 0,
      },
      {
        id: "pm8-q3",
        prompt: "Solution de e^x = 7 :",
        options: ["x = ln(7)", "x = 7/e", "x = e^7"],
        correct: 0,
      },
      {
        id: "pm8-q4",
        prompt: "La fonction x ↦ e^x est :",
        options: ["strictement croissante sur ℝ", "décroissante", "périodique"],
        correct: 0,
      },
      {
        id: "pm8-q5",
        prompt: "ln(e³) =",
        options: ["3", "e³", "ln(3)"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-9",
    title: "Mathématiques — Limites et continuité (2 Bac SM)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Limites en ±∞ · formes indéterminées",
    questions: [
      {
        id: "pm9-q1",
        prompt: "lim(x→+∞) (1/x) =",
        options: ["0", "+∞", "1"],
        correct: 0,
      },
      {
        id: "pm9-q2",
        prompt: "lim(x→0) sin(x)/x =",
        options: ["1", "0", "+∞"],
        correct: 0,
      },
      {
        id: "pm9-q3",
        prompt: "f continue sur [a,b] et f(a)·f(b) < 0 ⟹ (théorème des valeurs intermédiaires) :",
        options: ["∃ c ∈ ]a,b[ , f(c) = 0", "f = 0 partout", "f non définie"],
        correct: 0,
      },
      {
        id: "pm9-q4",
        prompt: "lim(x→+∞) (2x² + 1)/(x² − 3) =",
        options: ["2", "0", "+∞"],
        correct: 0,
      },
      {
        id: "pm9-q5",
        prompt: "Forme indéterminée classique :",
        options: ["∞ − ∞", "0 × 5", "2 + 3"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-pdfmath-10",
    title: "Mathématiques — Examen national · repères (2 Bac)",
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre: "Bac Maroc · fonctions · analyse",
    questions: [
      {
        id: "pm10-q1",
        prompt: "f(x) = x² − 4x + 3. Sommet de la parabole : x =",
        options: ["2", "3", "−1"],
        correct: 0,
      },
      {
        id: "pm10-q2",
        prompt: "Discriminant Δ = b² − 4ac. Si Δ < 0, l’équation ax²+bx+c=0 (a≠0) :",
        options: ["n’a pas de solution réelle", "a deux solutions réelles", "a une infinité"],
        correct: 0,
      },
      {
        id: "pm10-q3",
        prompt: "Vecteurs u(1;2) et v(2;4) sont :",
        options: ["colinéaires", "orthogonaux", "de normes égales toujours"],
        correct: 0,
      },
      {
        id: "pm10-q4",
        prompt: "Produit scalaire u·v = 0 signifie que u et v sont :",
        options: ["orthogonaux", "parallèles", "de même norme"],
        correct: 0,
      },
      {
        id: "pm10-q5",
        prompt: "ln(ab) = ln(a) + ln(b) pour a,b > 0. Vrai ?",
        options: ["Vrai", "Faux", "Vrai seulement si a = b"],
        correct: 0,
      },
    ],
  },
];
