"use client";

import React, { useState } from "react";
import type { VisualNotesBlueprint } from "@/lib/ai/schemas/visualNotesBlueprintSchema";
import type { ImageAspectRatio } from "@/lib/ai/services/generateImage";
import HighlightedText from "./HighlightedText";

type BlueprintViewerProps = {
  blueprint: VisualNotesBlueprint;
  source?: {
    title: string;
    url: string;
  };
  aspectRatio: ImageAspectRatio;
  setAspectRatio: (ratio: ImageAspectRatio) => void;
  onGenerateImage: () => void;
  isGeneratingImage: boolean;
  hasImage: boolean;
};

export default function BlueprintViewer({
  blueprint,
  source,
  aspectRatio,
  setAspectRatio,
  onGenerateImage,
  isGeneratingImage,
  hasImage,
}: BlueprintViewerProps) {
  const [copied, setCopied] = useState(false);

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(blueprint, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="sketch-panel p-6 sm:p-8 flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-dashed border-zinc-200 pb-5">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="sketch-badge-teal">
              {blueprint.subjectType.replace(/-/g, " ").toUpperCase()}
            </span>
            <span className="sketch-badge-orange">
              Livello: {blueprint.learningLevel.toUpperCase()}
            </span>
          </div>

          <div className="mt-1">
            <div className="sketchnote-title-box px-4 py-2 text-xl sm:text-2xl">
              {blueprint.topic}
            </div>
          </div>

          {source && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 text-xs font-sketch font-bold text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center gap-1"
            >
              ↳ Fonte Wikipedia: {source.title} ↗
            </a>
          )}
        </div>

        {/* Generate Image CTA Button (Fast Action) */}
        {!hasImage && (
          <div className="flex flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={onGenerateImage}
              disabled={isGeneratingImage}
              className="sketch-btn-orange"
            >
              {isGeneratingImage ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin text-white"
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
                  Disegno infografica con AI in corso...
                </>
              ) : (
                <>
                  <span>✎</span> Disegna Infografica Sketchnote ➔
                </>
              )}
            </button>
            <div className="flex items-center gap-2 text-xs font-sketch text-zinc-600">
              <span className="font-bold uppercase tracking-wider">Formato foglio:</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}
                disabled={isGeneratingImage}
                className="sketch-select py-1 px-2 text-xs w-auto"
              >
                <option value="3:4">3:4 (Verticale)</option>
                <option value="1:1">1:1 (Quadrato)</option>
                <option value="16:9">16:9 (Orizzontale)</option>
                <option value="9:16">9:16 (Story)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Central Visual Focus */}
      {blueprint.centralVisual && (
        <div className="rounded border-2 border-zinc-900 bg-amber-50/60 p-4 shadow-[3px_3px_0px_#ea580c]">
          <div className="flex items-center gap-2 text-xs font-sketch font-bold uppercase tracking-wider text-amber-900">
            <span>🎯</span> Elemento Grafico Centrale ({blueprint.centralVisual.type})
          </div>
          <p className="mt-1 text-sm text-zinc-900 leading-relaxed">
            {blueprint.centralVisual.instruction}
          </p>
        </div>
      )}

      {/* Modules List - Open Sketchnote Modules */}
      <div>
        <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-200 pb-2">
          <h3 className="text-base font-sketch font-bold uppercase tracking-wider text-zinc-900">
            Moduli di Conoscenza ({blueprint.modules?.length ?? 0})
          </h3>
          <span className="text-xs font-sketch text-zinc-500">
            Struttura aperta • Senza schede rigide
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {blueprint.modules?.map((module, index) => (
            <div
              key={index}
              className="sketch-module-open flex flex-col justify-between shadow-[2px_2px_0px_rgba(0,0,0,0.06)]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="sketch-badge-ink text-[10px]">
                    ✎ {module.visual.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-sketch font-semibold text-teal-700">
                    {module.conceptLabel}
                  </span>
                </div>

                <h4 className="mt-2 font-sketch font-bold uppercase tracking-wide text-lg text-zinc-900">
                  {module.title}
                </h4>

                <p className="mt-1 text-xs text-zinc-600">
                  <span className="font-sketch font-bold uppercase text-zinc-700">↳ Connessione:</span>{" "}
                  {module.relationToCentralTopic}
                </p>

                <p className="mt-1 text-xs text-zinc-500 italic">
                  <span className="font-sketch font-bold uppercase text-zinc-600 not-italic">Disegno previsto:</span>{" "}
                  {module.visual.instruction}
                </p>

                <ul className="mt-3 list-disc pl-4 space-y-1.5 text-xs text-zinc-800">
                  {module.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      <HighlightedText text={item.text} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution notice */}
      {blueprint.sourceNotice && (
        <p className="text-xs text-zinc-400 font-sans italic border-t-2 border-dashed border-zinc-200 pt-3">
          {blueprint.sourceNotice}
        </p>
      )}

      {/* Bottom CTA for generating image */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-zinc-200 pt-4">
        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer font-sketch font-bold uppercase tracking-wider hover:text-zinc-900">
            Visualizza JSON grezzo del blueprint
          </summary>
          <div className="relative mt-2">
            <button
              type="button"
              onClick={copyJson}
              className="sketch-btn-white text-[10px] py-1 px-2 absolute top-2 right-2"
            >
              {copied ? "✓ Copiato" : "Copia"}
            </button>
            <pre className="max-h-60 overflow-auto rounded border-2 border-zinc-900 bg-zinc-50 p-4 font-mono text-[11px] text-zinc-800">
              {JSON.stringify(blueprint, null, 2)}
            </pre>
          </div>
        </details>

        {!hasImage && (
          <button
            type="button"
            onClick={onGenerateImage}
            disabled={isGeneratingImage}
            className="sketch-btn-teal"
          >
            {isGeneratingImage ? "Disegno in corso..." : "Procedi: Disegna Infografica ➔"}
          </button>
        )}
      </div>
    </section>
  );
}
