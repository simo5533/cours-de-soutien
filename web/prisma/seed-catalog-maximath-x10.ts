/**
 * 10 QCM Mathématiques — 2 Bac PC BIOF (thèmes Maxi Math / pdfmath).
 * Contenu original ; aligné programme marocain sciences expérimentales.
 */
import type { SeedCatalogQcm } from "./seed-catalog-quizzes";

type Q = { id: string; prompt: string; options: string[]; correct: number };

function quiz(
  id: string,
  title: string,
  chapitre: string,
  qs: Q[],
): SeedCatalogQcm {
  return {
    id,
    title,
    matiere: "Mathématiques",
    niveau: "Lycée",
    chapitre,
    questions: qs,
  };
}

export const MAXIMATH_X10_QCMS: SeedCatalogQcm[] = [
  quiz("seed-qcm-maximath-1", "Maths 2 Bac PC — Limites et continuité", "Limites · continuité", [
    { id: "mx1-q1", prompt: "lim(x→0) (sin x)/x =", options: ["1", "0", "+∞"], correct: 0 },
    { id: "mx1-q2", prompt: "Si f est continue sur [a,b] et f(a)·f(b) < 0, alors :", options: ["∃ c, f(c)=0", "f=0 partout", "f non définie"], correct: 0 },
    { id: "mx1-q3", prompt: "lim(x→+∞) (3x+1)/(x-2) =", options: ["3", "0", "+∞"], correct: 0 },
    { id: "mx1-q4", prompt: "Forme indéterminée :", options: ["0/0", "2/4", "1/2"], correct: 0 },
    { id: "mx1-q5", prompt: "lim(x→+∞) 1/x =", options: ["0", "1", "+∞"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-2", "Maths 2 Bac PC — Dérivation", "Dérivée · tangente", [
    { id: "mx2-q1", prompt: "(ln x)' =", options: ["1/x", "x", "e^x"], correct: 0 },
    { id: "mx2-q2", prompt: "(e^x)' =", options: ["e^x", "xe^(x-1)", "ln x"], correct: 0 },
    { id: "mx2-q3", prompt: "f'(x) > 0 sur I ⟹ f est :", options: ["croissante sur I", "décroissante", "constante"], correct: 0 },
    { id: "mx2-q4", prompt: "(x² ln x)' pour x>0 :", options: ["2x ln x + x", "2x ln x", "x ln x"], correct: 0 },
    { id: "mx2-q5", prompt: "Tangente en x₀ : y = f(x₀) + f'(x₀)(x−x₀). Vrai ?", options: ["Vrai", "Faux", "Vrai seulement si f=0"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-3", "Maths 2 Bac PC — Fonction logarithme", "ln · équations", [
    { id: "mx3-q1", prompt: "Domaine de ln x :", options: ["]0,+∞[", "ℝ", "[0,+∞["], correct: 0 },
    { id: "mx3-q2", prompt: "ln(ab) =", options: ["ln a + ln b", "ln a · ln b", "ln(a+b)"], correct: 0 },
    { id: "mx3-q3", prompt: "ln(e³) =", options: ["3", "e³", "ln 3"], correct: 0 },
    { id: "mx3-q4", prompt: "Solution de ln x = 2 :", options: ["x = e²", "x = 2", "x = ln 2"], correct: 0 },
    { id: "mx3-q5", prompt: "ln 1 =", options: ["0", "1", "e"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-4", "Maths 2 Bac PC — Suites numériques", "Suites · limites", [
    { id: "mx4-q1", prompt: "Suite arithmétique uₙ = u₀ + nr. u₅ si u₀=3, r=2 :", options: ["13", "10", "15"], correct: 0 },
    { id: "mx4-q2", prompt: "Suite géométrique q=1/2, u₀=16. u₃ =", options: ["2", "8", "4"], correct: 0 },
    { id: "mx4-q3", prompt: "Somme 1+2+…+n =", options: ["n(n+1)/2", "n²", "2n"], correct: 0 },
    { id: "mx4-q4", prompt: "Si |q|<1, lim qⁿ quand n→+∞ :", options: ["0", "1", "+∞"], correct: 0 },
    { id: "mx4-q5", prompt: "uₙ₊₁ = uₙ + 3, u₀=1 : nature :", options: ["arithmétique", "géométrique", "constante"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-5", "Maths 2 Bac PC — Primitives et intégrales", "Calcul intégral", [
    { id: "mx5-q1", prompt: "Primitive de 1/x sur ]0,+∞[ :", options: ["ln x + C", "−1/x² + C", "x + C"], correct: 0 },
    { id: "mx5-q2", prompt: "∫₀¹ 2x dx =", options: ["1", "2", "0"], correct: 0 },
    { id: "mx5-q3", prompt: "Primitive de e^x :", options: ["e^x + C", "xe^x + C", "e^x/x + C"], correct: 0 },
    { id: "mx5-q4", prompt: "∫ₐᵇ f(x)dx représente (f≥0) :", options: ["aire sous la courbe", "pente", "dérivée"], correct: 0 },
    { id: "mx5-q5", prompt: "Primitive de cos x :", options: ["sin x + C", "−sin x + C", "cos x + C"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-6", "Maths 2 Bac PC — Nombres complexes", "Module · argument", [
    { id: "mx6-q1", prompt: "|3+4i| =", options: ["5", "7", "25"], correct: 0 },
    { id: "mx6-q2", prompt: "i² =", options: ["−1", "1", "i"], correct: 0 },
    { id: "mx6-q3", prompt: "e^(iπ) + 1 =", options: ["0", "1", "i"], correct: 0 },
    { id: "mx6-q4", prompt: "Conjugué de 2−3i :", options: ["2+3i", "−2+3i", "3−2i"], correct: 0 },
    { id: "mx6-q5", prompt: "Forme algébrique a+bi : partie réelle de 5−2i :", options: ["5", "−2", "5−2i"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-7", "Maths 2 Bac PC — Probabilités", "Loi binomiale · espérance", [
    { id: "mx7-q1", prompt: "P(Ā) =", options: ["1 − P(A)", "P(A)−1", "1/P(A)"], correct: 0 },
    { id: "mx7-q2", prompt: "10 lancers pile/face équilibrés : nb piles ~", options: ["B(10;0,5)", "P(5)", "U(0,10)"], correct: 0 },
    { id: "mx7-q3", prompt: "E(X) pour X ∈ {1,2,3}, P=1/3 chacun :", options: ["2", "3", "1"], correct: 0 },
    { id: "mx7-q4", prompt: "A et B indépendants : P(A∩B) =", options: ["P(A)P(B)", "P(A)+P(B)", "P(A)−P(B)"], correct: 0 },
    { id: "mx7-q5", prompt: "Dé équilibré : P(pair) =", options: ["1/2", "1/3", "2/3"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-8", "Maths 2 Bac PC — Dénombrement", "Combinaisons · arrangements", [
    { id: "mx8-q1", prompt: "C(n,2) =", options: ["n(n−1)/2", "n!", "2n"], correct: 0 },
    { id: "mx8-q2", prompt: "Permutations de 4 objets distincts :", options: ["24", "4", "12"], correct: 0 },
    { id: "mx8-q3", prompt: "Code 2 chiffres distincts (0–9) :", options: ["90", "100", "81"], correct: 0 },
    { id: "mx8-q4", prompt: "Sous-ensembles d'un ensemble à 4 éléments :", options: ["16", "8", "4"], correct: 0 },
    { id: "mx8-q5", prompt: "Principe multiplicatif 5×4 choix :", options: ["20", "9", "1"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-9", "Maths 2 Bac PC — Géométrie dans l'espace", "Vecteurs · produit scalaire", [
    { id: "mx9-q1", prompt: "u·v = 0 ⟺ u et v :", options: ["orthogonaux", "colinéaires", "égaux"], correct: 0 },
    { id: "mx9-q2", prompt: "||u|| = √(x²+y²+z²) pour u(x,y,z). ||(3,4,0)|| =", options: ["5", "7", "25"], correct: 0 },
    { id: "mx9-q3", prompt: "Milieu de A(1,0) et B(3,4) :", options: ["(2,2)", "(4,4)", "(1,2)"], correct: 0 },
    { id: "mx9-q4", prompt: "u et v colinéaires ⟹ u∧v (produit vectoriel) en 3D :", options: ["0", "1", "u·v"], correct: 0 },
    { id: "mx9-q5", prompt: "Distance origine–point M(0,0,5) :", options: ["5", "0", "√5"], correct: 0 },
  ]),
  quiz("seed-qcm-maximath-10", "Maths 2 Bac PC — Examen national type", "Bac Maroc · analyse", [
    { id: "mx10-q1", prompt: "f(x)=x²−4x+3. Sommet : x =", options: ["2", "3", "−1"], correct: 0 },
    { id: "mx10-q2", prompt: "Δ=b²−4ac. Si Δ>0, ax²+bx+c=0 (a≠0) :", options: ["2 solutions réelles", "0 solution", "1 seule toujours"], correct: 0 },
    { id: "mx10-q3", prompt: "∫₁ᵉ (1/x)dx =", options: ["1", "e", "0"], correct: 0 },
    { id: "mx10-q4", prompt: "cos²x+sin²x =", options: ["1", "0", "2"], correct: 0 },
    { id: "mx10-q5", prompt: "Suite uₙ=1/n : lim uₙ quand n→+∞ :", options: ["0", "1", "+∞"], correct: 0 },
  ]),
];
