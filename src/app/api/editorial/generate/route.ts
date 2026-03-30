import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { plannedArticleId } = await request.json();

  if (!plannedArticleId) {
    return NextResponse.json({ error: "ID de l'article planifié requis" }, { status: 400 });
  }

  const planned = await prisma.plannedArticle.findUnique({
    where: { id: plannedArticleId },
  });

  if (!planned) {
    return NextResponse.json({ error: "Article planifié non trouvé" }, { status: 404 });
  }

  if (planned.status !== "approved") {
    return NextResponse.json({ error: "L'article doit être approuvé avant la génération" }, { status: 400 });
  }

  // Mark as generating
  await prisma.plannedArticle.update({
    where: { id: plannedArticleId },
    data: { status: "generating" },
  });

  try {
    // Generate article content with Claude
    const prompt = `Tu es un rédacteur SEO expert pour le site Daily Mieux, un média français sur la consommation responsable et le bien-être au quotidien.

Génère un article complet en JSON pour le sujet suivant :

**Titre** : ${planned.title}
**Rubrique** : ${planned.topic}
**Angle éditorial** : ${planned.angle}
**Mots-clés SEO** : ${planned.keywords}

L'article doit :
- Être rédigé en français avec tous les accents corrects
- Avoir un ton conversationnel, expert mais accessible (tutoiement)
- Contenir 7 à 10 sections avec des titres H2 accrocheurs
- Chaque section doit avoir 2-4 paragraphes riches en contenu
- Inclure des données chiffrées quand possible
- Terminer par une conclusion avec un résumé en bullet points
- Inclure 3 questions FAQ pertinentes pour le SEO
- L'extrait (excerpt) doit faire 1-2 phrases accrocheuses (max 160 caractères)
- Le titre SEO doit inclure le mot-clé principal (max 60 caractères)
- La description SEO doit être optimisée (max 155 caractères)

IMPORTANT : Le contenu des sections doit être en HTML valide (<p>, <strong>, <ul>, <li>, <blockquote>). Pas de markdown.

Réponds UNIQUEMENT avec un objet JSON valide, sans commentaires, sans blocs de code :

{
  "title": "Titre de l'article",
  "excerpt": "Extrait accrocheur de 1-2 phrases",
  "seoTitle": "Titre SEO optimisé | Daily Mieux",
  "seoDesc": "Description SEO optimisée pour Google",
  "sections": [
    { "title": "Titre de la section", "body": "<p>Contenu HTML...</p>" }
  ],
  "faq": [
    { "question": "Question ?", "answer": "Réponse complète." }
  ]
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract JSON from response
    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    // Try to parse the JSON (handle potential markdown code blocks)
    let articleData;
    try {
      // Try direct parse first
      articleData = JSON.parse(responseText);
    } catch {
      // Try extracting from code block
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        articleData = JSON.parse(jsonMatch[1].trim());
      } else {
        // Try finding the JSON object
        const objMatch = responseText.match(/\{[\s\S]*\}/);
        if (objMatch) {
          articleData = JSON.parse(objMatch[0]);
        } else {
          throw new Error("Impossible de parser la réponse de l'IA");
        }
      }
    }

    // Build article content
    const content = JSON.stringify({
      sections: articleData.sections || [],
      tips: [],
      faq: articleData.faq || [],
    });

    // Verify JSON
    JSON.parse(content);

    // Get "Non affilié" category and admin author
    const nonAffilie = await prisma.category.findFirst({
      where: { slug: "non-affilie" },
    });
    const admin = await prisma.author.findFirst({
      where: { role: "admin" },
    });

    if (!nonAffilie || !admin) {
      throw new Error("Catégorie 'Non affilié' ou auteur admin introuvable");
    }

    const slug = slugify(articleData.title || planned.title);

    // Check for duplicate slug
    const existing = await prisma.article.findFirst({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

    // Create the article
    const article = await prisma.article.create({
      data: {
        title: articleData.title || planned.title,
        slug: finalSlug,
        excerpt: articleData.excerpt || planned.angle,
        content,
        type: "guide",
        topic: planned.topic,
        status: "published",
        categoryId: nonAffilie.id,
        authorId: admin.id,
        readTime: Math.max(1, Math.round(
          content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length / 200
        )),
        seoTitle: articleData.seoTitle || null,
        seoDesc: articleData.seoDesc || null,
        outUtmSource: "dailymieux",
        outUtmMedium: "article",
        outUtmCampaign: finalSlug,
        publishedAt: new Date(),
      },
    });

    // Update planned article with link
    await prisma.plannedArticle.update({
      where: { id: plannedArticleId },
      data: {
        status: "published",
        articleId: article.id,
      },
    });

    return NextResponse.json({
      success: true,
      article: { id: article.id, slug: article.slug, title: article.title },
    });
  } catch (error) {
    // Revert to approved on failure
    await prisma.plannedArticle.update({
      where: { id: plannedArticleId },
      data: { status: "approved" },
    });

    const message = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("Article generation error:", message);
    return NextResponse.json({ error: `Erreur de génération : ${message}` }, { status: 500 });
  }
}
