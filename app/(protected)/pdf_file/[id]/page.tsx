import Link from "next/link";
import { redis } from "@/lib/redis";

export default async function PdfPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string }>;
}) {
  const { id } = await params;
  const { title } = await searchParams;

  const text = await redis.get<string>(id);

  if (!text) {
    return (
      <main className="article-container">
        <div className="sketch-panel p-6 sm:p-8 border-red-500 shadow-[4px_4px_0px_#ef4444]">
          <h1 className="article-title text-red-600">Documento non trovato</h1>
          <p className="article-content mt-2">
            Il testo estratto dal PDF non è presente o la sessione è scaduta (i
            file temporanei scadono dopo 10 minuti).
          </p>
          <div className="mt-4">
            <Link href="/" className="sketch-btn-white text-xs">
              ← Torna alla home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayTitle = title ? decodeURIComponent(title) : "Documento PDF";

  return (
    <main className="article-container">
      {/* Top back navigation */}
      <div>
        <Link
          href="/"
          className="sketch-btn-white text-xs py-1 px-2.5 inline-flex items-center gap-1"
        >
          ← Torna alla home
        </Link>
      </div>

      {/* Signature Sketchnote Title Box */}
      <div>
        <div className="sketchnote-title-box px-5 py-2.5 text-xl sm:text-2xl">
          {displayTitle}
        </div>
      </div>

      <article className="sketch-panel p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-200 pb-3">
          <span className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-500">
            Estratto da file PDF
          </span>
          <span className="sketch-badge-ink">Testo di base</span>
        </div>

        <div className="max-h-[50vh] overflow-y-auto pr-3 rounded border-2 border-zinc-900 bg-white p-5 shadow-[2px_2px_0px_#18181b]">
          <p className="article-content" style={{ whiteSpace: "pre-line" }}>
            {text}
          </p>
        </div>
      </article>

      <div className="flex justify-end">
        <Link
          href={`/article_text/${encodeURIComponent(displayTitle)}/concept-map?source=custom&id=${encodeURIComponent(id)}`}
          className="sketch-btn-teal text-base px-6 py-3.5"
        >
          <span>✎</span> Crea Mappa Concettuale ➔
        </Link>
      </div>
    </main>
  );
}

