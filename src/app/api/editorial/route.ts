import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";

// GET - list planned articles
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const planned = await prisma.plannedArticle.findMany({
    orderBy: { scheduledFor: "asc" },
  });

  return NextResponse.json(planned);
}

// POST - create a planned article (or auto-plan next 3 weeks)
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const body = await request.json();

  // If action is "auto-plan", generate 3 weeks of article ideas
  if (body.action === "auto-plan") {
    return autoplan();
  }

  // Manual creation
  const { title, topic, angle, keywords, outline, scheduledFor } = body;

  if (!title || !topic || !scheduledFor) {
    return NextResponse.json({ error: "Titre, rubrique et date requis" }, { status: 400 });
  }

  const planned = await prisma.plannedArticle.create({
    data: {
      title,
      topic,
      angle: angle || "",
      keywords: keywords || "",
      outline: outline || "",
      scheduledFor: new Date(scheduledFor),
    },
  });

  return NextResponse.json(planned, { status: 201 });
}

// Auto-generate 3 weeks of article ideas based on site topics
async function autoplan() {
  // Get existing planned articles to avoid duplicates
  const existing = await prisma.plannedArticle.findMany({
    where: { status: { in: ["planned", "approved", "generating"] } },
    select: { title: true, scheduledFor: true },
  });

  const existingDates = new Set(
    existing.map((e) => e.scheduledFor.toISOString().slice(0, 10))
  );

  // Topics and article ideas pool
  const articleIdeas = [
    // Regime / Alimentation
    { topic: "regime", title: "Jeûne intermittent : mode passagère ou vraie méthode ?", angle: "Analyse scientifique des bénéfices et risques du jeûne intermittent pour les débutants", keywords: "jeûne intermittent, perte de poids, alimentation, santé" },
    { topic: "alimentation", title: "Les super-aliments sont-ils vraiment super ?", angle: "Décryptage marketing vs réalité nutritionnelle des aliments dits 'super'", keywords: "super-aliments, nutrition, marketing alimentaire, santé" },
    { topic: "regime", title: "Manger bio change-t-il vraiment quelque chose ?", angle: "Comparaison objective entre alimentation bio et conventionnelle sur la santé", keywords: "bio, alimentation biologique, pesticides, santé" },
    { topic: "alimentation", title: "Batch cooking : comment préparer une semaine de repas en 2 heures", angle: "Guide pratique avec planning, recettes et astuces d'organisation", keywords: "batch cooking, meal prep, organisation cuisine, repas semaine" },
    { topic: "alimentation", title: "Ces aliments qu'on croit sains mais qui ne le sont pas", angle: "Liste des faux amis nutritionnels et leurs alternatives", keywords: "alimentation saine, faux amis nutrition, sucres cachés" },
    { topic: "regime", title: "Régime méditerranéen : pourquoi les médecins le recommandent", angle: "Les preuves scientifiques derrière le régime le plus étudié au monde", keywords: "régime méditerranéen, santé cardiovasculaire, alimentation" },
    // Santé
    { topic: "sante", title: "Pourquoi tu es toujours fatigué (même après 8h de sommeil)", angle: "Les causes cachées de la fatigue chronique et les solutions concrètes", keywords: "fatigue, sommeil, énergie, santé" },
    { topic: "sante", title: "Écrans et santé mentale : ce que disent vraiment les études", angle: "État des lieux objectif de l'impact des écrans sur le bien-être", keywords: "écrans, santé mentale, bien-être, digital" },
    { topic: "sante", title: "10 minutes de marche par jour : les effets surprenants sur ton corps", angle: "Les bénéfices prouvés de la marche quotidienne même courte", keywords: "marche, activité physique, santé, bien-être" },
    { topic: "sante", title: "Stress chronique : ton corps t'envoie ces 7 signaux", angle: "Reconnaître les symptômes physiques du stress avant le burnout", keywords: "stress, santé, burnout, signaux corps" },
    // Maison / Consommation
    { topic: "maison", title: "Désencombrer sa maison : par où commencer sans se décourager", angle: "Méthode progressive et réaliste pour un intérieur plus léger", keywords: "désencombrement, minimalisme, organisation maison" },
    { topic: "conso", title: "Les applications qui t'aident vraiment à économiser au quotidien", angle: "Test et comparatif des meilleures apps d'économies en 2026", keywords: "économies, applications, budget, consommation" },
    { topic: "maison", title: "Produits ménagers maison : 5 recettes qui marchent vraiment", angle: "Recettes testées et approuvées avec ingrédients simples", keywords: "produits ménagers, fait maison, écologique, recettes" },
    { topic: "conso", title: "Fast fashion vs seconde main : le vrai coût de nos vêtements", angle: "Impact environnemental et économique comparé des deux modèles", keywords: "fast fashion, seconde main, mode durable, environnement" },
    { topic: "maison", title: "Comment réduire sa facture d'énergie sans sacrifier son confort", angle: "Gestes concrets et investissements rentables pour économiser", keywords: "économie énergie, facture, écogestes, maison" },
    { topic: "conso", title: "Abonnements : combien tu dépenses vraiment chaque mois sans le savoir", angle: "Audit des abonnements cachés et méthode pour faire le tri", keywords: "abonnements, dépenses, budget, économies" },
    // Lifestyle
    { topic: "lifestyle", title: "Routine matinale : ce qui marche vraiment (selon la science)", angle: "Les habitudes du matin validées par la recherche, sans bullshit", keywords: "routine matinale, productivité, habitudes, bien-être" },
    { topic: "lifestyle", title: "Pourquoi dire non est la meilleure chose que tu puisses faire", angle: "L'art de poser ses limites pour protéger son énergie et son temps", keywords: "dire non, limites, développement personnel, bien-être" },
    { topic: "lifestyle", title: "Digital detox : 7 jours sans réseaux sociaux, mon expérience", angle: "Récit personnel et conseils pratiques pour une pause digitale", keywords: "digital detox, réseaux sociaux, bien-être, déconnexion" },
  ];

  // Find next 3 Mondays (publication day)
  const today = new Date();
  const nextMondays: Date[] = [];
  const d = new Date(today);
  d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7)); // Next Monday
  for (let i = 0; i < 3; i++) {
    const monday = new Date(d);
    monday.setDate(monday.getDate() + i * 7);
    monday.setHours(9, 0, 0, 0);
    nextMondays.push(monday);
  }

  // Filter out dates that already have planned articles
  const availableDates = nextMondays.filter(
    (m) => !existingDates.has(m.toISOString().slice(0, 10))
  );

  if (availableDates.length === 0) {
    return NextResponse.json({ message: "Les 3 prochaines semaines sont déjà planifiées", created: 0 });
  }

  // Shuffle ideas and pick unused ones
  const existingTitles = new Set(existing.map((e) => e.title.toLowerCase()));
  const available = articleIdeas.filter(
    (idea) => !existingTitles.has(idea.title.toLowerCase())
  );

  const shuffled = available.sort(() => Math.random() - 0.5);
  const created = [];

  for (let i = 0; i < availableDates.length && i < shuffled.length; i++) {
    const idea = shuffled[i];
    const outline = `Introduction - ${idea.angle}\nDéveloppement en 5-7 sections\nConseils pratiques\nConclusion avec ouverture\nFAQ (3 questions)`;

    const planned = await prisma.plannedArticle.create({
      data: {
        title: idea.title,
        topic: idea.topic,
        angle: idea.angle,
        keywords: idea.keywords,
        outline,
        scheduledFor: availableDates[i],
      },
    });
    created.push(planned);
  }

  return NextResponse.json({ message: `${created.length} articles planifiés`, created: created.length, articles: created });
}
