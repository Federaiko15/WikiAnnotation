import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Testo non valido." }, { status: 400 });
    }

    const id = crypto.randomUUID();

    await redis.set(id, text, { ex: 600 });
    return NextResponse.json({ id });
  } catch (error) {
    console.error("Errore salvataggio Redis:", error);
    return NextResponse.json(
      { error: "Errore nel salvataggio del testo." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID mancante." }, { status: 400 });
    }
    const text = await redis.get<string>(id);

    if (!text) {
      return NextResponse.json(
        { error: "Testo non trovato o scaduto." },
        { status: 404 },
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Errore recupero Redis:", error);
    return NextResponse.json(
      { error: "Errore nel recupero del testo." },
      { status: 500 },
    );
  }
}
