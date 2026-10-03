import { z } from "zod";

const highlightSchema = z.object({
  text: z
    .string()
    .min(1)
    .max(35)
    .describe(
      "Exact span appearing inside the matching item text, without highlight markers.",
    ),
});

const blueprintItemSchema = z.object({
  text: z
    .string()
    .min(1)
    .max(100)
    .describe(
      "Compact infographic fact, usually 3–10 words. Include ==double equals== around one or two key spans. Never truncate text.",
    ),

  highlights: z
    .array(highlightSchema)
    .min(1)
    .max(2)
    .describe(
      "One or two important exact spans contained in text. Do not include the == markers.",
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
      "Short, concrete, complete visual instruction. Never end with an incomplete phrase.",
    ),
});

const blueprintModuleSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(64)
    .describe("Short ALL-CAPS module header, without a number."),

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
      "Three to five distinct, compact facts. Never truncate facts or repeat information unnecessarily.",
    ),

  visual: visualRepresentationSchema,

  relationToCentralTopic: z
    .string()
    .min(1)
    .max(180)
    .describe(
      "One concise, grammatically complete sentence explaining how the module relates to the central visual. Never truncate.",
    ),
});

export const singleVisualNotesBlueprintSchema = z.object({
  topic: z
    .string()
    .min(1)
    .max(80)
    .describe("The overall subject shared by all blueprints."),

  blueprintTitle: z
    .string()
    .min(1)
    .max(100)
    .describe(
      "A concise subtitle identifying the specific focus of this infographic.",
    ),

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
    .min(4)
    .max(7)
    .describe(
      "Four to seven non-redundant knowledge modules focused on this infographic's specific subject.",
    ),

  sourceNotice: z
    .string()
    .min(1)
    .max(180)
    .describe(
      "Short attribution notice based only on the supplied source information.",
    ),
});

export const visualNotesBlueprintCollectionSchema = z.object({
  topic: z
    .string()
    .min(1)
    .max(80)
    .describe("The overall subject shared by all blueprints."),

  blueprints: z
    .array(singleVisualNotesBlueprintSchema)
    .min(1)
    .describe(
      "An ordered collection of independent educational infographic blueprints. Generate as many as needed for complete, readable coverage of the source material.",
    ),
});

export const visualNotesBlueprintSchema = singleVisualNotesBlueprintSchema;

export type VisualNotesBlueprint = z.infer<
  typeof singleVisualNotesBlueprintSchema
>;

export type VisualNotesBlueprintCollection = z.infer<
  typeof visualNotesBlueprintCollectionSchema
>;

