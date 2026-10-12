import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";
import { generateFlashCards } from "@/lib/ai/services/generateFlashCards";

export async function POST(request: NextRequest) {
  const { id, textId, language } = await request.json();

  const blueprintsData = await redis.get<string>(id ?? "");
  const fullText = await redis.get<string>(textId ?? "");
  if (!blueprintsData || !fullText) {
    return NextResponse.json(
      { error: "Blueprint o testo non trovato o scaduto." },
      { status: 404 },
    );
  }

  const blueprints =
    typeof blueprintsData === "string"
      ? JSON.parse(blueprintsData)
      : blueprintsData;
  const outputLanguage: "it" | "en" = language === "en" ? "en" : "it";
  const flashcards = await generateFlashCards(fullText, outputLanguage, blueprints);
  if (!flashcards) {
    return NextResponse.json(
      { error: "Errore durante la generazione delle flashcards." },
      { status: 500 },
    );
  }

  return NextResponse.json({ flashcards });
}
