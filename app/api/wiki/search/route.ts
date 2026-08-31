import { NextResponse } from "next/server";

type WikiSearchResultItem = {
  pageid: number;
  title: string;
  snippet?: string;
};

type WikiActionSearchResponse = {
  query?: {
    search?: WikiSearchResultItem[];
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const limit = searchParams.get("limit") ?? "5";

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 },
    );
  }

  try {
    const params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: q,
      srlimit: limit,
      format: "json",
      utf8: "1",
    });

    const response = await fetch(
      `https://it.wikipedia.org/w/api.php?${params.toString()}`,
      {
        headers: {
          "User-Agent":
            "WikiAnnotation/1.0 (https://github.com/WikiAnnotation; contact@wikiannotation.local)",
          Accept: "application/json",
        },
        next: {
          revalidate: 1800,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Errore nella risposta di Wikipedia" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as WikiActionSearchResponse;
    const searchItems = data.query?.search ?? [];

    const pages = searchItems.map((item) => {
      const cleanSnippet = item.snippet
        ? item.snippet.replace(/<[^>]+>/g, "").trim()
        : "";

      return {
        id: item.pageid,
        key: item.title.replace(/\s+/g, "_"),
        title: item.title,
        description: cleanSnippet,
        excerpt: cleanSnippet,
      };
    });

    return NextResponse.json({ pages });
  } catch {
    return NextResponse.json(
      { error: "Errore durante la ricerca" },
      { status: 500 },
    );
  }
}
