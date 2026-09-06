"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserText } from "@/lib/api/notesClient";

const MAX_CHARACTERS = 10000;

const SAMPLE_TEXT = `La Rivoluzione Industriale è stato un processo di evoluzione economica e di industrializzazione di società che da agricole ed artigianali divennero prevalentemente industriali, moderno-capitalistiche.

Ha avuto inizio in Gran Bretagna verso la seconda metà del XVIII secolo (circa 1760-1780) per poi diffondersi nel resto d'Europa e negli Stati Uniti.

Fattori chiave:
1. Macchina a vapore di James Watt: rivoluzionò la produzione energetica nei cotonifici e nei trasporti.
2. Nascita delle ferrovie e locomotive a vapore (George Stephenson).
3. Urbanizzazione massiccia: spopolamento delle campagne verso le città industriali (come Manchester e Birmingham).
4. Nascita di due nuove classi sociali: la borghesia capitalista e il proletariato industriale.`;

export default function SendTextPage() {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const charCount = text.length;
  const remainingChars = MAX_CHARACTERS - charCount;
  const isOverLimit = charCount > MAX_CHARACTERS;
  const progressPercent = Math.min(
    100,
    Math.round((charCount / MAX_CHARACTERS) * 100),
  );

  function handleLoadSample() {
    setTitle("La Rivoluzione Industriale");
    setText(SAMPLE_TEXT);
    setErrorMessage(null);
  }

  function handleClear() {
    setTitle("");
    setText("");
    setErrorMessage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedTitle = title.trim();
    const rawText = text.trim();

    if (!trimmedTitle) {
      setErrorMessage(
        "Inserisci un titolo significativo per identificare la tua mappa.",
      );
      return;
    }

    if (!rawText) {
      setErrorMessage(
        "Inserisci il testo su cui generare la sketchnote illustrata.",
      );
      return;
    }

    if (rawText.length > MAX_CHARACTERS) {
      setErrorMessage(
        `Il testo supera il limite consentito di ${MAX_CHARACTERS} caratteri (${rawText.length}/${MAX_CHARACTERS}). Riduci il testo e riprova.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const id = await saveUserText(rawText);

      router.replace(
        `/article_text/${encodeURIComponent(trimmedTitle)}/concept-map?source=custom&id=${encodeURIComponent(id)}`,
      );
    } catch (err) {
      console.error("Errore durante il salvataggio del testo:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Impossibile salvare il testo al momento. Riprova più tardi.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sketch-panel p-6 sm:p-8 flex flex-col gap-6"
    >
      {/* Form Section Header */}
      <div className="border-b-2 border-dashed border-zinc-200 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="sketch-badge-orange">Passo 1 di 2</span>
            <h2 className="font-sketch font-bold uppercase tracking-wider text-lg text-zinc-900">
              Modulo di Inserimento
            </h2>
          </div>
          <span className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-400 hidden sm:inline-block">
            ✎ Testo Libero
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-zinc-500 font-sans leading-relaxed">
          Definisci il titolo dell&apos;argomento e incolla il materiale
          didattico che l&apos;AI utilizzerà come fonte per strutturare i
          concetti.
        </p>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-500 rounded shadow-[3px_3px_0px_#ef4444] text-red-700 animate-in fade-in">
          <span className="text-lg leading-none">⚠️</span>
          <div className="flex-1 text-xs sm:text-sm font-sans">
            <strong className="font-sketch text-sm uppercase tracking-wide block mb-0.5">
              Attenzione
            </strong>
            {errorMessage}
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 text-xs font-sketch font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Field 1: Titolo */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="title"
          className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-800 flex items-center justify-between"
        >
          <span>Titolo della Mappa / Argomento *</span>
          <span className="text-[11px] font-sans text-zinc-400 font-normal">
            Obbligatorio
          </span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          placeholder="es. La Fotosintesi Clorofilliana, Guerra di Troia, Equazioni di Maxwell..."
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
          maxLength={150}
          className="sketch-input text-base font-medium py-2.5 px-3.5"
        />
        <span className="text-[11px] text-zinc-400">
          Questo titolo apparirà nel cartiglio centrale della sketchnote
          illustrata con bordo inchiostro e sfumatura arancione.
        </span>
      </div>

      {/* Field 2: Testo */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="text"
            className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-800"
          >
            Testo Didattico di Riferimento *
          </label>

          {/* Character counter badge */}
          <span
            className={`text-xs font-sketch font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
              isOverLimit
                ? "bg-red-50 text-red-600 border-red-400"
                : charCount > 2500
                  ? "bg-amber-50 text-amber-700 border-amber-400"
                  : "bg-zinc-50 text-zinc-600 border-zinc-300"
            }`}
          >
            {charCount.toLocaleString("it-IT")} /{" "}
            {MAX_CHARACTERS.toLocaleString("it-IT")} caratteri
          </span>
        </div>

        <div className="relative">
          <textarea
            id="text"
            name="text"
            value={text}
            rows={10}
            placeholder="Incolla o digita qui i tuoi appunti, riassunti, spiegazioni o definizioni (massimo 3000 caratteri)...&#10;&#10;Suggerimento: suddividere in paragrafi, elenchi puntati o sequenze di causa/effetto aiuta l'AI a generare moduli visivi più chiari ed efficaci."
            onChange={(e) => setText(e.target.value)}
            disabled={isSubmitting}
            className={`sketch-input font-sans text-sm sm:text-base leading-relaxed p-4 min-h-[220px] sm:min-h-[260px] resize-y ${
              isOverLimit ? "border-red-500 focus:border-red-600" : ""
            }`}
          />

          {/* Progress bar at bottom of textarea */}
          <div className="w-full bg-zinc-100 h-1.5 rounded-b overflow-hidden -mt-1.5 border-x-2 border-b-2 border-zinc-900">
            <div
              className={`h-full transition-all duration-200 ${
                isOverLimit
                  ? "bg-red-500"
                  : progressPercent > 85
                    ? "bg-amber-500"
                    : "bg-teal-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Toolbar under Textarea */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-zinc-500 font-sans">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLoadSample}
              disabled={isSubmitting}
              className="text-teal-700 hover:text-teal-900 hover:underline font-sketch font-bold text-xs inline-flex items-center gap-1"
            >
              📄 Carica testo di esempio
            </button>
            {text && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                className="text-zinc-400 hover:text-zinc-700 hover:underline text-xs inline-flex items-center gap-1"
              >
                ✕ Pulisci
              </button>
            )}
          </div>

          <div className="text-[11px] text-zinc-400">
            {remainingChars >= 0 ? (
              <span>
                Rimangono{" "}
                <strong>{remainingChars.toLocaleString("it-IT")}</strong>{" "}
                caratteri
              </span>
            ) : (
              <span className="text-red-600 font-bold">
                Limite superato di{" "}
                {Math.abs(remainingChars).toLocaleString("it-IT")} caratteri!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Helpful educational tips callout */}
      <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded flex items-start gap-2.5 text-xs text-amber-900">
        <span className="text-base leading-none">💡</span>
        <div className="leading-relaxed font-sans">
          <strong>Consiglio didattico:</strong> Il modello estrae concetti
          chiave, relazioni gerarchiche e metafore visive. Includere date,
          parole chiave o collegamenti logici produrrà icone e callout più
          dettagliati.
        </div>
      </div>

      {/* Footer Submit Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-zinc-200 pt-5">
        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={isSubmitting}
          className="sketch-btn-white text-xs py-2 px-3.5"
        >
          ← Annulla e torna alla Home
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting || isOverLimit || !title.trim() || !text.trim()
          }
          className="sketch-btn-orange text-sm sm:text-base py-2.5 px-6"
        >
          {isSubmitting ? (
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
              <span>Salvataggio e apertura studio...</span>
            </>
          ) : (
            <span>Procedi alla Configurazione Mappa ➔</span>
          )}
        </button>
      </div>
    </form>
  );
}
