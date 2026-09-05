import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { generateImageFromBlueprint } from "@/lib/ai/services/generateImage";
import { visualNotesBlueprintSchema } from "@/lib/ai/schemas/visualNotesBlueprintSchema";

const requestSchema = z.object({
  blueprint: visualNotesBlueprintSchema,
  outputLanguage: z.enum(["it", "en"]).default("it"),
  aspectRatio: z.enum(["3:4", "1:1", "9:16", "16:9"]).default("3:4").optional(),
  annotationStyle: z
    .union([z.literal(0), z.literal(1), z.literal(2)])
    .default(0),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blueprint, outputLanguage, aspectRatio, annotationStyle } =
      requestSchema.parse(body);

    console.log(
      `[API /api/image] Inizio generazione immagine con l'AI per "${blueprint.topic}" (${aspectRatio ?? "3:4"}, ${outputLanguage})...`,
    );

    const result = await generateImageFromBlueprint({
      blueprint,
      outputLanguage,
      aspectRatio,
      annotationStyle,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      `[API /api/image] Errore durante la generazione dell'immagine: ${error}`,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error:
            "Dati di richiesta non validi: " +
            error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error && error.message
        ? error.message
        : "Errore durante la generazione dell'immagine";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
