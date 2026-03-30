"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  Eye,
  Calendar,
  User,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ArticleProps {
  article: {
    title: string;
    excerpt: string;
    content: string;
    type: string;
    coverImage: string | null;
    category: { name: string; slug: string; color: string | null };
    author: { name: string; avatar: string | null };
    publishedAt: Date | null;
    sponsorName: string | null;
    sponsorLogo: string | null;
    sponsorUrl: string | null;
    ctaLabel: string | null;
    ctaUrl: string | null;
    views: number;
  };
}

interface ContentData {
  sections: { id: string; title: string; body: string }[];
  tips: { title: string; body: string }[];
  faq: { question: string; answer: string }[];
}

export function GuideTemplate({ article }: ArticleProps) {
  const raw = JSON.parse(article.content);
  const data: ContentData = {
    sections: (raw.sections || []).map((s: { id?: string; title: string; body: string }, i: number) => ({
      id: s.id || `section-${i}`,
      title: s.title,
      body: s.body,
    })),
    tips: raw.tips || [],
    faq: raw.faq || [],
  };
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>(
    data.sections[0]?.id || ""
  );
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [data.sections]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const registerRef = (id: string, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    }
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative w-full aspect-[21/9] min-h-[320px] max-h-[520px]">
        {article.coverImage && (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-4xl px-4 pb-10 md:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4"
                style={{
                  backgroundColor: article.category.color || "#416CC2",
                  color: "#fff",
                }}
              >
                {article.category.name}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
                {article.title}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                {article.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Author & Meta */}
      <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {article.author.avatar ? (
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <span className="font-medium text-gray-700">{article.author.name}</span>
        </div>
        {article.publishedAt && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          <span>{article.views.toLocaleString("fr-FR")} vues</span>
        </div>
      </div>

      {/* Layout with sidebar TOC */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex gap-10">
          {/* Desktop sidebar TOC with scrollspy */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <BookOpen className="h-4 w-4" />
                <span>Sommaire</span>
              </div>
              <nav className="space-y-0.5 border-l-2 border-gray-100">
                {data.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleScrollTo(section.id)}
                    className={`w-full text-left pl-4 pr-2 py-2 text-sm transition-all border-l-2 -ml-[2px] ${
                      activeSection === section.id
                        ? "border-blue text-blue font-semibold bg-blue-pale"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}
                  >
                    <span className="line-clamp-2">{section.title}</span>
                  </button>
                ))}
                {data.tips.length > 0 && (
                  <button
                    onClick={() => handleScrollTo("tips")}
                    className={`w-full text-left pl-4 pr-2 py-2 text-sm transition-all border-l-2 -ml-[2px] ${
                      activeSection === "tips"
                        ? "border-blue text-blue font-semibold bg-blue-pale"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}
                  >
                    Conseils pratiques
                  </button>
                )}
                {data.faq.length > 0 && (
                  <button
                    onClick={() => handleScrollTo("faq")}
                    className={`w-full text-left pl-4 pr-2 py-2 text-sm transition-all border-l-2 -ml-[2px] ${
                      activeSection === "faq"
                        ? "border-blue text-blue font-semibold bg-blue-pale"
                        : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                    }`}
                  >
                    Questions fr&eacute;quentes
                  </button>
                )}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sections */}
            <div className="space-y-12">
              {data.sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  ref={(el) => registerRef(section.id, el)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <div
                    className="prose prose-lg prose-gray max-w-prose"
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </motion.section>
              ))}
            </div>

            {/* Tips - blue accent with lightbulb */}
            {data.tips.length > 0 && (
              <section
                id="tips"
                ref={(el) => registerRef("tips", el)}
                className="mt-16 scroll-mt-24"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Lightbulb className="h-7 w-7 text-blue" />
                  Conseils pratiques
                </h2>
                <div className="space-y-4">
                  {data.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="border-l-4 border-blue bg-blue-light rounded-r-xl p-5"
                    >
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-blue shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-navy mb-1">
                            {tip.title}
                          </h3>
                          <p className="text-sm text-navy leading-relaxed">
                            {tip.body}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Accordion */}
            {data.faq.length > 0 && (
              <section
                id="faq"
                ref={(el) => registerRef("faq", el)}
                className="mt-16 scroll-mt-24"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Questions fr&eacute;quentes
                </h2>
                <div className="space-y-3">
                  {data.faq.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <span>{item.question}</span>
                        <motion.div
                          animate={{ rotate: openFaq === i ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Sponsor */}
      {article.sponsorName && (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-center gap-3 rounded-xl bg-gray-50 px-5 py-3 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>Article sponsoris&eacute; par</span>
            {article.sponsorLogo && (
              <Image
                src={article.sponsorLogo}
                alt={article.sponsorName}
                width={80}
                height={24}
                className="h-5 w-auto object-contain"
              />
            )}
            {article.sponsorUrl ? (
              <a
                href={article.sponsorUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-semibold text-gray-700 underline underline-offset-2 hover:text-gray-900"
              >
                {article.sponsorName}
              </a>
            ) : (
              <span className="font-semibold text-gray-700">
                {article.sponsorName}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Final CTA */}
      {article.ctaLabel && article.ctaUrl && (
        <div className="mx-auto max-w-4xl px-4 pb-16 text-center">
          <a
            href={article.ctaUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-3 rounded-full bg-blue px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-navy hover:shadow-xl transition-all"
          >
            {article.ctaLabel}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      )}
    </article>
  );
}

export default GuideTemplate;
