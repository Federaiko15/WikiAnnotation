import { generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

import type {
  VisualNotesBlueprint,
  VisualNotesBlueprintCollection,
} from "../schemas/visualNotesBlueprintSchema";
import { createImageAgent } from "../agents/createImageAgents";
import type { ImageStyle } from "../agents/createImageAgents";

export type ImageAspectRatio = "3:4" | "1:1" | "9:16" | "16:9";

export type GenerateImageInput = {
  blueprint: VisualNotesBlueprint;
  outputLanguage: "it" | "en";
  aspectRatio: ImageAspectRatio;
  annotationStyle: ImageStyle;
};

export type GenerateImageOutput = {
  image: {
    base64: string;
    mediaType: string;
  };
  imageSize: string;
  finalPrompt: string;
};

export type GeneratedImageItem = {
  topic: string;
  blueprintTitle: string;
  image: {
    base64: string;
    mediaType: string;
  };
  imageSize: string;
  finalPrompt: string;
};

export type GenerateImagesInput = {
  blueprints: VisualNotesBlueprintCollection;
  outputLanguage: "it" | "en";
  aspectRatio: ImageAspectRatio;
  annotationStyle: ImageStyle;
};

export type GenerateImagesOutput = {
  images: GeneratedImageItem[];
};


export async function generateImageFromBlueprint({
  blueprint,
  outputLanguage,
  aspectRatio,
  annotationStyle,
}: GenerateImageInput): Promise<GenerateImageOutput> {
  const agent = createImageAgent(blueprint, outputLanguage, annotationStyle);

  const imageSizes: Record<ImageAspectRatio, `${number}x${number}`> = {
    "1:1": "1024x1024",
    "16:9": "1536x1024",
    "9:16": "1024x1536",
    "3:4": "1024x1360",
  };

  const imageSize = imageSizes[aspectRatio];

  const finalPrompt = [agent.system, "", agent.prompt].join("\n");

  const result = await generateImage({
    model: openai.image("gpt-image-2.5-flare"),
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

export async function generateImagesFromBlueprints({
  blueprints,
  outputLanguage,
  aspectRatio,
  annotationStyle,
}: GenerateImagesInput): Promise<GenerateImagesOutput> {
  const imagePromises = blueprints.blueprints.map(async (blueprint, index) => {
    console.log(
      `[generateImage] Inizio generazione immagine ${index + 1}/${blueprints.blueprints.length} per: "${blueprint.blueprintTitle || blueprint.topic}"`,
    );

    const result = await generateImageFromBlueprint({
      blueprint,
      outputLanguage,
      aspectRatio,
      annotationStyle,
    });

    return {
      topic: blueprint.topic,
      blueprintTitle: blueprint.blueprintTitle || `Parte ${index + 1}`,
      image: result.image,
      imageSize: result.imageSize,
      finalPrompt: result.finalPrompt,
    };
  });

  const images = await Promise.all(imagePromises);

  return { images };
}

