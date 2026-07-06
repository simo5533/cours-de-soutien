/**
 * Complète chaque langue et matière STEM à 15 QCM minimum.
 * Langues : quiz 11–15 · STEM (Phy/SVT/HG) : quiz 11–15 (+ base déjà à 11).
 */
import type { SeedCatalogQcm } from "./seed-catalog-quizzes";

type Q = { id: string; prompt: string; options: string[]; correct: number };

function quiz(
  id: string,
  matiere: SeedCatalogQcm["matiere"],
  title: string,
  niveau: string,
  chapitre: string,
  qs: Q[],
): SeedCatalogQcm {
  return { id, title, matiere, niveau, chapitre, questions: qs };
}

export const X15_FILL_QCMS: SeedCatalogQcm[] = [
  // ——— Français 11–15 ———
  quiz("seed-qcm-x15-fr-11", "Français", "Français — Quiz 11 · subjonctif", "C", "Subjonctif présent", [
    { id: "x15fr11-1", prompt: "« Il faut que tu ___ (venir) » :", options: ["viennes", "viens", "viendras"], correct: 0 },
    { id: "x15fr11-2", prompt: "« Bien qu’il ___ (pleuvoir), nous sortons » :", options: ["pleuve", "pleut", "a plu"], correct: 0 },
    { id: "x15fr11-3", prompt: "Après « avant que », on emploie souvent :", options: ["subjonctif", "infinitif seul", "participe passé"], correct: 0 },
    { id: "x15fr11-4", prompt: "« Je doute qu’il ___ (réussir) » :", options: ["réussisse", "réussit", "réussira"], correct: 0 },
    { id: "x15fr11-5", prompt: "« Pourvu qu’il ___ (être) à l’heure » :", options: ["soit", "est", "sera"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-fr-12", "Français", "Français — Quiz 12 · discours indirect", "C", "Rapporté · concordance", [
    { id: "x15fr12-1", prompt: "Direct : « Je viens demain » → Il dit qu’il ___ le lendemain.", options: ["viendrait", "vient", "est venu"], correct: 0 },
    { id: "x15fr12-2", prompt: "« Hier » devient souvent en rapporté :", options: ["la veille / le jour précédent", "demain", "aujourd’hui"], correct: 0 },
    { id: "x15fr12-3", prompt: "« Ici » → en rapporté :", options: ["là / là-bas", "partout", "nulle part"], correct: 0 },
    { id: "x15fr12-4", prompt: "« Il m’a demandé si je ___ (pouvoir) l’aider » :", options: ["pouvais", "peux", "pourrai"], correct: 0 },
    { id: "x15fr12-5", prompt: "Le discours indirect évite souvent :", options: ["les guillemets du direct", "tout verbe", "le sujet"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-fr-13", "Français", "Français — Quiz 13 · figures de style", "C", "Métaphore · comparaison", [
    { id: "x15fr13-1", prompt: "« La mer de nuages » — figure :", options: ["métaphore", "comparaison avec « comme »", "énumération"], correct: 0 },
    { id: "x15fr13-2", prompt: "« Fort comme un lion » — figure :", options: ["comparaison", "métaphore", "hyperbole seule"], correct: 0 },
    { id: "x15fr13-3", prompt: "Répétition d’un son en début de mots :", options: ["allitération", "oxymore", "litote"], correct: 0 },
    { id: "x15fr13-4", prompt: "« Un silence assourdissant » — figure :", options: ["oxymore", "métaphore simple", "anaphore"], correct: 0 },
    { id: "x15fr13-5", prompt: "Exagération volontaire :", options: ["hyperbole", "litote", "ellipse"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-fr-14", "Français", "Français — Quiz 14 · argumentation", "C", "Thèse · arguments", [
    { id: "x15fr14-1", prompt: "Dans un texte argumentatif, la thèse est :", options: ["l’idée défendue", "un exemple seul", "la conclusion toujours négative"], correct: 0 },
    { id: "x15fr14-2", prompt: "Un argument d’autorité cite :", options: ["une source reconnue", "une opinion sans fondement", "un dialogue théâtral"], correct: 0 },
    { id: "x15fr14-3", prompt: "Connecteur d’opposition :", options: ["cependant", "de plus", "ainsi"], correct: 0 },
    { id: "x15fr14-4", prompt: "Connecteur d’addition :", options: ["de plus", "néanmoins", "en revanche"], correct: 0 },
    { id: "x15fr14-5", prompt: "La concession introduit :", options: ["un obstacle avant de conclure", "la thèse finale seule", "un récit"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-fr-15", "Français", "Français — Quiz 15 · rédaction Bac", "C", "Synthèse · cohérence", [
    { id: "x15fr15-1", prompt: "Un paragraphe argumenté commence souvent par :", options: ["une phrase-topic", "une citation longue seule", "une liste sans idée"], correct: 0 },
    { id: "x15fr15-2", prompt: "Pour lier deux idées : utiliser des :", options: ["connecteurs logiques", "points seuls", "abréviations"], correct: 0 },
    { id: "x15fr15-3", prompt: "Éviter dans une dissertation :", options: ["le « je » trop familier (souvent)", "les paragraphes", "la conclusion"], correct: 0 },
    { id: "x15fr15-4", prompt: "Relecture : vérifier d’abord :", options: ["accords et conjugaison", "la couleur du stylo", "le nombre de pages seul"], correct: 0 },
    { id: "x15fr15-5", prompt: "Introduction efficace : annonce :", options: ["problématique et plan", "toute la conclusion", "rien"], correct: 0 },
  ]),

  // ——— Espagnol 11–15 ———
  quiz("seed-qcm-x15-es-11", "Espagnol", "Espagnol — Quiz 11 · imperativo", "C", "Impératif · consignes", [
    { id: "x15es11-1", prompt: "« ___ (tú / hablar) más despacio » :", options: ["Habla", "Hables", "Hablar"], correct: 0 },
    { id: "x15es11-2", prompt: "« No ___ (fumar) aquí » (usted) :", options: ["fume", "fumas", "fumar"], correct: 0 },
    { id: "x15es11-3", prompt: "Impératif affirmatif tú (regular -ar) :", options: ["3e pers. sing. présent", "infinitif", "subjonctif toujours"], correct: 0 },
    { id: "x15es11-4", prompt: "« Vamos a ___ (estudiar) » :", options: ["estudiar", "estudiamos", "estudié"], correct: 0 },
    { id: "x15es11-5", prompt: "« ___ (nosotros) la tarea » (imperativo nosotros -ar) :", options: ["Hablemos", "Hablamos", "Habláis"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-es-12", "Espagnol", "Espagnol — Quiz 12 · pluscuamperfecto", "C", "Plus-que-parfait", [
    { id: "x15es12-1", prompt: "Pluscuamperfecto : auxiliaire + :", options: ["participio", "infinitivo", "gerundio"], correct: 0 },
    { id: "x15es12-2", prompt: "« Ya había ___ (comer) » :", options: ["comido", "comía", "comí"], correct: 0 },
    { id: "x15es12-3", prompt: "Action antérieure à une autre passée :", options: ["pluscuamperfecto", "futuro", "presente"], correct: 0 },
    { id: "x15es12-4", prompt: "« Ellos ya ___ (salir) cuando llegué » :", options: ["habían salido", "salieron", "salían"], correct: 0 },
    { id: "x15es12-5", prompt: "Auxiliaire avec « salir » (mouvement) souvent :", options: ["haber", "ser toujours", "estar seul"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-es-13", "Espagnol", "Espagnol — Quiz 13 · por y para", "C", "Prépositions · but", [
    { id: "x15es13-1", prompt: "But / destination : souvent :", options: ["para", "por", "de"], correct: 0 },
    { id: "x15es13-2", prompt: "« Gracias ___ tu ayuda » :", options: ["por", "para", "con"], correct: 0 },
    { id: "x15es13-3", prompt: "« Este regalo es ___ ti » :", options: ["para", "por", "sin"], correct: 0 },
    { id: "x15es13-4", prompt: "Cause / motif approximatif : souvent :", options: ["por", "para", "hasta"], correct: 0 },
    { id: "x15es13-5", prompt: "« Camino ___ la escuela » (direction) :", options: ["hacia / a", "para seul toujours", "desde seul"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-es-14", "Espagnol", "Espagnol — Quiz 14 · vocabulario escolar", "C", "École · examen", [
    { id: "x15es14-1", prompt: "« El ___ » (professeur, masc.) :", options: ["profesor", "profesora", "alumno"], correct: 0 },
    { id: "x15es14-2", prompt: "« Sacar buenas ___ » (notes) :", options: ["notas", "libros", "puertas"], correct: 0 },
    { id: "x15es14-3", prompt: "« Aprobar un ___ » :", options: ["examen", "calle", "árbol"], correct: 0 },
    { id: "x15es14-4", prompt: "« Hacer los ___ » (devoirs) :", options: ["deberes", "deportes seuls", "viajes"], correct: 0 },
    { id: "x15es14-5", prompt: "« Biblioteca » :", options: ["bibliothèque", "cantine", "gymnase"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-es-15", "Espagnol", "Espagnol — Quiz 15 · cultura hispana", "C", "Géographie · repères", [
    { id: "x15es15-1", prompt: "Capitale de l’Espagne :", options: ["Madrid", "Barcelona", "Lisbonne"], correct: 0 },
    { id: "x15es15-2", prompt: "Langue officielle au Maroc (avec arabe) inclut usage de :", options: ["français (contexte scolaire)", "japonais", "suédois"], correct: 0 },
    { id: "x15es15-3", prompt: "« América Latina » : pays où l’on parle surtout :", options: ["espagnol (et portugais au Brésil)", "allemand", "russe"], correct: 0 },
    { id: "x15es15-4", prompt: "Fête nationale espagnole (repère) :", options: ["12 octobre (Fiesta Nacional)", "1 janvier seul", "14 juillet"], correct: 0 },
    { id: "x15es15-5", prompt: "« ¿Cómo te llamas? » demande :", options: ["le prénom", "l’âge", "l’heure"], correct: 0 },
  ]),

  // ——— Anglais 11–15 ———
  quiz("seed-qcm-x15-en-11", "Anglais", "Anglais — Quiz 11 · conditionals", "C", "If clauses · types", [
    { id: "x15en11-1", prompt: "Zero conditional : « If you heat ice, it ___ » :", options: ["melts", "melted", "will melt"], correct: 0 },
    { id: "x15en11-2", prompt: "First conditional : « If it rains, we ___ home » :", options: ["will stay", "stayed", "stay"], correct: 0 },
    { id: "x15en11-3", prompt: "Second conditional (hypothétique) : « If I ___ rich, I would travel » :", options: ["were", "am", "will be"], correct: 0 },
    { id: "x15en11-4", prompt: "Third conditional : « If I had studied, I ___ passed » :", options: ["would have", "will have", "would"], correct: 0 },
    { id: "x15en11-5", prompt: "Unless =", options: ["if not", "because", "although"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-en-12", "Anglais", "Anglais — Quiz 12 · passive voice", "C", "Passive · agent", [
    { id: "x15en12-1", prompt: "Passive present : « The book ___ read » :", options: ["is", "are", "was"], correct: 0 },
    { id: "x15en12-2", prompt: "« English ___ all over the world » (speak) :", options: ["is spoken", "speaks", "is speaking"], correct: 0 },
    { id: "x15en12-3", prompt: "Agent with by : « Written ___ Shakespeare » :", options: ["by", "from", "with"], correct: 0 },
    { id: "x15en12-4", prompt: "Passive past : « The letter ___ yesterday » (send) :", options: ["was sent", "is sent", "sent"], correct: 0 },
    { id: "x15en12-5", prompt: "Structure passive : be + :", options: ["past participle", "infinitive", "gerund only"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-en-13", "Anglais", "Anglais — Quiz 13 · relative clauses", "C", "Who · which · that", [
    { id: "x15en13-1", prompt: "« The student ___ won the prize » (person) :", options: ["who", "which", "where"], correct: 0 },
    { id: "x15en13-2", prompt: "« The book ___ I borrowed » (thing) :", options: ["that/which", "who", "whose"], correct: 0 },
    { id: "x15en13-3", prompt: "« Whose » indique :", options: ["possession", "lieu", "temps"], correct: 0 },
    { id: "x15en13-4", prompt: "« This is the school ___ I study » :", options: ["where", "who", "whose"], correct: 0 },
    { id: "x15en13-5", prompt: "Defining relative clause :", options: ["essential information", "optional always between commas", "no verb"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-en-14", "Anglais", "Anglais — Quiz 14 · school vocabulary", "C", "Education · exam", [
    { id: "x15en14-1", prompt: "« To pass an exam » =", options: ["réussir", "échouer", "oublier"], correct: 0 },
    { id: "x15en14-2", prompt: "« Homework » =", options: ["devoirs", "cantine", "vacances"], correct: 0 },
    { id: "x15en14-3", prompt: "« Headteacher » ≈", options: ["directeur d’école", "élève", "bibliothèque"], correct: 0 },
    { id: "x15en14-4", prompt: "« To revise » =", options: ["réviser", "jouer", "dormir"], correct: 0 },
    { id: "x15en14-5", prompt: "« Grade / mark » =", options: ["note", "classe", "crayon"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-en-15", "Anglais", "Anglais — Quiz 15 · UK culture", "C", "Repères · géographie", [
    { id: "x15en15-1", prompt: "Capital of the UK :", options: ["London", "Paris", "Dublin"], correct: 0 },
    { id: "x15en15-2", prompt: "The UK includes England, Scotland, Wales and :", options: ["Northern Ireland", "Canada", "Australia"], correct: 0 },
    { id: "x15en15-3", prompt: "Official language of the UK :", options: ["English", "French only", "Spanish"], correct: 0 },
    { id: "x15en15-4", prompt: "« GCSE » refers to :", options: ["school exams (UK)", "a sport", "a currency"], correct: 0 },
    { id: "x15en15-5", prompt: "Union Jack is :", options: ["the UK flag", "a river", "a king"], correct: 0 },
  ]),

  // ——— Anglais américain 11–15 ———
  quiz("seed-qcm-x15-enus-11", "Anglais américain", "Anglais US — Quiz 11 · grammar review", "C", "Tenses · agreement", [
    { id: "x15us11-1", prompt: "« The team ___ winning » (collective, US often) :", options: ["is", "are always", "were"], correct: 0 },
    { id: "x15us11-2", prompt: "US : « I have gotten » — UK often :", options: ["I have got", "I have get", "I gotten"], correct: 0 },
    { id: "x15us11-3", prompt: "« Different than » is common in :", options: ["US English", "UK only", "French"], correct: 0 },
    { id: "x15us11-4", prompt: "« On the weekend » (US) ≈ UK :", options: ["at the weekend", "in the weekend only", "on weekendly"], correct: 0 },
    { id: "x15us11-5", prompt: "« Real good » in informal US — prescriptive grammar prefers :", options: ["really good", "real well always", "goodly"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-enus-12", "Anglais américain", "Anglais US — Quiz 12 · education", "C", "High school · college", [
    { id: "x15us12-1", prompt: "US « high school » ≈", options: ["lycée (secondaire)", "université", "primaire"], correct: 0 },
    { id: "x15us12-2", prompt: "US « college » often means :", options: ["université / études sup.", "école primaire", "cantine"], correct: 0 },
    { id: "x15us12-3", prompt: "« GPA » measures :", options: ["academic average", "sport score", "temperature"], correct: 0 },
    { id: "x15us12-4", prompt: "« Senior year » (high school) :", options: ["dernière année", "première année", "maternelle"], correct: 0 },
    { id: "x15us12-5", prompt: "« Pop quiz » =", options: ["interrogation surprise", "fête", "musique seule"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-enus-13", "Anglais américain", "Anglais US — Quiz 13 · idioms", "C", "Expressions US", [
    { id: "x15us13-1", prompt: "« Break a leg » means :", options: ["good luck", "hurt yourself", "run fast"], correct: 0 },
    { id: "x15us13-2", prompt: "« Piece of cake » =", options: ["very easy", "dessert only", "difficult"], correct: 0 },
    { id: "x15us13-3", prompt: "« Hang out » =", options: ["spend time casually", "hang clothes", "sleep"], correct: 0 },
    { id: "x15us13-4", prompt: "« Under the weather » =", options: ["feeling sick", "sunny", "outside"], correct: 0 },
    { id: "x15us13-5", prompt: "« Buck » (informal US) can mean :", options: ["dollar", "horse only", "car"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-enus-14", "Anglais américain", "Anglais US — Quiz 14 · US geography", "C", "States · cities", [
    { id: "x15us14-1", prompt: "Capital of the USA :", options: ["Washington, D.C.", "New York", "Los Angeles"], correct: 0 },
    { id: "x15us14-2", prompt: "Number of states in the USA :", options: ["50", "48", "13"], correct: 0 },
    { id: "x15us14-3", prompt: "« The West Coast » includes roughly :", options: ["California", "Florida", "Maine"], correct: 0 },
    { id: "x15us14-4", prompt: "Statue of Liberty is in :", options: ["New York", "Texas", "Chicago"], correct: 0 },
    { id: "x15us14-5", prompt: "US national holiday July 4th :", options: ["Independence Day", "Thanksgiving", "Labor Day only"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-enus-15", "Anglais américain", "Anglais US — Quiz 15 · media & tech", "C", "Digital · everyday US", [
    { id: "x15us15-1", prompt: "« Wi-Fi » is used for :", options: ["wireless internet", "TV only", "postal mail"], correct: 0 },
    { id: "x15us15-2", prompt: "« Smartphone » =", options: ["téléphone intelligent", "montre seule", "radio"], correct: 0 },
    { id: "x15us15-3", prompt: "« Stream a show » =", options: ["watch online", "swim", "print"], correct: 0 },
    { id: "x15us15-4", prompt: "« Text someone » (US) =", options: ["send an SMS/message", "write a book", "call only"], correct: 0 },
    { id: "x15us15-5", prompt: "« App » short for :", options: ["application", "appetite", "apparatus only"], correct: 0 },
  ]),

  // ——— Allemand 11–15 ———
  quiz("seed-qcm-x15-de-11", "Allemand", "Allemand — Quiz 11 · Futur I", "C", "werden + Infinitiv", [
    { id: "x15de11-1", prompt: "Futur I : « Ich ___ morgen kommen » :", options: ["werde", "bin", "war"], correct: 0 },
    { id: "x15de11-2", prompt: "« Er ___ das Buch lesen » :", options: ["wird", "wirst", "werden"], correct: 0 },
    { id: "x15de11-3", prompt: "Futur I = werden + :", options: ["Infinitiv (fin)", "Partizip II", "Nomen"], correct: 0 },
    { id: "x15de11-4", prompt: "« Wir ___ pünktlich sein » :", options: ["werden", "wird", "wurden"], correct: 0 },
    { id: "x15de11-5", prompt: "Futur pour intention / futur proche en allemand :", options: ["Futur I / Präsens parfois", "nur Präteritum", "nur Plusquamperfekt"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-de-12", "Allemand", "Allemand — Quiz 12 · Präpositionen", "C", "in · an · auf", [
    { id: "x15de12-1", prompt: "« Ich bin ___ der Schule » (être à l’intérieur) :", options: ["in", "auf", "vor"], correct: 0 },
    { id: "x15de12-2", prompt: "« Das Bild hängt ___ der Wand » :", options: ["an", "in", "unter"], correct: 0 },
    { id: "x15de12-3", prompt: "« Auf dem Tisch » — Dativ après « auf » (lieu) :", options: ["dem Tisch", "den Tisch", "der Tisch"], correct: 0 },
    { id: "x15de12-4", prompt: "« Nach » + pays (féminin) Allemagne :", options: ["Deutschland (ohne article souvent)", "die Deutschland", "der Deutschland"], correct: 0 },
    { id: "x15de12-5", prompt: "« Mit » exige le cas :", options: ["Dativ", "Akkusativ", "Genitiv"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-de-13", "Allemand", "Allemand — Quiz 13 · Schule", "C", "Vocabulaire scolaire", [
    { id: "x15de13-1", prompt: "« die Schule » =", options: ["l’école", "la rue", "la gare"], correct: 0 },
    { id: "x15de13-2", prompt: "« die Hausaufgaben » =", options: ["les devoirs", "la maison", "les vacances"], correct: 0 },
    { id: "x15de13-3", prompt: "« der Lehrer / die Lehrerin » =", options: ["professeur", "élève", "directeur seul"], correct: 0 },
    { id: "x15de13-4", prompt: "« die Prüfung » =", options: ["l’examen", "la récréation", "le stylo"], correct: 0 },
    { id: "x15de13-5", prompt: "« bestehen » (Prüfung) ≈", options: ["réussir", "échouer", "oublier"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-de-14", "Allemand", "Allemand — Quiz 14 · Kultur", "C", "Allemagne · repères", [
    { id: "x15de14-1", prompt: "Capitale de l’Allemagne :", options: ["Berlin", "Munich", "Vienne"], correct: 0 },
    { id: "x15de14-2", prompt: "Langue officielle en Allemagne :", options: ["allemand", "anglais", "espagnol"], correct: 0 },
    { id: "x15de14-3", prompt: "« Guten Tag » =", options: ["bonjour", "au revoir", "merci"], correct: 0 },
    { id: "x15de14-4", prompt: "« Danke » =", options: ["merci", "pardon", "oui"], correct: 0 },
    { id: "x15de14-5", prompt: "Oktoberfest est associé à :", options: ["Munich / Bavière", "Berlin seul", "Paris"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-de-15", "Allemand", "Allemand — Quiz 15 · Leseverstehen", "C", "Compréhension · stratégies", [
    { id: "x15de15-1", prompt: "Pour un texte allemand, repérer d’abord :", options: ["le sujet et le verbe", "tous les noms propres seuls", "la longueur"], correct: 0 },
    { id: "x15de15-2", prompt: "« weil » introduit une proposition avec verbe en :", options: ["fin", "début", "milieu seul"], correct: 0 },
    { id: "x15de15-3", prompt: "Négation standard :", options: ["nicht / kein", "ne...pas français", "never seul"], correct: 0 },
    { id: "x15de15-4", prompt: "« ob » dans « Ich weiß nicht, ob … » =", options: ["si (indirecte)", "ou", "parce que"], correct: 0 },
    { id: "x15de15-5", prompt: "Les mots composés allemands (Hausaufgaben) :", options: ["souvent un seul sens combiné", "toujours deux phrases", "sans sens"], correct: 0 },
  ]),

  // ——— Chinois 11–15 ———
  quiz("seed-qcm-x15-zh-11", "Chinois (mandarin)", "Chinois — Quiz 11 · 把 et 被", "C", "Structures · voix", [
    { id: "x15zh11-1", prompt: "Structure 把 : met l’accent sur :", options: ["le résultat sur l’objet", "la question", "le passé seul"], correct: 0 },
    { id: "x15zh11-2", prompt: "被 marque souvent :", options: ["voix passive", "futur", "négation"], correct: 0 },
    { id: "x15zh11-3", prompt: "Ordre basique chinois :", options: ["SVO (sujet-verbe-objet)", "VSO toujours", "OVS"], correct: 0 },
    { id: "x15zh11-4", prompt: "« 不 » devant verbe =", options: ["négation", "passé", "pluriel"], correct: 0 },
    { id: "x15zh11-5", prompt: "« 没 » utilisé souvent pour nier :", options: ["passé / avoir", "futur seul", "couleurs"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-zh-12", "Chinois (mandarin)", "Chinois — Quiz 12 · école", "C", "学校 · examen", [
    { id: "x15zh12-1", prompt: "« 学校 » signifie :", options: ["école", "hôpital", "magasin"], correct: 0 },
    { id: "x15zh12-2", prompt: "« 老师 » =", options: ["professeur", "élève", "parent"], correct: 0 },
    { id: "x15zh12-3", prompt: "« 学生 » =", options: ["élève / étudiant", "professeur", "médecin"], correct: 0 },
    { id: "x15zh12-4", prompt: "« 考试 » =", options: ["examen", "vacances", "repas"], correct: 0 },
    { id: "x15zh12-5", prompt: "« 作业 » ≈", options: ["devoirs", "sport", "musique"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-zh-13", "Chinois (mandarin)", "Chinois — Quiz 13 · familles", "C", "家庭 · politesse", [
    { id: "x15zh13-1", prompt: "« 爸爸 » =", options: ["papa", "maman", "frère"], correct: 0 },
    { id: "x15zh13-2", prompt: "« 妈妈 » =", options: ["maman", "papa", "sœur"], correct: 0 },
    { id: "x15zh13-3", prompt: "« 谢谢 » =", options: ["merci", "bonjour", "pardon"], correct: 0 },
    { id: "x15zh13-4", prompt: "« 请 » dans une phrase polie ≈", options: ["s’il vous plaît", "non", "hier"], correct: 0 },
    { id: "x15zh13-5", prompt: "« 对不起 » ≈", options: ["pardon / désolé", "félicitations", "au revoir"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-zh-14", "Chinois (mandarin)", "Chinois — Quiz 14 · nombres et dates", "C", "数字 · 时间", [
    { id: "x15zh14-1", prompt: "« 一 » =", options: ["1", "2", "10"], correct: 0 },
    { id: "x15zh14-2", prompt: "« 十 » =", options: ["10", "1", "100"], correct: 0 },
    { id: "x15zh14-3", prompt: "« 星期 » concerne :", options: ["semaine / jour de la semaine", "mois seul", "année seule"], correct: 0 },
    { id: "x15zh14-4", prompt: "« 今天 » =", options: ["aujourd’hui", "demain", "hier"], correct: 0 },
    { id: "x15zh14-5", prompt: "« 年 » =", options: ["année", "heure", "minute"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-zh-15", "Chinois (mandarin)", "Chinois — Quiz 15 · culture", "C", "中国 · repères", [
    { id: "x15zh15-1", prompt: "Capitale de la Chine :", options: ["北京 (Pékin)", "上海 seule", "东京"], correct: 0 },
    { id: "x15zh15-2", prompt: "Le mandarin est :", options: ["langue officielle (standard)", "dialecte uniquement sans usage", "alphabet latin"], correct: 0 },
    { id: "x15zh15-3", prompt: "« 汉语 » désigne :", options: ["langue chinoise", "monnaie", "nourriture"], correct: 0 },
    { id: "x15zh15-4", prompt: "Nouvel an chinois (repère culturel) :", options: ["fête majeure (printemps)", "Noël occidental", "Ramadan"], correct: 0 },
    { id: "x15zh15-5", prompt: "Les caractères chinois sont des :", options: ["logogrammes", "lettres latines", "chiffres seuls"], correct: 0 },
  ]),

  // ——— Physique-Chimie 11–15 ———
  quiz("seed-qcm-x15-phy-11", "Physique-Chimie", "Physique — Énergie mécanique", "Lycée", "Conservation · travail", [
    { id: "x15p11-1", prompt: "Énergie cinétique Ec =", options: ["½mv²", "mgh", "Fv"], correct: 0 },
    { id: "x15p11-2", prompt: "Énergie potentielle de pesanteur Ep =", options: ["mgh", "½mv²", "qU"], correct: 0 },
    { id: "x15p11-3", prompt: "Sans frottement, Em = Ec + Ep :", options: ["se conserve", "double toujours", "nulle"], correct: 0 },
    { id: "x15p11-4", prompt: "Travail W =", options: ["F·d·cosθ", "m·g seul", "P·t seul"], correct: 0 },
    { id: "x15p11-5", prompt: "Unité SI énergie :", options: ["joule (J)", "watt", "newton"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-phy-12", "Physique-Chimie", "Chimie — Réactions redox", "Lycée", "Oxydation · réduction", [
    { id: "x15p12-1", prompt: "Oxydation :", options: ["perte d’électrons", "gain d’électrons", "gain de protons"], correct: 0 },
    { id: "x15p12-2", prompt: "Réduction :", options: ["gain d’électrons", "perte d’électrons", "perte d’eau"], correct: 0 },
    { id: "x15p12-3", prompt: "Oxydant :", options: ["espèce qui se réduit", "espèce qui s’oxyde", "catalyseur seul"], correct: 0 },
    { id: "x15p12-4", prompt: "Dans une pile : énergie chimique →", options: ["énergie électrique", "lumière seule", "chaleur seule"], correct: 0 },
    { id: "x15p12-5", prompt: "Numéro d’oxydation du O dans O₂ :", options: ["0", "−2", "+2"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-phy-13", "Physique-Chimie", "Physique — Gravitation", "Lycée", "Poids · g", [
    { id: "x15p13-1", prompt: "Poids P =", options: ["mg", "m/g", "g/m"], correct: 0 },
    { id: "x15p13-2", prompt: "g ≈ sur Terre :", options: ["9,8 m/s²", "9,8 N", "1 m/s²"], correct: 0 },
    { id: "x15p13-3", prompt: "Masse vs poids : la masse (kg) est :", options: ["invariante (lieu)", "toujours en N", "une force"], correct: 0 },
    { id: "x15p13-4", prompt: "Chute libre (sans frottement) : accélération :", options: ["g", "0", "v"], correct: 0 },
    { id: "x15p13-5", prompt: "Unité masse SI :", options: ["kilogramme", "newton", "joule"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-phy-14", "Physique-Chimie", "Chimie — Structure atomique", "Lycée", "Atome · tableau périodique", [
    { id: "x15p14-1", prompt: "Numéro atomique Z =", options: ["nombre de protons", "nombre de neutrons seul", "masse"], correct: 0 },
    { id: "x15p14-2", prompt: "Charge électron :", options: ["négative", "positive", "nulle"], correct: 0 },
    { id: "x15p14-3", prompt: "Isotopes : même Z, différent :", options: ["nombre de neutrons", "nombre de protons", "symbole"], correct: 0 },
    { id: "x15p14-4", prompt: "H₂O : molécule :", options: ["triatomique", "diatomique", "monoatomique"], correct: 0 },
    { id: "x15p14-5", prompt: "Gaz noble : couche externe souvent :", options: ["saturée (stable)", "vide", "ionisée"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-phy-15", "Physique-Chimie", "Physique — Optique géométrique", "Lycée", "Réflexion · réfraction", [
    { id: "x15p15-1", prompt: "Loi de Snell : n₁sinθ₁ =", options: ["n₂sinθ₂", "n₂cosθ₂", "sinθ₂ seul"], correct: 0 },
    { id: "x15p15-2", prompt: "Angle d’incidence = angle mesuré par rapport à :", options: ["la normale", "la surface", "l’axe horizontal seul"], correct: 0 },
    { id: "x15p15-3", prompt: "Réflexion totale : lumière passe de milieu plus réfringent vers :", options: ["moins réfringent", "plus dense toujours", "vide seul"], correct: 0 },
    { id: "x15p15-4", prompt: "Miroir plan : image :", options: ["virtuelle, même taille", "réelle agrandie", "inexistante"], correct: 0 },
    { id: "x15p15-5", prompt: "Lentille convergente : image réelle d’un objet lointain en :", options: ["foyer image", "centre optique", "infini"], correct: 0 },
  ]),

  // ——— SVT 11–15 ———
  quiz("seed-qcm-x15-svt-11", "SVT", "SVT — Génétique mendélienne", "Lycée", "Allèles · dominance", [
    { id: "x15s11-1", prompt: "Allèle dominant s’exprime en :", options: ["hétérozygote", "jamais", "seulement homozygote récessif"], correct: 0 },
    { id: "x15s11-2", prompt: "Aa × Aa (A dominant) : proportion phénotype dominant ≈", options: ["3/4", "1/4", "1/2 seul"], correct: 0 },
    { id: "x15s11-3", prompt: "Génotype =", options: ["allèles possédés", "apparence seule", "ADN entier"], correct: 0 },
    { id: "x15s11-4", prompt: "Phénotype =", options: ["caractère observé", "chromosome seul", "mutation"], correct: 0 },
    { id: "x15s11-5", prompt: "Deux allèles identiques :", options: ["homozygote", "hétérozygote", "haploïde"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-svt-12", "SVT", "SVT — Écosystèmes", "Lycée", "Chaînes · flux", [
    { id: "x15s12-1", prompt: "Producteur primaire :", options: ["végétal photosynthétique", "décomposeur", "prédateur apex"], correct: 0 },
    { id: "x15s12-2", prompt: "Pyramide des biomasses : base =", options: ["producteurs", "prédateurs", "décomposeurs seuls"], correct: 0 },
    { id: "x15s12-3", prompt: "Décomposeur recycle :", options: ["matière organique", "lumière", "roches"], correct: 0 },
    { id: "x15s12-4", prompt: "Chaîne alimentaire : énergie perdue entre niveaux :", options: ["oui (chaleur)", "non", "doublée"], correct: 0 },
    { id: "x15s12-5", prompt: "Biodiversité :", options: ["variété des espèces/écosystèmes", "une seule espèce", "pollution"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-svt-13", "SVT", "SVT — Reproduction humaine", "Lycée", "Fécondation · hormones", [
    { id: "x15s13-1", prompt: "Gamète mâle humain :", options: ["spermatozoïde", "ovule", "neurone"], correct: 0 },
    { id: "x15s13-2", prompt: "Fécondation : fusion", options: ["spermatozoïde + ovule", "deux ovules", "ADN seul"], correct: 0 },
    { id: "x15s13-3", prompt: "Cellule œuf (zygote) : chromosomes :", options: ["2n", "n seul", "4n"], correct: 0 },
    { id: "x15s13-4", prompt: "Hormone testostérone : rôle lié à :", options: ["caractères sexuels masculins", "photosynthèse", "digestion"], correct: 0 },
    { id: "x15s13-5", prompt: "Cycle menstruel : organe cible utérus influencé par :", options: ["hormones ovariennes", "lumière", "gravité"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-svt-14", "SVT", "SVT — Santé publique", "Lycée", "Épidémie · prévention", [
    { id: "x15s14-1", prompt: "Épidémie :", options: ["maladie qui se propage largement", "une seule personne", "vaccin"], correct: 0 },
    { id: "x15s14-2", prompt: "Prévention : lavage des mains réduit :", options: ["infections", "photosynthèse", "tectonique"], correct: 0 },
    { id: "x15s14-3", prompt: "OMS (WHO) : rôle :", options: ["santé mondiale", "météo", "sport"], correct: 0 },
    { id: "x15s14-4", prompt: "Maladie transmissible se propage par :", options: ["agent pathogène", "roches", "vent seul sans agent"], correct: 0 },
    { id: "x15s14-5", prompt: "Quarantaine sert à :", options: ["limiter propagation", "augmenter virus", "remplacer vaccin"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-svt-15", "SVT", "SVT — Climat et environnement", "Lycée", "Effet de serre · biodiversité", [
    { id: "x15s15-1", prompt: "Effet de serre : gaz retiennent :", options: ["chaleur infrarouge", "lumière UV seule", "oxygène"], correct: 0 },
    { id: "x15s15-2", prompt: "CO₂ principal gaz à effet de serre d’origine :", options: ["anthropique (combustion)", "hélium", "azote seul"], correct: 0 },
    { id: "x15s15-3", prompt: "Réchauffement climatique : enjeu pour :", options: ["écosystèmes / mers", "tectonique seule", "mitose"], correct: 0 },
    { id: "x15s15-4", prompt: "Déforestation réduit :", options: ["puits de carbone", "population humaine", "gravité"], correct: 0 },
    { id: "x15s15-5", prompt: "Espèce menacée : risque de :", options: ["extinction", "mutation forcée", "photosynthèse accrue"], correct: 0 },
  ]),

  // ——— Histoire-Géographie 11–15 ———
  quiz("seed-qcm-x15-hg-11", "Histoire-Géographie", "HG — Révolution industrielle", "Lycée", "XVIIIe–XIXe · machines", [
    { id: "x15h11-1", prompt: "Révolution industrielle commence en :", options: ["Grande-Bretagne", "Maroc seul", "Antarctique"], correct: 0 },
    { id: "x15h11-2", prompt: "Machine à vapeur (repère Watt) : impact sur :", options: ["transports / usines", "agriculture seule", "religion seule"], correct: 0 },
    { id: "x15h11-3", prompt: "Urbanisation industrielle : migration vers :", options: ["villes", "déserts", "pôles"], correct: 0 },
    { id: "x15h11-4", prompt: "Classe ouvrière : travail en :", options: ["usine", "château", "temple"], correct: 0 },
    { id: "x15h11-5", prompt: "Énergie fossile clé XIXe :", options: ["charbon", "soleil PV", "uranium moderne"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-hg-12", "Histoire-Géographie", "HG — Mondialisation", "Lycée", "Échanges · réseaux", [
    { id: "x15h12-1", prompt: "Mondialisation : intensification des :", options: ["échanges mondiaux", "barrières totales", "isolement"], correct: 0 },
    { id: "x15h12-2", prompt: "OMC (WTO) concerne :", options: ["commerce international", "météo", "espace"], correct: 0 },
    { id: "x15h12-3", prompt: "Firme multinationale :", options: ["activité dans plusieurs pays", "un seul village", "sans production"], correct: 0 },
    { id: "x15h12-4", prompt: "Délocalisation : déplacer production vers :", options: ["coûts plus bas", "toujours même ville", "lune"], correct: 0 },
    { id: "x15h12-5", prompt: "Internet favorise :", options: ["circulation rapide d’infos", "fin des échanges", "cartes papier seules"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-hg-13", "Histoire-Géographie", "HG — Développement durable", "Lycée", "Enjeux · ODD", [
    { id: "x15h13-1", prompt: "Développement durable : équilibre :", options: ["économie / social / environnement", "profit seul", "guerre"], correct: 0 },
    { id: "x15h13-2", prompt: "ODD (ONU) : nombre d’objectifs (repère) :", options: ["17", "5", "100"], correct: 0 },
    { id: "x15h13-3", prompt: "Empreinte carbone mesure :", options: ["GES émis", "population seule", "altitude"], correct: 0 },
    { id: "x15h13-4", prompt: "Énergies renouvelables :", options: ["solaire, éolien…", "charbon seul", "pétrole seul"], correct: 0 },
    { id: "x15h13-5", prompt: "Recyclage réduit :", options: ["déchets / extraction", "pluie", "population"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-hg-14", "Histoire-Géographie", "HG — Cartographie", "Lycée", "Échelle · lecture", [
    { id: "x15h14-1", prompt: "Échelle 1/50 000 : 1 cm =", options: ["500 m", "50 m", "5 km"], correct: 0 },
    { id: "x15h14-2", prompt: "Courbe de niveau : relie points même :", options: ["altitude", "température", "population"], correct: 0 },
    { id: "x15h14-3", prompt: "Légende carte :", options: ["explique symboles", "titre seul", "échelle seule"], correct: 0 },
    { id: "x15h14-4", prompt: "Rose des vents indique :", options: ["orientation", "population", "relief"], correct: 0 },
    { id: "x15h14-5", prompt: "GPS utilise :", options: ["satellites", "boussole seule", "thermomètre"], correct: 0 },
  ]),
  quiz("seed-qcm-x15-hg-15", "Histoire-Géographie", "HG — Afrique et Maroc contemporain", "Lycée", "Décolonisation · intégration", [
    { id: "x15h15-1", prompt: "Décolonisation africaine pic (années) :", options: ["1950–1960", "1850", "2000 seul"], correct: 0 },
    { id: "x15h15-2", prompt: "Union africaine (UA) siège institutionnel :", options: ["Addis-Abeba", "Paris", "New York"], correct: 0 },
    { id: "x15h15-3", prompt: "Maroc : roi actuel (repère) Mohammed VI depuis :", options: ["1999", "1956", "2011 seul"], correct: 0 },
    { id: "x15h15-4", prompt: "Plan Maroc Vert concerne surtout :", options: ["agriculture", "espace", "pétrole seul"], correct: 0 },
    { id: "x15h15-5", prompt: "Diaspora marocaine : lien économique via :", options: ["transferts / investissements", "volcan", "glace"], correct: 0 },
  ]),
];
