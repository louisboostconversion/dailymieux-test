"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";

interface StickyCTAProps {
  label: string;
  url: string;
  sponsorName?: string | null;
}

export default function StickyCTA({ label, url, sponsorName }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    const show = () => {
      if (!dismissedRef.current) setIsVisible(true);
    };

    // Show after 2s OR 300px scroll, whichever comes first
    const timer = setTimeout(show, 2000);

    const handleScroll = () => {
      if (window.scrollY > 300) show();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDismiss = () => {
    dismissedRef.current = true;
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (isDismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        opacity: isVisible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Soft gradient fade */}
      <div
        style={{
          height: 24,
          background: "linear-gradient(to top, rgba(255,255,255,0.9), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(226,231,241,0.5)",
          boxShadow: "0 -8px 30px rgba(11,25,86,0.12)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:py-3.5">
          {/* Brand info — desktop only */}
          {sponsorName && (
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold"
                style={{ backgroundColor: "#E8F0FB", color: "#416CC2" }}>
                {sponsorName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span style={{ fontSize: 10, color: "#8E9AB8", lineHeight: 1 }}>Découvrir</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0B1956" }}>{sponsorName}</span>
              </div>
            </div>
          )}

          {/* CTA button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              borderRadius: 12,
              background: "linear-gradient(135deg, #0B1956, #416CC2)",
              padding: "14px 20px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(11,25,86,0.25)",
              transition: "box-shadow 0.2s, transform 0.15s",
            }}
          >
            <span>{label}</span>
            <ArrowRight style={{ width: 16, height: 16 }} />
          </a>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            aria-label="Fermer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              color: "#8E9AB8",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Safe area for notched phones */}
        <div style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }} />
      </div>
    </div>
  );
}
