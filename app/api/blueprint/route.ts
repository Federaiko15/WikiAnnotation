import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseWikipediaPage } from "@/lib/wikipedia/parseWikipediaPage";
import { generateBlueprint } from "@/lib/ai/services/generateBlueprint";

const requestSchema = z.object({
  language: z.enum(["it", "en"]),

  pageKey: z.string().trim().min(1).max(300),

  learningLevel: z.enum([
    "primary",
    "middle-school",
    "high-school",
    "university",
    "general",
  ]),

  outputLanguage: z.enum(["it", "en"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { language, pageKey, learningLevel, outputLanguage } =
      requestSchema.parse(body);

    console.log(
      `[API /api/blueprint] Inizio richiesta per: ${pageKey} (${learningLevel}, ${outputLanguage})`,
    );

    const parsedPage = await parseWikipediaPage(language, pageKey);
    console.log(
      `[API /api/blueprint] Pagina Wikipedia recuperata: "${parsedPage.title}" con ${parsedPage.sections.length} sezioni`,
    );

    if (parsedPage.sections.length === 0) {
      return NextResponse.json(
        {
          error:
            "La voce non contiene abbastanza testo didattico da elaborare.",
        },
        {
          status: 422,
        },
      );
    }

    console.log(
      `[API /api/blueprint] Inizio generazione con l'AI (questo passaggio può richiedere fino a un minuto)...`,
    );

    const blueprint = await generateBlueprint({
      page: parsedPage,
      learningLevel,
      outputLanguage,
    });

    console.log(
      `[API /api/blueprint] Blueprint generato con successo per: ${blueprint.topic}`,
    );

    return NextResponse.json({
      source: {
        title: parsedPage.title,
        url: parsedPage.sourceUrl,
      },
      blueprint,
    });
  } catch (error) {
    console.error("Errore Blueprint Agent:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dati di richiesta non validi: " + error.issues.map((i) => i.message).join(", "),
        },
        {
          status: 400,
        },
      );
    }

    const message =
      error instanceof Error && error.message
        ? error.message
        : "Non è stato possibile creare il blueprint degli appunti.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
