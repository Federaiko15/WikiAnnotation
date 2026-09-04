import React from "react";

type StatusBannerProps = {
  phase: "blueprint" | "image" | null;
  error: string | null;
  onClearError?: () => void;
  onRetry?: () => void;
};

export default function StatusBanner({
  phase,
  error,
  onClearError,
  onRetry,
}: StatusBannerProps) {
  if (error) {
    return (
      <div className="flex flex-col gap-3 rounded border-2 border-zinc-900 bg-red-50 p-4 text-sm text-red-800 shadow-[3px_3px_0px_#ef4444]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 font-sketch font-bold uppercase tracking-wider text-red-900">
            <span className="text-base">⚠️</span>
            <span>Si è verificato un errore</span>
          </div>
          {onClearError && (
            <button
              type="button"
              onClick={onClearError}
              className="text-xs font-sketch font-bold text-red-700 hover:text-red-900 cursor-pointer"
            >
              ✕ Chiudi
            </button>
          )}
        </div>
        <p className="text-xs font-sans leading-relaxed text-zinc-700">{error}</p>
        {onRetry && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRetry}
              className="sketch-btn-orange text-xs py-1.5 px-3"
            >
              Riprova ➔
            </button>
          </div>
        )}
      </div>
    );
  }

  if (phase === "blueprint") {
    return (
      <div className="flex items-start gap-4 rounded border-2 border-zinc-900 bg-white p-5 text-sm shadow-[4px_4px_0px_#ea580c] animate-pulse">
        <span className="text-2xl">🧠</span>
        <div className="flex-1">
          <p className="font-sketch font-bold uppercase tracking-wider text-base text-zinc-900">
            Generazione Blueprint Concettuale in corso...
          </p>
          <p className="mt-1 text-xs text-zinc-600 font-sans leading-relaxed">
            L&apos;AI sta analizzando la voce Wikipedia, estraendo <span className="highlighter-yellow">6–8 moduli didattici</span>, definendo l&apos;elemento grafico centrale e contrassegnando le parole chiave.
          </p>
        </div>
      </div>
    );
  }

  if (phase === "image") {
    return (
      <div className="flex items-start gap-4 rounded border-2 border-zinc-900 bg-white p-5 text-sm shadow-[4px_4px_0px_#0d9488] animate-pulse">
        <span className="text-2xl">🎨</span>
        <div className="flex-1">
          <p className="font-sketch font-bold uppercase tracking-wider text-base text-teal-900">
            Disegno dell&apos;Infografica Sketchnote in corso...
          </p>
          <p className="mt-1 text-xs text-zinc-600 font-sans leading-relaxed">
            Il modello grafico sta disegnando a mano su foglio bianco: figure umane semplici con prop identificativi, connettori a freccia, doodle e testo con tratti di <span className="highlighter-teal">evidenziatore traslucido</span>.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
