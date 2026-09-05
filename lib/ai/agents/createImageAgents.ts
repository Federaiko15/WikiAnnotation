import type { VisualNotesBlueprint } from "../schemas/visualNotesBlueprintSchema";
import { IMAGE_SYSTEM_PROMPT } from "../prompts/imageSystemPrompt";

type OutputLanguage = "it" | "en";
export type ImageStyle = 0 | 1 | 2;

function highlightText(
  text: string,
  highlights: Array<{ text: string }>,
): string {
  return highlights.reduce((result, highlight) => {
    return result.replace(highlight.text, `==${highlight.text}==`);
  }, text);
}

export function createImageAgent(
  blueprint: VisualNotesBlueprint,
  outputLanguage: OutputLanguage,
  imageStyle: ImageStyle,
) {
  const languageName = outputLanguage === "it" ? "Italian" : "English";

  const modules = blueprint.modules
    .map((module) => {
      const items = module.items
        .map((item) => {
          const markedText = highlightText(item.text, item.highlights);

          return `- "${markedText}"`;
        })
        .join("\n");

      return [
        `<module>`,
        `TITLE: "${module.title}"`,
        `CONCEPT LABEL: "${module.conceptLabel}"`,
        `FACTS:`,
        items,
        `VISUAL TYPE: "${module.visual.type}"`,
        `VISUAL INSTRUCTION: "${module.visual.instruction}"`,
        `RELATION TO CENTRAL TOPIC: "${module.relationToCentralTopic}"`,
        `</module>`,
      ].join("\n");
    })
    .join("\n\n");

  const centralVisual = [
    `TYPE: "${blueprint.centralVisual.type}"`,
    `INSTRUCTION: "${blueprint.centralVisual.instruction}"`,
  ].join("\n");

  return {
    system: [
      IMAGE_SYSTEM_PROMPT[imageStyle],
      "",
      `VISIBLE TEXT LANGUAGE: ${languageName}`,
      "Use only the blueprint below as the authoritative content source.",
      "Do not invent facts, labels, dates, modules, examples, or conclusions.",
      "Reproduce visible text compactly and accurately.",
    ].join("\n"),

    prompt: [
      `TOPIC: "${blueprint.topic}"`,
      `LEARNING LEVEL: "${blueprint.learningLevel}"`,
      `SUBJECT TYPE: "${blueprint.subjectType}"`,
      "",
      "CENTRAL VISUAL:",
      centralVisual,
      "",
      "KNOWLEDGE MODULES:",
      modules,
      "",
      `SOURCE NOTICE: "${blueprint.sourceNotice}"`,
      "",
      "Create only the final handwritten educational infographic.",
    ].join("\n"),
  };
}
