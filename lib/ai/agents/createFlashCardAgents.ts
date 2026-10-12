import { FLASH_CARDS_SYSTEM_PROMPT } from "../prompts/flashCardsSystemPrompt";
import { VisualNotesBlueprintCollection } from "../schemas/visualNotesBlueprintSchema";

type OutputLanguage = "it" | "en";
type createFlashCardsAgentParams = {
  fullText: string;
  outputLanguage: OutputLanguage;
  blueprint: VisualNotesBlueprintCollection;
};

export function createFlashCardsAgent(params: createFlashCardsAgentParams) {
  const final_language = params.outputLanguage === "it" ? "Italian" : "English";

  return {
    system: [
      FLASH_CARDS_SYSTEM_PROMPT,
      "",
      `OUTPUT LANGUAGE: ${final_language}`,
      "All user-visible content must be written in this language.",
    ].join("\n"),

    prompt: [
      "You are an AI that generates educational multiple-choice flashcards from a given text.",
      "The flashcards should be concise, clear, and cover the key concepts of the text.",
      "For each flashcard:",
      "- Formulate a clear question based on the text and blueprint.",
      "- Provide 3 to 4 multiple-choice answer options in the `answer` array.",
      "- Each option must have `text` (string) and `isCorrect` (boolean).",
      "- Exactly ONE option must have `isCorrect: true`, while the other options must be plausible distractors with `isCorrect: false`.",
      "",
      "Here is the text to have the whole context:",
      "<text>",
      params.fullText,
      "</text>",
      "According to the blueprint generated, create a set of flashcards that cover the key concepts of the text.",
      "Use the following blueprint as a guide:",
      "<blueprint>",
      JSON.stringify(params.blueprint),
      "</blueprint>",
      "",
      "Return the flashcards in a structured format conforming to the schema.",
    ].join("\n"),
  };
}
