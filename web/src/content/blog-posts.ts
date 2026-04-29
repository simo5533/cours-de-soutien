/** Articles du blog (contenu statique, bilingue) — soutien scolaire & acquisition commerciale. */

export type BlogLocale = "fr" | "ar";

export type BlogPost = {
  slug: string;
  publishedAt: string;
  title: Record<BlogLocale, string>;
  excerpt: Record<BlogLocale, string>;
  /** Paragraphes affichés dans l’ordre */
  paragraphs: Record<BlogLocale, string[]>;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "pourquoi-soutien-scolaire-regulier",
    publishedAt: "2026-03-15",
    title: {
      fr: "Pourquoi un soutien scolaire régulier fait la différence",
      ar: "لماذا يحدث الدعم المدرسي المنتظم فارقاً حقيقياً",
    },
    excerpt: {
      fr: "Rythme, confiance et méthode : ce qu’un accompagnement structuré apporte au quotidien, du collège au lycée.",
      ar: "الإيقاع والثقة والمنهجية: ما يقدمه التوجيه المنظم يومياً، من المستوى الإعدادي إلى البكالوريا.",
    },
    paragraphs: {
      fr: [
        "Beaucoup d’élèves attendent la dernière ligne droite avant les examens pour « rattraper » le programme. Or les lacunes s’installent souvent plus tôt : un chapitre mal compris devient un obstacle sur les suivants.",
        "Un soutien régulier permet de stabiliser les bases, de poser des questions sans attendre, et d’adopter une méthode de travail adaptée (prise de notes, exercices ciblés, relecture). Ce n’est pas seulement du « rattrapage » : c’est un investissement sur la confiance et l’autonomie.",
        "Chez Methodix, l’objectif est double : clarifier les notions et rendre l’élève acteur de sa progression, avec un suivi cohérent entre les séances et les ressources en ligne.",
      ],
      ar: [
        "كثير من التلاميذ يؤجلون المراجعة إلى آخر لحظة قبل الامتحانات. لكن الفجوات غالباً ما تتشكل مبكراً: فصل غير مفهوم يصبح عائقاً للفصول التالية.",
        "الدعم المنتظم يثبت الأساسيات ويسمح بطرح الأسئلة دون انتظار، واعتماد طريقة عمل مناسبة (ملاحظات، تمارين موجهة، مراجعة). الأمر ليس مجرد « تعويض » بل استثمار في الثقة والاستقلالية.",
        "في ميثوديكس هدفنا مزدوج: توضيح المفاهيم وجعل التلميذ فاعلاً في تقدمه، مع متابعة متسقة بين الحصص والموارد الرقمية.",
      ],
    },
  },
  {
    slug: "parents-comment-accompagner-sans-stress",
    publishedAt: "2026-03-01",
    title: {
      fr: "Parents : accompagner la scolarité sans stress inutile",
      ar: "الآباء: مرافقة المسار الدراسي دون ضغط زائد",
    },
    excerpt: {
      fr: "Quelques repères concrets pour créer un cadre favorable : routine, communication avec l’école et collaboration avec un tuteur.",
      ar: "نقاط عملية لخلق إطار مريح: عادات يومية، تواصل مع المدرسة، وتعاون مع المؤطر.",
    },
    paragraphs: {
      fr: [
        "Le rôle des parents n’est pas de refaire les cours à la place de l’élève, mais d’offrir un environnement stable : horaires de travail réalistes, espace calme, et messages encourageants plutôt que culpabilisants.",
        "Fixer des objectifs petits et atteignables (« ce soir : 20 minutes sur les équations ») est souvent plus efficace qu’une pression globale sur la moyenne.",
        "Lorsque la famille et le centre de soutien vont dans le même sens, l’élève perçoit une ligne claire : les efforts sont reconnus et les difficultés peuvent se dire sans honte.",
      ],
      ar: [
        "دور الوالدين ليس إعادة الشرح بدل التلميذ، بل توفير بيئة مستقرة: أوقات عمل واقعية، مكان هادئ، وكلمات تشجيعية بدلاً من اللوم.",
        "وضع أهداف صغيرة قابلة للتحقيق (« الليلة: 20 دقيقة على المعادلات ») غالباً ما يكون أكثر فعالية من الضغط العام على المعدل.",
        "عندما تتفق العائلة مع مركز الدعم، يلتقط التلميذ رسالة واضحة: الجهود تُقدَّر والصعوبات يمكن قولها بلا خجل.",
      ],
    },
  },
  {
    slug: "langues-vivantes-methodes-et-motivation",
    publishedAt: "2026-02-18",
    title: {
      fr: "Langues vivantes : méthodes et motivation sur la durée",
      ar: "اللغات الحية: المناهج والدافع على المدى الطويل",
    },
    excerpt: {
      fr: "Anglais, français, arabe, allemand ou chinois : comment garder une progression régulière grâce à l’exposition et à la pratique guidée.",
      ar: "الإنجليزية أو الفرنسية أو العربية أو الألمانية أو الصينية: كيف نحافظ على تقدم منتظم عبر التعرض والتمرين الموجّه.",
    },
    paragraphs: {
      fr: [
        "Les langues se consolident par la fréquence plus que par de rares « gros blocs » de révision. Quelques minutes quotidiennes d’écoute ou de vocabulaire valent souvent une longue séance occasionnelle.",
        "Alterner grammaire, compréhension et expression orale évite l’ennui et ancre les acquis. Un enseignant ou tuteur aide à corriger les erreurs tôt, avant qu’elles ne se fossilisent.",
        "Methodix propose des parcours structurés et des ressources pour les langues vivantes, avec une logique progressive adaptée aux objectifs scolaires et personnels.",
      ],
      ar: [
        "اللغات تتعزز بالتكرار أكثر من جلسات المراجعة الطويلة النادرة. دقائق يومية من الاستماع أو المفردات تساوي غالباً حصة طويلة متقطعة.",
        "تنويع القواعد والفهم والتعبير الشفهي يقلل الملل ويثبت المكتسبات. المعلم أو المؤطر يساعد على تصحيح الأخطاء مبكراً.",
        "تقدم ميثوديكس مسارات منظمة وموارد للغات الحية، بتدرج يناسب الأهداف المدرسية والشخصية.",
      ],
    },
  },
  {
    slug: "ia-et-soutien-un-complement-pas-un-raccourci",
    publishedAt: "2026-02-02",
    title: {
      fr: "IA et soutien scolaire : un complément, pas un raccourci",
      ar: "الذكاء الاصطناعي والدعم المدرسي: مكمل وليس اختصاراً",
    },
    excerpt: {
      fr: "Comment utiliser l’intelligence artificielle pour clarifier une notion tout en gardant le fil du raisonnement et l’exigence du programme.",
      ar: "كيف نستخدم الذكاء الاصطناعي لتوضيح فكرة مع الحفاظ على مسار التفكير ومتطلبات المنهاج.",
    },
    paragraphs: {
      fr: [
        "Les outils d’IA peuvent expliquer un exercice, proposer un plan de rédaction ou reformuler une définition. Ils gagnent en pertinence lorsque l’élève a déjà tenté le problème et peut dire où il bloque.",
        "Le risque est de copier une réponse sans comprendre : le vrai critère reste la capacité à refaire seul, en classe ou à l’examen. L’humain (professeur, tuteur) reste indispensable pour le cadre, le suivi et la motivation.",
        "Sur Methodix, l’IA est pensée comme une aide ciblée — par exemple sur des fichiers ou des questions précises — au service d’un parcours encadré, pas comme un substitut au travail personnel.",
      ],
      ar: [
        "يمكن لأدوات الذكاء الاصطناعي شرح تمرير، اقتراح مخطط لكتابة، أو إعادة صياغة تعريف. تكون أدق عندما يحاول التلميذ أولاً ويحدد نقطة الانسداد.",
        "الخطر هو نسخ إجابة دون فهم: المعيار الحقيقي يبقى القدرة على الإعادة بمفردك. يظل وجود المعلم أو المؤطر أساسياً للإطار والمتابعة والدافع.",
        "في ميثوديكس صممنا الذكاء الاصطناعي كمساعد موجّه — مثلاً على ملفات أو أسئلة محددة — في إطار مسار مُشرف، وليس بديلاً عن العمل الشخصي.",
      ],
    },
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
