"use client";

import { useState } from "react";
import type { FlashCardItem } from "@/lib/ai/schemas/visualFlashCardsSchema";

export type { FlashCardItem };

export type FlashCardsProps = {
  flashCards: FlashCardItem[];
  topic?: string;
  flashCardTitle?: string;
};

export default function FlashCards({
  flashCards,
  topic,
  flashCardTitle,
}: FlashCardsProps) {
  // Map of question index -> chosen answer option index
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isChecked, setIsChecked] = useState<boolean>(false);

  function handleSelect(questionIndex: number, optionIndex: number) {
    if (isChecked) return; // Prevent changing after verification until reset
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  }

  function handleCheck() {
    setIsChecked(true);
  }

  function handleReset() {
    setSelectedAnswers({});
    setIsChecked(false);
  }

  // Calculate score
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = flashCards.reduce((acc, card, cardIdx) => {
    const chosenIdx = selectedAnswers[cardIdx];
    if (chosenIdx !== undefined && card.answer[chosenIdx]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const totalCount = flashCards.length;
  const scorePercent =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Title & Topic Header */}
      {(topic || flashCardTitle) && (
        <div className="sketch-panel p-6 sm:p-8 flex flex-col gap-2 border-2 border-zinc-900 bg-white shadow-[4px_4px_0px_#ea580c]">
          {topic && (
            <span className="text-xs font-sketch font-bold uppercase tracking-wider text-orange-600">
              {topic}
            </span>
          )}
          {flashCardTitle && (
            <h2 className="text-xl sm:text-2xl font-bold font-sketch text-zinc-900">
              {flashCardTitle}
            </h2>
          )}
          <p className="text-xs sm:text-sm text-zinc-600 font-sans mt-1">
            Seleziona la risposta corretta per ciascuna domanda e premi &ldquo;Controlla risposte&rdquo; per verificare il tuo punteggio.
          </p>
        </div>
      )}

      {/* Score Summary Box (shown after verification) */}
      {isChecked && (
        <div
          className={`sketch-panel p-6 border-2 border-zinc-900 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_#18181b] ${
            scorePercent >= 70
              ? "bg-emerald-50 border-emerald-900"
              : "bg-orange-50 border-orange-900"
          }`}
        >
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-700">
              Risultato Finale
            </span>
            <div className="text-2xl font-bold font-sketch text-zinc-900">
              {correctCount} su {totalCount} corrette ({scorePercent}%)
            </div>
            <p className="text-sm text-zinc-600 font-sans">
              {scorePercent === 100
                ? "🎉 Fantastico! Hai risposto correttamente a tutte le domande!"
                : scorePercent >= 70
                  ? "👍 Ottimo risultato! Hai una solida comprensione dei concetti."
                  : "📚 Ripassa i concetti chiave e riprova per consolidare la memoria!"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="sketch-btn-teal text-sm py-2 px-5 whitespace-nowrap"
          >
            ↺ Riprova il quiz
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="flex flex-col gap-5">
        {flashCards.map((card, cardIndex) => {
          const selectedOptionIndex = selectedAnswers[cardIndex];
          const hasSelected = selectedOptionIndex !== undefined;
          const isQuestionCorrect =
            hasSelected && card.answer[selectedOptionIndex]?.isCorrect;

          return (
            <div
              key={cardIndex}
              className={`sketch-panel p-5 sm:p-6 border-2 rounded-lg bg-white transition-colors shadow-[3px_3px_0px_#18181b] ${
                isChecked
                  ? isQuestionCorrect
                    ? "border-emerald-600"
                    : "border-rose-500"
                  : "border-zinc-900"
              }`}
            >
              {/* Question header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-sketch font-bold uppercase tracking-wider text-zinc-500">
                  Domanda {cardIndex + 1} di {totalCount}
                </span>

                {isChecked && (
                  <span
                    className={`text-xs font-sketch font-bold px-2 py-0.5 rounded border ${
                      isQuestionCorrect
                        ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                        : "bg-rose-100 text-rose-800 border-rose-400"
                    }`}
                  >
                    {isQuestionCorrect
                      ? "✓ Risposta corretta"
                      : hasSelected
                        ? "✗ Risposta errata"
                        : "— Non risposta"}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-base sm:text-lg text-zinc-900 mb-4 leading-snug">
                {card.question}
              </h3>

              {/* Radio button options */}
              <div className="flex flex-col gap-2.5">
                {card.answer.map((option, optIndex) => {
                  const isSelected = selectedOptionIndex === optIndex;
                  const isCorrect = option.isCorrect;

                  // Compute styles based on checked status
                  let optionStyle =
                    "border-zinc-300 bg-white hover:bg-zinc-50 hover:border-zinc-400";
                  let badge = null;

                  if (isChecked) {
                    if (isCorrect) {
                      // Correct option is always highlighted green after check
                      optionStyle =
                        "border-emerald-600 bg-emerald-50 text-emerald-950 font-medium";
                      badge = (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 ml-auto whitespace-nowrap">
                          ✓ Corretta
                        </span>
                      );
                    } else if (isSelected && !isCorrect) {
                      // Selected wrong option is highlighted red
                      optionStyle =
                        "border-rose-500 bg-rose-50 text-rose-950 font-medium";
                      badge = (
                        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-300 ml-auto whitespace-nowrap">
                          ✗ Errata
                        </span>
                      );
                    } else {
                      // Unselected non-correct option
                      optionStyle = "border-zinc-200 bg-zinc-50 opacity-60 text-zinc-500";
                    }
                  } else if (isSelected) {
                    optionStyle =
                      "border-orange-500 bg-orange-50/70 text-zinc-900 font-medium shadow-sm";
                  }

                  return (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${optionStyle} ${
                        isChecked ? "cursor-default" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`flashcard-question-${cardIndex}`}
                        value={optIndex}
                        checked={isSelected}
                        onChange={() => handleSelect(cardIndex, optIndex)}
                        disabled={isChecked}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-zinc-400 accent-orange-600 cursor-pointer disabled:cursor-default"
                      />
                      <span className="text-sm sm:text-base leading-relaxed flex-1">
                        {option.text}
                      </span>
                      {badge}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom control bar */}
      <div className="sketch-panel p-4 sm:p-5 border-2 border-zinc-900 bg-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[3px_3px_0px_#18181b]">
        <div className="text-xs sm:text-sm text-zinc-600 font-sans">
          {isChecked ? (
            <span>
              Quiz completato! Punteggio: <strong>{correctCount} / {totalCount}</strong>
            </span>
          ) : (
            <span>
              Risposte selezionate: <strong>{answeredCount}</strong> di{" "}
              <strong>{totalCount}</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isChecked ? (
            <button
              type="button"
              onClick={handleReset}
              className="sketch-btn-white text-sm py-2 px-4"
            >
              ↺ Ricomincia
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCheck}
              disabled={answeredCount === 0}
              className="sketch-btn-teal text-sm py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✓ Controlla risposte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

