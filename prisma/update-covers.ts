import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Map our slugs to real Webflow CDN images from dailymieux.fr
const webflowImages: Record<string, string> = {
  "le-matcha-peut-il-vraiment-remplacer-le-cafe":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de5478899d39dfd6db1a41_matcha-1.webp",
  "le-boom-des-complements-alimentaires-pour-enfants":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de7271c557c794b478f024_alime%201.webp",
  "pourquoi-on-culpabilise-toujours-en-achetant-pour-soi-et-pas-pour-les-autres":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de73077b7ddd2d3e704574_68dd4d87740813f6b8108728_photo-1520893866413-dc8f4c81208d%201.webp",
  "courses-en-ligne-drive-magasin-comparatif":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de6c92008575528280d90a_caddie.webp",
  "pourquoi-on-a-toujours-limpression-de-manquer-meme-avec-des-placards-pleins":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de7173319b25714c7245fc_68dd4d87740813f6b8108729_photo-1688104170986-d7c6006ced3e%201.webp",
  "spring-leurs-promesses-marketing-passent-elles-lepreuve-du-reel":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68e51b94406c915fd42bb11a_Capture%20d%C3%A9cran%202025-10-06%20173504%201.webp",
  "ce-que-revelent-nos-placards-sur-nos-vraies-priorites":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de7173319b25714c7245fc_68dd4d87740813f6b8108729_photo-1688104170986-d7c6006ced3e%201.webp",
  "5-petites-habitudes-de-consommation-qui-allegent-vraiment-ton-quotidien":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de762ded56de8c7af9b6d5_68dd4d87740813f6b81086e4_premium_photo-1683121269108-1bd195cd18cf%201%20(1).webp",
  "pourquoi-on-adore-les-classements-meme-pour-choisir-une-lessive":
    "https://cdn.prod.website-files.com/68da9ffe1429ee4e953c67fe/68de6f4d4b7b6b87f339621b_classement%20(1).webp",
};

async function main() {
  let updated = 0;
  for (const [slug, imageUrl] of Object.entries(webflowImages)) {
    const result = await prisma.article.updateMany({
      where: { slug },
      data: { coverImage: imageUrl },
    });
    if (result.count > 0) {
      console.log(`✓ ${slug} → Webflow CDN image`);
      updated++;
    } else {
      console.log(`✗ ${slug} → not found in DB`);
    }
  }
  console.log(`\nUpdated ${updated} articles with original Webflow images.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
