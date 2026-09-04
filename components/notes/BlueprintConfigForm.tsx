"use client";

import React from "react";
import type { LearningLevel } from "@/lib/ai/agents/createBlueprintAgents";
import type { OutputLanguage } from "@/lib/api/notesClient";
import type { ImageAspectRatio } from "@/lib/ai/services/generateImage";

type BlueprintConfigFormProps = {
  learningLevel: LearningLevel;
  setLearningLevel: (level: LearningLevel) => void;
  outputLanguage: OutputLanguage;
  setOutputLanguage: (lang: OutputLanguage) => void;
  aspectRatio: ImageAspectRatio;
  setAspectRatio: (ratio: ImageAspectRatio) => void;
  autoGenerateImage: boolean;
  setAutoGenerateImage: (val: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  loadingPhase?: "blueprint" | "image" | null;
  hasBlueprint: boolean;
  onReset?: () => void;
};

export default function BlueprintConfigForm({
  learningLevel,
  setLearningLevel,
  outputLanguage,
  setOutputLanguage,
  aspectRatio,
  setAspectRatio,
  autoGenerateImage,
  setAutoGenerateImage,
  onSubmit,
  loading,
  loadingPhase,
  hasBlueprint,
  onReset,
}: BlueprintConfigFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="sketch-panel p-6 sm:p-8 flex flex-col gap-6"
    >
      <div className="border-b-2 border-dashed border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="sketch-badge-orange">Passo 1</span>
          <h2 className="font-sketch font-bold uppercase tracking-wider text-lg text-zinc-900">
            Configurazione Didattica e Grafica
          </h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500 font-sans">
          Personalizza il target scolastico, la lingua degli appunti e le proporzioni del foglio da disegno.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Livello di Apprendimento */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="learningLevel"
            className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-800"
          >
            Livello Scolastico
          </label>
          <select
            id="learningLevel"
            value={learningLevel}
            onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
            disabled={loading}
            className="sketch-select"
          >
            <option value="primary">Scuola Primaria (Elementari)</option>
            <option value="middle-school">Scuola Secondaria I Grado (Medie)</option>
            <option value="high-school">Scuola Secondaria II Grado (Superiori)</option>
            <option value="university">Università / Specialistico</option>
            <option value="general">Generale / Divulgativo</option>
          </select>
          <span className="text-[11px] text-zinc-400">
            Adatta la densità dei concetti e il vocabolario
          </span>
        </div>

        {/* Lingua di Output */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="outputLanguage"
            className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-800"
          >
            Lingua dei Testi
          </label>
          <select
            id="outputLanguage"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value as OutputLanguage)}
            disabled={loading}
            className="sketch-select"
          >
            <option value="it">🇮🇹 Italiano</option>
            <option value="en">🇬🇧 Inglese (English)</option>
          </select>
          <span className="text-[11px] text-zinc-400">
            Lingua usata nelle intestazioni e nelle etichette
          </span>
        </div>

        {/* Formato / Aspect Ratio */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="aspectRatio"
            className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-800"
          >
            Proporzioni Foglio
          </label>
          <select
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}
            disabled={loading}
            className="sketch-select"
          >
            <option value="3:4">3:4 (Verticale / Foglio standard)</option>
            <option value="1:1">1:1 (Quadrato)</option>
            <option value="16:9">16:9 (Widescreen orizzontale)</option>
            <option value="9:16">9:16 (Verticale smartphone)</option>
          </select>
          <span className="text-[11px] text-zinc-400">
            Formato di disegno per l&apos;illustrazione finale
          </span>
        </div>

        {/* Generazione a catena (One-shot vs Step-by-step) */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-3 rounded border-2 border-zinc-900 bg-white p-3 shadow-[2px_2px_0px_#18181b] cursor-pointer hover:shadow-[3px_3px_0px_#ea580c] transition-all">
            <input
              type="checkbox"
              checked={autoGenerateImage}
              onChange={(e) => setAutoGenerateImage(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 accent-orange-600 rounded border-2 border-zinc-900"
            />
            <div className="flex flex-col text-xs">
              <span className="font-sketch font-bold uppercase tracking-wider text-zinc-900 text-sm">
                Genera anche l&apos;immagine subito
              </span>
              <span className="text-zinc-500 text-[11px]">
                Esegue entrambe le chiamate (blueprint + infografica)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-zinc-200 pt-4">
        {hasBlueprint && onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className="sketch-btn-white text-xs py-2 px-3"
          >
            ↺ Ricomincia da capo
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="sketch-btn-orange"
          >
            {loading ? (
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
                {loadingPhase === "image"
                  ? "Disegno infografica in corso..."
                  : "Creazione blueprint in corso..."}
              </>
            ) : hasBlueprint ? (
              "Aggiorna Blueprint ➔"
            ) : autoGenerateImage ? (
              "✎ Disegna Blueprint e Immagine ➔"
            ) : (
              "Genera Blueprint ➔"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
