import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB;

export const pdfBase64Schema = z
  .string({ error: "La stringa è obbligatoria" })
  .transform((val) => val.replace(/^data:application\/pdf;base64,/, ""))
  .transform((base64str, ctx) => {
    try {
      const buffer = Buffer.from(base64str, "base64");
      if (buffer.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Il file fornito è vuoto o la stringa base64 non è valida",
        });
        return z.NEVER;
      }
      return buffer;
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Impossibile decodificare la stringa base64",
      });
      return z.NEVER;
    }
  })
  .refine(
    (buffer) => buffer.length <= MAX_FILE_SIZE,
    "Il file supera la dimensione massima",
  )
  .refine(
    (buffer) => buffer.subarray(0, 4).toString("utf-8") === "%PDF",
    "Il file fornito non è un documento PDF valido",
  );

export const uploadRequestSchema = z.object({
  pdfBase64: pdfBase64Schema,
});
