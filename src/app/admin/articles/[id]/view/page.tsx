"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageSquare, Send, CheckCircle2, Clock, Type, ImageIcon } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  type: string;
  topic: string | null;
  coverImage: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  affiliateUrl: string | null;
  outUtmSource: string | null;
  outUtmMedium: string | null;
  outUtmCampaign: string | null;
  category: { name: string; color: string };
}

interface Annotation {
  id: string;
  message: string;
  status: string;
  adminReply: string | null;
  createdAt: string;
  highlightedText: string;
  author: { name: string };
}

interface FloatingButton {
  x: number;
  y: number;
  text: string;
  type: "text" | "title" | "image";
}

export default function ArticleViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [floatingBtn, setFloatingBtn] = useState<FloatingButton | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${id}`).then((r) => r.json()),
      fetch(`/api/modification-requests?articleId=${id}`).then((r) => r.json()),
    ]).then(([articleData, requestsData]) => {
      setArticle(articleData);
      setAnnotations(Array.isArray(requestsData) ? requestsData : []);
      setLoading(false);
    });
  }, [id]);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentRef.current) {
      // Don't dismiss if clicking inside comment box
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 3) return;

    // Check selection is within the article content
    const range = selection.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) return;

    const rect = range.getBoundingClientRect();
    const containerRect = contentRef.current.getBoundingClientRect();

    setFloatingBtn({
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top - containerRect.top - 10,
      text,
      type: "text",
    });
  }, []);

  const handleElementClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!contentRef.current) return;
    const containerRect = contentRef.current.getBoundingClientRect();

    // Click on heading (h1, h2, h3)
    const heading = target.closest("h1, h2, h3, h4");
    if (heading) {
      e.stopPropagation();
      const rect = heading.getBoundingClientRect();
      setFloatingBtn({
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top - 10,
        text: heading.textContent?.trim() || "Titre",
        type: "title",
      });
      return;
    }

    // Click on image
    const img = target.closest("img");
    if (img) {
      e.stopPropagation();
      const rect = img.getBoundingClientRect();
      setFloatingBtn({
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top - 10,
        text: img.alt || img.src.split("/").pop() || "Image",
        type: "image",
      });
      return;
    }
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (commentRef.current && commentRef.current.contains(e.target as Node)) return;
    if ((e.target as Element).closest("[data-annotation-btn]")) return;

    // Small delay to allow mouseup to fire first
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        if (!commentOpen) {
          setFloatingBtn(null);
        }
      }
    }, 100);
  }, [commentOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  function openComment() {
    if (!floatingBtn) return;
    setSelectedText(floatingBtn.text);
    setCommentOpen(true);
    setCommentText("");
    setSuccessMsg(false);
  }

  async function submitAnnotation() {
    if (!commentText.trim() || !selectedText) return;
    setSending(true);

    const typeLabel = floatingBtn?.type === "image" ? "Image" : floatingBtn?.type === "title" ? "Titre" : "Texte sélectionné";
    const message = `[${typeLabel}] "${selectedText}"\n\n${commentText.trim()}`;

    const res = await fetch("/api/modification-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId: id, message }),
    });

    setSending(false);
    if (res.ok) {
      const newReq = await res.json();
      setAnnotations((prev) => [{ ...newReq, highlightedText: selectedText, author: newReq.author || { name: "Vous" } }, ...prev]);
      setSuccessMsg(true);
      setTimeout(() => {
        setCommentOpen(false);
        setFloatingBtn(null);
        setSuccessMsg(false);
        window.getSelection()?.removeAllRanges();
      }, 1500);
    }
  }

  function renderContent() {
    if (!article) return null;
    try {
      const data = JSON.parse(article.content);

      if (article.type === "guide" && data.sections) {
        return data.sections.map((s: { title: string; body: string }, i: number) => (
          <div key={i} className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">{s.title}</h2>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.body) }}
            />
          </div>
        ));
      }

      if (article.type === "advertorial" && data.sections) {
        return data.sections.map((s: { title: string; body: string }, i: number) => (
          <div key={i} className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">{s.title}</h2>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.body) }}
            />
          </div>
        ));
      }

      if (article.type === "listicle" && data.items) {
        return data.items.map((item: { title: string; body: string }, i: number) => (
          <div key={i} className="mb-6 flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {i + 1}
            </span>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900">{item.title}</h3>
              <div
                className="prose prose-gray max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.body) }}
              />
            </div>
          </div>
        ));
      }

      if (article.type === "review") {
        return (
          <div>
            {data.score !== undefined && (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-4xl font-bold text-blue-600">{data.score}/10</span>
              </div>
            )}
            {data.body && (
              <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
            )}
            {data.pros?.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 font-semibold text-green-700">Points forts</h3>
                <ul className="space-y-1">{data.pros.map((p: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-green-500">+</span>{p}</li>)}</ul>
              </div>
            )}
            {data.cons?.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 font-semibold text-red-700">Points faibles</h3>
                <ul className="space-y-1">{data.cons.map((c: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm"><span className="text-red-500">-</span>{c}</li>)}</ul>
              </div>
            )}
          </div>
        );
      }

      if (article.type === "comparative" && data.products) {
        return (
          <div>
            {data.products.map((p: { name: string; scores?: Record<string, number> }, i: number) => (
              <div key={i} className="mb-4 rounded-lg border p-4">
                <h3 className="font-semibold">{p.name}</h3>
                {p.scores && Object.entries(p.scores).map(([k, v]) => (
                  <div key={k} className="mt-2 flex items-center gap-2 text-sm">
                    <span className="w-24 text-gray-500">{k}</span>
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(v as number) * 10}%` }} />
                    </div>
                    <span className="text-xs font-medium">{v as number}/10</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }

      // Fallback: render raw
      return <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(JSON.stringify(data, null, 2)) }} />;
    } catch {
      return <p className="text-gray-500">Contenu non disponible</p>;
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2D5A3D] border-t-transparent" />
      </div>
    );
  }

  if (!article) {
    return <p className="py-20 text-center text-gray-500">Article non trouvé</p>;
  }

  // Parse annotations from modification requests
  const parsedAnnotations = annotations.map((a) => {
    const match = a.message.match(/\[(Texte sélectionné|Titre|Image)\] "(.+?)"\n\n([\s\S]*)/);
    return {
      ...a,
      annotationType: match ? match[1] : "text",
      highlightedText: match ? match[2] : "",
      cleanMessage: match ? match[3] : a.message,
    };
  });

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/articles")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux articles
        </button>
        <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
          <MessageSquare className="h-4 w-4" />
          Selectionnez du texte pour demander une modification
        </div>
      </div>

      {/* URL de redirection */}
      {(article.affiliateUrl || article.ctaUrl) && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">URLs de redirection de l&apos;article</h3>
          <div className="space-y-2.5">
            {article.affiliateUrl && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">Lien affilié</span>
                <a href={article.affiliateUrl} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-blue-600 underline hover:text-blue-800">
                  {article.affiliateUrl}
                </a>
              </div>
            )}
            {article.ctaUrl && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 rounded bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">Bouton CTA</span>
                <a href={article.ctaUrl} target="_blank" rel="noopener noreferrer" className="break-all text-sm text-blue-600 underline hover:text-blue-800">
                  {article.ctaUrl}
                </a>
              </div>
            )}
            {article.topic && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">URL publique</span>
                <span className="break-all text-sm text-gray-500">
                  /{article.topic}/{article.slug}
                </span>
              </div>
            )}
            {(article.outUtmSource || article.outUtmMedium || article.outUtmCampaign) && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">UTM</span>
                <span className="text-sm text-gray-500">
                  {[article.outUtmSource && `source=${article.outUtmSource}`, article.outUtmMedium && `medium=${article.outUtmMedium}`, article.outUtmCampaign && `campaign=${article.outUtmCampaign}`].filter(Boolean).join(" · ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Article content */}
        <div className="flex-1">
          <div
            ref={contentRef}
            onMouseUp={handleMouseUp}
            onClick={handleElementClick}
            className="relative rounded-2xl bg-white p-8 shadow-sm select-text [&_h1]:cursor-pointer [&_h2]:cursor-pointer [&_h3]:cursor-pointer [&_h4]:cursor-pointer [&_img]:cursor-pointer [&_h1:hover]:bg-blue-50 [&_h2:hover]:bg-blue-50 [&_h3:hover]:bg-blue-50 [&_h4:hover]:bg-blue-50 [&_img:hover]:ring-2 [&_img:hover]:ring-blue-400 [&_img:hover]:ring-offset-2 [&_h1]:rounded-lg [&_h2]:rounded-lg [&_h3]:rounded-lg [&_h4]:rounded-lg [&_h1]:transition-colors [&_h2]:transition-colors [&_h3]:transition-colors [&_img]:transition-all [&_h1]:px-2 [&_h2]:px-2 [&_h3]:px-2 [&_h4]:px-2 [&_h1]:-mx-2 [&_h2]:-mx-2 [&_h3]:-mx-2 [&_h4]:-mx-2 [&_img]:rounded-lg"
            style={{ userSelect: "text" }}
          >
            {/* Cover */}
            {article.coverImage && (
              <div className="mb-6 overflow-hidden rounded-xl">
                <img src={article.coverImage} alt={article.title} className="h-64 w-full object-cover" />
              </div>
            )}

            {/* Title */}
            <div className="mb-2">
              <span
                className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: article.category.color }}
              >
                {article.category.name}
              </span>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">{article.title}</h1>
            <p className="mb-6 text-gray-500">{article.excerpt}</p>

            {/* Content - selectable */}
            <div>
              {renderContent()}

              {/* CTA */}
              {article.ctaLabel && article.ctaUrl && (
                <div className="mt-8 text-center">
                  <span className="inline-block rounded-xl px-8 py-3 text-sm font-bold uppercase text-white" style={{ background: "linear-gradient(135deg, #0B1956, #416CC2)" }}>
                    {article.ctaLabel}
                  </span>
                </div>
              )}

              {/* Floating annotation button */}
              {floatingBtn && !commentOpen && (
                <button
                  data-annotation-btn
                  onClick={openComment}
                  className="absolute z-50 flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-xl transition-all hover:bg-gray-800"
                  style={{
                    left: `${floatingBtn.x}px`,
                    top: `${floatingBtn.y}px`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  {floatingBtn.type === "image" ? (
                    <><ImageIcon className="h-3.5 w-3.5" /> Modifier l&apos;image</>
                  ) : floatingBtn.type === "title" ? (
                    <><Type className="h-3.5 w-3.5" /> Modifier le titre</>
                  ) : (
                    <><MessageSquare className="h-3.5 w-3.5" /> Modifier</>
                  )}
                </button>
              )}

              {/* Comment form */}
              {commentOpen && floatingBtn && (
                <div
                  ref={commentRef}
                  className="absolute z-50 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
                  style={{
                    left: `${Math.min(Math.max(floatingBtn.x, 160), (contentRef.current?.offsetWidth || 600) - 160)}px`,
                    top: `${floatingBtn.y + 8}px`,
                    transform: "translate(-50%, 0)",
                  }}
                >
                  {successMsg ? (
                    <div className="flex items-center gap-2 py-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Demande envoyée !
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-400 mb-1">
                          {floatingBtn?.type === "image" ? "Image sélectionnée :" : floatingBtn?.type === "title" ? "Titre sélectionné :" : "Texte sélectionné :"}
                        </p>
                        <p className={`rounded-lg px-3 py-2 text-xs text-gray-700 border line-clamp-3 ${
                          floatingBtn?.type === "image" ? "bg-purple-50 border-purple-200" : floatingBtn?.type === "title" ? "bg-blue-50 border-blue-200" : "bg-yellow-50 border-yellow-200"
                        }`}>
                          &ldquo;{selectedText}&rdquo;
                        </p>
                      </div>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={
                          floatingBtn?.type === "image" ? "Decrivez le changement d'image souhaite..." :
                          floatingBtn?.type === "title" ? "Decrivez le changement de titre souhaite..." :
                          "Decrivez la modification souhaitee..."
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
                        rows={3}
                        autoFocus
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <button
                          onClick={() => { setCommentOpen(false); setFloatingBtn(null); window.getSelection()?.removeAllRanges(); }}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={submitAnnotation}
                          disabled={!commentText.trim() || sending}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Send className="h-3 w-3" />
                          {sending ? "Envoi..." : "Envoyer"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - annotations list */}
        <div className="w-80 shrink-0">
          <div className="sticky top-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MessageSquare className="h-4 w-4" />
              Demandes ({parsedAnnotations.length})
            </h3>

            {parsedAnnotations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                <p className="text-xs text-gray-400">Aucune demande pour cet article</p>
                <p className="mt-1 text-xs text-gray-300">Selectionnez du texte pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {parsedAnnotations.map((a) => (
                  <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    {/* Status */}
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`flex items-center gap-1 text-xs font-medium ${
                        a.status === "pending" ? "text-amber-600" :
                        a.status === "done" ? "text-green-600" :
                        a.status === "approved" ? "text-blue-600" : "text-red-600"
                      }`}>
                        <Clock className="h-3 w-3" />
                        {a.status === "pending" ? "En attente" :
                         a.status === "done" ? "Terminee" :
                         a.status === "approved" ? "Approuvee" : "Refusee"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>

                    {/* Highlighted text */}
                    {a.highlightedText && (
                      <div className={`mb-2 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 border ${
                        a.annotationType === "Image" ? "bg-purple-50 border-purple-100" :
                        a.annotationType === "Titre" ? "bg-blue-50 border-blue-100" :
                        "bg-yellow-50 border-yellow-100"
                      }`}>
                        <span className="font-medium text-gray-400 text-[10px] uppercase tracking-wide">
                          {a.annotationType === "Image" ? "Image" : a.annotationType === "Titre" ? "Titre" : "Texte"}
                        </span>
                        <p className="mt-0.5">&ldquo;{a.highlightedText.length > 80 ? a.highlightedText.slice(0, 80) + "..." : a.highlightedText}&rdquo;</p>
                      </div>
                    )}

                    {/* Message */}
                    <p className="text-xs text-gray-700">{a.cleanMessage}</p>

                    {/* Admin reply */}
                    {a.adminReply && (
                      <div className="mt-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs text-blue-700 border border-blue-100">
                        <span className="font-medium">Reponse :</span> {a.adminReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
