/** Contenu SEO landing Methodix — Maroc (FR / AR). Les CTA et espaces restent dans messages/*.json. */

export type MethodixHomeBlock = {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroNote: string;
  trust: [string, string, string];
  whyTitle: string;
  whyP1: string;
  whyP2: string;
  subjectsTitle: string;
  subjects: { title: string; desc: string }[];
  serviceEyebrow: string;
  servicesTitle: string;
  servicesSubtitle: string;
  services: { title: string; desc: string }[];
  valueProposition: string;
  aiTitle: string;
  aiP1: string;
  aiP2: string;
  aiP3: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

const fr: MethodixHomeBlock = {
  badge: "Correction d'exercices en ligne au Maroc",
  heroTitle: "Corrige tes exercices en ligne avec l'IA",
  heroSubtitle:
    "Envoie une photo de ton exercice. CorrecteurPlus t'explique la correction étape par étape, avec l'aide d'un professeur si besoin.",
  heroNote:
    "3 corrections gratuites — sans carte bancaire. Quiz gratuits illimités.",
  trust: [
    "Quiz gratuits et corrections IA instantanées",
    "Programme officiel marocain (MEN)",
    "Correction par IA, professeur, ou les deux",
  ],
  valueProposition:
    "Chez Methodix, tu ne paies pas seulement pour regarder des cours. Tu paies pour comprendre tes erreurs et progresser exercice après exercice.",
  whyTitle: "Pourquoi choisir Methodix pour corriger tes exercices ?",
  whyP1:
    "Methodix est une plateforme spécialisée dans la correction d'exercices : tu envoies ton devoir, tu reçois une explication détaillée de tes erreurs, et tu progresses exercice après exercice — avec l'IA, un professeur, ou les deux.",
  whyP2:
    "Que tu prépares le bac marocain ou que tu veuilles simplement comprendre un exercice difficile en maths, physique ou français, Methodix s'adapte à ton niveau avec des quiz gratuits, des corrections IA et l'aide de vrais professeurs.",
  subjectsTitle: "Correction d'exercices : toutes les matières du programme marocain",
  subjects: [
    {
      title: "Mathématiques",
      desc: "Cours, exercices corrigés et correction IA pour les maths du bac marocain. Tronc commun, 1ère bac, 2ème bac sciences et économie.",
    },
    {
      title: "Physique-Chimie",
      desc: "Cours de physique-chimie du programme marocain avec correction automatique par IA. Mécanique, électricité, chimie organique.",
    },
    {
      title: "Sciences de la Vie et de la Terre (SVT)",
      desc: "Cours SVT, schémas annotés et correction IA pour le bac marocain. Génétique, immunologie, géologie.",
    },
    {
      title: "Philosophie",
      desc: "Cours de philo, fiches auteurs et correction de dissertations par IA. Les 5 axes du programme officiel marocain.",
    },
    {
      title: "Histoire-Géographie",
      desc: "Cours d'histoire et géographie du Maroc et du monde. Compositions corrigées et correction de plans par IA.",
    },
    {
      title: "Langue arabe",
      desc: "Grammaire arabe, expression écrite et analyse de textes littéraires. Correction de rédactions par IA pour le bac marocain.",
    },
    {
      title: "Français",
      desc: "Dissertation, explication de texte et commentaire composé. Correction de productions écrites par IA pour le lycée marocain.",
    },
    {
      title: "Anglais",
      desc: "Grammaire, vocabulaire et expression écrite en anglais. Préparation aux épreuves du baccalauréat marocain par IA.",
    },
  ],
  serviceEyebrow: "Nos services",
  servicesTitle: "Corrige, comprends, progresse",
  servicesSubtitle:
    "Du quiz gratuit à la session live avec professeur : choisis le format qui t'aide vraiment à avancer.",
  services: [
    {
      title: "Quiz gratuits",
      desc: "Teste ton niveau avec des QCM gratuits par matière, niveau et chapitre.",
    },
    {
      title: "Correction IA instantanée",
      desc: "Envoie ton exercice et reçois une correction détaillée étape par étape avec explication des erreurs.",
    },
    {
      title: "Correction professeur",
      desc: "Un vrai professeur corrige ton exercice, t'explique tes erreurs et te donne des conseils personnalisés.",
    },
    {
      title: "Correction IA + Professeur",
      desc: "L'IA prépare une première correction, puis un professeur vérifie, améliore et valide la réponse.",
    },
    {
      title: "Session correction live",
      desc: "Réserve une courte session avec un professeur pour comprendre un exercice difficile en direct.",
    },
  ],
  aiTitle: "Notre correcteur d'exercices par intelligence artificielle : une première au Maroc",
  aiP1:
    "Methodix est la seule plateforme de soutien scolaire en ligne au Maroc à proposer un correcteur d'exercices basé sur l'intelligence artificielle. Photographiez votre exercice ou tapez votre question, et notre IA vous retourne une correction détaillée, étape par étape, avec des explications pédagogiques claires — en moins de 30 secondes.",
  aiP2:
    "Cette fonctionnalité exclusive est disponible pour les abonnés Methodix. Elle couvre toutes les matières du programme officiel marocain : mathématiques, physique-chimie, SVT, français, philosophie, histoire-géographie, arabe, anglais et autres enseignements du lycée.",
  aiP3:
    "Nos élèves abonnés bénéficient d'un accès illimité au correcteur IA, leur permettant de soumettre autant d'exercices qu'ils le souhaitent et de progresser à leur rythme.",
  faqTitle: "Questions fréquentes sur la correction d'exercices en ligne au Maroc",
  faq: [
    {
      q: "Qu'est-ce que Methodix et à qui s'adresse cette plateforme ?",
      a: "Methodix est une plateforme de soutien scolaire en ligne au Maroc qui propose des cours complets et un correcteur d'exercices par intelligence artificielle pour les élèves du tronc commun, de la 1ère baccalauréat et de la 2ème baccalauréat — toutes filières confondues (sciences, économie, lettres). Methodix s'adresse à tous les lycéens marocains qui souhaitent progresser à leur rythme, depuis leur domicile, sans avoir recours à des cours particuliers coûteux.",
    },
    {
      q: "Comment fonctionne le correcteur d'exercices par intelligence artificielle de Methodix ?",
      a: "Le correcteur IA de Methodix analyse votre exercice soumis sous forme de photo ou de texte et vous retourne en moins de 30 secondes une correction complète : erreurs repérées, règles ou notions utiles, méthode et correction ou pistes de réponse selon la matière, et souvent un exercice similaire pour vous entraîner. Il couvre l'ensemble des matières du programme marocain (sciences, lettres, langues, etc.).",
    },
    {
      q: "Le correcteur d'exercices IA est-il gratuit sur Methodix ?",
      a: "Methodix offre 3 corrections d'exercices gratuites à l'inscription, sans carte bancaire requise. Au-delà de ces 3 corrections gratuites, l'accès illimité au correcteur d'exercices par IA est inclus dans l'abonnement Methodix à partir de 99 MAD par mois.",
    },
    {
      q: "Quelles matières sont disponibles sur Methodix pour le bac marocain ?",
      a: "Methodix couvre toutes les matières du programme officiel du baccalauréat marocain : Mathématiques (tronc commun, 1ère bac, 2ème bac sciences et économie), Physique-Chimie, Sciences de la Vie et de la Terre (SVT), Français, Anglais et Arabe. Les cours sont alignés sur le programme du ministère de l'Éducation nationale du Maroc.",
    },
    {
      q: "Les cours de Methodix suivent-ils le programme scolaire officiel marocain ?",
      a: "Oui. L'intégralité des cours, fiches de révision et exercices corrigés de Methodix est conçue en conformité avec le programme officiel de l'Éducation nationale marocaine. Les notations, les méthodes de résolution et le vocabulaire utilisés sont ceux des lycées publics et privés du Maroc.",
    },
    {
      q: "Puis-je utiliser Methodix depuis mon smartphone au Maroc ?",
      a: "Oui. Methodix est entièrement optimisé pour les appareils mobiles — téléphone et tablette. Vous pouvez accéder à tous les cours de soutien, soumettre vos exercices au correcteur IA et consulter votre historique de corrections depuis n'importe quel appareil connecté, depuis n'importe quelle ville du Maroc.",
    },
    {
      q: "Quelle est la différence entre Methodix et un professeur particulier au Maroc ?",
      a: "Un professeur particulier au Maroc coûte entre 100 et 400 MAD par séance, est disponible quelques heures par semaine et ne couvre généralement qu'une seule matière. Methodix est disponible 24h/24 tous les jours, couvre toutes les matières du programme marocain, intègre un correcteur par intelligence artificielle, et son abonnement commence à 99 MAD par mois — soit le coût d'une seule heure de cours particulier.",
    },
    {
      q: "Comment s'inscrire sur Methodix et commencer le soutien scolaire en ligne ?",
      a: "L'inscription sur Methodix est gratuite et prend moins de 2 minutes. Créez votre compte, sélectionnez votre niveau scolaire et votre filière, et commencez immédiatement avec 3 corrections d'exercices gratuites par intelligence artificielle. Aucune carte bancaire n'est requise pour démarrer.",
    },
    {
      q: "Methodix propose-t-il une préparation spécifique aux examens nationaux du baccalauréat marocain ?",
      a: "Oui. Methodix propose des parcours de révision intensifs dédiés à la préparation du baccalauréat marocain, incluant des exercices de type examen national, des annales corrigées et un accès au correcteur IA illimité pour les abonnés. Les chapitres les plus fréquemment évalués lors des examens nationaux sont mis en avant dans chaque matière.",
    },
    {
      q: "Le soutien scolaire en ligne Methodix est-il efficace pour les élèves en difficulté ?",
      a: "Methodix est particulièrement adapté aux élèves en difficulté car il propose une approche personnalisée : le correcteur IA identifie précisément les lacunes de chaque élève, l'historique de corrections permet de suivre la progression, et les explications sont conçues pour être comprises sans prérequis avancés. Les élèves abonnés constatent souvent une nette progression sur les matières où ils s'entraînent régulièrement.",
    },
    {
      q: "Est-ce que Methodix est disponible pour le tronc commun au Maroc ?",
      a: "Oui. Methodix propose des cours de soutien scolaire et un correcteur d'exercices par IA pour le tronc commun scientifique et littéraire : mathématiques, physique-chimie, SVT, français et arabe. Les cours tronc commun couvrent les suites numériques, les fonctions, les limites, la trigonométrie, les statistiques et les probabilités.",
    },
    {
      q: "Comment annuler mon abonnement Methodix ?",
      a: "Votre abonnement Methodix est sans engagement. Vous pouvez l'annuler à tout moment depuis votre espace personnel, sans frais ni pénalité. En cas d'insatisfaction dans les 7 premiers jours suivant votre abonnement, Methodix vous rembourse intégralement sur simple demande.",
    },
  ],
};

const ar: MethodixHomeBlock = {
  badge: "تصحيح التمارين أونلاين في المغرب",
  heroTitle: "صحّح تمارينك أونلاين بالذكاء الاصطناعي",
  heroSubtitle:
    "أرسل صورة تمرينك. Methodix يقدّم تصحيحًا مفصّلًا خطوة بخطوة، مع إمكانية طلب مساعدة أستاذ.",
  heroNote:
    "3 تصحيحات مجانية — بدون بطاقة بنكية. اختبارات مجانية بلا حدود.",
  trust: [
    "اختبارات مجانية وتصحيح فوري بالذكاء الاصطناعي",
    "منهاج وزاري مغربي رسمي",
    "تصحيح بالذكاء الاصطناعي أو الأستاذ أو كلاهما",
  ],
  valueProposition:
    "في ميثوديكس، لا تدفع فقط لمشاهدة الدروس. تدفع لفهم أخطائك والتقدم تمريناً بعد تمرين.",
  whyTitle: "لماذا تختار ميثوديكس لدعمك المدرسي في المغرب؟",
  whyP1:
    "ميثوديكس من أوائل المنصات في المغرب التي تدمج الذكاء الاصطناعي في تصحيح التمارين: تحليل الواجب، توضيح الأخطاء وشرح التصحيح في ثوانٍ، في أي وقت.",
  whyP2:
    "سواء كنت تستعد لبكالوريا المغرب أو تبحث عن مراجعة في الرياضيات أو الفيزياء أو علوم الحياة والأرض، تتكيف المنصة مع مستواك ووتيرتك.",
  subjectsTitle: "جميع المواد وفق المنهاج المغربي الرسمي",
  subjects: [
    {
      title: "الرياضيات",
      desc: "دروس وتمارين مصححة وتصحيح بالذكاء الاصطناعي لبكالوريا المغرب. مشترك، أولى باك، ثانية باك علوم واقتصاد.",
    },
    {
      title: "الفيزياء والكيمياء",
      desc: "دروس برنامج مغربي مع تصحيح تلقائي بالذكاء الاصطناعي: ميكانيك، كهرباء، كيمياء عضوية.",
    },
    {
      title: "علوم الحياة والأرض",
      desc: "دروس SVT ومخططات موضحة وتصحيح بالذكاء الاصطناعي: وراثة، مناعة، جيولوجيا.",
    },
    {
      title: "الفلسفة",
      desc: "دروس، بطاقات مفكرين وتصحيح فلسفة بالذكاء الاصطناعي. المحاور الخمسة للبرنامج الرسمي.",
    },
    {
      title: "التاريخ والجغرافيا",
      desc: "تاريخ وجغرافيا المغرب والعالم. مواضيع مصححة وتصحيح مخططات بالذكاء الاصطناعي.",
    },
    {
      title: "اللغة العربية",
      desc: "قواعد، تعبير كتابي وتحليل نصوص. تصحيح مواضيع بالذكاء الاصطناعي لبكالوريا المغرب.",
    },
    {
      title: "الفرنسية",
      desc: "مقال، شرح نص وتعليق مركّب. تصحيح إنتاجات كتابية بالذكاء الاصطناعي للثانوي المغربي.",
    },
    {
      title: "الإنجليزية",
      desc: "قواعد، مفردات وتعبير كتابي. تحضير اختبارات البكالوريا المغربية بالذكاء الاصطناعي.",
    },
  ],
  serviceEyebrow: "خدماتنا",
  servicesTitle: "صحّح، افهم، تقدّم",
  servicesSubtitle: "من الاختبار المجاني إلى الجلسة المباشرة مع الأستاذ.",
  services: [
    {
      title: "اختبارات مجانية",
      desc: "اختبر مستواك بأسئلة اختيار من متعدد مجانية حسب المادة والمستوى.",
    },
    {
      title: "تصحيح فوري بالذكاء الاصطناعي",
      desc: "أرسل تمرينك واحصل على تصحيح مفصل خطوة بخطوة مع شرح الأخطاء.",
    },
    {
      title: "تصحيح من الأستاذ",
      desc: "أستاذ حقيقي يصحح تمرينك ويشرح أخطاءك ويعطيك نصائح شخصية.",
    },
    {
      title: "ذكاء اصطناعي + أستاذ",
      desc: "الذكاء الاصطناعي يجهز تصحيحاً أولياً ثم الأستاذ يتحقق ويحسّنه.",
    },
    {
      title: "جلسة تصحيح مباشرة",
      desc: "احجز جلسة قصيرة مع أستاذ لفهم تمرين صعب مباشرة.",
    },
  ],
  aiTitle: "مصحح التمارين بالذكاء الاصطناعي — ميزة رائدة في المغرب",
  aiP1:
    "صوّر تمرينك أو اكتب سؤالك: تحصل على تصحيح مفصل خطوة بخطوة مع شروح واضحة في أقل من 30 ثانية.",
  aiP2:
    "الميزة متاحة للمشتركين وتغطي جميع مواد المنهاج الرسمي المغربي: الرياضيات، الفيزياء-الكيمياء، علوم الحياة والأرض، الفرنسية، الفلسفة، التاريخ-الجغرافيا، العربية، الإنجليزية ومواد أخرى للثانوي.",
  aiP3:
    "المشتركون يستفيدون من تصحيحات غير محدودة بالذكاء الاصطناعي ليتقدموا بوتيرتهم.",
  faqTitle: "أسئلة شائعة حول الدعم المدرسي أونلاين في المغرب",
  faq: [
    {
      q: "ما هي ميثوديكس ولمن توجه؟",
      a: "منصة دعم مدرسي أونلاين في المغرب مع مصحح تمارين بالذكاء الاصطناعي للمستويات من المشترك إلى البكالوريا بجميع الشعب.",
    },
    {
      q: "كيف يعمل مصحح الذكاء الاصطناعي؟",
      a: "يحلل التمرين المرسل كصورة أو نص ويعيد مساعدة كاملة: الأخطاء، القواعد أو المفاهيم، طريقة الحل أو الخطة حسب المادة، وغالباً تمريناً مشابهاً. يدعم جميع مواد المنهاج المغربي (علوم، آداب، لغات، إلخ).",
    },
    {
      q: "هل المصحح مجاني؟",
      a: "ثلاث تصحيحات مجانية عند التسجيل دون بطاقة. بعدها الاشتراك من 99 درهم شهرياً للوصول غير المحدود.",
    },
    {
      q: "ما المواد المتوفرة؟",
      a: "الرياضيات، الفيزياء-الكيمياء، علوم الحياة والأرض، الفرنسية، الإنجليزية والعربية وفق برنامج البكالوريا المغربية.",
    },
    {
      q: "هل المحتوى متوافق مع المنهاج الرسمي؟",
      a: "نعم، صُمم ليتوافق مع برنامج وزارة التربية الوطنية المغربية.",
    },
    {
      q: "هل يعمل على الهاتف؟",
      a: "نعم، المنصة مُحسّنة للهواتف والألواح في جميع أنحاء المغرب.",
    },
    {
      q: "الفرق عن الأستاذ الخصوصي؟",
      a: "الأستاذ الخصوصي غالباً باهظ وبساعات محدودة؛ ميثوديكس متاح 24/7 ويغطي عدة مواد بسعر اشتراك يبدأ من 99 درهم شهرياً.",
    },
    {
      q: "كيف أبدأ؟",
      a: "تسجيل مجاني في دقائق، اختر المستوى والشعبة، وابدأ بثلاث تصحيحات مجانية دون بطاقة بنكية.",
    },
    {
      q: "هل هناك تحضير للبكالوريا؟",
      a: "نعم، مسارات مراجعة وتمارين بأسلوب الامتحان الوطني وتصحيح بالذكاء الاصطناعي للمشتركين.",
    },
    {
      q: "هل يناسب التلامذة المتعثرين؟",
      a: "نعم، المصحح يحدد الفجوات ويوضح الخطوات بلغة مبسطة مع متابعة التقدم.",
    },
    {
      q: "هل يشمل المشترك؟",
      a: "نعم، دروس ومصحح ذكاء اصطناعي للمشترك العلمي والأدبي في الرياضيات والفيزياء والكيمياء وعلوم الحياة والفرنسية والعربية.",
    },
    {
      q: "كيف ألغي الاشتراك؟",
      a: "بدون التزام طويل؛ يمكن الإلغاء من حسابك. استرداد خلال 7 أيام عند عدم الرضا وفق شروط المنصة.",
    },
  ],
};

export const methodixHomeSeoByLocale: Record<string, MethodixHomeBlock> = {
  fr,
  ar,
};

export function getMethodixHomeSeo(locale: string): MethodixHomeBlock {
  return methodixHomeSeoByLocale[locale] ?? fr;
}
