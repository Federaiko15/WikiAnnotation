"use client";

import { useState, useRef } from "react";
import { FaFilePdf, FaUpload, FaTimes } from "react-icons/fa";

export function PDFComponent() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || file.type !== "application/pdf") {
      setPdf(null);
      return;
    }

    console.log(file.name);
    setPdf(file);
  };

  const handleRemovePdf = () => {
    setPdf(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!pdf || pdf.type !== "application/pdf") {
      console.log("File non preso");
      return;
    }

    try {
      setIsUploadingPdf(true);
      console.log(pdf.name);

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(pdf);
      });

      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfBase64: base64 }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(
          "Errore nella risposta alla API che elabora il file PDF",
          data,
        );
        return;
      } else {
        console.log(data.data);
      }
    } catch (error) {
      console.error("Errore durante l'invio del file PDF:", error);
    } finally {
      setIsUploadingPdf(false);
    }
  };

  return (
    <form
      onSubmit={handlePdfSubmit}
      className="w-full bg-white border-2 border-zinc-900 rounded-lg p-4 sm:p-5 shadow-[4px_4px_0px_#18181b] space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded border-2 border-zinc-900 bg-red-50 flex items-center justify-center shadow-[1px_1px_0px_#18181b] shrink-0">
            <FaFilePdf className="text-red-600 text-lg" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-sketch font-bold text-zinc-900 leading-tight">
              Genera Appunti da Documento PDF
            </h2>
            <p className="text-xs text-zinc-500 font-sans">
              Allega un file PDF (slide, dispense o capitoli) per estrarre la
              mappa concettuale
            </p>
          </div>
        </div>
        <span className="sketch-badge-teal self-start sm:self-auto shrink-0">
          PDF Uploader
        </span>
      </div>

      {/* Area di Selezione File o Card di Anteprima */}
      {!pdf ? (
        <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-900 bg-zinc-50/60 hover:bg-orange-50/20 rounded-md p-5 sm:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 group">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            name="file"
            onChange={handleFileChange}
            className="sr-only"
          />
          <div className="w-11 h-11 rounded-full bg-white border-2 border-zinc-900 flex items-center justify-center shadow-[2px_2px_0px_#18181b] group-hover:scale-105 transition-transform">
            <FaUpload className="text-zinc-700 text-sm group-hover:text-orange-600 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-sketch font-bold text-zinc-800">
              Seleziona o trascina un file PDF
            </p>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Formati supportati: solo documenti .pdf
            </p>
          </div>
        </label>
      ) : (
        <div className="border-2 border-zinc-900 bg-orange-50/30 rounded-md p-3.5 flex items-center justify-between shadow-[2px_2px_0px_#ea580c] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded border-2 border-zinc-900 bg-white flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#18181b]">
              <FaFilePdf className="text-red-600 text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-sketch font-bold text-zinc-900 truncate">
                {pdf.name}
              </p>
              <p className="text-xs text-zinc-500 font-sans">
                {(pdf.size / 1024 / 1024).toFixed(2)} MB • File PDF pronto per
                l&apos;invio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemovePdf}
            className="sketch-btn-white text-xs py-1.5 px-3 shrink-0 text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
            title="Rimuovi questo file"
          >
            <FaTimes className="text-xs" />
            <span>Rimuovi</span>
          </button>
        </div>
      )}

      {/* Barra Azioni Form */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-[11px] text-zinc-400 font-sans hidden sm:block">
          {pdf
            ? "✓ File selezionato correttamente"
            : "Nessun file selezionato al momento"}
        </p>
        <button
          type="submit"
          disabled={!pdf || isUploadingPdf}
          className="w-full sm:w-auto sketch-btn-teal text-sm py-2 px-5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {isUploadingPdf
              ? "Elaborazione in corso... ⌛"
              : "Invia PDF per Analisi ➔"}
          </span>
        </button>
      </div>
    </form>
  );
}
