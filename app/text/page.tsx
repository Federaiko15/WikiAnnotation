import type { Metadata } from "next";
import Link from "next/link";
import SendTextPage from "@/components/SendTextPage";

export const metadata: Metadata = {
  title: "Crea Sketchnote da Testo Personalizzato | WikiAnnotation",
  description:
    "Incolla un testo, appunti o riassunti didattici personalizzati per generare una mappa concettuale e una sketchnote illustrata con l'intelligenza artificiale.",
};

export default function TextPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      {/* Header Panel with Breadcrumbs & Title */}
      <div className="sketch-panel p-6 sm:p-8 flex flex-col gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sketch font-bold tracking-wider text-zinc-500"
        >
          <Link href="/" className="hover:text-orange-600 transition-colors">
            HOME
          </Link>
          <span className="text-zinc-400">➔</span>
          <span className="text-zinc-900">INSERISCI TESTO</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-zinc-200 pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="sketch-badge-orange">✦ Testo Personalizzato</span>
              <span className="sketch-badge-teal">✎ Sketchnote Studio</span>
            </div>

            <div className="mt-1">
              <h1 className="sketchnote-title-box px-4 py-1.5 text-xl sm:text-2xl">
                Crea Mappa da un Tuo Testo
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-sans max-w-2xl leading-relaxed">
              Incolla i tuoi appunti, un riassunto di lezione o qualsiasi testo didattico
              (fino a 3.000 caratteri). L&apos;AI analizzerà i concetti chiave e genererà una{" "}
              <span className="highlighter-yellow">mappa concettuale visiva</span> illustrata a mano.
            </p>
          </div>

          <div>
            <Link
              href="/"
              className="sketch-btn-white text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
            >
              ← Torna alla ricerca
            </Link>
          </div>
        </div>
      </div>

      {/* Main Interactive Form Component */}
      <SendTextPage />
    </main>
  );
}

