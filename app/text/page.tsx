"use client";

import SendTextPage from "@/components/SendTextPage";

export default function TextPage() {
  return (
    <>
      <div>
        <div>Inserisci il testo su cui creare la sketchnote illustrata</div>
        <p>
          Il testo su cui creare la sketchnote illustrata non potrà però
          superare i 3000 caratteri
        </p>
      </div>
      <div>
        <SendTextPage />
      </div>
    </>
  );
}
