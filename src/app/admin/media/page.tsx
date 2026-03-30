"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import Image from "next/image";

interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    const res = await fetch("/api/upload");
    const data = await res.json();
    setMedia(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/upload", { method: "POST", body: formData });
    }
    setUploading(false);
    fetchMedia();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Médias</h1>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#2D5A3D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#234a31]">
          <Upload className="h-4 w-4" />
          {uploading ? "Upload..." : "Uploader"}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-12 text-center text-gray-400 shadow-sm">
          Chargement...
        </div>
      ) : media.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <Upload className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">Aucun média uploadé</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <div className="relative aspect-square">
                {item.mimeType.startsWith("image/") ? (
                  <Image
                    src={item.url}
                    alt={item.filename}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-400">
                    {item.mimeType}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.filename}
                </p>
                <p className="text-xs text-gray-500">{formatSize(item.size)}</p>
              </div>
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="rounded-lg bg-white/90 p-1.5 shadow-sm hover:bg-white"
                  title="Copier l'URL"
                >
                  {copied === item.url ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={async () => {
                    if (!confirm("Supprimer ce média ?")) return;
                    await fetch(`/api/upload/${item.id}`, { method: "DELETE" });
                    fetchMedia();
                  }}
                  className="rounded-lg bg-white/90 p-1.5 shadow-sm hover:bg-white"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
