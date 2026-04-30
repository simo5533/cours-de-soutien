/**
 * QCM prêts à l’emploi pour le catalogue public (/cours).
 * Matières = libellés exacts de `language-quiz-catalog.ts`.
 * Série 1 → bases, 2 → intermédiaire, 3 → consolidation.
 */

export type SeedCatalogQcmQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
};

export type SeedCatalogQcm = {
  id: string;
  title: string;
  matiere: string;
  niveau: string;
  chapitre: string;
  questions: SeedCatalogQcmQuestion[];
};

export const CATALOG_SEED_QCMS: SeedCatalogQcm[] = [
  // ——— Français ———
  {
    id: "seed-qcm-fr-1",
    title: "Français — Quiz 1 · bases",
    matiere: "Français",
    niveau: "Série 1",
    chapitre: "Articles, accords simples, présent",
    questions: [
      {
        id: "fr1-q1",
        prompt: "Complétez : « ___ école est fermée ce jour-là » (article défini contracté).",
        options: ["L’", "La", "Le"],
        correct: 0,
      },
      {
        id: "fr1-q2",
        prompt: "Quel pronom convient : « ___ parle français très bien » (sujet, 3e personne féminin) ?",
        options: ["Elle", "Il", "Ils"],
        correct: 0,
      },
      {
        id: "fr1-q3",
        prompt: "À la forme négative du présent : « Nous ___ télévision le soir ».",
        options: ["ne regardons pas", "ne pas regardons", "n’avons pas regardé"],
        correct: 0,
      },
      {
        id: "fr1-q4",
        prompt: "« Elle a ___ des lettres » — accord standard du participe (COD après le verbe).",
        options: ["écrit", "écrite", "écrites"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-fr-2",
    title: "Français — Quiz 2 · passé / imparfait",
    matiere: "Français",
    niveau: "Série 2",
    chapitre: "Passé composé vs imparfait",
    questions: [
      {
        id: "fr2-q1",
        prompt: "« Hier, il ___ toute la journée » (pluie prolongée, contexte narratif).",
        options: ["pleuvait", "a plu", "pleut"],
        correct: 0,
      },
      {
        id: "fr2-q2",
        prompt: "« Quand j’étais petit, je ___ au foot chaque dimanche » (habitude passée).",
        options: ["jouais", "ai joué", "joue"],
        correct: 0,
      },
      {
        id: "fr2-q3",
        prompt: "« Soudain, elle ___ un cri » (action ponctuelle passée).",
        options: ["entendait", "a entendu", "entend"],
        correct: 1,
      },
      {
        id: "fr2-q4",
        prompt: "« Pendant que tu cuisinais, moi je ___ le journal » (action en arrière-plan).",
        options: ["lisais", "ai lu", "lis"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-fr-3",
    title: "Français — Quiz 3 · subjonctif / style",
    matiere: "Français",
    niveau: "Série 3",
    chapitre: "Subjonctif après certaines conjonctions",
    questions: [
      {
        id: "fr3-q1",
        prompt: "« Il faut que tu ___ à l’heure » (subjonctif présent).",
        options: ["viennes", "viens", "viendras"],
        correct: 0,
      },
      {
        id: "fr3-q2",
        prompt: "« Bien qu’il ___ fatigué, il a terminé le travail ».",
        options: ["soit", "est", "était"],
        correct: 2,
      },
      {
        id: "fr3-q3",
        prompt: "« Je doute qu’il ___ raison ».",
        options: ["ait", "a", "aurait"],
        correct: 0,
      },
      {
        id: "fr3-q4",
        prompt: "Après « afin que », le verbe se met en général au :",
        options: ["subjonctif", "indicatif uniquement", "infinitif obligatoire"],
        correct: 0,
      },
    ],
  },

  // ——— Espagnol ———
  {
    id: "seed-qcm-es-1",
    title: "Espagnol — Quiz 1 · ser / estar",
    matiere: "Espagnol",
    niveau: "Série 1",
    chapitre: "Verbes ser et estar",
    questions: [
      {
        id: "es1-q1",
        prompt: "« Ella ___ profesora » (profession / identité).",
        options: ["es", "está", "será"],
        correct: 0,
      },
      {
        id: "es1-q2",
        prompt: "« El libro ___ sobre la mesa » (position).",
        options: ["es", "está", "hay"],
        correct: 1,
      },
      {
        id: "es1-q3",
        prompt: "« Nosotros ___ cansados » (état temporaire).",
        options: ["somos", "estamos", "estáis"],
        correct: 1,
      },
      {
        id: "es1-q4",
        prompt: "« Madrid ___ la capital de España ».",
        options: ["está", "es", "hay"],
        correct: 1,
      },
    ],
  },
  {
    id: "seed-qcm-es-2",
    title: "Espagnol — Quiz 2 · temps du passé",
    matiere: "Espagnol",
    niveau: "Série 2",
    chapitre: "Préterito / imperfecto",
    questions: [
      {
        id: "es2-q1",
        prompt: "« Cuando era niño, ___ al parque » (habitude).",
        options: ["iba", "fui", "voy"],
        correct: 0,
      },
      {
        id: "es2-q2",
        prompt: "« Ayer ___ pizza con mis amigos » (action terminée).",
        options: ["comía", "comí", "como"],
        correct: 1,
      },
      {
        id: "es2-q3",
        prompt: "« Mientras cocinaba, él ___ la tele ».",
        options: ["miraba", "miró", "mira"],
        correct: 0,
      },
      {
        id: "es2-q4",
        prompt: "« De repente ___ un ruido extraño » (évènement ponctuel).",
        options: ["oía", "hubo", "oyó"],
        correct: 2,
      },
    ],
  },
  {
    id: "seed-qcm-es-3",
    title: "Espagnol — Quiz 3 · subjonctif",
    matiere: "Espagnol",
    niveau: "Série 3",
    chapitre: "Subjonctif (déclencheurs)",
    questions: [
      {
        id: "es3-q1",
        prompt: "« Quiero que tú ___ » (venir, 2e pers. sing.).",
        options: ["vengas", "vienes", "vendrás"],
        correct: 0,
      },
      {
        id: "es3-q2",
        prompt: "« Es posible que ___ tarde » (il / pleuvoir).",
        options: ["llueva", "llueve", "lloverá"],
        correct: 0,
      },
      {
        id: "es3-q3",
        prompt: "« Aunque ___ cansado, siguió trabajando » (subjonctif imparfait ou indicatif selon nuance — ici : fait réel vécu = indicatif imparfait).",
        options: ["estuviera", "estaba", "sea"],
        correct: 1,
      },
      {
        id: "es3-q4",
        prompt: "« Dudamos que ___ verdad » (ser).",
        options: ["sea", "es", "era"],
        correct: 0,
      },
    ],
  },

  // ——— Anglais (international) ———
  {
    id: "seed-qcm-en-1",
    title: "Anglais — Quiz 1 · présent",
    matiere: "Anglais",
    niveau: "Série 1",
    chapitre: "Present simple vs continuous",
    questions: [
      {
        id: "en1-q1",
        prompt: "« She usually ___ breakfast at 7 » (habitude).",
        options: ["has", "is having", "had"],
        correct: 0,
      },
      {
        id: "en1-q2",
        prompt: "« Listen! Someone ___ at the door » (moment présent).",
        options: ["knocks", "is knocking", "knocked"],
        correct: 1,
      },
      {
        id: "en1-q3",
        prompt: "« Water ___ at 100 °C at sea level » (vérité générale).",
        options: ["is boiling", "boils", "boil"],
        correct: 1,
      },
      {
        id: "en1-q4",
        prompt: "« They ___ in London since 2020 » → forme correcte si l’action continue :",
        options: ["live", "have lived", "are living"],
        correct: 1,
      },
    ],
  },
  {
    id: "seed-qcm-en-2",
    title: "Anglais — Quiz 2 · present perfect",
    matiere: "Anglais",
    niveau: "Série 2",
    chapitre: "Present perfect / past simple",
    questions: [
      {
        id: "en2-q1",
        prompt: "« I ___ that film three times » (expérience jusqu’à maintenant).",
        options: ["saw", "have seen", "was seeing"],
        correct: 1,
      },
      {
        id: "en2-q2",
        prompt: "« ___ you ever ___ sushi? »",
        options: ["Did / try", "Have / tried", "Are / trying"],
        correct: 1,
      },
      {
        id: "en2-q3",
        prompt: "« He ___ to Rome in 2019 » (date passée précise).",
        options: ["has gone", "went", "goes"],
        correct: 1,
      },
      {
        id: "en2-q4",
        prompt: "« It’s the best book I ___ read ».",
        options: ["ever", "never", "have ever"],
        correct: 2,
      },
    ],
  },
  {
    id: "seed-qcm-en-3",
    title: "Anglais — Quiz 3 · conditionnels",
    matiere: "Anglais",
    niveau: "Série 3",
    chapitre: "First / second conditional",
    questions: [
      {
        id: "en3-q1",
        prompt: "« If it rains tomorrow, we ___ at home » (probabilité réelle).",
        options: ["stay", "stayed", "will stay"],
        correct: 2,
      },
      {
        id: "en3-q2",
        prompt: "« If I ___ rich, I would travel more ».",
        options: ["am", "were", "had been"],
        correct: 1,
      },
      {
        id: "en3-q3",
        prompt: "« Unless you hurry, you ___ the train ».",
        options: ["miss", "will miss", "missed"],
        correct: 1,
      },
      {
        id: "en3-q4",
        prompt: "« I wish I ___ speak Japanese » (souhait irréel présent).",
        options: ["can", "could", "will"],
        correct: 1,
      },
    ],
  },

  // ——— Anglais américain ———
  {
    id: "seed-qcm-enus-1",
    title: "Anglais américain — Quiz 1 · graphie",
    matiere: "Anglais américain",
    niveau: "Série 1",
    chapitre: "US vs UK spelling",
    questions: [
      {
        id: "enus1-q1",
        prompt: "Graphie **américaine** standard pour « couleur » :",
        options: ["colour", "color", "colur"],
        correct: 1,
      },
      {
        id: "enus1-q2",
        prompt: "« Favourite » en anglais des États-Unis :",
        options: ["favourite", "favorite", "favorit"],
        correct: 1,
      },
      {
        id: "enus1-q3",
        prompt: "« Centre » (bâtiment / milieu) en US :",
        options: ["centre", "center", "senter"],
        correct: 1,
      },
      {
        id: "enus1-q4",
        prompt: "« Neighbour » en orthographe US :",
        options: ["neighbor", "neighbour", "naiber"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-enus-2",
    title: "Anglais américain — Quiz 2 · phrasal verbs",
    matiere: "Anglais américain",
    niveau: "Série 2",
    chapitre: "Phrasal verbs courants",
    questions: [
      {
        id: "enus2-q1",
        prompt: "« To call off » signifie le plus souvent :",
        options: ["raccrocher le téléphone", "annuler", "rappeler quelqu’un"],
        correct: 1,
      },
      {
        id: "enus2-q2",
        prompt: "« I need to ___ my homework before class » (terminer rapidement).",
        options: ["get over", "finish up", "give away"],
        correct: 1,
      },
      {
        id: "enus2-q3",
        prompt: "« She ___ her jacket and left » (enlever un vêtement).",
        options: ["took off", "took on", "took in"],
        correct: 0,
      },
      {
        id: "enus2-q4",
        prompt: "« We ran ___ milk » (il n’y en a plus).",
        options: ["out of", "into", "over"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-enus-3",
    title: "Anglais américain — Quiz 3 · culture & oral",
    matiere: "Anglais américain",
    niveau: "Série 3",
    chapitre: "Idiomes & usage",
    questions: [
      {
        id: "enus3-q1",
        prompt: "« A buck » (familier US) désigne souvent :",
        options: ["un cerf", "un dollar", "une voiture"],
        correct: 1,
      },
      {
        id: "enus3-q2",
        prompt: "« You bet! » (familier) peut signifier :",
        options: ["Tu as perdu !", "Bien sûr ! / Absolument !", "Fais ton pari !"],
        correct: 1,
      },
      {
        id: "enus3-q3",
        prompt: "« Freshman » (lycée / université US) correspond en gros à :",
        options: ["un diplômé", "une première année / premier cycle", "un professeur"],
        correct: 1,
      },
      {
        id: "enus3-q4",
        prompt: "« Gas » (US) pour une voiture = en UK on dit plutôt :",
        options: ["petrol", "water", "oil"],
        correct: 0,
      },
    ],
  },

  // ——— Allemand ———
  {
    id: "seed-qcm-de-1",
    title: "Allemand — Quiz 1 · articles",
    matiere: "Allemand",
    niveau: "Série 1",
    chapitre: "Der, die, das",
    questions: [
      {
        id: "de1-q1",
        prompt: "« ___ Buch » (neutre, nominatif, défini).",
        options: ["Das", "Der", "Die"],
        correct: 0,
      },
      {
        id: "de1-q2",
        prompt: "« ___ Frau » (féminin).",
        options: ["Der", "Die", "Das"],
        correct: 1,
      },
      {
        id: "de1-q3",
        prompt: "« ___ Mann » (masculin).",
        options: ["Die", "Das", "Der"],
        correct: 2,
      },
      {
        id: "de1-q4",
        prompt: "Pluriel défini « the books » :",
        options: ["die Bücher", "das Bücher", "der Bücher"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-de-2",
    title: "Allemand — Quiz 2 · accusatif",
    matiere: "Allemand",
    niveau: "Série 2",
    chapitre: "Cas accusatif (objet direct)",
    questions: [
      {
        id: "de2-q1",
        prompt: "« Ich sehe ___ Hund » (masculin, objet direct).",
        options: ["der", "den", "dem"],
        correct: 1,
      },
      {
        id: "de2-q2",
        prompt: "« Ich kaufe ___ Zeitung » (féminin, A.).",
        options: ["die", "der", "eine"],
        correct: 0,
      },
      {
        id: "de2-q3",
        prompt: "« Er trinkt ___ Wasser » (neutre, A.).",
        options: ["das", "den", "dem"],
        correct: 0,
      },
      {
        id: "de2-q4",
        prompt: "« Wir haben ___ Kinder » (pluriel, A. = forme des « die » au pluriel accusatif).",
        options: ["die", "der", "den"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-de-3",
    title: "Allemand — Quiz 3 · ordre des mots",
    matiere: "Allemand",
    niveau: "Série 3",
    chapitre: "V2, verbe à la fin (subordonnée)",
    questions: [
      {
        id: "de3-q1",
        prompt: "Ordre principal correct : « Heute ___ ich früh auf ».",
        options: ["stehe", "ich stehe", "aufstehe ich"],
        correct: 0,
      },
      {
        id: "de3-q2",
        prompt: "« … weil ich müde ___ » (fin de subordonnée).",
        options: ["bin", "war", "ist"],
        correct: 0,
      },
      {
        id: "de3-q3",
        prompt: "« Gestern ___ ich ins Kino » (passé, Präteritum courant pour « sein/haben » ou verbe fort).",
        options: ["gehe", "ging", "gegangen"],
        correct: 1,
      },
      {
        id: "de3-q4",
        prompt: "« Ich weiß nicht, ob er ___ » (venir, subordonnée).",
        options: ["kommt", "komme", "kommst"],
        correct: 0,
      },
    ],
  },

  // ——— Chinois (mandarin) ———
  {
    id: "seed-qcm-zh-1",
    title: "Chinois — Quiz 1 · HSK 1",
    matiere: "Chinois (mandarin)",
    niveau: "Série 1",
    chapitre: "Salutations, famille, chiffres",
    questions: [
      {
        id: "zh1-q1",
        prompt: "Que signifie « 你好 » (nǐ hǎo) ?",
        options: ["Au revoir", "Bonjour / Salut", "Merci"],
        correct: 1,
      },
      {
        id: "zh1-q2",
        prompt: "Comment dit-on « merci » ?",
        options: ["你好", "谢谢", "再见"],
        correct: 1,
      },
      {
        id: "zh1-q3",
        prompt: "Caractère du chiffre « 1 » :",
        options: ["二", "一", "三"],
        correct: 1,
      },
      {
        id: "zh1-q4",
        prompt: "« 妈妈 » désigne en général :",
        options: ["papa", "maman", "grand-mère"],
        correct: 1,
      },
    ],
  },
  {
    id: "seed-qcm-zh-2",
    title: "Chinois — Quiz 2 · temps & mesure",
    matiere: "Chinois (mandarin)",
    niveau: "Série 2",
    chapitre: "Classificateurs, heure (intro)",
    questions: [
      {
        id: "zh2-q1",
        prompt: "« 两本书 » (liǎng běn shū) = environ :",
        options: ["un livre", "deux livres", "trois livres"],
        correct: 1,
      },
      {
        id: "zh2-q2",
        prompt: "« 今天 » signifie :",
        options: ["demain", "aujourd’hui", "hier"],
        correct: 1,
      },
      {
        id: "zh2-q3",
        prompt: "« 水 » signifie le plus souvent :",
        options: ["feu", "eau", "pain"],
        correct: 1,
      },
      {
        id: "zh2-q4",
        prompt: "« 我吃饭 » (contexte courant) évoque plutôt :",
        options: ["Je mange (un repas)", "Je cuisine de l’eau", "Je dors"],
        correct: 0,
      },
    ],
  },
  {
    id: "seed-qcm-zh-3",
    title: "Chinois — Quiz 3 · particules",
    matiere: "Chinois (mandarin)",
    niveau: "Série 3",
    chapitre: "了, 过, question",
    questions: [
      {
        id: "zh3-q1",
        prompt: "« 你吃过中国菜吗？ » — « 吗 » sert ici à :",
        options: ["nier", "former une question oui/non", "exprimer le passé"],
        correct: 1,
      },
      {
        id: "zh3-q2",
        prompt: "« 了 » en fin de phrase peut souvent marquer :",
        options: ["un changement d’état / accomplissement", "le futur seul", "la négation"],
        correct: 0,
      },
      {
        id: "zh3-q3",
        prompt: "« 我去过北京 » indique :",
        options: [
          "je vais à Pékin demain",
          "j’ai déjà été à Pékin (expérience passée)",
          "je ne suis jamais allé à Pékin",
        ],
        correct: 1,
      },
      {
        id: "zh3-q4",
        prompt: "« 不 » et « 没 » pour la négation : usage fréquent — « je n’ai pas mangé » se rend souvent par :",
        options: ["我没吃", "我是不吃", "我没不吃"],
        correct: 0,
      },
    ],
  },
];
