"use client";

import { useState } from "react";

type Image = { id: number; url: string };

type Props = {
  images: Image[];
};

export function ImageGallery({ images }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {images.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIdx(idx)}
            className="group relative overflow-hidden rounded-xl border border-[var(--border)] transition hover:border-[var(--forest)] hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={`Photo du logement ${idx + 1}`}
              className="h-28 w-36 object-cover transition group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
              🔍
            </span>
          </button>
        ))}
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIdx].url}
              alt={`Photo du logement ${lightboxIdx + 1}`}
              className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg shadow-md transition hover:bg-red-50"
              aria-label="Fermer"
            >
              ✕
            </button>

            {images.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((lightboxIdx - 1 + images.length) % images.length)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-md transition hover:bg-white"
                >
                  ←
                </button>
                <span className="rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                  {lightboxIdx + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx((lightboxIdx + 1) % images.length)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-md transition hover:bg-white"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
