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
        <div className="article-card">
          <h1 className="article-title text-red-600 dark:text-red-400">
            Articolo non trovato
          </h1>
          <p className="article-content">
            Non è stato possibile recuperare il testo di questa voce.
          </p>
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
      <article className="article-card">
        <h1 className="article-title">{canonicalTitle}</h1>

        <div className="max-h-[50vh] overflow-y-auto pr-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-950/40">
          <p className="article-content" style={{ whiteSpace: "pre-line" }}>
            {page.extract}
          </p>
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800">
          <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Apri la fonte originale su Wikipedia →
          </a>

          <p className="text-xs text-gray-400 dark:text-neutral-500">
            Fonte: Wikipedia. Consulta sempre la voce originale per verificare
            informazioni, contesto e fonti.
          </p>
        </div>
      </article>

      <div className="flex justify-end">
        <CreateConceptMapButton pageKey={wikipediaKey} />
      </div>
    </main>
  );
}
