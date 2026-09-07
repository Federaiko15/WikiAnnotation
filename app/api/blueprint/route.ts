import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseWikipediaPage } from "@/lib/wikipedia/parseWikipediaPage";
import { generateBlueprint } from "@/lib/ai/services/generateBlueprint";
import { redis } from "@/lib/redis";
import { ParsedWikiPage } from "@/lib/wikipedia/types";

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
  textId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { language, pageKey, learningLevel, outputLanguage, textId } =
      requestSchema.parse(body);

    console.log(
      `[API /api/blueprint] Inizio richiesta per: ${pageKey} (${learningLevel}, ${outputLanguage})`,
    );
    console.log(
      `[API /api/blueprint] Inizio richiesta per: ${pageKey} | textId:`,
      textId,
    );
    let parsedPage: ParsedWikiPage;

    if (textId !== undefined) {
      // 1. Recupero del testo custom da Redis
      const customText = await redis.get<string>(textId);

      if (!customText) {
        return NextResponse.json(
          { error: "Il testo personalizzato non è stato trovato o è scaduto." },
          { status: 404 },
        );
      }

      // 2. Adattamento del testo nel formato che il generatore si aspetta
      parsedPage = {
        title: pageKey,
        sourceUrl: "Testo inserito dall'utente",
        sections: [
          {
            title: "Testo di riferimento",
            level: 1,
            content: [customText],
            text: customText,
          },
        ],
      };
    } else {
      parsedPage = await parseWikipediaPage(language, pageKey);
      console.log(
        `[API /api/blueprint] Pagina Wikipedia recuperata: "${parsedPage.title}" con ${parsedPage.sections.length} sezioni`,
      );
    }

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
          error:
            "Dati di richiesta non validi: " +
            error.issues.map((i) => i.message).join(", "),
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

    const status = message.includes("429") ? 429 : 500;

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      },
    );
  }
}
