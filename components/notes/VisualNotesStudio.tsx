"use client";

import React, { useState } from "react";
import type { VisualNotesBlueprintCollection } from "@/lib/ai/schemas/visualNotesBlueprintSchema";
import type { LearningLevel } from "@/lib/ai/agents/createBlueprintAgents";
import type { ImageAspectRatio } from "@/lib/ai/services/generateImage";
import type { ImageStyle } from "@/lib/ai/agents/createImageAgents";
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
  textId?: string;
};

export default function VisualNotesStudio({
  pageKey,
  articleTitle,
  textId,
}: VisualNotesStudioProps) {
  // Configuration options
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>("it");
  const [learningLevel, setLearningLevel] = useState<LearningLevel>("general");
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>("3:4");
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(false);
  const [annotationStyle, setAnnotationStyle] = useState<ImageStyle>(0);

  // Workflow results
  const [blueprints, setBlueprints] =
    useState<VisualNotesBlueprintCollection | null>(null);
  const [source, setSource] = useState<{ title: string; url: string } | null>(
    null,
  );
  const [imageResult, setImageResult] = useState<ImageApiResponse | null>(null);

  // UI state
  const [currentStep, setCurrentStep] = useState<StepKey>("config");
  const [loadingPhase, setLoadingPhase] = useState<
    "blueprint" | "image" | null
  >(null);
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
        textId,
      });

      console.log(
        "[VisualNotesStudio] Blueprints generati con successo:",
        data.blueprints.topic,
        `(${data.blueprints.blueprints.length} fogli)`,
      );

      setBlueprints(data.blueprints);
      setSource(data.source);
      setCurrentStep("blueprint");

      // If user enabled auto-generation, immediately trigger Fetch 2
      if (autoGenerateImage) {
        await executeImageGeneration(data.blueprints);
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
  async function executeImageGeneration(
    targetBlueprints?: VisualNotesBlueprintCollection,
  ) {
    const bps = targetBlueprints ?? blueprints;

    if (!bps || !bps.blueprints.length) {
      setError("Nessun blueprint disponibile per generare l'immagine.");
      return;
    }

    setLoadingPhase("image");
    setError(null);

    console.log(
      "[VisualNotesStudio] Inizio chiamata /api/image per:",
      bps.topic,
      `(${bps.blueprints.length} blueprint)`,
      aspectRatio,
    );

    try {
      const data = await fetchGeneratedImage({
        blueprints: bps,
        outputLanguage,
        aspectRatio,
        annotationStyle,
      });

      console.log(
        "[VisualNotesStudio] Immagini generate con successo! Totale:",
        data.images?.length ?? 1,
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
    setBlueprints(null);
    setImageResult(null);
    setError(null);
    setCurrentStep("config");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stepper Navigation */}
      <NotesStepper
        currentStep={currentStep}
        hasBlueprint={!!blueprints && blueprints.blueprints.length > 0}
        hasImage={!!imageResult}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Loading or Error Feedback */}
      <StatusBanner
        phase={loadingPhase}
        error={error}
        onClearError={() => setError(null)}
        onRetry={() => {
          if (loadingPhase === "image" || (blueprints && !imageResult)) {
            executeImageGeneration();
          } else {
            handleGenerateBlueprint();
          }
        }}
      />

      {/* Step 1: Configuration Form */}
      {(currentStep === "config" || !blueprints) && (
        <BlueprintConfigForm
          learningLevel={learningLevel}
          setLearningLevel={setLearningLevel}
          outputLanguage={outputLanguage}
          setOutputLanguage={setOutputLanguage}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          setAnnotationStyle={setAnnotationStyle}
          autoGenerateImage={autoGenerateImage}
          setAutoGenerateImage={setAutoGenerateImage}
          onSubmit={handleGenerateBlueprint}
          loading={loadingPhase !== null}
          loadingPhase={loadingPhase}
          hasBlueprint={!!blueprints && blueprints.blueprints.length > 0}
          onReset={handleReset}
        />
      )}

      {/* Step 2: Educational Blueprint Preview */}
      {blueprints &&
        blueprints.blueprints.length > 0 &&
        (currentStep === "blueprint" ||
          (!imageResult && currentStep !== "config")) && (
          <BlueprintViewer
            blueprints={blueprints}
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
          topic={blueprints?.topic ?? articleTitle}
          onRegenerate={() => executeImageGeneration()}
          isRegenerating={loadingPhase === "image"}
        />
      )}
    </div>
  );
}
