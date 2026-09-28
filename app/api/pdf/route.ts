import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { uploadRequestSchema } from "@/lib/schemas";
import { parsePdfBuffer } from "@/lib/pdf/pdf-parser";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = uploadRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { pdfBase64: pdfBuffer, fileName } = validation.data;
    console.log(
      `File correttamente mandato di dimensione in byte: ${pdfBuffer.length}`,
    );

    const parsedData = await parsePdfBuffer(pdfBuffer);
    if (!parsedData.text || parsedData.text.length === 0) {
      return NextResponse.json(
        {
          error:
            "Il PDF è stato letto ma non contiene testo estraibile (potrebbe essere una scansione)",
        },
        { status: 422 },
      );
    }

    const extractedText = parsedData.text;
    const randomId = crypto.randomUUID();
    await redis.set(randomId, extractedText, { ex: 600 });

    const rawFileName = fileName || "Documento PDF";
    const title = rawFileName
      .replace(/\.pdf$/i, "")
      .replace(/[-_]/g, " ")
      .trim();

    return NextResponse.json({
      success: true,
      size: pdfBuffer.length,
      randomId,
      title,
    });
  } catch (error) {
    console.error("Errore elaborazione PDF:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Errore durante l'elaborazione del file PDF",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        success: false,
        error: "Id del testo non trovato nei parametri",
        status: 404,
      });
    }

    const text = await redis.get<string>(id);
    if (!text) {
      return NextResponse.json({
        success: false,
        error: "Testo non trovato dall'id passato come parametro",
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      text: text,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Errore durante l'esecuzione della chiamata GET: " + error,
      status: 500,
    });
  }
}
