"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        Erreur
      </h1>
      <p className="mt-3 max-w-md text-gray-600">
        Une erreur est survenue dans l&apos;interface d&apos;administration.
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={reset}
          className="rounded-lg bg-[#2D5A3D] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#234a31] transition-colors"
        >
          Reessayer
        </button>
        <a
          href="/admin"
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Retour au dashboard
        </a>
      </div>
    </div>
  );
}
