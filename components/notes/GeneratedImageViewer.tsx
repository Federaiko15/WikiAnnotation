"use client";

import React, { useState } from "react";
import type {
  ImageApiResponse,
  GeneratedImageItem,
} from "@/lib/api/notesClient";

type GeneratedImageViewerProps = {
  result: ImageApiResponse;
  topic: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
};

export default function GeneratedImageViewer({
  result,
  topic,
  onRegenerate,
  isRegenerating,
}: GeneratedImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const images: GeneratedImageItem[] =
    result.images && result.images.length > 0
      ? result.images
      : result.image
        ? [
            {
              topic,
              blueprintTitle: topic,
              image: result.image,
              imageSize: result.imageSize || "1024x1360",
              finalPrompt: result.finalPrompt || "",
            },
          ]
        : [];

  const currentItem = images[currentIndex] ?? images[0];

  if (!currentItem) return null;

  const dataUri = `data:${currentItem.image.mediaType || "image/png"};base64,${currentItem.image.base64}`;

  function handleDownloadCurrent() {
    const link = document.createElement("a");
    link.href = dataUri;
    const title = currentItem.blueprintTitle || currentItem.topic || topic;
    const sanitizedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    link.download = `appunti-visivi-${sanitizedTitle || "sketchnote"}${images.length > 1 ? `-${currentIndex + 1}` : ""}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleDownloadAll() {
    images.forEach((item, idx) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = `data:${item.image.mediaType || "image/png"};base64,${item.image.base64}`;
        const title = item.blueprintTitle || item.topic || topic;
        const sanitizedTitle = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        link.download = `appunti-visivi-${sanitizedTitle || "sketchnote"}-${idx + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 250);
    });
  }

  function handleCopyPrompt() {
    navigator.clipboard.writeText(currentItem.finalPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  }

  return (
    <section className="sketch-panel p-6 sm:p-8 flex flex-col gap-6">
      {/* Multi-Image Tabs and Navigation */}
      {images.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded border-2 border-zinc-900 bg-zinc-50 p-3 shadow-[2px_2px_0px_#18181b]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-700">
              Fogli Infografica ({images.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {images.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`text-xs font-sketch font-bold uppercase tracking-wider px-3 py-1 rounded border-2 transition-all ${
                      isActive
                        ? "border-zinc-900 bg-[#ea580c] text-white shadow-[2px_2px_0px_#18181b]"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 shadow-[1px_1px_0px_#18181b]"
                    }`}
                  >
                    Foglio {idx + 1}: {item.blueprintTitle || `Parte ${idx + 1}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1,
                )
              }
              className="sketch-btn-white text-xs py-1 px-2.5"
            >
              ← Prec
            </button>
            <span className="text-xs font-sketch font-bold text-zinc-600">
              {currentIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0,
                )
              }
              className="sketch-btn-white text-xs py-1 px-2.5"
            >
              Succ →
            </button>
          </div>
        </div>
      )}

      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-zinc-200 pb-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="sketch-badge-teal">
              ✓ {images.length > 1 ? `${images.length} Infografiche Generate` : "Infografica Generata"}
            </span>
            {images.length > 1 && (
              <span className="sketch-badge-ink text-xs">
                Foglio {currentIndex + 1} di {images.length}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-col gap-1">
            <h3 className="sketchnote-title-box-sm px-4 py-1.5 text-lg sm:text-xl">
              {currentItem.topic}
            </h3>
            {currentItem.blueprintTitle && (
              <div className="text-sm font-sketch font-bold uppercase text-orange-700">
                ↳ Focus: {currentItem.blueprintTitle}
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 font-sans">
            Foglio Sketchnote • Risoluzione: {currentItem.imageSize} • Formato PNG
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="sketch-btn-white text-xs py-2 px-3.5"
          >
            {isRegenerating ? (
              <>
                <svg
                  className="h-3.5 w-3.5 animate-spin text-zinc-800"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Ridisegno in corso...
              </>
            ) : (
              <>↺ {images.length > 1 ? "Ridisegna Tutte" : "Ridisegna Infografica"}</>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadCurrent}
            className="sketch-btn-orange text-xs py-2 px-4"
          >
            ⬇ {images.length > 1 ? "Scarica Questo Foglio" : "Scarica PNG"}
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={handleDownloadAll}
              className="sketch-btn-teal text-xs py-2 px-4"
            >
              ⬇ Scarica Tutte ({images.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Image Paper Container */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center justify-center overflow-hidden rounded border-2 border-zinc-900 bg-white p-3 sm:p-4 shadow-[5px_5px_0px_#18181b]">
        <div
          className="group relative w-full cursor-zoom-in"
          onClick={() => setIsZoomOpen(true)}
        >
          {/* Using standard img for direct Base64 Data URL display */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dataUri}
            alt={`Mappa concettuale illustrata per ${currentItem.topic} - ${currentItem.blueprintTitle}`}
            className="mx-auto h-auto max-h-[75vh] w-auto rounded border border-zinc-200 object-contain transition-transform duration-200 group-hover:scale-[1.005]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="sketch-btn-white text-xs shadow-md">
              🔍 Clicca per ingrandire
            </span>
          </div>
        </div>
      </div>

      {/* Details and Prompt */}
      <div className="flex flex-col gap-2 border-t-2 border-dashed border-zinc-200 pt-4">
        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer font-sketch font-bold uppercase tracking-wider hover:text-zinc-900">
            Mostra prompt di generazione inviato al modello AI (Foglio {currentIndex + 1})
          </summary>
          <div className="relative mt-2">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="sketch-btn-white text-[10px] py-1 px-2.5 absolute top-2 right-2"
            >
              {copiedPrompt ? "✓ Copiato" : "Copia Prompt"}
            </button>
            <pre className="max-h-56 overflow-auto rounded border-2 border-zinc-900 bg-zinc-50 p-4 font-mono text-[11px] text-zinc-800 whitespace-pre-wrap">
              {currentItem.finalPrompt}
            </pre>
          </div>
        </details>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/80 p-4 backdrop-blur-xs"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="relative max-h-[95vh] max-w-[95vw] overflow-auto rounded border-2 border-zinc-900 bg-white p-2 shadow-[8px_8px_0px_#18181b]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev > 0 ? prev - 1 : images.length - 1,
                      )
                    }
                    className="sketch-btn-white text-xs py-1 px-2 shadow-[2px_2px_0px_#18181b]"
                  >
                    ← Prec
                  </button>
                  <span className="text-xs font-sketch font-bold text-zinc-800 bg-white px-2 py-1 rounded border-2 border-zinc-900">
                    {currentIndex + 1} / {images.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev < images.length - 1 ? prev + 1 : 0,
                      )
                    }
                    className="sketch-btn-white text-xs py-1 px-2 shadow-[2px_2px_0px_#18181b]"
                  >
                    Succ →
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="sketch-btn-white h-9 w-9 p-0 flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_#18181b]"
                aria-label="Chiudi zoom"
              >
                ✕
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUri}
              alt={`Zoom appunti visivi ${currentItem.topic} - ${currentItem.blueprintTitle}`}
              className="h-auto max-h-[90vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
