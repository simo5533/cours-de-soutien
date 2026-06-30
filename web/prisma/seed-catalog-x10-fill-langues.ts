/**
 * Complète chaque langue du catalogue à 10 QCM minimum.
 */
import type { SeedCatalogQcm } from "./seed-catalog-quizzes";

type Q = { id: string; prompt: string; options: string[]; correct: number };

function langQuiz(
  id: string,
  matiere: SeedCatalogQcm["matiere"],
  title: string,
  niveau: string,
  chapitre: string,
  qs: Q[],
): SeedCatalogQcm {
  return { id, title, matiere, niveau, chapitre, questions: qs };
}

export const X10_FILL_LANGUES_QCMS: SeedCatalogQcm[] = [
  langQuiz("seed-qcm-x10-fr-8", "Français", "Français — Quiz 8 · pronoms relatifs", "B", "Qui · que · dont · où", [
    { id: "xf8-1", prompt: "« La fille ___ parle est ma sœur » :", options: ["qui", "que", "dont"], correct: 0 },
    { id: "xf8-2", prompt: "« Le livre ___ j’ai besoin » :", options: ["que", "dont", "où"], correct: 1 },
    { id: "xf8-3", prompt: "« La ville ___ je suis né » :", options: ["que", "dont", "où"], correct: 2 },
    { id: "xf8-4", prompt: "« C’est un ami ___ je fais confiance » :", options: ["que", "à qui", "dont"], correct: 1 },
    { id: "xf8-5", prompt: "« Voici la raison ___ il est absent » :", options: ["que", "pour laquelle", "qui"], correct: 1 },
  ]),
  langQuiz("seed-qcm-x10-fr-9", "Français", "Français — Quiz 9 · voix passive", "C", "Passive · agent", [
    { id: "xf9-1", prompt: "Passive : « On répare la route » →", options: ["La route est réparée", "La route répare", "La route a réparé"], correct: 0 },
    { id: "xf9-2", prompt: "« Le gateau a été mangé par les enfants » — voix :", options: ["passive", "active", "impersonnelle seulement"], correct: 0 },
    { id: "xf9-3", prompt: "Agent introduit souvent par :", options: ["par", "de", "à"], correct: 0 },
    { id: "xf9-4", prompt: "« La lettre sera envoyée demain » — temps :", options: ["futur simple", "passé composé", "imparfait"], correct: 0 },
    { id: "xf9-5", prompt: "Passive du présent : être + :", options: ["participe passé", "infinitif", "subjonctif"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-fr-10", "Français", "Français — Quiz 10 · orthographe courante", "C", "Accords · homophones", [
    { id: "xf10-1", prompt: "« Il ___ (a/à) faim » :", options: ["a", "à", "as"], correct: 0 },
    { id: "xf10-2", prompt: "« ___ (ses/ces/c’est) amis » (démonstratif) :", options: ["Ces", "Ses", "C’est"], correct: 0 },
    { id: "xf10-3", prompt: "« Elles ___ (sont/ont) arrivées » :", options: ["sont", "ont", "son"], correct: 0 },
    { id: "xf10-4", prompt: "« Peu ___ (de/des) temps » :", options: ["de", "des", "du"], correct: 0 },
    { id: "xf10-5", prompt: "Pluriel de « journal » :", options: ["journaux", "journals", "journeaux"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-es-8", "Espagnol", "Espagnol — Quiz 8 · pretérito indefinido", "B", "Passé simple -ar", [
    { id: "xe8-1", prompt: "« Ayer yo ___ (hablar) » :", options: ["hablé", "hablo", "hablaba"], correct: 0 },
    { id: "xe8-2", prompt: "« Ellos ___ (comer) ayer » :", options: ["comieron", "comen", "comían"], correct: 0 },
    { id: "xe8-3", prompt: "« Tú ___ (vivir) en Madrid » (passé ponctuel) :", options: ["viviste", "vives", "vivías"], correct: 0 },
    { id: "xe8-4", prompt: "« ¿___ (ser) feliz? » (yo, passé) :", options: ["Fui", "Soy", "Era"], correct: 0 },
    { id: "xe8-5", prompt: "Marqueur temporel fréquent avec indefinido :", options: ["ayer", "ahora", "siempre (habitude)"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-es-9", "Espagnol", "Espagnol — Quiz 9 · subjuntivo presente", "C", "Subjonctif · volonté", [
    { id: "xe9-1", prompt: "« Quiero que tú ___ (venir) » :", options: ["vengas", "vienes", "vendrás"], correct: 0 },
    { id: "xe9-2", prompt: "« Es importante que ___ (estudiar) » :", options: ["estudies", "estudias", "estudiaste"], correct: 0 },
    { id: "xe9-3", prompt: "Après « ojalá » on emploie souvent :", options: ["subjuntivo", "infinitivo solo", "futuro siempre"], correct: 0 },
    { id: "xe9-4", prompt: "« Dudo que él ___ (tener) razón » :", options: ["tenga", "tiene", "tuvo"], correct: 0 },
    { id: "xe9-5", prompt: "« No creo que ___ (llover) » :", options: ["llueva", "llueve", "llovió"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-es-10", "Espagnol", "Espagnol — Quiz 10 · ser vs estar", "C", "États · identité", [
    { id: "xe10-1", prompt: "« María ___ profesora » (profession) :", options: ["es", "está", "son"], correct: 0 },
    { id: "xe10-2", prompt: "« La sopa ___ caliente » (température) :", options: ["está", "es", "son"], correct: 0 },
    { id: "xe10-3", prompt: "« Nosotros ___ en casa » (lieu) :", options: ["estamos", "somos", "están"], correct: 0 },
    { id: "xe10-4", prompt: "« El examen ___ difícil » (caractéristique) :", options: ["es", "está", "estamos"], correct: 0 },
    { id: "xe10-5", prompt: "« Yo ___ cansado » (état) :", options: ["estoy", "soy", "es"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-en-8", "Anglais", "Anglais — Quiz 8 · past simple", "B", "Irregular verbs", [
    { id: "xen8-1", prompt: "« I ___ to school yesterday » (go) :", options: ["went", "goed", "gone"], correct: 0 },
    { id: "xen8-2", prompt: "« She ___ a letter » (write) :", options: ["wrote", "writed", "written"], correct: 0 },
    { id: "xen8-3", prompt: "« They ___ football » (play) :", options: ["played", "plaied", "playing"], correct: 0 },
    { id: "xen8-4", prompt: "Negative past simple : « I ___ see him » :", options: ["didn't", "don't", "wasn't"], correct: 0 },
    { id: "xen8-5", prompt: "Question : « ___ you finish? » :", options: ["Did", "Do", "Were"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-en-9", "Anglais", "Anglais — Quiz 9 · present perfect", "C", "Have/has + past participle", [
    { id: "xen9-1", prompt: "« I ___ finished » :", options: ["have", "has", "am"], correct: 0 },
    { id: "xen9-2", prompt: "« She has ___ » (go) :", options: ["gone", "went", "go"], correct: 0 },
    { id: "xen9-3", prompt: "« ___ you ever been to London? » :", options: ["Have", "Did", "Are"], correct: 0 },
    { id: "xen9-4", prompt: "For + duration : « I have lived here ___ 5 years » :", options: ["for", "since", "during"], correct: 0 },
    { id: "xen9-5", prompt: "Since + point : « since ___ » :", options: ["2020", "two years", "a long time only without since"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-en-10", "Anglais", "Anglais — Quiz 10 · modals", "C", "Can · must · should", [
    { id: "xen10-1", prompt: "« You ___ study for the exam » (obligation) :", options: ["must", "can", "may"], correct: 0 },
    { id: "xen10-2", prompt: "« ___ I open the window? » (permission) :", options: ["Can", "Must", "Should"], correct: 0 },
    { id: "xen10-3", prompt: "« You ___ see a doctor » (advice) :", options: ["should", "can", "must not always"], correct: 0 },
    { id: "xen10-4", prompt: "« He ___ speak French » (ability) :", options: ["can", "must", "should"], correct: 0 },
    { id: "xen10-5", prompt: "Prohibition : « You ___ smoke here » :", options: ["mustn't", "don't", "can't always same register"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-enus-8", "Anglais américain", "Anglais US — Quiz 8 · spelling", "B", "US vs UK basics", [
    { id: "xus8-1", prompt: "US spelling of « colour » :", options: ["color", "coler", "coulor"], correct: 0 },
    { id: "xus8-2", prompt: "US : « center » — UK often :", options: ["centre", "centerre", "centor"], correct: 0 },
    { id: "xus8-3", prompt: "US past of « travel » often :", options: ["traveled", "travelled", "traveld"], correct: 0 },
    { id: "xus8-4", prompt: "US : « favorite » — UK :", options: ["favourite", "favorit", "favrite"], correct: 0 },
    { id: "xus8-5", prompt: "US : « organize » — UK often :", options: ["organise", "organize only", "organaize"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-enus-9", "Anglais américain", "Anglais US — Quiz 9 · everyday vocab", "C", "US terms", [
    { id: "xus9-1", prompt: "US « apartment » ≈ UK :", options: ["flat", "lift", "lorry"], correct: 0 },
    { id: "xus9-2", prompt: "US « elevator » ≈ UK :", options: ["lift", "flat", "petrol"], correct: 0 },
    { id: "xus9-3", prompt: "US « truck » ≈ UK :", options: ["lorry", "boot", "queue"], correct: 0 },
    { id: "xus9-4", prompt: "US « vacation » ≈ UK :", options: ["holiday", "term", "revision"], correct: 0 },
    { id: "xus9-5", prompt: "US « sidewalk » ≈ UK :", options: ["pavement", "subway", "motorway"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-enus-10", "Anglais américain", "Anglais US — Quiz 10 · phrasal verbs", "C", "Common phrasals", [
    { id: "xus10-1", prompt: "« give up » ≈", options: ["abandon / stop trying", "give a gift up", "stand up"], correct: 0 },
    { id: "xus10-2", prompt: "« look after » ≈", options: ["take care of", "search", "look behind"], correct: 0 },
    { id: "xus10-3", prompt: "« turn on » (light) ≈", options: ["switch on", "turn off", "rotate"], correct: 0 },
    { id: "xus10-4", prompt: "« find out » ≈", options: ["discover", "find outside", "lose"], correct: 0 },
    { id: "xus10-5", prompt: "« run out of » ≈", options: ["have no more left", "run outside", "run quickly"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-de-8", "Allemand", "Allemand — Quiz 8 · Perfekt", "B", "Passé composé allemand", [
    { id: "xd8-1", prompt: "Perfekt : « Ich ___ gegessen » :", options: ["habe", "bin", "hat"], correct: 0 },
    { id: "xd8-2", prompt: "« Er ___ nach Hause gegangen » (Bewegung) :", options: ["ist", "hat", "sind"], correct: 0 },
    { id: "xd8-3", prompt: "Participe : « gemacht » vient de :", options: ["machen", "mache", "macht"], correct: 0 },
    { id: "xd8-4", prompt: "« Wir ___ Deutsch gelernt » :", options: ["haben", "sind", "ist"], correct: 0 },
    { id: "xd8-5", prompt: "Auxiliaire avec « bleiben » (resté) :", options: ["ist", "hat", "habe"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-de-9", "Allemand", "Allemand — Quiz 9 · Datif / Accusatif", "C", "Cas · articles", [
    { id: "xd9-1", prompt: "Datif masculin défini :", options: ["dem", "den", "der"], correct: 0 },
    { id: "xd9-2", prompt: "« Ich gebe ___ Kind das Buch » (Dat.) :", options: ["dem", "das", "den"], correct: 0 },
    { id: "xd9-3", prompt: "Accusatif féminin défini :", options: ["die", "der", "dem"], correct: 0 },
    { id: "xd9-4", prompt: "« Ich sehe ___ Mann » (Acc.) :", options: ["den", "dem", "der"], correct: 0 },
    { id: "xd9-5", prompt: "Préposition « mit » → cas :", options: ["Dativ", "Akkusativ", "Nominativ"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-de-10", "Allemand", "Allemand — Quiz 10 · Nebensatz", "C", "Subordonnée · verbe final", [
    { id: "xd10-1", prompt: "« Ich weiß, dass er ___ » (kommen) :", options: ["kommt", "kommen", "gekommen"], correct: 0 },
    { id: "xd10-2", prompt: "Dans une subordonnée, le verbe conjugué est souvent :", options: ["en fin", "en deuxième position", "absent"], correct: 0 },
    { id: "xd10-3", prompt: "« Weil ich müde ___, schlafe ich » (sein) :", options: ["bin", "ist", "bist"], correct: 0 },
    { id: "xd10-4", prompt: "« dass » introduit :", options: ["subordonnée", "question ouverte", "impératif"], correct: 0 },
    { id: "xd10-5", prompt: "« Ob er kommt, ___ ich nicht » (wissen) :", options: ["weiß", "wissen", "wisst"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-zh-8", "Chinois (mandarin)", "Chinois — Quiz 8 · temps et aspect", "B", "了 · 过 · 在", [
    { id: "xzh8-1", prompt: "« 我吃了 » avec 了 suggère souvent :", options: ["action accomplie", "futur", "négation"], correct: 0 },
    { id: "xzh8-2", prompt: "« 我在学习 » : 在 indique :", options: ["action en cours", "passé", "interrogation"], correct: 0 },
    { id: "xzh8-3", prompt: "« 我去过中国 » : 过 indique :", options: ["expérience passée", "futur proche", "obligation"], correct: 0 },
    { id: "xzh8-4", prompt: "« 明天 » signifie :", options: ["demain", "hier", "aujourd’hui"], correct: 0 },
    { id: "xzh8-5", prompt: "« 现在 » signifie :", options: ["maintenant", "plus tard", "jamais"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-zh-9", "Chinois (mandarin)", "Chinois — Quiz 9 · quantificateurs", "C", "个 · 本 · 张", [
    { id: "xzh9-1", prompt: "« 一个人 » : 个 classifie :", options: ["personnes / objets généraux", "livres seulement", "liquides"], correct: 0 },
    { id: "xzh9-2", prompt: "« 一本书 » : 本 pour :", options: ["livres", "véhicules", "animaux"], correct: 0 },
    { id: "xzh9-3", prompt: "« 一张纸 » : 张 pour :", options: ["feuilles / papier plat", "eau", "arbres"], correct: 0 },
    { id: "xzh9-4", prompt: "Structure : nombre + classificateur + nom. Ex. 三___苹果 (général) :", options: ["个", "本", "张"], correct: 0 },
    { id: "xzh9-5", prompt: "« 两位老师 » : 位 est plus :", options: ["poli (personnes)", "pour liquides", "pour animaux"], correct: 0 },
  ]),
  langQuiz("seed-qcm-x10-zh-10", "Chinois (mandarin)", "Chinois — Quiz 10 · comparaison", "C", "比 · 更 · 一样", [
    { id: "xzh10-1", prompt: "« A 比 B 高 » signifie :", options: ["A est plus grand que B", "A est B", "A est moins grand"], correct: 0 },
    { id: "xzh10-2", prompt: "« 更好 » signifie :", options: ["meilleur / encore mieux", "pire", "identique"], correct: 0 },
    { id: "xzh10-3", prompt: "« 一样 » suggère :", options: ["pareil / même", "plus", "moins"], correct: 0 },
    { id: "xzh10-4", prompt: "« 没有 » dans comparaison : « A 没有 B 高 » ≈", options: ["A n’est pas aussi grand que B", "A est plus grand", "A est égal"], correct: 0 },
    { id: "xzh10-5", prompt: "« 越来越 » indique :", options: ["de plus en plus", "de moins en moins seule", "jamais"], correct: 0 },
  ]),
];
