"use client";

import { useState } from "react";
import PageCard from "./layout/PageCard";
import SendTextButton from "./layout/SendTextButton";

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
