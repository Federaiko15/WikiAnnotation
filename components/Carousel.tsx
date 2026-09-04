"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

// 1. Importa le immagini dalla cartella assets
import alessandroMagno from "@/assets/alessandro-magno.png";
import divinaCommedia from "@/assets/appunti-visivi-divina-commedia.png";
import signoreDegliAnelli from "@/assets/appunti-visivi-il-signore-degli-anelli.png";
import ilReLeone from "@/assets/appunti-visivi-il-re-leone.png";
import pirandello from "@/assets/appunti-visivi-luigi-pirandello.png";
import secondaGuerraMondiale from "@/assets/seconda-guerra-mondiale.png";

type Slide = {
  image: StaticImageData;
  title: string;
  description: string;
};

// 2. Aggiungi o rimuovi le slide in questo array
const slides: Slide[] = [
  {
    image: alessandroMagno,
    title: "Alessandro Magno",
    description: "Mappa concettuale sulle conquiste e l'impero macedone.",
  },
  {
    image: divinaCommedia,
    title: "La Divina Commedia",
    description: "Struttura dei tre regni danteschi e viaggio allegorico.",
  },
  {
    image: signoreDegliAnelli,
    title: "Il Signore degli Anelli",
    description: "Temi, personaggi chiave e geografia della Terra di Mezzo.",
  },
  {
    image: ilReLeone,
    title: "Il Re Leone",
    description:
      "Archetipi narrativi, cerchio della vita e riferimenti shakespeareiani.",
  },
  {
    image: pirandello,
    title: "Luigi Pirandello",
    description: "Il relativismo, le maschere e la poetica dell'umorismo.",
  },
  {
    image: secondaGuerraMondiale,
    title: "Seconda Guerra Mondiale",
    description: "Cronologia essenziale, fronti principali ed esiti storici.",
  },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Auto-scrolling ogni 4 secondi (in pausa se hovered o se l'utente ha premuto Pausa)
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered]);

  const current = slides[currentIndex];

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8">
      {/* Intestazione sezione carousel */}
      <div className="mb-4 flex items-center justify-between border-b-2 border-dashed border-zinc-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="sketch-badge-orange">Galleria Esempi</span>
          <h2 className="font-sketch font-bold uppercase tracking-wider text-base sm:text-lg text-zinc-900">
            Esempi di Appunti Visivi Generati
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-xs font-sketch font-bold text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-1 cursor-pointer"
            title={isPlaying ? "Metti in pausa lo scorrimento automatico" : "Attiva lo scorrimento automatico"}
          >
            <span>{isPlaying ? "⏸ In pausa" : "▶ Riproduci"}</span>
          </button>
          <span className="text-xs font-sketch text-zinc-500">
            Slide {currentIndex + 1} di {slides.length}
          </span>
        </div>
      </div>

      {/* Riquadro del Carousel in stile Sketchnote con pausa all'hover */}
      <div
        className="sketch-panel relative overflow-hidden bg-white p-4 sm:p-6 shadow-[5px_5px_0px_#18181b]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Titolo e didascalia della slide corrente */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="sketchnote-title-box-sm px-3 py-1 text-sm sm:text-base inline-block">
              {current.title}
            </div>
            <p className="mt-1 text-xs text-zinc-600 font-sans">
              {current.description}
            </p>
          </div>

          {/* Pulsanti di navigazione Prec / Succ */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={prevSlide}
              className="sketch-btn-white text-xs px-3 py-1.5"
              aria-label="Slide precedente"
            >
              ← Prec
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="sketch-btn-orange text-xs px-3 py-1.5"
              aria-label="Slide successiva"
            >
              Succ →
            </button>
          </div>
        </div>

        {/* Visualizzatore immagine */}
        <div className="relative mx-auto flex w-full items-center justify-center rounded border-2 border-zinc-900 bg-zinc-50 p-2 sm:p-4 shadow-[3px_3px_0px_#18181b]">
          <Image
            src={current.image}
            alt={`Esempio appunti visivi: ${current.title}`}
            className="h-auto max-h-[60vh] w-auto rounded object-contain transition-opacity duration-300"
            priority={currentIndex === 0}
          />
        </div>

        {/* Indicatori a pallino / barretta in basso */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Vai alla slide ${index + 1}`}
              className={`h-3 rounded-full border-2 border-zinc-900 transition-all ${
                currentIndex === index
                  ? "w-8 bg-[#ea580c] shadow-[1px_1px_0px_#18181b]"
                  : "w-3 bg-white hover:bg-zinc-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
