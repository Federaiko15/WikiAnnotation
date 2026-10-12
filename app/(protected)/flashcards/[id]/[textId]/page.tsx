import FlashCards from "@/components/profile/FlashCards";
import { generateFlashCards } from "@/lib/ai/services/generateFlashCards";
import { redis } from "@/lib/redis";
import type { VisualNotesBlueprintCollection } from "@/lib/ai/schemas/visualNotesBlueprintSchema";
import type { visualFlashCardsSchema } from "@/lib/ai/schemas/visualFlashCardsSchema";
import type { z } from "zod";
import Link from "next/link";

export default async function FlashcardsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id?: string; textId?: string }>;
  searchParams: Promise<{ language?: string; outputLanguage?: string }>;
}) {
  const { id, textId } = await params;
  const resolvedSearchParams = await searchParams;
  const langParam =
    resolvedSearchParams.outputLanguage || resolvedSearchParams.language;
  const outputLanguage: "it" | "en" = langParam === "en" ? "en" : "it";

  if (!id || !textId || textId === "undefined") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Flashcards</h1>
        <p className="text-lg text-gray-600 mb-4">
          ID blueprint o ID testo mancante. Impossibile generare le flashcards.
        </p>
        <Link href="/" className="sketch-btn-white text-xs">
          ← Torna alla home
        </Link>
      </div>
    );
  }

  // Recupera direttamente da Redis senza passare da HTTP
  const [blueprintsData, fullText] = await Promise.all([
    redis.get<string | VisualNotesBlueprintCollection>(id),
    redis.get<string>(textId),
  ]);

  if (!blueprintsData || !fullText) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Flashcards</h1>
        <p className="text-lg text-gray-600 mb-4">
          Blueprint o testo non trovato o sessione scaduta.
        </p>
        <Link href="/" className="sketch-btn-white text-xs">
          ← Torna alla home
        </Link>
      </div>
    );
  }

  const blueprints: VisualNotesBlueprintCollection =
    typeof blueprintsData === "string"
      ? JSON.parse(blueprintsData)
      : blueprintsData;

  let flashCards: z.infer<typeof visualFlashCardsSchema> | null = null;
  try {
    flashCards = await generateFlashCards(fullText, outputLanguage, blueprints);
  } catch (error) {
    console.error("Errore durante la generazione delle flashcards:", error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        <Link href="/" className="sketch-btn-white text-xs py-1.5 px-3">
          ← Torna alla home
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6 font-sketch text-zinc-900">
        Flashcards Didattiche
      </h1>
      {flashCards &&
      flashCards.flashCards &&
      flashCards.flashCards.length > 0 ? (
        <FlashCards
          flashCards={flashCards.flashCards}
          topic={flashCards.topic}
          flashCardTitle={flashCards.flashCardTitle}
        />
      ) : (
        <p className="text-lg text-gray-600">
          Nessuna flashcard disponibile per il blueprint e il testo specificati.
        </p>
      )}
    </div>
  );
}
