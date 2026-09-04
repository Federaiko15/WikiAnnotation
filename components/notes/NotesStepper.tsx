import React from "react";

export type StepKey = "config" | "blueprint" | "image";

type NotesStepperProps = {
  currentStep: StepKey;
  hasBlueprint: boolean;
  hasImage: boolean;
  onStepClick?: (step: StepKey) => void;
};

export default function NotesStepper({
  currentStep,
  hasBlueprint,
  hasImage,
  onStepClick,
}: NotesStepperProps) {
  const steps: Array<{
    key: StepKey;
    number: number;
    title: string;
    description: string;
    isAccessible: boolean;
  }> = [
    {
      key: "config",
      number: 1,
      title: "Parametri",
      description: "Livello e Lingua",
      isAccessible: true,
    },
    {
      key: "blueprint",
      number: 2,
      title: "Blueprint",
      description: "Struttura modulare",
      isAccessible: hasBlueprint,
    },
    {
      key: "image",
      number: 3,
      title: "Infografica",
      description: "Sketchnote visiva",
      isAccessible: hasImage,
    },
  ];

  return (
    <nav aria-label="Avanzamento processo" className="w-full">
      <ol className="grid grid-cols-3 gap-2 sm:gap-4">
        {steps.map((step) => {
          const isActive = currentStep === step.key;
          const isDone =
            (step.key === "config" && hasBlueprint) ||
            (step.key === "blueprint" && hasImage);

          const canNavigate = step.isAccessible && onStepClick;

          return (
            <li key={step.key} className="relative">
              <button
                type="button"
                disabled={!canNavigate}
                onClick={() => canNavigate && onStepClick(step.key)}
                className={`w-full flex flex-col items-center sm:items-start p-3 sm:p-4 rounded border-2 text-left transition-all ${
                  isActive
                    ? "border-zinc-900 bg-white shadow-[4px_4px_0px_#ea580c] -translate-y-0.5"
                    : isDone
                      ? "border-zinc-900 bg-white shadow-[3px_3px_0px_#0d9488] hover:-translate-y-0.5"
                      : "border-dashed border-zinc-300 bg-white text-zinc-400 opacity-70"
                } ${canNavigate ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors ${
                      isActive
                        ? "border-zinc-900 bg-[#ea580c] text-white"
                        : isDone
                          ? "border-zinc-900 bg-[#0d9488] text-white"
                          : "border-zinc-300 bg-white text-zinc-400"
                    }`}
                  >
                    {isDone ? "✓" : step.number}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-sketch font-bold uppercase tracking-wider truncate ${
                      isActive
                        ? "text-zinc-900"
                        : isDone
                          ? "text-teal-800"
                          : "text-zinc-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <p className="hidden sm:block mt-1.5 text-xs text-zinc-500 font-sans truncate">
                  {step.description}
                </p>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
