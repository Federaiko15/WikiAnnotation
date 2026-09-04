"use client";

import VisualNotesStudio from "@/components/notes/VisualNotesStudio";

type GenerateBlueprintButtonProps = {
  pageKey: string;
};

/**
 * @deprecated Use VisualNotesStudio from '@/components/notes/VisualNotesStudio' instead.
 */
export default function GenerateBlueprintButton({
  pageKey,
}: GenerateBlueprintButtonProps) {
  const displayTitle = pageKey.replace(/_/g, " ");
  return <VisualNotesStudio pageKey={pageKey} articleTitle={displayTitle} />;
}
