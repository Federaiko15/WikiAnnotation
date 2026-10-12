import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";

import { createFlashCardsAgent } from "../agents/createFlashCardAgents";
import { VisualNotesBlueprintCollection } from "../schemas/visualNotesBlueprintSchema";
import { visualFlashCardsSchema } from "../schemas/visualFlashCardsSchema";

export async function generateFlashCards(
  fullText: string,
  outputLanguage: "it" | "en",
  blueprint: VisualNotesBlueprintCollection,
) {
  const agent = createFlashCardsAgent({ fullText, outputLanguage, blueprint });
  const result = await generateText({
    model: openai("gpt-5-mini"),
    system: agent.system,
    prompt: agent.prompt,
    output: Output.object({ schema: visualFlashCardsSchema }),
  });
  return result.output;
}
