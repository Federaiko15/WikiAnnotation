import Link from "next/link";

export default function Header() {
  return (
    <header className="header-container">
      <div className="header-wrapper">
        <Link href="/" className="inline-block transition-transform hover:-translate-y-0.5 active:translate-y-0">
          <div className="sketchnote-title-box-sm px-3 py-1 text-base sm:text-lg">
            WikiAnnotation
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="sketch-badge-orange hidden sm:inline-flex">
            ✦ AI Sketchnote
          </span>
          <span className="text-xs font-sketch uppercase tracking-wider text-zinc-500">
            Appunti Visivi Didattici
          </span>
        </div>
      </div>
    </header>
  );
}
