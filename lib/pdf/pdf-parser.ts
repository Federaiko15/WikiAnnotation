import { PdfReader } from "pdfreader";

export interface ParsedPdfData {
  text: string;
  rows: Record<number, string[]>;
}

export function parsePdfBuffer(buffer: Buffer): Promise<ParsedPdfData> {
  return new Promise((resolve, reject) => {
    const rows: Record<number, string[]> = {};
    let fullText = "";

    new PdfReader({}).parseBuffer(buffer, (err, item) => {
      if (err) {
        return reject(err);
      }
      if (!item) {
        return resolve({ text: fullText, rows });
      }

      if (item.text) {
        fullText += item.text + " ";

        const y = Math.round(item.y || 0);
        rows[y] = rows[y] || [];
        rows[y].push(item.text);
      }
    });
  });
}
