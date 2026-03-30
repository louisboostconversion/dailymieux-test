import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create authors
  const admin = await prisma.author.upsert({
    where: { email: "admin@dailymieux.fr" },
    update: {},
    create: {
      name: "Rédaction Daily Mieux",
      email: "admin@dailymieux.fr",
      password: hashSync("admin123", 10),
      role: "admin",
      bio: "L'équipe de rédaction Daily Mieux, des experts passionnés par la consommation responsable.",
    },
  });

  const elise = await prisma.author.upsert({
    where: { email: "elise@dailymieux.fr" },
    update: {},
    create: {
      name: "Élise Montclar",
      email: "elise@dailymieux.fr",
      password: hashSync("elise123", 10),
      role: "editor",
      bio: "Journaliste spécialisée en consommation responsable et bien-être au quotidien.",
    },
  });

  const marc = await prisma.author.upsert({
    where: { email: "marc@dailymieux.fr" },
    update: {},
    create: {
      name: "Marc Delvern",
      email: "marc@dailymieux.fr",
      password: hashSync("marc123", 10),
      role: "editor",
      bio: "Rédacteur passionné par la psychologie de la consommation et le bien-être familial.",
    },
  });

  // Create categories
  const categories = [
    { name: "Régime", slug: "regime", description: "Guides et conseils pour une alimentation équilibrée", icon: "🥗", color: "#22c55e", order: 0 },
    { name: "Consommation", slug: "consommation", description: "Décryptage des tendances de consommation", icon: "🛒", color: "#3b82f6", order: 1 },
    { name: "Alimentation", slug: "alimentation", description: "Tout savoir sur ce que vous mangez", icon: "🍎", color: "#f97316", order: 2 },
    { name: "Santé", slug: "sante", description: "Bien-être et santé au quotidien", icon: "💚", color: "#10b981", order: 3 },
    { name: "Maison", slug: "maison", description: "Conseils pour un intérieur sain et éco-responsable", icon: "🏠", color: "#8b5cf6", order: 4 },
    { name: "Beauté", slug: "beaute", description: "Cosmétiques, soins et routines beauté décryptés", icon: "✨", color: "#ec4899", order: 5 },
    { name: "Enfant", slug: "enfant", description: "Le meilleur pour vos enfants, en toute confiance", icon: "👶", color: "#f59e0b", order: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const cat = {
    regime: (await prisma.category.findUnique({ where: { slug: "regime" } }))!,
    consommation: (await prisma.category.findUnique({ where: { slug: "consommation" } }))!,
    alimentation: (await prisma.category.findUnique({ where: { slug: "alimentation" } }))!,
    sante: (await prisma.category.findUnique({ where: { slug: "sante" } }))!,
    maison: (await prisma.category.findUnique({ where: { slug: "maison" } }))!,
    beaute: (await prisma.category.findUnique({ where: { slug: "beaute" } }))!,
    enfant: (await prisma.category.findUnique({ where: { slug: "enfant" } }))!,
  };

  // All articles imported from dailymieux.fr
  const articles = [
    // ============================================================
    // ENFANT
    // ============================================================
    {
      title: "Les repas en famille : un rituel sous-estimé pour le cerveau des enfants",
      slug: "les-repas-en-famille-un-rituel-sous-estime-pour-le-cerveau-des-enfants",
      excerpt: "Les repas partagés en famille stimulent le développement cérébral des enfants bien plus qu'on ne le pense. Décryptage scientifique.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.enfant.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-12-18"),
      content: JSON.stringify({
        sections: [
          { id: "securite", title: "Le repas, une bulle de sécurité pour le cerveau", body: "Le cerveau de l'enfant a besoin de cadres prévisibles pour se sentir en sécurité. Les repas en famille déclenchent la libération d'ocytocine, créent une synchronisation émotionnelle et renforcent la résilience face au stress." },
          { id: "social", title: "Comment les repas façonnent le cerveau social", body: "Pendant les repas partagés, les enfants développent l'écoute, l'articulation des idées, le tour de parole et la reconnaissance émotionnelle. Les recherches de Harvard montrent que les enfants qui dînent régulièrement en famille ont un vocabulaire 1,5 fois plus riche." },
          { id: "obstacles", title: "Ce qui a affaibli la magie du repas familial", body: "Les écrans, les horaires décalés et les atmosphères tendues empêchent le cerveau de passer en mode relationnel. Un repas pris devant un écran perd l'essentiel de ses bénéfices cognitifs." },
          { id: "restaurer", title: "Comment restaurer ce rituel", body: "Éteignez les écrans et la critique. Ritualisez le début du repas avec un geste symbolique. Invitez la conversation avec des questions émotionnelles. Valorisez la contribution de chaque enfant avec de petites responsabilités." },
        ],
        tips: [
          { title: "La question magique", body: "Demandez chaque soir : 'C'était quoi ton moment préféré de la journée ?' Cela active la mémoire positive et renforce le lien affectif." },
        ],
        faq: [
          { question: "Combien de repas en famille par semaine pour voir un effet ?", answer: "Les études montrent des bénéfices significatifs dès 3 repas partagés par semaine. La régularité compte plus que la perfection." },
        ],
      }),
    },
    {
      title: "Les 3 erreurs que font (presque) tous les parents avant le coucher",
      slug: "les-3-erreurs-que-font-presque-tous-les-parents-avant-le-coucher",
      excerpt: "Confondre calme et silence, écrans avant le dodo, sauter le rituel... Ces erreurs empêchent votre enfant de bien dormir.",
      type: "listicle",
      status: "published",
      featured: false,
      categoryId: cat.enfant.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-01-05"),
      content: JSON.stringify({
        items: [
          {
            title: "Confondre le calme avec le silence",
            body: "Plutôt qu'imposer le silence, créez des conditions rassurantes : lumière tamisée, rythmes prévisibles, sons doux. Les schémas auditifs réguliers signalent la sécurité au cerveau en développement.",
            ctaLabel: "",
            ctaUrl: "",
          },
          {
            title: "Laisser les écrans jusqu'au dernier moment",
            body: "La lumière bleue des écrans bloque la mélatonine, l'hormone du sommeil, parfois jusqu'à 90 minutes après l'exposition. Supprimez les écrans au moins une heure avant le coucher et remplacez-les par une histoire ou une activité sensorielle.",
            ctaLabel: "",
            ctaUrl: "",
          },
          {
            title: "Sauter le rituel du coucher",
            body: "Établissez des séquences fixes et prévisibles : pyjama, histoire, câlin, lumière douce, musique. Ce rituel neurologique prépare le cerveau au sommeil. Préférez des phrases comme 'On va aider ton corps à se reposer' plutôt que des ordres.",
            ctaLabel: "",
            ctaUrl: "",
          },
        ],
      }),
    },
    {
      title: "Le boom des compléments alimentaires pour enfants",
      slug: "le-boom-des-complements-alimentaires-pour-enfants",
      excerpt: "Gummies, sirops vitaminés, poudres... Faut-il vraiment supplémenter nos enfants ? Décryptage entre marketing et vrais besoins.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.enfant.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-02-02"),
      content: JSON.stringify({
        sections: [
          { id: "boom", title: "Pourquoi ce boom maintenant ?", body: "Trois facteurs expliquent l'explosion : la culture parentale anxieuse, le marketing ciblé qui exploite les vulnérabilités émotionnelles autour de la santé des enfants, et le rebranding des suppléments en gummies colorés et appétissants." },
          { id: "experts", title: "Ce que disent les experts", body: "L'OMS et les pédiatres s'accordent : un enfant en bonne santé, avec une alimentation équilibrée, n'a pas besoin de compléments alimentaires. Les exceptions existent pour des carences spécifiques diagnostiquées et sous supervision médicale." },
          { id: "marketing", title: "Marketing et culpabilité parentale", body: "Les messages comme 'Votre enfant fatigué manque peut-être de vitamines' exploitent les peurs parentales et le désir de s'assurer qu'on fait tout ce qu'il faut." },
          { id: "equilibre", title: "L'approche équilibrée", body: "La supplémentation en vitamine D reste recommandée. Le fer peut être nécessaire en cas de carence diagnostiquée. Mais l'usage systématique de multivitamines répond davantage à un besoin de réassurance parentale qu'à un vrai besoin nutritionnel." },
        ],
        tips: [
          { title: "Avant de supplémenter", body: "Consultez toujours un pédiatre avant de donner des compléments à votre enfant. Un bilan sanguin permet d'identifier les vraies carences." },
        ],
        faq: [
          { question: "Les gummies vitaminés sont-ils vraiment efficaces ?", answer: "Ils contiennent souvent beaucoup de sucre et des dosages faibles. Privilégiez les formes recommandées par votre médecin si une supplémentation est nécessaire." },
        ],
      }),
    },

    // ============================================================
    // SANTÉ
    // ============================================================
    {
      title: "Pourquoi ton sommeil ne te repose pas vraiment (et comment y remédier)",
      slug: "pourquoi-ton-sommeil-ne-te-repose-pas-vraiment-et-comment-y-remedier",
      excerpt: "Tu dors 8 heures mais tu te réveilles épuisé ? Le problème n'est pas la quantité, c'est la qualité de ton sommeil.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.sante.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-01-22"),
      content: JSON.stringify({
        sections: [
          { id: "probleme", title: "Dormir ne veut pas dire récupérer", body: "Le sommeil profond (stade N3) ne représente que 20-25% du temps total de sommeil mais assure plus de 80% de la récupération physique. Les micro-éveils cérébraux empêchent d'atteindre ces phases cruciales." },
          { id: "coupables", title: "Les vrais coupables", body: "Stress et anxiété maintiennent le cerveau en alerte. Température au-dessus de 19°C. Lumière bleue des écrans retardant la mélatonine de 60-90 minutes. Alcool perturbant le sommeil profond malgré la somnolence initiale. Caféine active 6-8 heures après consommation." },
          { id: "erreurs", title: "Les 4 erreurs classiques", body: "Se coucher tard ne compense pas un sommeil de mauvaise qualité. Une chambre au-dessus de 20°C réduit significativement le sommeil profond. L'activité mentale avant le coucher maintient le cerveau en mode alerte. Utiliser le lit pour travailler affaiblit l'association sommeil-lit." },
          { id: "solutions", title: "Les solutions concrètes", body: "Rituel de 30 minutes : arrêt des écrans, douche tiède, méditation. Chambre à 18-19°C, bien aérée. Technique de respiration 4-7-8. Exposition à la lumière du matin pendant 5-10 minutes. Dîner léger 2-3 heures avant le coucher." },
          { id: "glymphatique", title: "Le système glymphatique", body: "Pendant le sommeil profond, le système glymphatique du cerveau élimine les déchets neuronaux accumulés pendant la journée. Un mauvais sommeil laisse ces toxines s'accumuler, causant brouillard mental et irritabilité." },
        ],
        tips: [
          { title: "La technique 4-7-8", body: "Inspirez 4 secondes, retenez 7 secondes, expirez 8 secondes. Ce rythme active le système nerveux parasympathique et favorise l'endormissement." },
        ],
        faq: [
          { question: "Combien d'heures de sommeil faut-il vraiment ?", answer: "Ce n'est pas la durée qui compte mais la qualité. 6h30 de sommeil profond valent mieux que 9h de sommeil fragmenté." },
        ],
      }),
    },

    // ============================================================
    // ALIMENTATION
    // ============================================================
    {
      title: "Le matcha peut-il vraiment remplacer le café ?",
      slug: "le-matcha-peut-il-vraiment-remplacer-le-cafe",
      excerpt: "Nouveau rituel bien-être ou simple effet de mode ? On a analysé les bienfaits réels du matcha face au café traditionnel.",
      type: "guide",
      status: "published",
      featured: true,
      categoryId: cat.alimentation.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-02-18"),
      content: JSON.stringify({
        sections: [
          { id: "culture", title: "Le café : bien plus qu'une boisson", body: "Le café est un rituel culturel profondément ancré. L'odeur du matin, un réveil en soi, un marqueur social universel. C'est une expérience sensorielle et sociale qui résiste naturellement au remplacement." },
          { id: "matcha", title: "Ce que promet le matcha", body: "Le matcha, poudre de thé vert finement moulue utilisée dans la cérémonie japonaise depuis des siècles, promet une énergie plus stable que le café, sans le fameux crash de 11h. La caféine est libérée plus lentement et la L-théanine crée un effet de concentration calme." },
          { id: "comparaison", title: "Café vs Matcha au quotidien", body: "En énergie, le café offre un impact immédiat parfois suivi de coups de barre, tandis que le matcha monte doucement avec une concentration durable. En goût, le café est intense et amer, le matcha est végétal avec une touche umami. En rituel, le café est rapide et automatique, le matcha demande une préparation plus méditative." },
          { id: "verdict", title: "Alors, peut-il le remplacer ?", body: "Pour l'intensité et le lien social rapide, le café reste supérieur. Pour une concentration douce et un rituel zen, le matcha offre une alternative crédible. Mais un remplacement complet reste difficile car le café est ancré dans la culture et les émotions." },
          { id: "budget", title: "La question du budget", body: "Café filtre : quelques centimes la tasse. Café en capsule : 0,40-0,60€. Matcha de qualité : 0,80-2,00€ la tasse. Ce prix premium limite l'adoption massive." },
        ],
        tips: [
          { title: "Transition douce", body: "Remplacez d'abord votre deuxième café de la journée par un matcha. Embrassez le rituel des 5 minutes de préparation comme une pause consciente." },
          { title: "Choisir la qualité", body: "Le matcha bas de gamme est amer. Les versions de qualité (grade cérémoniel) sont plus rondes et agréables." },
        ],
        faq: [
          { question: "Le matcha contient-il autant de caféine que le café ?", answer: "Un bol de matcha contient environ 70mg de caféine contre 95mg pour un café. La différence est dans la libération : progressive pour le matcha, immédiate pour le café." },
          { question: "Peut-on boire du matcha le soir ?", answer: "Sa teneur en caféine le déconseille après 16h pour la plupart des personnes, tout comme le café." },
        ],
      }),
    },
    {
      title: "Le mythe du « boire 2 litres d'eau par jour » : vrai ou faux ?",
      slug: "le-mythe-du-boire-2-litres-deau-par-jour-vrai-ou-faux",
      excerpt: "On nous répète qu'il faut boire 2 litres d'eau par jour. Mais d'où vient cette règle et est-elle vraiment fondée scientifiquement ?",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.alimentation.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-11-25"),
      content: JSON.stringify({
        sections: [
          { id: "origine", title: "D'où vient la règle des 2 litres ?", body: "La recommandation vient d'un guide des années 1940 qui indiquait qu'un adulte a besoin d'environ 2,5 litres d'eau par jour, provenant de toutes les sources alimentaires. Les médias ont simplifié le message en supprimant le contexte sur les sources alimentaires." },
          { id: "aliments", title: "L'eau dans les aliments", body: "30 à 40% de l'apport hydrique quotidien vient des aliments solides. Les oranges contiennent 85% d'eau, les concombres 95%, les pâtes cuites environ 70%, le thé et le café 98%." },
          { id: "signaux", title: "Les vrais signaux à surveiller", body: "Plutôt que compter les litres, observez la sensation de soif, la bouche sèche, la couleur des urines (foncées = déshydratation) et la fatigue ou les maux de tête." },
          { id: "variation", title: "Les besoins varient énormément", body: "Femme sédentaire : environ 1,2L par jour. Homme sportif par temps chaud : jusqu'à 3L. Le régime alimentaire (sel, protéines) influence aussi les besoins." },
        ],
        tips: [
          { title: "Écoutez votre corps", body: "La soif est un mécanisme naturel très fiable. Forcer à boire sans soif n'apporte aucun bénéfice mesurable pour la santé." },
        ],
        faq: [
          { question: "Le café déshydrate-t-il ?", answer: "Non, c'est un mythe. L'effet diurétique léger du café est largement compensé par l'eau qu'il contient." },
          { question: "Faut-il boire pendant les repas ?", answer: "Oui, boire pendant les repas ne dilue pas les sucs gastriques de manière significative. Buvez si vous avez soif." },
        ],
      }),
    },
    {
      title: "Bio, écolo… ces mots veulent-ils encore dire quelque chose ?",
      slug: "bio-ecolo-que-veulent-vraiment-dire-ces-mots-sur-les-etiquettes",
      excerpt: "Naturel, bio, clean, écolo... On décrypte ce que signifient vraiment ces termes sur vos étiquettes.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.alimentation.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-10-28"),
      content: JSON.stringify({
        sections: [
          { id: "naturel", title: "« Naturel » : le terme le plus trompeur", body: "Le mot 'naturel' n'a aucune définition légale. C'est un pur terme marketing. Un produit étiqueté naturel peut contenir des conservateurs synthétiques, des parfums et des substances chimiques à côté d'un minimum d'ingrédients naturels." },
          { id: "bio", title: "« Bio » : le seul terme encadré par la loi", body: "Bio signifie issu de l'agriculture biologique réglementée par l'UE, sans pesticides de synthèse ni OGM. Mais ça ne garantit ni l'efficacité, ni le goût, ni l'absence d'additifs. Le logo feuille européenne indique un vrai contrôle réglementaire." },
          { id: "ecolo", title: "« Écologique » : la zone grise", body: "Peut faire référence à l'emballage recyclable, la réduction de plastique, la production économe en eau ou le transport optimisé. Mais masque souvent l'impact environnemental global. Un bidon '100% recyclable' reste un produit pétrolier." },
          { id: "clean", title: "« Clean » : le nouveau chouchou du marketing", body: "Peut signifier : pas d'ingrédients controversés, formules courtes, pas de parfums synthétiques. Mais aucune définition officielle. Chaque marque définit 'clean' à sa manière." },
          { id: "conseils", title: "Comment s'y retrouver concrètement", body: "Cherchez les labels officiels (EU Bio, Ecolabel, Cosmébio). Regardez la liste des ingrédients : plus elle est courte, mieux c'est. Méfiez-vous des promesses vagues sans explication." },
        ],
        tips: [
          { title: "La règle d'or", body: "Plus le mot est simple et rassurant, plus il mérite vérification. Les vrais labels ont des cahiers des charges et des audits réguliers." },
        ],
        faq: [
          { question: "Bio veut-il dire meilleur pour la santé ?", answer: "Pas automatiquement. Bio garantit un mode de production, pas une supériorité nutritionnelle ou gustative." },
        ],
      }),
    },

    // ============================================================
    // CONSOMMATION
    // ============================================================
    {
      title: "Courses en ligne, drive ou magasin : qui sort vainqueur ?",
      slug: "courses-en-ligne-drive-magasin-comparatif",
      excerpt: "On a analysé les trois modes de courses du quotidien. Temps, budget, praticité : notre verdict.",
      type: "comparative",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-12-05"),
      content: JSON.stringify({
        criteria: ["Gain de temps", "Budget", "Choix produits", "Fraîcheur", "Praticité", "Charge mentale"],
        products: [
          {
            name: "Magasin",
            image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
            ratings: { "Gain de temps": 2, "Budget": 3, "Choix produits": 5, "Fraîcheur": 5, "Praticité": 2, "Charge mentale": 2 },
            pros: ["Inspection directe des produits", "Liberté de changer d'avis", "Expérience sociale"],
            cons: ["1h30+ de temps investi", "Achats impulsifs", "Fatiguant avec enfants"],
            price: "Variable",
          },
          {
            name: "Drive",
            image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop",
            ratings: { "Gain de temps": 4, "Budget": 4, "Choix produits": 3, "Fraîcheur": 3, "Praticité": 4, "Charge mentale": 4 },
            pros: ["Rapidité (10 min de retrait)", "Moins d'achats impulsifs", "Flexibilité horaire"],
            cons: ["Sélection limitée", "Qualité variable du frais", "Nécessite de planifier"],
            price: "Gratuit",
            badge: "Meilleur compromis",
          },
          {
            name: "Livraison",
            image: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=400&h=300&fit=crop",
            ratings: { "Gain de temps": 5, "Budget": 2, "Choix produits": 4, "Fraîcheur": 3, "Praticité": 5, "Charge mentale": 5 },
            pros: ["Zéro déplacement", "Gain de temps maximal", "Comparaison des prix"],
            cons: ["Frais de livraison", "Créneaux horaires", "Substitutions de produits"],
            price: "3-7€/livraison",
          },
        ],
        winner: "Drive",
        verdict: "Le drive offre le meilleur compromis entre temps, budget et praticité. La livraison est idéale quand le temps manque. Le magasin reste incontournable pour le frais. La vraie victoire, c'est d'alterner selon vos besoins.",
      }),
    },
    {
      title: "Ces 5 petites habitudes qui transforment ton quotidien",
      slug: "5-petites-habitudes-de-consommation-qui-allegent-vraiment-ton-quotidien",
      excerpt: "Pas besoin de tout révolutionner. Ces 5 micro-habitudes de consommation allègent vraiment le quotidien.",
      type: "listicle",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-01-15"),
      content: JSON.stringify({
        items: [
          { title: "Privilégie les formats compacts", body: "Troquer les gros bidons pour des capsules concentrées, c'est gagner de la place physique et mentale. Les formats compacts et empilables procurent un sentiment de contrôle.", ctaLabel: "Voir les capsules Spring", ctaUrl: "https://www.wespring.com/product/lessive" },
          { title: "Automatise les achats répétitifs", body: "Les micro-décisions du quotidien drainent l'énergie mentale. Les abonnements pour le café, les filtres à eau ou la lessive éliminent cette fatigue décisionnelle.", ctaLabel: "", ctaUrl: "" },
          { title: "Opte pour les produits multifonctions", body: "Un seul produit versatile réduit l'encombrement mieux que des gadgets spécialisés. Moins de choix, moins d'espace consommé, plus de clarté.", ctaLabel: "", ctaUrl: "" },
          { title: "Réduis les emballages inutiles", body: "Le désordre visuel crée de l'agitation mentale. Passer à des contenants en verre et aux achats en vrac améliore la sérénité.", ctaLabel: "", ctaUrl: "" },
          { title: "Ne garde que ce que tu utilises vraiment", body: "La règle des 30 jours : si un produit n'a pas été utilisé depuis un mois, il est probablement inutile. L'accumulation mime une fausse sécurité.", ctaLabel: "", ctaUrl: "" },
        ],
      }),
    },
    {
      title: "Classements : pourquoi on adore qu'on nous dise quoi choisir",
      slug: "pourquoi-on-adore-les-classements-meme-pour-choisir-une-lessive",
      excerpt: "Top 10, meilleur choix, élu produit de l'année... Pourquoi notre cerveau est-il si attiré par les classements ?",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-03"),
      content: JSON.stringify({
        sections: [
          { id: "cerveau", title: "Les classements économisent notre énergie mentale", body: "Plutôt que d'évaluer 20 options, on en regarde 3. Les classements fonctionnent comme une solution express qui réduit la charge cognitive. Notre cerveau préfère la simplicité." },
          { id: "curiosite", title: "Les podiums activent notre curiosité naturelle", body: "Les classements déclenchent un biais de curiosité : l'envie de découvrir le numéro 1. Le marketing exploite cela avec des labels 'N°1 des ventes', même quand les critères restent flous." },
          { id: "preuve", title: "Effet d'autorité et preuve sociale", body: "Les produits en tête nous semblent validés par deux biais cognitifs : l'effet d'autorité et la preuve sociale. Cette combinaison crée de la réassurance dans nos décisions d'achat." },
          { id: "piege", title: "Le piège : confondre simplicité et vérité", body: "Tous les classements ne se valent pas. Certains sont sponsorisés ou créés pour le clic. Mais notre cerveau ne fait pas la différence : voir un podium déclenche une confiance automatique." },
          { id: "revelation", title: "Ce que ça révèle de nous", body: "Les décisions d'achat sont émotionnelles avant d'être rationnelles. On préfère la réassurance par la comparaison à l'analyse indépendante." },
        ],
        tips: [
          { title: "Vérifiez la source", body: "Avant de suivre un classement, regardez qui l'a publié et selon quels critères. Un classement éditorial indépendant n'a pas la même valeur qu'un contenu sponsorisé." },
        ],
        faq: [
          { question: "Les classements sont-ils fiables ?", answer: "Cela dépend de la source. Les classements basés sur des tests réels et des méthodologies transparentes sont fiables." },
        ],
      }),
    },
    {
      title: "Simplifier sa vie, oui… mais à quel prix ?",
      slug: "le-vrai-prix-du-confort-quand-on-paie-pour-se-simplifier-la-vie",
      excerpt: "Livraison, abonnements, capsules pré-dosées... On analyse le vrai coût du confort au quotidien.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-02-08"),
      content: JSON.stringify({
        sections: [
          { id: "energie", title: "Le confort comme économie d'énergie mentale", body: "Acheter le confort n'est pas frivole : c'est réduire la charge cognitive. Quand l'esprit est déjà saturé par les tâches quotidiennes, les produits qui éliminent des étapes apportent un soulagement mental." },
          { id: "temps", title: "Le prix caché du temps gagné", body: "Le temps devient une monnaie. La livraison de courses (2h gagnées/semaine), les capsules pré-dosées, les robots aspirateurs représentent du temps récupéré qui justifie le surcoût pour beaucoup." },
          { id: "dependance", title: "Attention à la dépendance au confort", body: "Une fois expérimenté, le confort se normalise. Le robot aspirateur rend le balai insupportable. Les capsules de café rendent le filtre archaïque. Le budget s'installe insidieusement." },
          { id: "cadre", title: "Le cadre de décision", body: "Trois questions pour évaluer : est-ce que ça fait vraiment gagner du temps/énergie ? Vais-je l'utiliser régulièrement ? Le gain de confort dépasse-t-il le coût ?" },
        ],
        tips: [
          { title: "La bonne question", body: "Remplacez 'Combien ça coûte ?' par 'Combien ça me libère ?'. Le confort utile améliore la vie, le confort inutile plombe le budget." },
        ],
        faq: [
          { question: "Les abonnements sont-ils rentables ?", answer: "Ceux que vous utilisez vraiment, oui. Faites un audit trimestriel : annulez tout ce qui n'est pas utilisé au moins 3 fois par mois." },
        ],
      }),
    },
    {
      title: "Les petits gestes qui donnent l'impression de mieux consommer",
      slug: "les-petits-gestes-qui-donnent-limpression-de-mieux-consommer",
      excerpt: "Tote bag en coton bio, lumières éteintes... Tous les petits gestes ne se valent pas. On fait le tri.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-11-10"),
      content: JSON.stringify({
        sections: [
          { id: "tote-bag", title: "Le tote bag en coton bio : l'illusion la plus courante", body: "Un tote bag en coton nécessite des centaines d'utilisations pour compenser son impact de production. L'utiliser une fois par semaine prend des années avant d'être justifié écologiquement." },
          { id: "lumieres", title: "Éteindre les lumières : symbolique mais insuffisant", body: "Avec la technologie LED, la consommation d'éclairage est devenue marginale. L'effet psychologique d'amorce de ce geste peut cependant déclencher des comportements plus impactants." },
          { id: "plastique", title: "Choisir des produits sans plastique inutile", body: "Impact direct et immédiat à chaque achat. Remplacer les produits suremballés par des formats compacts crée un feedback concret." },
          { id: "formules", title: "Passer aux formules clean", body: "L'effet cumulatif compte : 150 fois un impact réduit par an, ça fait une vraie différence. La répétition quotidienne est la clé." },
          { id: "vrai-impact", title: "Ce qui change vraiment les choses", body: "La réduction récurrente des déchets, les habitudes quotidiennes répétées et les comportements devenus des habitudes invisibles intégrées à la routine." },
        ],
        tips: [
          { title: "Fréquence > geste isolé", body: "Un geste modeste répété chaque jour a plus d'impact qu'un grand geste fait une fois. Concentrez-vous sur la cohérence." },
        ],
        faq: [
          { question: "Les sacs en tissu sont-ils vraiment écologiques ?", answer: "Seulement si vous les utilisez des centaines de fois. Un sac en plastique réutilisé 3-4 fois peut avoir un meilleur bilan qu'un tote bag utilisé occasionnellement." },
        ],
      }),
    },
    {
      title: "Ce que révèlent nos placards sur nos vraies priorités",
      slug: "ce-que-revelent-nos-placards-sur-nos-vraies-priorites",
      excerpt: "Tes placards en disent plus sur toi que tes belles déclarations. Décryptage psychologique de notre consommation.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-10-20"),
      content: JSON.stringify({
        sections: [
          { id: "cuisine", title: "Les placards de cuisine : miroir des habitudes", body: "Le temple du pratique (plats préparés) signale la priorité vitesse. Les rêves santé (graines de chia non ouvertes, poudres protéinées) représentent l'achat de bonnes intentions. Le confort régressif (chocolat, pâte à tartiner) révèle des mécanismes d'adaptation émotionnelle." },
          { id: "sdb", title: "La salle de bain : théâtre de l'identité", body: "L'excès de produits ménagers suggère une anxiété de préparation. Les crèmes anti-âge et sérums signalent des préoccupations sur le vieillissement. Quelques produits multifonctions indiquent un rejet de la surconsommation." },
          { id: "revelation", title: "Ce que les placards révèlent vraiment", body: "Nos priorités réelles vs déclarées. Les émotions cachées (l'accumulation suggère la peur du manque). Les compromis inconscients entre prix, santé, écologie et confort." },
          { id: "actions", title: "Que faire de cette prise de conscience", body: "Faites l'inventaire de ce que vous utilisez vraiment. Identifiez les messages cachés sur vos priorités. Ajustez progressivement pour aligner vos achats sur vos vraies valeurs." },
        ],
        tips: [
          { title: "L'exercice du placard", body: "Ouvrez un placard et demandez-vous pour chaque produit : 'Est-ce que je l'ai utilisé ce mois-ci ?' La réponse est souvent révélatrice." },
        ],
        faq: [],
      }),
    },
    {
      title: "Avoir tout, mais ressentir le vide : le vrai paradoxe moderne",
      slug: "pourquoi-on-a-toujours-limpression-de-manquer-meme-avec-des-placards-pleins",
      excerpt: "Pourquoi a-t-on toujours l'impression de manquer, même avec des placards pleins ? Exploration d'un paradoxe de consommation.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-10-08"),
      content: JSON.stringify({
        sections: [
          { id: "peur", title: "La peur du manque est câblée en nous", body: "Les mécanismes ancestraux de survie ont créé une mémoire de la rareté qui persiste malgré l'abondance moderne. Les schémas familiaux renforcent le réflexe d'accumulation." },
          { id: "paradoxe", title: "Le paradoxe de l'abondance", body: "Les placards pleins augmentent paradoxalement la focalisation sur ce qui manque plutôt que sur ce qu'on possède. Le biais de négativité fait que le cerveau scanne les lacunes plutôt qu'il n'évalue l'ensemble." },
          { id: "marketing", title: "Le marketing exploite cette peur", body: "Les packs familiaux, les lots de 3 et les messages de stock limité cultivent délibérément l'anxiété pour stimuler l'achat." },
          { id: "solutions", title: "Trois solutions concrètes", body: "Organisez les produits visiblement par catégorie. Demandez-vous 'de quoi ai-je vraiment besoin cette semaine ?' plutôt que 'qu'est-ce qui pourrait me manquer ?'. Laissez intentionnellement de l'espace vide comme signal psychologique de contrôle." },
        ],
        tips: [
          { title: "L'espace vide", body: "Le vrai confort n'est peut-être pas d'accumuler 'au cas où'. C'est d'apprendre à se sentir en sécurité même avec un peu de vide." },
        ],
        faq: [],
      }),
    },
    {
      title: "Ces micro-dépenses invisibles qui plombent le budget familial",
      slug: "ces-micro-depenses-invisibles-qui-plombent-le-budget-familial",
      excerpt: "Café à emporter, abonnements oubliés, achats de caisse... Ces petites dépenses s'accumulent en centaines d'euros par mois.",
      type: "listicle",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-02-22"),
      content: JSON.stringify({
        items: [
          { title: "Les courses de dernière minute", body: "Un aller rapide pour 'juste une baguette' finit à ~12€ d'achats impulsifs. Multiplié par la semaine, ça fait 140€+ par mois qui s'évaporent.", ctaLabel: "", ctaUrl: "" },
          { title: "Les abonnements accumulés", body: "Streaming, apps éducatives, musique... Les prélèvements automatiques s'accumulent à 50-100€/mois sans qu'on s'en rende compte.", ctaLabel: "", ctaUrl: "" },
          { title: "Les achats 'confort' émotionnels", body: "Le café quotidien à 2,50€ = 50€/mois. Les snacks des enfants ajoutent 30€/mois à travers des comportements de récompense ritualisés.", ctaLabel: "", ctaUrl: "" },
          { title: "Les frais numériques cachés", body: "Achats in-app et micro-paiements (0,99€, 2,99€) totalisent des centaines d'euros par an via le biais de fractionnement.", ctaLabel: "", ctaUrl: "" },
          { title: "Les achats impulsifs en caisse", body: "Articles promotionnels, gadgets, jouets ajoutent 20-30€/mois via les achats de fatigue en caisse.", ctaLabel: "", ctaUrl: "" },
        ],
      }),
    },
    {
      title: "Pourquoi on culpabilise en achetant pour soi",
      slug: "pourquoi-on-culpabilise-toujours-en-achetant-pour-soi-et-pas-pour-les-autres",
      excerpt: "Acheter pour les enfants, pas de problème. Mais pour soi ? La culpabilité s'installe. Exploration psychologique.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.consommation.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-10"),
      content: JSON.stringify({
        sections: [
          { id: "hierarchie", title: "La hiérarchie invisible des besoins", body: "Les achats pour les autres sont rationalisés comme utiles et légitimes, tandis que les acquisitions personnelles sont classées comme superficielles, déclenchant la culpabilité." },
          { id: "culture", title: "Le poids de la culture et de l'éducation", body: "Les messages d'enfance comme 'pense aux autres avant toi' créent un cadre où prendre pour soi équivaut à priver les autres." },
          { id: "charge", title: "Le rôle de la charge mentale", body: "Les gestionnaires du budget familial comparent inconsciemment leurs dépenses personnelles aux besoins de la famille, percevant chaque achat individuel comme une perte d'opportunité." },
          { id: "genre", title: "Une question de genre aussi", body: "Les femmes vivent cette culpabilité de manière disproportionnée en raison du rôle culturel de 'care', tandis que la consommation masculine (tech, véhicules) reçoit une légitimité rationnelle." },
          { id: "sortir", title: "Comment sortir de ce schéma", body: "Recadrez la dépense personnelle comme un investissement dans votre capacité de bien-être. Allouez un budget mensuel personnel fixe. Remplacez 'je n'en ai pas besoin' par 'je le mérite'." },
        ],
        tips: [
          { title: "Le modèle positif", body: "Acheter pour soi peut devenir un exemple positif pour vos enfants : leur montrer qu'on a le droit de prendre soin de soi." },
        ],
        faq: [],
      }),
    },

    // ============================================================
    // MAISON (Spring articles)
    // ============================================================
    {
      title: "Spring tient-il vraiment ses promesses écolos ?",
      slug: "spring-leurs-promesses-marketing-passent-elles-lepreuve-du-reel",
      excerpt: "Formule clean, efficace à 20°C, zéro plastique... On a mis Spring à l'épreuve du réel pendant plusieurs semaines.",
      type: "review",
      status: "published",
      featured: true,
      categoryId: cat.maison.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-01-28"),
      ctaLabel: "Découvrir Spring à 4,90€",
      ctaUrl: "https://www.wespring.com/product/lessive",
      content: JSON.stringify({
        overallScore: 8,
        criteria: [
          { name: "Formule clean", score: 9 },
          { name: "Efficacité", score: 7.5 },
          { name: "Packaging éco", score: 9.5 },
          { name: "Praticité livraison", score: 9 },
          { name: "Rapport qualité-prix", score: 7 },
        ],
        pros: ["Pas d'odeur chimique agressive", "Packaging 100% carton recyclable", "Livraison en boîte aux lettres", "Formule sans ingrédients controversés", "Efficace dès 30°C"],
        cons: ["Taches tenaces nécessitent un 2e lavage", "Prix légèrement supérieur aux discount", "Format capsule non adapté aux très grosses machines"],
        forWho: "Spring est idéal pour les personnes soucieuses de l'environnement qui veulent une lessive efficace au quotidien sans se compliquer la vie. Parfait pour les familles avec enfants en bas âge et les peaux sensibles.",
        alternatives: [
          { name: "L'Arbre Vert", url: "#" },
          { name: "Rainett", url: "#" },
          { name: "Etamine du Lys", url: "#" },
        ],
        body: "On entend 'écologique', 'révolutionnaire', 'efficace dès la première utilisation' partout. On a décidé de tester les promesses de Spring de manière méthodique.",
      }),
    },
    {
      title: "Spring : qui devrait l'adopter, et qui devrait passer son tour",
      slug: "spring-qui-devrait-l-adopter",
      excerpt: "Spring n'est pas pour tout le monde. On identifie 4 profils de consommateurs pour savoir si c'est fait pour vous.",
      type: "guide",
      status: "published",
      featured: false,
      categoryId: cat.maison.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1610557892470-55d9e80c0eb7?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-12-12"),
      ctaLabel: "Découvrir Spring",
      ctaUrl: "https://www.wespring.com/product/lessive",
      content: JSON.stringify({
        sections: [
          { id: "eco", title: "Le profil éco-conscient", body: "Ceux qui scrutent les étiquettes et réduisent activement le plastique trouveront Spring naturellement séduisant. Le produit élimine les emballages inutiles et s'intègre dans un mode de vie responsable." },
          { id: "parent", title: "Le profil parent pressé", body: "Les consommateurs en manque de temps apprécient la praticité : pas de dosage, pas de bouchon, pas de gouttes renversées. Le format capsule réduit la charge mentale quotidienne." },
          { id: "parfum", title: "Le profil amateur de parfum fort", body: "Ce groupe recherche un parfum puissant comme indicateur de propreté. Spring propose volontairement un parfum discret, ce qui ne conviendra pas à ceux qui privilégient l'expérience olfactive." },
          { id: "prix", title: "Le profil sensible au prix", body: "À environ 0,30€ par lavage, Spring se positionne en milieu de gamme. Le produit mise sur le confort et l'impact écologique plus que sur la compétitivité prix." },
        ],
        tips: [
          { title: "Testez avant de vous engager", body: "Le pack découverte à 4,90€ permet de tester sans engagement. C'est la meilleure façon de savoir si Spring vous convient." },
        ],
        faq: [
          { question: "Peut-on annuler l'abonnement à tout moment ?", answer: "Oui, Spring propose un modèle sans engagement. Vous pouvez annuler, mettre en pause ou modifier votre abonnement librement." },
        ],
      }),
    },
    {
      title: "J'ai voulu piéger Spring : voici ce qui s'est passé",
      slug: "jai-voulu-pieger-spring-voici-ce-qui-sest-passe",
      excerpt: "Crash-test : une chemise blanche, du café noir et une capsule Spring à 30°C. Le résultat nous a surpris.",
      type: "advertorial",
      status: "published",
      featured: false,
      categoryId: cat.maison.id,
      authorId: marc.id,
      coverImage: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-02-15"),
      ctaLabel: "Tester Spring à 4,90€",
      ctaUrl: "https://www.wespring.com/product/lessive",
      content: JSON.stringify({
        sections: [
          { title: "Le défi", body: "<p>Convaincu par Spring mais toujours sceptique sur les lessives écolos, j'ai décidé de mener un crash-test impitoyable : ma plus belle chemise blanche, un demi-verre de café noir bien corsé, et un cycle à 30°C. Le pire scénario possible pour une lessive qui se dit efficace à basse température.</p>" },
          { title: "Premier lavage : résultat honnête", body: "<p>Après un cycle complet : l'odeur de café a quasiment disparu, remplacée par un parfum frais sans chimie agressive. En revanche, une légère ombre beige subsiste sur le tissu. Pas dramatique, mais pas parfait non plus.</p>" },
          { title: "Deuxième lavage : le verdict final", body: "<p>Un deuxième passage avec la même capsule et le même programme a fait disparaître complètement la tache résiduelle. La chemise est comme neuve. Pour 95% des besoins quotidiens, le produit tient sa promesse.</p>" },
        ],
        products: [
          {
            name: "Pack découverte Spring",
            description: "12 capsules de lessive concentrée, livraison gratuite en boîte aux lettres. Efficace dès 20°C.",
            price: "4,90€ au lieu de 7,90€",
            ctaLabel: "Tester l'offre",
            ctaUrl: "https://www.wespring.com/product/lessive",
          },
        ],
        verdict: "Spring n'est pas miraculeuse sur les taches extrêmes en un seul lavage, mais elle est honnête et efficace pour l'immense majorité des besoins. Et c'est exactement ce qu'on lui demande.",
      }),
    },
    {
      title: "Ariel, L'Arbre Vert, Spring : qui lave vraiment le mieux ?",
      slug: "jai-teste-spring-ariel-skip-et-la-marque-en-moins-laquelle-choisir-pour-ta-lessive",
      excerpt: "On a comparé trois lessives populaires sur 5 critères : efficacité, composition, écologie, format et impact santé.",
      type: "comparative",
      status: "published",
      featured: false,
      categoryId: cat.maison.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&h=630&fit=crop",
      publishedAt: new Date("2026-03-05"),
      ctaLabel: "Tester Spring à 4,90€",
      ctaUrl: "https://www.wespring.com/product/lessive",
      content: JSON.stringify({
        criteria: ["Efficacité", "Composition", "Écologie", "Format", "Impact santé"],
        products: [
          {
            name: "Skip (industriel)",
            image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop",
            ratings: { "Efficacité": 4, "Composition": 2, "Écologie": 1, "Format": 3, "Impact santé": 2 },
            pros: ["Efficacité brute sur les taches", "Disponible partout", "Prix compétitif"],
            cons: ["Formules diluées", "Bidons plastique lourds", "Azurants optiques et parfums synthétiques", "Potentiellement irritant"],
            price: "~0,20€/lavage",
          },
          {
            name: "L'Arbre Vert",
            image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0eb7?w=400&h=300&fit=crop",
            ratings: { "Efficacité": 3, "Composition": 4, "Écologie": 4, "Format": 3, "Impact santé": 4 },
            pros: ["EU Ecolabel certifié", "Sans colorants ni allergènes majeurs", "Ingrédients biodégradables", "Emballages réutilisables"],
            cons: ["Parfois insuffisant sur les taches tenaces", "Parfum discret qui divise", "Format classique (bidons)"],
            price: "~0,25€/lavage",
          },
          {
            name: "Spring",
            image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400&h=300&fit=crop",
            ratings: { "Efficacité": 4, "Composition": 5, "Écologie": 5, "Format": 5, "Impact santé": 5 },
            pros: ["Format capsule concentré", "Packaging éco-conçu (carton)", "Dermatologiquement testé", "Parfums créés par des parfumeurs", "Transparence des ingrédients"],
            cons: ["Prix légèrement supérieur", "Disponible uniquement en ligne"],
            price: "~0,30€/lavage",
            badge: "Notre choix",
          },
        ],
        winner: "Spring",
        verdict: "Spring combine santé, responsabilité et plaisir sensoriel avec une transparence rare. L'Arbre Vert reste une valeur sûre accessible. Skip assure l'efficacité brute mais au prix de la composition et de l'écologie.",
      }),
    },
    {
      title: "Spring : la lessive qui rend la corvée (presque) agréable",
      slug: "spring-ma-lessive-qui-a-change-la-corvee-en-petit-plaisir-discret",
      excerpt: "Comment une simple lessive a transformé une corvée automatique en petit moment de satisfaction. Retour d'expérience.",
      type: "advertorial",
      status: "published",
      featured: false,
      categoryId: cat.maison.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-11-18"),
      ctaLabel: "Tester Spring à 4,90€",
      ctaUrl: "https://www.wespring.com/product/lessive",
      content: JSON.stringify({
        sections: [
          { title: "Le packaging qui change tout", body: "<p>La boîte compacte tient dans la boîte aux lettres. Pas de carton surdimensionné. Les capsules sont presque élégantes comparées aux bidons industriels en plastique. C'est un petit détail, mais il change la perception de l'acte de laver son linge.</p>" },
          { title: "Test sur draps blancs", body: "<p>Une seule capsule produit des résultats propres avec un parfum subtil et frais, loin des odeurs chimiques agressives. La simplicité du pré-dosage élimine la friction mentale du quotidien.</p>" },
          { title: "Test sur vêtements de sport", body: "<p>La lessive neutralise efficacement les odeurs sans masquage par parfum lourd. Juste une fonctionnalité propre et honnête.</p>" },
          { title: "Ce qui change au quotidien", body: "<p>Dosage simplifié, moins de déchets plastique à stocker et à jeter, satisfaction psychologique d'un choix aligné avec ses valeurs. Le confort vient autant de l'expérience que du résultat.</p>" },
        ],
        products: [
          {
            name: "Spring - Pack découverte",
            description: "12 capsules concentrées avec livraison gratuite en boîte aux lettres. Choix du parfum inclus.",
            price: "4,90€ au lieu de 7,90€",
            ctaLabel: "Tester Spring",
            ctaUrl: "https://www.wespring.com/product/lessive",
          },
        ],
        verdict: "Spring ne promet pas de révolution. Elle offre une expérience de lessive plus agréable, plus simple et plus responsable. Et parfois, c'est exactement ce dont on a besoin.",
      }),
    },

    // ============================================================
    // RÉGIME
    // ============================================================
    {
      title: "Cheef vs Comme J'aime : notre test complet",
      slug: "cheef-vs-comme-jaime-notre-test-complet",
      excerpt: "On a testé et comparé les deux programmes minceur les plus populaires en France. Repas, prix, résultats : voici notre verdict.",
      type: "comparative",
      status: "published",
      featured: true,
      categoryId: cat.regime.id,
      authorId: elise.id,
      coverImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=630&fit=crop",
      publishedAt: new Date("2025-11-05"),
      ctaLabel: "Découvrir Cheef",
      ctaUrl: "https://www.cheef.fr/minceur?utm_source=dailymieux.fr&utm_medium=affiliate&utm_campaign=cheefvscommejaime&ae=429",
      content: JSON.stringify({
        criteria: ["Qualité des repas", "Variété", "Prix", "Résultats", "Flexibilité", "Accompagnement"],
        products: [
          {
            name: "Cheef",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
            ratings: { "Qualité des repas": 5, "Variété": 4, "Prix": 4, "Résultats": 5, "Flexibilité": 5, "Accompagnement": 5 },
            pros: ["Repas frais et gourmands", "Suivi diététicien inclus", "Sans engagement", "Large choix de menus", "Adapté aux régimes spécifiques"],
            cons: ["Moins connu", "Disponibilité limitée en outre-mer"],
            price: "À partir de 6,50€/repas",
            badge: "Meilleur choix",
          },
          {
            name: "Comme J'aime",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            ratings: { "Qualité des repas": 3, "Variété": 3, "Prix": 2, "Résultats": 3, "Flexibilité": 2, "Accompagnement": 3 },
            pros: ["Marque très connue", "Programme clé en main", "Livraison à domicile"],
            cons: ["Prix élevé", "Engagement longue durée", "Repas parfois fades", "Service client critiqué", "Résiliation complexe"],
            price: "À partir de 9€/repas",
          },
        ],
        winner: "Cheef",
        verdict: "Cheef l'emporte sur tous les critères. Meilleure qualité, prix plus accessible, accompagnement personnalisé et flexibilité totale. Comme J'aime souffre de prix élevés et de conditions d'engagement rigides.",
      }),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  console.log("Seed completed!");
  console.log(`Authors: ${admin.email}, ${elise.email}, ${marc.email}`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Articles: ${articles.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
