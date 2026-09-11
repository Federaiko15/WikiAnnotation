import AuthForm from "@/components/auth/AuthForm";
import Carousel from "@/components/Carousel";

export default function Auth() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:py-10 lg:px-8 xl:px-12 bg-zinc-50/50">
      <div className="w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14 xl:gap-16">
        {/* Colonna Sinistra: Form di Registrazione (più largo) */}
        <div className="w-full max-w-lg xl:max-w-xl shrink-0 bg-white border-2 border-zinc-900 shadow-[6px_6px_0px_#ea580c] p-6 sm:p-8 xl:p-9 rounded-lg">
          <div className="text-center mb-6">
            <div className="sketchnote-title-box inline-block px-4 py-1.5 text-lg sm:text-xl mb-3">
              WikiAnnotation
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="sketch-badge-orange text-xs">
                ✦ AI Sketchnote
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sketch text-zinc-900 mt-2">
              Crea il tuo Account o accedi se già ne hai uno!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1.5 max-w-md mx-auto">
              Crea sketchnote visivi con l&apos;IA su articoli presi da
              Wikipedia o testo personalizzato.
            </p>
          </div>
          <AuthForm />
        </div>

        {/* Colonna Destra: Carousel di anteprime (dimensione intermedia bilanciata) */}
        <div className="w-full flex-1 min-w-0 max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
          <Carousel className="w-full" compact />
        </div>
      </div>
    </main>
  );
}
