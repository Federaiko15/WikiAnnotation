"use client";

import { useState } from "react";
import PageCard from "./layout/PageCard";

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
    setIsSearching(true);

    const formData = new FormData(e.currentTarget);
    const rawSearch = String(formData.get("search") ?? "").trim();

    if (!rawSearch) {
      alert("Inserisci un argomento da cercare.");
      setIsSearching(false);
      return;
    }

    try {
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
  };
  return (
    <div className="prova-container">
      <form onSubmit={searchPage} className="prova-form">
        <input
          type="text"
          value={text}
          name="search"
          placeholder="Es. Alessandro Magno"
          onChange={(e) => setText(e.target.value)}
          className="prova-input"
        />
        <button type="submit" className="prova-btn" disabled={isSearching}>
          {isSearching ? "Cercando..." : "Cerca"}
        </button>
      </form>
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
