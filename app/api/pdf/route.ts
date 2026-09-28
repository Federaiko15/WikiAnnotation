import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { uploadRequestSchema } from "@/lib/schemas";
import { parsePdfBuffer } from "@/lib/pdf/pdf-parser";

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

    const { pdfBase64: pdfBuffer } = validation.data;
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
    return NextResponse.json({
      success: true,
      data: {
        size: pdfBuffer.length,
        extractedText: parsedData.text,
        rowsCount: Object.keys(parsedData.rows).length,
      },
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
