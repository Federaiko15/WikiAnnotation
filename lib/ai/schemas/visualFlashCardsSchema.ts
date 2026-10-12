import { z } from "zod";

export const answerOptionSchema = z.object({
  text: z.string().min(1).max(200).describe("Testo dell'opzione di risposta."),
  isCorrect: z
    .boolean()
    .describe("True se questa opzione è la risposta corretta, false altrimenti."),
});

export const flashCardItemSchema = z.object({
  question: z.string().min(1).max(200).describe("Domanda della flashcard."),
  answer: z
    .array(answerOptionSchema)
    .min(2)
    .max(4)
    .describe(
      "Opzioni a scelta multipla (2-4 opzioni). Esattamente un'opzione deve avere isCorrect a true.",
    ),
});

export const visualFlashCardsSchema = z.object({
  topic: z
    .string()
    .min(1)
    .max(80)
    .describe("The overall subject shared by all flashcards."),

  flashCardTitle: z
    .string()
    .min(1)
    .max(100)
    .describe(
      "A concise subtitle identifying the specific focus of this set of flashcards.",
    ),

  flashCards: z
    .array(flashCardItemSchema)
    .min(5)
    .max(14)
    .describe(
      "Flashcard educative a risposta multipla sul tema specifico.",
    ),
});

export type AnswerOption = z.infer<typeof answerOptionSchema>;
export type FlashCardItem = z.infer<typeof flashCardItemSchema>;
export type VisualFlashCards = z.infer<typeof visualFlashCardsSchema>;

