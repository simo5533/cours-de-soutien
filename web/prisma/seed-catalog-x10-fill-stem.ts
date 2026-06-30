/**
 * Complète Physique-Chimie, SVT et Histoire-Géo à 10 QCM minimum.
 */
import type { SeedCatalogQcm } from "./seed-catalog-quizzes";

type Q = { id: string; prompt: string; options: string[]; correct: number };

function stemQuiz(
  id: string,
  matiere: SeedCatalogQcm["matiere"],
  title: string,
  niveau: string,
  chapitre: string,
  qs: Q[],
): SeedCatalogQcm {
  return { id, title, matiere, niveau, chapitre, questions: qs };
}

export const X10_FILL_STEM_QCMS: SeedCatalogQcm[] = [
  // ——— Physique-Chimie (5 de plus → 10) ———
  stemQuiz("seed-qcm-x10-phy-6", "Physique-Chimie", "Physique — Mouvement rectiligne", "Lycée", "MRU · vitesse", [
    { id: "xp6-1", prompt: "v = d/t. d=100 m, t=20 s → v :", options: ["5 m/s", "2000 m/s", "0,2 m/s"], correct: 0 },
    { id: "xp6-2", prompt: "MRU : accélération :", options: ["0", "constante non nulle", "variable toujours"], correct: 0 },
    { id: "xp6-3", prompt: "Unité SI vitesse :", options: ["m/s", "km/h seule SI", "N"], correct: 0 },
    { id: "xp6-4", prompt: "72 km/h ≈", options: ["20 m/s", "72 m/s", "2 m/s"], correct: 0 },
    { id: "xp6-5", prompt: "Graphique d(t) linéaire en MRU : pente =", options: ["vitesse", "accélération", "masse"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-phy-7", "Physique-Chimie", "Physique — Loi d'Ohm", "Lycée", "U = R·I", [
    { id: "xp7-1", prompt: "U = R×I. R=10 Ω, I=0,5 A → U :", options: ["5 V", "20 V", "0,05 V"], correct: 0 },
    { id: "xp7-2", prompt: "Unité résistance :", options: ["ohm (Ω)", "volt", "ampère"], correct: 0 },
    { id: "xp7-3", prompt: "I = U/R. U=12 V, R=4 Ω → I :", options: ["3 A", "48 A", "0,33 A"], correct: 0 },
    { id: "xp7-4", prompt: "Association série : R_eq =", options: ["R1+R2", "1/R1+1/R2", "R1×R2"], correct: 0 },
    { id: "xp7-5", prompt: "Puissance P = U×I. Unité :", options: ["watt (W)", "joule", "coulomb"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-phy-8", "Physique-Chimie", "Chimie — Quantité de matière", "Lycée", "Mole · Avogadro", [
    { id: "xp8-1", prompt: "1 mole ≈ particules (Avogadro) :", options: ["6,02×10²³", "10²³", "6,02×10²²"], correct: 0 },
    { id: "xp8-2", prompt: "Masse molaire H₂O ≈ 18 g/mol. n=2 mol → m :", options: ["36 g", "18 g", "9 g"], correct: 0 },
    { id: "xp8-3", prompt: "n = m/M. m=56 g, M=28 g/mol → n :", options: ["2 mol", "0,5 mol", "28 mol"], correct: 0 },
    { id: "xp8-4", prompt: "Volume molaire gaz (CN) ≈", options: ["24 L/mol", "1 L/mol", "22 mL/mol"], correct: 0 },
    { id: "xp8-5", prompt: "Symbole quantité de matière :", options: ["n", "m", "M"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-phy-9", "Physique-Chimie", "Chimie — Acides et bases", "Lycée", "pH · neutralisation", [
    { id: "xp9-1", prompt: "pH = 7 à 25 °C : solution :", options: ["neutre", "acide", "basique"], correct: 0 },
    { id: "xp9-2", prompt: "pH < 7 : milieu :", options: ["acide", "basique", "neutre"], correct: 0 },
    { id: "xp9-3", prompt: "Acide + base → souvent :", options: ["sel + eau", "oxygène seul", "métal"], correct: 0 },
    { id: "xp9-4", prompt: "Plus pH augmente (à dilution fixe), plus :", options: ["basique", "acide", "neutre toujours"], correct: 0 },
    { id: "xp9-5", prompt: "Indicateur universel rouge en milieu acide :", options: ["rouge/orange", "bleu", "vert seulement"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-phy-10", "Physique-Chimie", "Physique — Ondes et lumière", "Lycée", "Fréquence · longueur d'onde", [
    { id: "xp10-1", prompt: "v = λ×f. λ=2 m, f=5 Hz → v :", options: ["10 m/s", "2,5 m/s", "7 m/s"], correct: 0 },
    { id: "xp10-2", prompt: "Unité fréquence :", options: ["hertz (Hz)", "mètre", "seconde"], correct: 0 },
    { id: "xp10-3", prompt: "Lumière dans le vide ≈", options: ["3×10⁸ m/s", "340 m/s", "1500 m/s"], correct: 0 },
    { id: "xp10-4", prompt: "Son dans l'air ≈", options: ["340 m/s", "3×10⁸ m/s", "10 m/s"], correct: 0 },
    { id: "xp10-5", prompt: "λ (lambda) désigne :", options: ["longueur d'onde", "amplitude", "période"], correct: 0 },
  ]),
  // ——— SVT (5 de plus → 10) ———
  stemQuiz("seed-qcm-x10-svt-6", "SVT", "SVT — Mitose et méiose", "Lycée", "Division cellulaire", [
    { id: "xs6-1", prompt: "Mitose : cellules filles :", options: ["2n identiques", "n gamètes", "4n"], correct: 0 },
    { id: "xs6-2", prompt: "Méiose produit :", options: ["gamètes n", "cellules 2n identiques", "ADN sans division"], correct: 0 },
    { id: "xs6-3", prompt: "Crossing-over en prophase I :", options: ["recombinaison", "photosynthèse", "respiration"], correct: 0 },
    { id: "xs6-4", prompt: "Humain : 46 chromosomes somatiques → paires :", options: ["23", "46", "92"], correct: 0 },
    { id: "xs6-5", prompt: "Mitose sert surtout à :", options: ["croissance / renouvellement", "formation spermatozoïde seule", "digestion"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-svt-7", "SVT", "SVT — Système nerveux", "Lycée", "Neurone · synapse", [
    { id: "xs7-1", prompt: "Unité fonctionnelle système nerveux :", options: ["neurone", "nephron", "alvéole"], correct: 0 },
    { id: "xs7-2", prompt: "Synapse : transmission via :", options: ["neurotransmetteurs", "sang seul", "os"], correct: 0 },
    { id: "xs7-3", prompt: "Réflexe myotatique : arc :", options: ["sensoriel → centre → moteur", "cortex seul", "digestif"], correct: 0 },
    { id: "xs7-4", prompt: "Cerveau contrôle entre autres :", options: ["mouvement volontaire", "photosynthèse", "mitose plante"], correct: 0 },
    { id: "xs7-5", prompt: "Axone transporte :", options: ["influx nerveux", "sang", "urine"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-svt-8", "SVT", "SVT — Immunologie", "Lycée", "Immunité · vaccin", [
    { id: "xs8-1", prompt: "Vaccin vise surtout :", options: ["immunité mémorisée", "antibiotique direct", "chirurgie"], correct: 0 },
    { id: "xs8-2", prompt: "Anticorps produits par :", options: ["lymphocytes B/plasma", "neurones", "os"], correct: 0 },
    { id: "xs8-3", prompt: "Antigène :", options: ["reconnu par système immunitaire", "vitamine", "hormone seule"], correct: 0 },
    { id: "xs8-4", prompt: "Immunité innée :", options: ["barrières non spécifiques", "anticorps uniquement", "vaccin"], correct: 0 },
    { id: "xs8-5", prompt: "Antibiotique agit sur :", options: ["bactéries", "virus toujours", "vaccins"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-svt-9", "SVT", "SVT — Géologie · tectonique", "Lycée", "Plaques · séismes", [
    { id: "xs9-1", prompt: "Tectonique des plaques explique :", options: ["séismes / volcanisme", "photosynthèse", "digestion"], correct: 0 },
    { id: "xs9-2", prompt: "Faille transformante : mouvement :", options: ["horizontal", "vertical seulement", "aucun"], correct: 0 },
    { id: "xs9-3", prompt: "Subduction : plaque plonge :", options: ["sous une autre", "dans l'espace", "sur continent sec"], correct: 0 },
    { id: "xs9-4", prompt: "Richter mesure :", options: ["magnitude séisme", "pluie", "température corps"], correct: 0 },
    { id: "xs9-5", prompt: "Dorsale océanique : croûte :", options: ["océanique jeune", "continentale ancienne seule", "atmosphère"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-svt-10", "SVT", "SVT — Nutrition et santé", "Lycée", "Macronutriments", [
    { id: "xs10-1", prompt: "Glucides : énergie rapide via :", options: ["glucose", "ADN seul", "calcium"], correct: 0 },
    { id: "xs10-2", prompt: "Protéines : rôle majeur :", options: ["structure / enzymes", "only lipids storage", "O₂ transport seul"], correct: 0 },
    { id: "xs10-3", prompt: "Insuline régule :", options: ["glycémie", "température os", "lumière"], correct: 0 },
    { id: "xs10-4", prompt: "Carence fer → risque :", options: ["anémie", "diabète type 1 seul", "myopie"], correct: 0 },
    { id: "xs10-5", prompt: "Fibres alimentaires aident :", options: ["transit intestinal", "mitose", "photosynthèse humaine"], correct: 0 },
  ]),
  // ——— Histoire-Géographie (5 de plus → 10) ———
  stemQuiz("seed-qcm-x10-hg-6", "Histoire-Géographie", "HG — Maroc indépendance", "Collège", "1956 · protectorate", [
    { id: "xh6-1", prompt: "Indépendance Maroc (repère) :", options: ["1956", "1912 seule fin", "2000"], correct: 0 },
    { id: "xh6-2", prompt: "Protectorat français (partie) : présence :", options: ["administrative/militaire", "inexistante", "romaine"], correct: 0 },
    { id: "xh6-3", prompt: "Manifeste de l'Indépendance (1944) : acteur :", options: ["nationalistes marocains", "ONU seule", "Rome"], correct: 0 },
    { id: "xh6-4", prompt: "Rabat : statut politique :", options: ["capitale", "port principal seul", "désert"], correct: 0 },
    { id: "xh6-5", prompt: "Après 1956 : défi majeur :", options: ["construction État moderne", "découverte Amérique", "guerre froide seule fin"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-hg-7", "Histoire-Géographie", "HG — Climat et biomes", "Collège", "Climatogramme", [
    { id: "xh7-1", prompt: "Équateur : climat typique :", options: ["tropical humide chaud", "polaire", "désertique froid"], correct: 0 },
    { id: "xh7-2", prompt: "Méditerranéen : été souvent :", options: ["sec et chaud", "très froid", "sans saison"], correct: 0 },
    { id: "xh7-3", prompt: "Isohyète relie points même :", options: ["pluviométrie", "altitude", "population"], correct: 0 },
    { id: "xh7-4", prompt: "Désert : pluviométrie annuelle :", options: ["faible", ">2000 mm", "nulle partout"], correct: 0 },
    { id: "xh7-5", prompt: "Biome toundra : végétation :", options: ["mousse/lichens", "forêt tropicale", "mangrove"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-hg-8", "Histoire-Géographie", "HG — Urbanisation", "Lycée", "Métropolisation", [
    { id: "xh8-1", prompt: "Métropolisation : concentration en :", options: ["grandes villes", "campagnes seules", "déserts"], correct: 0 },
    { id: "xh8-2", prompt: "Périurbanisation :", options: ["extension banlieue", "dépeuplement urbain total", "volcan"], correct: 0 },
    { id: "xh8-3", prompt: "Bidonville : enjeu :", options: ["logement précaire", "ski", "pêche"], correct: 0 },
    { id: "xh8-4", prompt: "Casablanca : rôle économique Maroc :", options: ["métropole économique", "capitale politique", "port désert"], correct: 0 },
    { id: "xh8-5", prompt: "Gentrifiation :", options: ["remplacement population quartier", "agriculture seule", "glace"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-hg-9", "Histoire-Géographie", "HG — Ressources et eau", "Lycée", "Stress hydrique", [
    { id: "xh9-1", prompt: "Stress hydrique : demande vs ressource :", options: ["déficit / tension", "excès toujours", "sans lien"], correct: 0 },
    { id: "xh9-2", prompt: "Barrage : fonction :", options: ["stockage eau / énergie", "only transport", "only tourisme"], correct: 0 },
    { id: "xh9-3", prompt: "Dessalement : source :", options: ["eau de mer", "glace pôle seule", "pétrole"], correct: 0 },
    { id: "xh9-4", prompt: "Aquifère : eau :", options: ["souterraine", "atmosphérique seule", "magmatique"], correct: 0 },
    { id: "xh9-5", prompt: "Irrigation intensive : risque :", options: ["salinisation sols", "augmentation pluie", "extinction soleil"], correct: 0 },
  ]),
  stemQuiz("seed-qcm-x10-hg-10", "Histoire-Géographie", "HG — UE et coopération", "Lycée", "Intégration régionale", [
    { id: "xh10-1", prompt: "Union européenne : monnaie partagée (zone) :", options: ["euro", "dollar", "dirham seul UE"], correct: 0 },
    { id: "xh10-2", prompt: "Libre circulation Schengen (concept) :", options: ["personnes (espace)", "only goods ban", "only space"], correct: 0 },
    { id: "xh10-3", prompt: "UA (Union africaine) : objectif :", options: ["coopération continentale", "colonisation", "only sport"], correct: 0 },
    { id: "xh10-4", prompt: "Accord libre-échange : réduction :", options: ["barrières commerciales", "population", "eau"], correct: 0 },
    { id: "xh10-5", prompt: "Maroc : partenariat UE via :", options: ["accords associat./économiques", "Antarctique", "Lune"], correct: 0 },
  ]),
];
