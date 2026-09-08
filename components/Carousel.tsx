"use client";

import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

// 1. Importa le immagini dalla cartella assets
import alessandroMagno from "@/assets/alessandro-magno.png";
import vulcano from "@/assets/appunti-visivi-vulcano.png";
import divinaCommedia from "@/assets/appunti-visivi-divina-commedia.png";
import signoreDegliAnelli from "@/assets/appunti-visivi-il-signore-degli-anelli.png";
import fotosintesi1 from "@/assets/appunti-visivi-fotosintesi-clorofilliana.png";
import ilReLeone from "@/assets/appunti-visivi-il-re-leone.png";
import gwt from "@/assets/appunti-visivi-gwt.png";
import pirandello from "@/assets/appunti-visivi-luigi-pirandello.png";
import fotosintesi2 from "@/assets/appunti-visivi-fotosintesi-clorofilliana(1).png";
import secondaGuerraMondiale from "@/assets/seconda-guerra-mondiale.png";
import starwars from "@/assets/appunti-visivi-star-wars-episodio-iii-la-vendetta-dei-sith.png";
import laGuerraDiTroia from "@/assets/appunti-visivi-guerra-di-troia.png";
import dna from "@/assets/appunti-visivi-dna.png";

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
    image: vulcano,
    title: "I Vulcani",
    description: "Struttura e composizione dei vulcani",
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
    image: fotosintesi1,
    title: "Fotosintesi Clorofiliana 1",
    description: "Descrizione del processo di fotosintesi clorofiliana",
  },
  {
    image: ilReLeone,
    title: "Il Re Leone",
    description:
      "Archetipi narrativi, cerchio della vita e riferimenti shakespeareiani.",
  },
  {
    image: gwt,
    title: "GWT",
    description: "Spiegazione della teoria - Global Neural Workspace Theort-",
  },
  {
    image: pirandello,
    title: "Luigi Pirandello",
    description: "Il relativismo, le maschere e la poetica dell'umorismo.",
  },
  {
    image: fotosintesi2,
    title: "Fotosintesi Clorofiliana (Schema ad Albero)",
    description: "Descrizione del processo di fotosintesi clorofiliana",
  },
  {
    image: secondaGuerraMondiale,
    title: "Seconda Guerra Mondiale",
    description: "Cronologia essenziale, fronti principali ed esiti storici.",
  },
  {
    image: starwars,
    title: "Star Wars - La vendetta dei Sith",
    description:
      "Trama, personaggi principali e temi dell'ultimo film della trilogia prequel di Star Wars.",
  },
  {
    image: laGuerraDiTroia,
    title: "La Guerra di Troia",
    description: "Protagonisti e linea temporale della famosa Guerra di Troia",
  },
  {
    image: dna,
    title: "DNA",
    description:
      "Descrizione della struttura, delle funzioni e delle dinamiche del DNA",
  },
];
type CarouselProps = {
  className?: string;
};

export default function Carousel({ className }: CarouselProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Auto-scrolling ogni 2.5 secondi (in pausa se hovered, se in zoom o se l'utente ha premuto Pausa)
  useEffect(() => {
    if (!isPlaying || isHovered || isZoomed) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2500);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, isZoomed]);

  // Chiusura modal zoom con tasto Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    if (isZoomed) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const current = slides[currentIndex];

  return (
    <section className={className ?? "mx-auto w-full max-w-4xl px-4 py-8"}>
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
            title={
              isPlaying
                ? "Metti in pausa lo scorrimento automatico"
                : "Attiva lo scorrimento automatico"
            }
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
        {/* Titolo e didascalia della slide corrente con altezza minima fissa */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-h-[56px]">
          <div>
            <div className="sketchnote-title-box-sm px-3 py-1 text-sm sm:text-base inline-block">
              {current.title}
            </div>
            <p className="mt-1 text-xs text-zinc-600 font-sans line-clamp-2">
              {current.description}
            </p>
          </div>

          {/* Pulsanti di navigazione Prec / Succ */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
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

        {/* Visualizzatore immagine ad ALTEZZA GENEROSA e FISSA:
            Garantisce che il testo nelle pagine verticali sia grande e leggibile
            e che l'altezza non collassi mai quando compaiono immagini orizzontali */}
        <div className="relative mx-auto flex h-[480px] sm:h-[600px] md:h-[680px] lg:h-[750px] xl:h-[820px] w-full items-center justify-center rounded border-2 border-zinc-900 bg-zinc-50 p-2 sm:p-4 shadow-[3px_3px_0px_#18181b] overflow-hidden group">
          <Image
            src={current.image}
            alt={`Esempio appunti visivi: ${current.title}`}
            className="max-h-full max-w-full h-auto w-auto rounded object-contain transition-opacity duration-300 select-none cursor-pointer"
            priority={currentIndex === 0}
            onClick={() => setIsZoomed(true)}
          />

          {/* Pulsante Ingrandisci per leggere tutti i dettagli a pieno schermo */}
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-zinc-900 border-2 border-zinc-900 rounded px-2.5 py-1 text-xs font-sketch font-bold uppercase shadow-[2px_2px_0px_#18181b] opacity-80 hover:opacity-100 transition-all cursor-pointer flex items-center gap-1.5"
            title="Ingrandisci a tutto schermo per leggere i dettagli"
          >
            <span>🔍 Ingrandisci</span>
          </button>
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

      {/* Modal Lightbox a tutto schermo per visualizzare e leggere l'immagine nei minimi dettagli */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] flex flex-col items-center bg-white p-3 sm:p-5 rounded-lg border-3 border-zinc-900 shadow-[8px_8px_0px_#ea580c]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between mb-3 pb-2 border-b-2 border-dashed border-zinc-300">
              <div className="flex items-center gap-2">
                <span className="sketch-badge-orange text-xs">Dettaglio</span>
                <span className="font-sketch font-bold text-base sm:text-lg text-zinc-900">
                  {current.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="text-xs font-sketch font-bold px-3 py-1 bg-zinc-100 hover:bg-zinc-200 border-2 border-zinc-900 rounded cursor-pointer shadow-[2px_2px_0px_#18181b]"
              >
                ✕ Chiudi (Esc)
              </button>
            </div>
            <div className="relative flex items-center justify-center overflow-auto max-h-[82vh]">
              <Image
                src={current.image}
                alt={current.title}
                className="max-h-[80vh] w-auto h-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
