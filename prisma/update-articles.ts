import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Curated Unsplash images that match article topics
const coverImages: Record<string, string> = {
  // ENFANT
  "les-repas-en-famille-un-rituel-sous-estime-pour-le-cerveau-des-enfants":
    "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&h=800&fit=crop",
  "les-3-erreurs-que-font-presque-tous-les-parents-avant-le-coucher":
    "https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=1200&h=800&fit=crop",
  "le-boom-des-complements-alimentaires-pour-enfants":
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=800&fit=crop",

  // SANTÉ
  "ce-que-la-science-dit-vraiment-sur-le-sommeil-reparateur":
    "https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=1200&h=800&fit=crop",

  // ALIMENTATION
  "matcha-vs-cafe-lequel-est-vraiment-meilleur-pour-toi":
    "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=1200&h=800&fit=crop",
  "le-mythe-des-2-litres-deau-par-jour":
    "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=1200&h=800&fit=crop",
  "bio-ecolo-clean-cest-quoi-la-difference":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=800&fit=crop",

  // CONSOMMATION
  "pourquoi-tu-achetes-toujours-plus-que-prevu-en-courses":
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=800&fit=crop",
  "ces-habitudes-de-consommation-qui-te-coutent-plus-cher-quun-abonnement":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop",
  "le-classement-des-marques-que-les-francais-ne-veulent-plus-acheter":
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop",
  "les-produits-de-confort-dont-tu-ne-soupconnes-pas-le-vrai-cout":
    "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=1200&h=800&fit=crop",
  "5-petits-gestes-qui-font-la-difference-pour-un-budget-mieux-gere":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
  "le-paradoxe-du-manque-pourquoi-plus-tu-as-plus-tu-veux":
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=800&fit=crop",
  "les-micro-depenses-ce-trou-noir-dans-ton-budget":
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop",
  "la-culpabilite-dachat-est-elle-en-train-de-redefinir-nos-habitudes":
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop",
  "mieux-ranger-ses-placards-pour-mieux-consommer":
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=800&fit=crop",

  // MAISON (Spring articles)
  "spring-avis-detaille-sur-la-marque-de-lessive-en-capsules-naturelles":
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&h=800&fit=crop",
  "spring-vs-la-grande-distribution-qui-lave-vraiment-mieux":
    "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=1200&h=800&fit=crop",
  "le-crash-test-des-lessives-naturelles-spring-tient-elle-ses-promesses":
    "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=1200&h=800&fit=crop",
  "top-5-des-profils-de-consommateurs-qui-adoptent-spring":
    "https://images.unsplash.com/photo-1545127398-14699f92334b?w=1200&h=800&fit=crop",
  "retour-dexperience-3-mois-avec-spring-au-quotidien":
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1200&h=800&fit=crop",

  // RÉGIME
  "cheef-vs-comme-jaime-quel-programme-minceur-choisir":
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop",
};

// Generate realistic readTime based on content length
function getReadTime(slug: string): number {
  const short = ["5-petits-gestes", "les-3-erreurs", "micro-depenses"];
  const long = ["cheef-vs-comme-jaime", "crash-test", "avis-detaille", "retour-dexperience"];

  if (short.some(s => slug.includes(s))) return Math.floor(Math.random() * 3) + 4;
  if (long.some(s => slug.includes(s))) return Math.floor(Math.random() * 4) + 8;
  return Math.floor(Math.random() * 4) + 5;
}

// Generate fake views with realistic distribution
function getFakeViews(publishedAt: Date | null): number {
  if (!publishedAt) return 0;
  const daysSincePublished = Math.floor((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24));
  // Base views: 200-600 per article, plus ~15-40 per day since published
  const baseViews = Math.floor(Math.random() * 400) + 200;
  const dailyGrowth = Math.floor(Math.random() * 25) + 15;
  return baseViews + (daysSincePublished * dailyGrowth) + Math.floor(Math.random() * 200);
}

async function main() {
  const articles = await prisma.article.findMany();

  for (const article of articles) {
    const coverImage = coverImages[article.slug] || article.coverImage;
    const readTime = getReadTime(article.slug);
    const views = getFakeViews(article.publishedAt);

    await prisma.article.update({
      where: { id: article.id },
      data: {
        coverImage,
        readTime,
        views,
      },
    });

    console.log(`✓ ${article.slug}: readTime=${readTime}min, views=${views}, image=${coverImage ? '✓' : '✗'}`);
  }

  // Mark the first article as featured
  const featured = await prisma.article.findFirst({
    orderBy: { publishedAt: "desc" },
    where: { status: "published" },
  });
  if (featured) {
    await prisma.article.update({
      where: { id: featured.id },
      data: { featured: true },
    });
    console.log(`\n★ Featured: ${featured.title}`);
  }

  console.log(`\nDone! Updated ${articles.length} articles.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
