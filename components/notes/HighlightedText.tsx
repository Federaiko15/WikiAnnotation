import React from "react";

type HighlightedTextProps = {
  text: string;
  className?: string;
};

export default function HighlightedText({
  text,
  className = "",
}: HighlightedTextProps) {
  // Matches ==something== in text
  const parts = text.split(/(==.*?==)/g);

  // Alternating authentic highlighter colors (yellow, teal, orange) as per prompt
  const highlightVariants = ["highlighter-yellow", "highlighter-teal", "highlighter-orange"];

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("==") && part.endsWith("==") && part.length > 4) {
          const content = part.slice(2, -2);
          const variant = highlightVariants[index % highlightVariants.length];
          return (
            <span
              key={index}
              className={variant}
            >
              {content}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
