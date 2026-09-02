import { BLUEPRINT_SYSTEM_PROMPT } from "../prompts/blueprintSystemPrompt";
import { WikiSection } from "@/lib/wikipedia/types";

export type LearningLevel =
  | "primary"
  | "middle-school"
  | "high-school"
  | "university"
  | "general";

type CreateBlueprintAgentsParams = {
  articleTitle: string;
  learningLevel: LearningLevel;
  outputLanguage: string;
  sections: WikiSection[];
};

export function createBlueprintAgents(input: CreateBlueprintAgentsParams) {
  const final_language = input.outputLanguage === "it" ? "Italian" : "English";
  const sourceMaterial = input.sections
    .map((section) => {
      return [
        `<section title="${section.title}">`,
        section.content.map((block) => `- ${block}`).join("\n"),
        "</section>",
      ].join("\n");
    })
    .join("\n\n");

  return {
    system: [
      BLUEPRINT_SYSTEM_PROMPT,
      "",
      `OUTPUT LANGUAGE: ${final_language}`,
      "All user-visible blueprint content must be written in this language.",
    ].join("\n"),

    prompt: [
      `TOPIC: ${input.articleTitle}`,
      `LEARNING LEVEL: ${input.learningLevel}`,
      "",
      "SOURCE MATERIAL:",
      "<article>",
      sourceMaterial,
      "</article>",
      "",
      "Return the structured educational content blueprint now.",
    ].join("\n"),
  };
}
