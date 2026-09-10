import Link from "next/link";
import CreateConceptMapButton from "@/components/article/CreateConceptMapButton";

type ArticleParams = {
  params: Promise<{
    title: string;
  }>;
};

type WikipediaPage = {
  title: string;
  extract: string;
  missing?: string;
};

type WikipediaResponse = {
  query?: {
    pages: Record<string, WikipediaPage>;
  };
};

export default async function ArticlePage({ params }: ArticleParams) {
  const { title } = await params;
  const wikipediaKey = decodeURIComponent(title);

  const query = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "extracts",
    explaintext: "1",
    redirects: "1",
    titles: wikipediaKey,
  });

  const response = await fetch(
    `https://it.wikipedia.org/w/api.php?${query.toString()}`,
    {
      next: {
        revalidate: 3600,
      },
      headers: {
        "User-Agent":
          "WikiAnnotation/1.0 (https://github.com/WikiAnnotation; contact@wikiannotation.local)",
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Impossibile recuperare l’articolo da Wikipedia.");
  }

  const data = (await response.json()) as WikipediaResponse;
  const page = Object.values(data.query?.pages ?? {})[0];

  if (!page || page.missing !== undefined || !page.extract) {
    return (
      <main className="article-container">
        <div className="sketch-panel p-6 sm:p-8 border-red-500 shadow-[4px_4px_0px_#ef4444]">
          <h1 className="article-title text-red-600">
            Articolo non trovato
          </h1>
          <p className="article-content mt-2">
            Non è stato possibile recuperare il testo di questa voce da Wikipedia.
          </p>
          <div className="mt-4">
            <Link href="/" className="sketch-btn-white text-xs">
              ← Torna alla ricerca
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const canonicalTitle = page.title ?? wikipediaKey;
  const originalUrl = `https://it.wikipedia.org/wiki/${encodeURIComponent(
    canonicalTitle.replace(/\s+/g, "_"),
  )}`;

  return (
    <main className="article-container">
      {/* Top back navigation */}
      <div>
        <Link
          href="/"
          className="sketch-btn-white text-xs py-1 px-2.5 inline-flex items-center gap-1"
        >
          ← Torna alla ricerca
        </Link>
      </div>

      {/* Signature Sketchnote Title Box */}
      <div>
        <div className="sketchnote-title-box px-5 py-2.5 text-xl sm:text-2xl">
          {canonicalTitle}
        </div>
      </div>

      <article className="sketch-panel p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-200 pb-3">
          <span className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-500">
            Estratto didattico da Wikipedia
          </span>
          <span className="sketch-badge-ink">
            Testo di base
          </span>
        </div>

        <div className="max-h-[50vh] overflow-y-auto pr-3 rounded border-2 border-zinc-900 bg-white p-5 shadow-[2px_2px_0px_#18181b]">
          <p className="article-content" style={{ whiteSpace: "pre-line" }}>
            {page.extract}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t-2 border-dashed border-zinc-200 pt-4">
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-sketch font-bold text-teal-700 hover:text-teal-900 hover:underline inline-flex items-center gap-1"
          >
            ↳ Apri la fonte originale su Wikipedia ↗
          </a>

          <p className="text-xs text-zinc-400">
            Fonte: Wikipedia. Consulta sempre la voce originale per verificare informazioni, contesto e fonti.
          </p>
        </div>
      </article>

      <div className="flex justify-end">
        <CreateConceptMapButton pageKey={wikipediaKey} />
      </div>
    </main>
  );
}
