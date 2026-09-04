import { generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

import type { VisualNotesBlueprint } from "../schemas/visualNotesBlueprintSchema";
import { createImageAgent } from "../agents/createImageAgents";

export type ImageAspectRatio = "3:4" | "1:1" | "9:16" | "16:9";

export type GenerateImageInput = {
  blueprint: VisualNotesBlueprint;
  outputLanguage: "it" | "en";
  aspectRatio?: ImageAspectRatio;
};

export type GenerateImageOutput = {
  image: {
    base64: string;
    mediaType: string;
  };
  imageSize: string;
  finalPrompt: string;
};

export async function generateImageFromBlueprint({
  blueprint,
  outputLanguage,
  aspectRatio = "3:4",
}: GenerateImageInput): Promise<GenerateImageOutput> {
  const agent = createImageAgent(blueprint, outputLanguage);

  const imageSize =
    aspectRatio === "1:1"
      ? "1024x1024"
      : aspectRatio === "16:9"
        ? "1536x1024"
        : "1024x1536";

  const finalPrompt = [agent.system, "", agent.prompt].join("\n");

  const result = await generateImage({
    model: openai.image("gpt-image-2"),
    prompt: finalPrompt,
    size: imageSize,
    n: 1,
    providerOptions: {
      openai: {
        quality: "medium",
        output_format: "png",
      },
    },
  });

  return {
    image: {
      base64: result.image.base64,
      mediaType: result.image.mediaType || "image/png",
    },
    imageSize,
    finalPrompt,
  };
}
