import { z } from "zod";

const highlightSchema = z.object({
  text: z
    .string()
    .min(1)
    .max(35)
    .describe(
      "Exact one-to-three-word span appearing inside the matching item text.",
    ),
});

const blueprintItemSchema = z.object({
  text: z
    .string()
    .min(1)
    .max(100)
    .describe(
      "Exact compact infographic fragment, usually 3 to 10 words. Use ==double equals== around one or two key spans.",
    ),

  highlights: z
    .array(highlightSchema)
    .min(1)
    .max(2)
    .describe(
      "Important exact spans contained in text. Do not list terms not present in text.",
    ),
});

const visualRepresentationSchema = z.object({
  type: z.enum([
    "diagram",
    "timeline",
    "map",
    "comparison",
    "process-flow",
    "cross-section",
    "chart",
    "labelled-illustration",
    "example",
    "sketch",
  ]),

  instruction: z
    .string()
    .min(1)
    .max(180)
    .describe(
      "Short concrete instruction describing what to draw, not a paragraph.",
    ),
});

const blueprintModuleSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(32)
    .describe("Short all-caps module header, without number."),

  conceptLabel: z
    .string()
    .min(1)
    .max(45)
    .describe("Short concept label, not a sentence."),

  items: z
    .array(blueprintItemSchema)
    .min(3)
    .max(5)
    .describe(
      "Three to five distinct compact facts or ideas. No repeated facts.",
    ),

  visual: visualRepresentationSchema,

  relationToCentralTopic: z
    .string()
    .min(1)
    .max(90)
    .describe(
      "Short statement explaining the meaningful visual connection to the central topic.",
    ),
});

export const visualNotesBlueprintSchema = z.object({
  topic: z.string().min(1).max(80),

  learningLevel: z.enum([
    "primary",
    "middle-school",
    "high-school",
    "university",
    "general",
  ]),

  subjectType: z.enum([
    "scientific-concept",
    "person",
    "historical-event",
    "object",
    "place",
    "process",
    "system",
    "plan",
    "classroom-concept",
    "other",
  ]),

  centralVisual: visualRepresentationSchema,

  modules: z
    .array(blueprintModuleSchema)
    .min(6)
    .max(8)
    .describe("Six to eight non-redundant knowledge modules."),

  sourceNotice: z
    .string()
    .min(1)
    .max(180)
    .describe(
      "Short attribution notice based only on the supplied source information.",
    ),
});

export type VisualNotesBlueprint = z.infer<typeof visualNotesBlueprintSchema>;
