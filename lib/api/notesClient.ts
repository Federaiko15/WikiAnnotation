import type { VisualNotesBlueprint } from "@/lib/ai/schemas/visualNotesBlueprintSchema";
import type { LearningLevel } from "@/lib/ai/agents/createBlueprintAgents";
import type { ImageAspectRatio } from "@/lib/ai/services/generateImage";
import type { ImageStyle } from "@/lib/ai/agents/createImageAgents";

export type OutputLanguage = "it" | "en";

export type BlueprintApiParams = {
  pageKey: string;
  learningLevel: LearningLevel;
  outputLanguage: OutputLanguage;
  language?: "it" | "en";
  textId?: string;
};

export type BlueprintApiResponse = {
  source: {
    title: string;
    url: string;
  };
  blueprint: VisualNotesBlueprint;
};

export type ImageApiParams = {
  blueprint: VisualNotesBlueprint;
  outputLanguage: OutputLanguage;
  aspectRatio?: ImageAspectRatio;
  annotationStyle: ImageStyle;
};

export type ImageApiResponse = {
  image: {
    base64: string;
    mediaType: string;
  };
  imageSize: string;
  finalPrompt: string;
};

export async function fetchBlueprint(
  params: BlueprintApiParams,
): Promise<BlueprintApiResponse> {
  const response = await fetch("/api/blueprint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language: params.language ?? "it",
      pageKey: params.pageKey,
      learningLevel: params.learningLevel,
      outputLanguage: params.outputLanguage,
      textId: params.textId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Impossibile generare il blueprint per la voce richiesta.",
    );
  }

  return data as BlueprintApiResponse;
}

export async function fetchGeneratedImage(
  params: ImageApiParams,
): Promise<ImageApiResponse> {
  const response = await fetch("/api/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      blueprint: params.blueprint,
      outputLanguage: params.outputLanguage,
      aspectRatio: params.aspectRatio ?? "3:4",
      annotationStyle: params.annotationStyle,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Impossibile generare l'immagine della mappa concettuale.",
    );
  }

  return data as ImageApiResponse;
}

export async function saveUserText(userText: string): Promise<string> {
  const response = await fetch("/api/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: userText }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Errore nel salvataggio del testo.");
  }

  return data.id;
}

export async function getUserText(id: string): Promise<string | null> {
  const response = await fetch(`/api/text?id=${encodeURIComponent(id)}`);
  if (!response.ok) return null;
  const data = await response.json();
  return data.text ?? null;
}
