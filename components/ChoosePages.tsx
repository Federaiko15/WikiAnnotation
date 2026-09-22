"use client";

import { useState, useRef } from "react";
import PageCard from "./layout/PageCard";
import SendTextButton from "./layout/SendTextButton";
import { FaFilePdf, FaUpload, FaTimes } from "react-icons/fa";

type SearchResult = {
  id: number;
  key: string;
  title: string;
  excerpt: string;
  description?: string;
};

type SearchResponse = {
  pages?: SearchResult[];
};

export default function ChoosePages() {
  const [text, setText] = useState<string>("");
  const [pagesResult, setPagesResult] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [pdf, setPdf] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || file.type !== "application/pdf") {
      console.log("File non preso");
      setPdf(null);
      return;
    }

    console.log(file.name);
    setPdf(file);
  };

  const handleRemovePdf = () => {
    setPdf(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePdfSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pdf || pdf.type !== "application/pdf") {
      console.log("File non preso");
      return;
    }

    console.log(pdf.name);
  };

  const searchPage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nativeEvent = e.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement | null;

    if (!submitter) {
      console.error("Submitter button not found.");
      setIsSearching(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    if (submitter.id === "search-btn") {
      // caso in cui l'utente inserisce direttamente un proprio testo su cui voler generare l'immagine

      try {
        setIsSearching(true);

        const rawSearch = String(formData.get("search") ?? "").trim();

        if (!rawSearch) {
          alert("Inserisci un argomento da cercare.");
          setIsSearching(false);
          return;
        }
        const searchParams = new URLSearchParams({
          q: rawSearch,
          limit: "5",
        });

        const searchResponse = await fetch(
          `/api/wiki/search?${searchParams.toString()}`,
        );

        const searchData = (await searchResponse.json()) as SearchResponse;
        const results = searchData.pages ?? [];

        if (results.length === 0) {
          throw new Error("Nessun risultato trovato.");
        }

        setPagesResult(results);
      } catch (error) {
        console.error("Errore durante la ricerca:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };
  return (
    <div className="prova-container">
      {/* Sketchnote Hero Intro */}
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="sketchnote-title-box px-6 py-3 text-2xl sm:text-3xl max-w-xl">
          Appunti Visivi Didattici
        </div>
        <p className="max-w-xl text-sm sm:text-base text-zinc-600 font-sans leading-relaxed">
          Cerca una voce di Wikipedia o inserisci un testo già pronto: creeremo
          un <span className="highlighter-yellow">blueprint concettuale</span> e
          una vera{" "}
          <span className="highlighter-teal">sketchnote illustrata</span> a mano
          con l&apos;AI.
        </p>
      </div>

      <form onSubmit={searchPage} className="prova-form">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            name="search"
            placeholder="✎ Inserisci un argomento... (es. Alessandro Magno, Fotosintesi)"
            onChange={(e) => setText(e.target.value)}
            className="prova-input text-base"
          />
        </div>
        <button
          type="submit"
          className="prova-btn"
          id="search-btn"
          disabled={isSearching}
        >
          {isSearching ? "Cercando... ⌛" : "Cerca Argomento ➔"}
        </button>
        <SendTextButton />
      </form>

      {/* Separatore visivo Sketchnote */}
      <div className="relative flex items-center justify-center my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-zinc-200" />
        </div>
        <div className="relative bg-white px-3 text-xs font-sketch font-bold uppercase tracking-wider text-zinc-400">
          oppure carica un file
        </div>
      </div>

      {/* Form di Caricamento e Invio PDF */}
      <form
        onSubmit={handlePdfSubmit}
        className="w-full bg-white border-2 border-zinc-900 rounded-lg p-4 sm:p-5 shadow-[4px_4px_0px_#18181b] space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded border-2 border-zinc-900 bg-red-50 flex items-center justify-center shadow-[1px_1px_0px_#18181b] shrink-0">
              <FaFilePdf className="text-red-600 text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-sketch font-bold text-zinc-900 leading-tight">
                Genera Appunti da Documento PDF
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Allega un file PDF (slide, dispense o capitoli) per estrarre la mappa concettuale
              </p>
            </div>
          </div>
          <span className="sketch-badge-teal self-start sm:self-auto shrink-0">
            PDF Uploader
          </span>
        </div>

        {/* Area di Selezione File o Card di Anteprima */}
        {!pdf ? (
          <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-zinc-50/60 hover:bg-orange-50/20 rounded-md p-5 sm:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 group">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              name="file"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="w-11 h-11 rounded-full bg-white border-2 border-zinc-900 flex items-center justify-center shadow-[2px_2px_0px_#18181b] group-hover:scale-105 transition-transform">
              <FaUpload className="text-zinc-700 text-sm group-hover:text-orange-600 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-sm font-sketch font-bold text-zinc-800">
                Seleziona o trascina un file PDF
              </p>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Formati supportati: solo documenti .pdf
              </p>
            </div>
          </label>
        ) : (
          <div className="border-2 border-zinc-900 bg-orange-50/30 rounded-md p-3.5 flex items-center justify-between shadow-[2px_2px_0px_#ea580c] gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded border-2 border-zinc-900 bg-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#18181b]">
                <FaFilePdf className="text-red-600 text-xl" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-sketch font-bold text-zinc-900 truncate">
                  {pdf.name}
                </p>
                <p className="text-xs text-zinc-500 font-sans">
                  {(pdf.size / 1024 / 1024).toFixed(2)} MB • File PDF pronto per l&apos;invio
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemovePdf}
              className="sketch-btn-white text-xs py-1.5 px-3 shrink-0 text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
              title="Rimuovi questo file"
            >
              <FaTimes className="text-xs" />
              <span>Rimuovi</span>
            </button>
          </div>
        )}

        {/* Barra Azioni Form */}
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-zinc-400 font-sans hidden sm:block">
            {pdf ? "✓ File selezionato correttamente" : "Nessun file selezionato al momento"}
          </p>
          <button
            type="submit"
            disabled={!pdf}
            className="w-full sm:w-auto sketch-btn-teal text-sm py-2 px-5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Invia PDF per Analisi ➔</span>
          </button>
        </div>
      </form>

      {pagesResult.length > 0 && (
        <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-200 pb-2 mt-4">
          <span className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-500">
            Risultati Trovati ({pagesResult.length})
          </span>
          <span className="text-xs text-zinc-400">
            Seleziona una voce per aprirla ↳
          </span>
        </div>
      )}

      <div className="prova-results">
        {pagesResult.map((page) => (
          <PageCard
            key={page.id}
            title={page.title}
            pageKey={page.key}
            description={page.description}
          />
        ))}
      </div>
    </div>
  );
}
