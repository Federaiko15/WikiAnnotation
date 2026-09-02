"use client";

import { useState } from "react";
import type { VisualNotesBlueprint } from "@/lib/ai/schemas/visualNotesBlueprintSchema";
import type { LearningLevel } from "@/lib/ai/agents/createBlueprintAgents";

type OutputLanguage = "it" | "en";

type GenerateBlueprintButtonProps = {
  pageKey: string;
};

export default function GenerateBlueprintButton({
  pageKey,
}: GenerateBlueprintButtonProps) {
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("it");
  const [learningLevel, setLearningLevel] = useState<LearningLevel>("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<VisualNotesBlueprint | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("[GenerateBlueprint] Avvio generazione per:", {
      pageKey,
      learningLevel,
      outputLanguage,
    });

    try {
      const response = await fetch("/api/blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "it",
          pageKey,
          learningLevel,
          outputLanguage,
        }),
      });

      console.log("[GenerateBlueprint] Risposta ricevuta, status:", response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Errore nella generazione del blueprint");
      }

      console.log("[GenerateBlueprint] Blueprint ricevuto con successo:", data.blueprint);
      setBlueprint(data.blueprint);
    } catch (err) {
      console.error("[GenerateBlueprint] Errore:", err);
      setError(err instanceof Error ? err.message : "Errore imprevisto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="outputLanguage"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Lingua di output del blueprint:
          </label>
          <select
            id="outputLanguage"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value as OutputLanguage)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
          >
            <option value="it">Italiano</option>
            <option value="en">Inglese (English)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="learningLevel"
            className="text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Livello di apprendimento (Learning Level):
          </label>
          <select
            id="learningLevel"
            value={learningLevel}
            onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
            disabled={loading}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
          >
            <option value="primary">Scuola primaria (elementari)</option>
            <option value="middle-school">Scuola secondaria di I grado (medie)</option>
            <option value="high-school">Scuola secondaria di II grado (superiori)</option>
            <option value="university">Università</option>
            <option value="general">Generale / Divulgativo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generazione blueprint in corso...
            </>
          ) : (
            "Genera blueprint"
          )}
        </button>
      </form>

      {loading && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200 animate-pulse">
          <span className="text-xl">⏳</span>
          <div className="flex-1">
            <p className="font-semibold">
              Elaborazione in corso con l&apos;AI...
            </p>
            <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              L&apos;analisi della voce Wikipedia e la strutturazione dei moduli didattici richiedono generalmente circa 30–60 secondi.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <p className="font-semibold">Errore:</p>
          <p>{error}</p>
        </div>
      )}

      {blueprint && (
        <div className="flex flex-col gap-5 border-t border-gray-200 pt-6 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Blueprint generato
          </h2>

          <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/50 space-y-1.5 text-sm">
            <p>
              <span className="font-semibold">Argomento:</span> {blueprint.topic}
            </p>
            <p>
              <span className="font-semibold">Livello:</span>{" "}
              {blueprint.learningLevel}
            </p>
            <p>
              <span className="font-semibold">Tipo di soggetto:</span>{" "}
              {blueprint.subjectType}
            </p>
            {blueprint.centralVisual && (
              <p>
                <span className="font-semibold">
                  Visuale centrale ({blueprint.centralVisual.type}):
                </span>{" "}
                {blueprint.centralVisual.instruction}
              </p>
            )}
            {blueprint.sourceNotice && (
              <p className="text-xs text-gray-500 italic mt-2">
                {blueprint.sourceNotice}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Moduli ({blueprint.modules?.length ?? 0}):
            </h3>
            <div className="flex flex-col gap-4">
              {blueprint.modules?.map((module, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <h4 className="font-bold text-blue-600 dark:text-blue-400">
                    {index + 1}. {module.title} — {module.conceptLabel}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Relazione:</span>{" "}
                    {module.relationToCentralTopic}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Visuale ({module.visual.type}):</span>{" "}
                    {module.visual.instruction}
                  </p>
                  <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {module.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item.text}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400">
              Mostra JSON grezzo
            </summary>
            <pre className="mt-2 max-h-[50vh] overflow-auto rounded-lg bg-gray-100 p-4 text-xs font-mono text-gray-800 dark:bg-neutral-950 dark:text-gray-200">
              {JSON.stringify(blueprint, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
