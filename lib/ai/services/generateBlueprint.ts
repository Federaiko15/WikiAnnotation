import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";

import { createBlueprintAgents } from "../agents/createBlueprintAgents";
import {
  visualNotesBlueprintSchema,
  type VisualNotesBlueprint,
} from "../schemas/visualNotesBlueprintSchema";

import type { ParsedWikiPage } from "@/lib/wikipedia/types";
import type { LearningLevel } from "@/lib/ai/agents/createBlueprintAgents";

type GenerateBlueprintInput = {
  page: ParsedWikiPage;
  learningLevel: LearningLevel;
  outputLanguage: "it" | "en";
};

export async function generateBlueprint({
  page,
  learningLevel,
  outputLanguage,
}: GenerateBlueprintInput): Promise<VisualNotesBlueprint> {
  const agent = createBlueprintAgents({
    articleTitle: page.title,
    learningLevel,
    outputLanguage,
    sections: page.sections,
  });

  const result = await generateText({
    model: openai("gpt-5-mini"),
    system: agent.system,
    prompt: agent.prompt,
    output: Output.object({ schema: visualNotesBlueprintSchema }),
  });

  return result.output;
}
