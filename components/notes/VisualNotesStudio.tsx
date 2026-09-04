"use client";

import React, { useState } from "react";
import type { VisualNotesBlueprint } from "@/lib/ai/schemas/visualNotesBlueprintSchema";
import type { LearningLevel } from "@/lib/ai/agents/createBlueprintAgents";
import type { ImageAspectRatio } from "@/lib/ai/services/generateImage";
import {
  fetchBlueprint,
  fetchGeneratedImage,
  type OutputLanguage,
  type ImageApiResponse,
} from "@/lib/api/notesClient";

import NotesStepper, { type StepKey } from "./NotesStepper";
import BlueprintConfigForm from "./BlueprintConfigForm";
import BlueprintViewer from "./BlueprintViewer";
import GeneratedImageViewer from "./GeneratedImageViewer";
import StatusBanner from "./StatusBanner";

type VisualNotesStudioProps = {
  pageKey: string;
  articleTitle: string;
};

export default function VisualNotesStudio({
  pageKey,
  articleTitle,
}: VisualNotesStudioProps) {
  // Configuration options
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("it");
  const [learningLevel, setLearningLevel] = useState<LearningLevel>("general");
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>("3:4");
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(false);

  // Workflow results
  const [blueprint, setBlueprint] = useState<VisualNotesBlueprint | null>(null);
  const [source, setSource] = useState<{ title: string; url: string } | null>(
    null,
  );
  const [imageResult, setImageResult] = useState<ImageApiResponse | null>(null);

  // UI state
  const [currentStep, setCurrentStep] = useState<StepKey>("config");
  const [loadingPhase, setLoadingPhase] = useState<"blueprint" | "image" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch 1: /api/blueprint
  async function handleGenerateBlueprint(e?: React.FormEvent) {
    if (e) e.preventDefault();

    setLoadingPhase("blueprint");
    setError(null);

    console.log("[VisualNotesStudio] Inizio generazione blueprint per:", {
      pageKey,
      learningLevel,
      outputLanguage,
    });

    try {
      const data = await fetchBlueprint({
        pageKey,
        learningLevel,
        outputLanguage,
        language: "it",
      });

      console.log(
        "[VisualNotesStudio] Blueprint generato con successo:",
        data.blueprint.topic,
      );

      setBlueprint(data.blueprint);
      setSource(data.source);
      setCurrentStep("blueprint");

      // If user enabled auto-generation, immediately trigger Fetch 2
      if (autoGenerateImage) {
        await executeImageGeneration(data.blueprint);
      } else {
        setLoadingPhase(null);
      }
    } catch (err) {
      console.error("[VisualNotesStudio] Errore blueprint:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Errore durante la creazione del blueprint didattico.",
      );
      setLoadingPhase(null);
    }
  }

  // Fetch 2: /api/image
  async function executeImageGeneration(targetBlueprint?: VisualNotesBlueprint) {
    const bp = targetBlueprint ?? blueprint;

    if (!bp) {
      setError("Nessun blueprint disponibile per generare l'immagine.");
      return;
    }

    setLoadingPhase("image");
    setError(null);

    console.log(
      "[VisualNotesStudio] Inizio chiamata /api/image per:",
      bp.topic,
      aspectRatio,
    );

    try {
      const data = await fetchGeneratedImage({
        blueprint: bp,
        outputLanguage,
        aspectRatio,
      });

      console.log(
        "[VisualNotesStudio] Immagine generata con successo! Dimensione:",
        data.imageSize,
      );

      setImageResult(data);
      setCurrentStep("image");
    } catch (err) {
      console.error("[VisualNotesStudio] Errore generazione immagine:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Errore durante la creazione dell'infografica visiva.",
      );
    } finally {
      setLoadingPhase(null);
    }
  }

  function handleReset() {
    setBlueprint(null);
    setImageResult(null);
    setError(null);
    setCurrentStep("config");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper Navigation */}
      <NotesStepper
        currentStep={currentStep}
        hasBlueprint={!!blueprint}
        hasImage={!!imageResult}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Loading or Error Feedback */}
      <StatusBanner
        phase={loadingPhase}
        error={error}
        onClearError={() => setError(null)}
        onRetry={() => {
          if (loadingPhase === "image" || (blueprint && !imageResult)) {
            executeImageGeneration();
          } else {
            handleGenerateBlueprint();
          }
        }}
      />

      {/* Step 1: Configuration Form */}
      {(currentStep === "config" || !blueprint) && (
        <BlueprintConfigForm
          learningLevel={learningLevel}
          setLearningLevel={setLearningLevel}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          autoGenerateImage={autoGenerateImage}
          setAutoGenerateImage={setAutoGenerateImage}
          onSubmit={handleGenerateBlueprint}
          loading={loadingPhase !== null}
          loadingPhase={loadingPhase}
          hasBlueprint={!!blueprint}
          onReset={handleReset}
        />
      )}

      {/* Step 2: Educational Blueprint Preview */}
      {blueprint && (currentStep === "blueprint" || (!imageResult && currentStep !== "config")) && (
        <BlueprintViewer
          blueprint={blueprint}
          source={source ?? undefined}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onGenerateImage={() => executeImageGeneration()}
          isGeneratingImage={loadingPhase === "image"}
          hasImage={!!imageResult}
        />
      )}

      {/* Step 3: Generated Infographic Sketchnote Image */}
      {imageResult && currentStep === "image" && (
        <GeneratedImageViewer
          result={imageResult}
          topic={blueprint?.topic ?? articleTitle}
          onRegenerate={() => executeImageGeneration()}
          isRegenerating={loadingPhase === "image"}
        />
      )}
    </div>
  );
}
