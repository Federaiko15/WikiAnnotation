import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";
import Carousel from "@/components/Carousel";

export default function Auth() {
  return (
    <main className="min-h-screen flex items-center p-4 sm:p-6 lg:py-10 lg:px-8 xl:px-14 bg-zinc-50/50">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center lg:items-center justify-start gap-8 lg:gap-12 xl:gap-16">
        {/* Colonna Sinistra: Form di Registrazione (ancorato a sinistra e larghezza fissa) */}
        <div className="w-full max-w-md shrink-0 bg-white border-2 border-zinc-900 shadow-[6px_6px_0px_#ea580c] p-6 sm:p-8 rounded-lg">
          <div className="text-center mb-6">
            <Link
              href="/"
              className="inline-block mb-3 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="sketchnote-title-box px-4 py-1.5 text-lg sm:text-xl">
                WikiAnnotation
              </div>
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="sketch-badge-orange text-xs">
                ✦ AI Sketchnote
              </span>
            </div>
            <h1 className="text-2xl font-bold font-sketch text-zinc-900 mt-2">
              Crea il tuo Account
            </h1>
            <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
              Crea sketchnote visivi con l&apos;IA su articoli presi da
              Wikipedia o testo personalizzato.
            </p>
          </div>

          <AuthForm />

          <div className="mt-6 text-center text-xs text-zinc-500 font-sans">
            Hai già un account o vuoi esplorare?{" "}
            <Link
              href="/"
              className="text-orange-600 font-semibold hover:underline"
            >
              Torna alla Home
            </Link>
          </div>
        </div>

        {/* Colonna Destra: Carousel di anteprime (ampio e con altezza generosa) */}
        <div className="w-full flex-1 min-w-0 max-w-4xl xl:max-w-5xl">
          <Carousel className="w-full" />
        </div>
      </div>
    </main>
  );
}



