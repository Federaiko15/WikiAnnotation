import type { Metadata } from "next";
import Link from "next/link";
import VisualNotesStudio from "@/components/notes/VisualNotesStudio";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ title: string }>;
}): Promise<Metadata> {
  const { title } = await params;
  const displayTitle = decodeURIComponent(title).replace(/_/g, " ");

  return {
    title: `Mappa Concettuale: ${displayTitle} | WikiAnnotation`,
    description: `Genera appunti visivi, sketchnote e mappa concettuale basata sulla voce Wikipedia "${displayTitle}" tramite intelligenza artificiale.`,
  };
}

export default async function ConceptMapPage({
  params,
  searchParams,
}: {
  params: Promise<{ title: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const { title } = await params;
  const { source } = await searchParams;
  const pageKey = decodeURIComponent(title);
  const displayTitle = pageKey.replace(/_/g, " ");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      {/* Breadcrumb & Navigation Header */}
      <div className="sketch-panel p-6 sm:p-8 flex flex-col gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sketch font-bold tracking-wider text-zinc-500"
        >
          <Link href="/" className="hover:text-orange-600 transition-colors">
            HOME
          </Link>
          <span className="text-zinc-400">➔</span>
          <Link
            href={`/article/${encodeURIComponent(pageKey)}`}
            className="hover:text-orange-600 transition-colors truncate max-w-[200px]"
          >
            {displayTitle.toUpperCase()}
          </Link>
          <span className="text-zinc-400">➔</span>
          <span className="text-zinc-900">MAPPA CONCETTUALE</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-zinc-200 pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="sketch-badge-teal">✎ Visual Notes Studio</span>
              <span className="sketch-badge-orange">✦ AI Sketchnote</span>
            </div>

            <div className="mt-1">
              <h1 className="sketchnote-title-box px-4 py-1.5 text-xl sm:text-2xl">
                Appunti Visivi: {displayTitle}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-sans max-w-2xl leading-relaxed">
              Generazione in due passaggi: prima la struttura concettuale
              (blueprint modulare), poi l&apos;infografica illustrata a mano
              come un disegno su foglio bianco.
            </p>
          </div>

          <div>
            <Link
              href={`/article/${encodeURIComponent(pageKey)}`}
              className="sketch-btn-white text-xs py-2 px-3.5"
            >
              ← Torna al testo della voce
            </Link>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio */}
      <VisualNotesStudio pageKey={pageKey} articleTitle={displayTitle} />
    </main>
  );
}
