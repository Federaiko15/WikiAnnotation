"use client";
import { useState } from "react";

export default function SendTextPage() {
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawText = String(formData.get("text") ?? "").trim();

    if (!rawText) {
      alert("Inserisci un testo su cui generare la sketchnote illustrata.");
      return;
    }

    if (rawText.length > 3000) {
      alert(
        "Il testo inserito supera i 3000 caratteri. Riduci il testo e riprova.",
      );
      return;
    }
    console.log("Testo inviato:", rawText);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Testo:</label>
        <textarea
          id="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={3000}
        />
        <button type="submit">Invia</button>
      </form>
    </div>
  );
}
