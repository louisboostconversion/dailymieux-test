"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { Monitor, Tablet, Smartphone, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

interface ArticlePreviewProps {
  form: {
    title: string;
    excerpt: string;
    content: string;
    type: string;
    coverImage: string;
    categoryId: string;
    featured: boolean;
    sponsorName: string;
    sponsorUrl: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  categoryName?: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";

const DEVICES: {
  id: DeviceType;
  label: string;
  icon: typeof Monitor;
  width: number;
  height: number;
  defaultZoom: number;
}[] = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: 1440, height: 900, defaultZoom: 60 },
  { id: "tablet", label: "Tablet", icon: Tablet, width: 768, height: 1024, defaultZoom: 75 },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: 375, height: 812, defaultZoom: 90 },
];

export default function ArticlePreview({ form, categoryName }: ArticlePreviewProps) {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [zoom, setZoom] = useState(60);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readyRef = useRef(false);

  const currentDevice = DEVICES.find((d) => d.id === device)!;
  const scale = zoom / 100;

  const article = useMemo(
    () => ({
      title: form.title || "Titre de l'article",
      excerpt: form.excerpt || "Extrait de l'article...",
      content: form.content || "{}",
      type: form.type,
      coverImage: form.coverImage || null,
      category: {
        name: categoryName || "Categorie",
        slug: "preview",
        color: "#2D5A3D",
      },
      author: { name: "Vous", avatar: null },
      publishedAt: new Date().toISOString(),
      sponsorName: form.sponsorName || null,
      sponsorLogo: null,
      sponsorUrl: form.sponsorUrl || null,
      ctaLabel: form.ctaLabel || null,
      ctaUrl: form.ctaUrl || null,
      views: 0,
    }),
    [form, categoryName]
  );

  const sendToIframe = useCallback(() => {
    if (iframeRef.current?.contentWindow && readyRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { type: "preview-update", article },
        "*"
      );
    }
  }, [article]);

  // Listen for iframe ready signal
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "preview-ready") {
        readyRef.current = true;
        sendToIframe();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sendToIframe]);

  // Send data when article changes
  useEffect(() => {
    sendToIframe();
  }, [sendToIframe]);

  // Also send on iframe load (fallback)
  function handleIframeLoad() {
    // Small delay to let the page initialize
    setTimeout(() => {
      readyRef.current = true;
      sendToIframe();
    }, 200);
  }

  function adjustZoom(delta: number) {
    setZoom((z) => Math.min(150, Math.max(25, z + delta)));
  }

  function switchDevice(d: DeviceType) {
    const dev = DEVICES.find((x) => x.id === d)!;
    setDevice(d);
    setZoom(dev.defaultZoom);
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5">
        {/* Left: dimensions */}
        <div className="flex items-center gap-2 min-w-[80px]">
          <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-mono font-medium text-gray-500">
            {currentDevice.width} x {currentDevice.height}
          </span>
        </div>

        {/* Center: device selector */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              onClick={() => switchDevice(d.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                device === d.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title={d.label}
            >
              <d.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{d.label}</span>
            </button>
          ))}
        </div>

        {/* Right: zoom controls */}
        <div className="flex items-center gap-1 min-w-[80px] justify-end">
          <button
            onClick={() => adjustZoom(-10)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-[2.5rem] text-center text-[11px] font-mono font-medium text-gray-500">
            {zoom}%
          </span>
          <button
            onClick={() => adjustZoom(10)}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => switchDevice(device)}
            className="ml-1 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Reinitialiser"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 overflow-auto"
        style={{
          background:
            "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          backgroundColor: "#f1f5f9",
        }}
      >
        <div className="flex justify-center py-6" style={{ minHeight: "100%" }}>
          {/* Device frame */}
          <div
            className="relative flex-shrink-0 transition-all duration-300 ease-out"
            style={{
              width: currentDevice.width * scale,
              height: currentDevice.height * scale,
            }}
          >
            {/* Frame chrome */}
            <div
              className={`h-full w-full overflow-hidden bg-white transition-all duration-300 ${
                device === "mobile"
                  ? "rounded-[2.5rem]"
                  : device === "tablet"
                  ? "rounded-[1.5rem]"
                  : "rounded-xl"
              }`}
              style={{
                boxShadow: "0 25px 50px -12px rgba(0,0,0,.25), 0 0 0 1px rgba(0,0,0,.05)",
                border:
                  device === "mobile"
                    ? `${Math.max(6, 10 * scale)}px solid #111827`
                    : device === "tablet"
                    ? `${Math.max(5, 8 * scale)}px solid #1f2937`
                    : "none",
              }}
            >
              {/* Desktop browser bar */}
              {device === "desktop" && (
                <div
                  className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-3 backdrop-blur"
                  style={{ height: 32 * scale }}
                >
                  <div className="flex gap-1">
                    <div className="rounded-full bg-[#ff5f57]" style={{ width: 8 * scale, height: 8 * scale }} />
                    <div className="rounded-full bg-[#febc2e]" style={{ width: 8 * scale, height: 8 * scale }} />
                    <div className="rounded-full bg-[#28c840]" style={{ width: 8 * scale, height: 8 * scale }} />
                  </div>
                  <div
                    className="mx-2 flex-1 rounded-md bg-white/80 px-3 text-gray-400 truncate"
                    style={{
                      height: 20 * scale,
                      fontSize: Math.max(8, 11 * scale),
                      lineHeight: `${20 * scale}px`,
                      border: `${scale}px solid #e5e7eb`,
                    }}
                  >
                    dailymieux.fr/{form.type}/{form.title ? "mon-article" : "preview"}
                  </div>
                </div>
              )}

              {/* Mobile notch */}
              {device === "mobile" && (
                <div
                  className="relative flex justify-center bg-white"
                  style={{ height: 24 * scale }}
                >
                  <div
                    className="absolute rounded-full bg-gray-900"
                    style={{
                      top: 8 * scale,
                      width: 70 * scale,
                      height: 5 * scale,
                    }}
                  />
                </div>
              )}

              {/* Iframe — renders at REAL device width, triggering responsive CSS */}
              <iframe
                ref={iframeRef}
                src="/preview-frame"
                onLoad={handleIframeLoad}
                title="Apercu article"
                className="border-0"
                style={{
                  width: currentDevice.width,
                  height:
                    (currentDevice.height -
                      (device === "desktop" ? 32 : device === "mobile" ? 24 : 0)) /
                    scale,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              />
            </div>

            {/* Device label */}
            <div className="mt-3 text-center">
              <span className="text-[11px] font-medium text-gray-400">
                {currentDevice.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
