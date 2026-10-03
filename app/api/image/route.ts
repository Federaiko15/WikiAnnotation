import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { generateImagesFromBlueprints } from "@/lib/ai/services/generateImage";
import {
  singleVisualNotesBlueprintSchema,
  visualNotesBlueprintCollectionSchema,
} from "@/lib/ai/schemas/visualNotesBlueprintSchema";

export const maxDuration = 120;

const requestSchema = z
  .object({
    blueprints: visualNotesBlueprintCollectionSchema.optional(),
    blueprint: singleVisualNotesBlueprintSchema.optional(),
    outputLanguage: z.enum(["it", "en"]).default("it"),
    aspectRatio: z.enum(["3:4", "1:1", "9:16", "16:9"]).default("3:4"),
    annotationStyle: z
      .union([z.literal(0), z.literal(1), z.literal(2)])
      .default(0),
  })
  .refine((data) => data.blueprints !== undefined || data.blueprint !== undefined, {
    message: "Fornire 'blueprints' o 'blueprint'.",
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      blueprints,
      blueprint,
      outputLanguage,
      aspectRatio,
      annotationStyle,
    } = requestSchema.parse(body);

    const collection = blueprints ?? {
      topic: blueprint?.topic ?? "",
      blueprints: blueprint ? [blueprint] : [],
    };

    const count = collection.blueprints.length;
    console.log(
      `[API /api/image] Inizio generazione di ${count} immagine/i per "${collection.topic || collection.blueprints[0]?.topic || ""}" (${aspectRatio}, ${outputLanguage})...`,
    );

    const result = await generateImagesFromBlueprints({
      blueprints: collection,
      outputLanguage,
      aspectRatio,
      annotationStyle,
    });

    console.log(
      `[API /api/image] Generate con successo ${result.images.length} immagine/i!`,
    );

    const firstImage = result.images[0];

    return NextResponse.json({
      images: result.images,
      // Retrocompatibilità per consumer legacy
      image: firstImage?.image,
      imageSize: firstImage?.imageSize,
      finalPrompt: firstImage?.finalPrompt,
    });
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
