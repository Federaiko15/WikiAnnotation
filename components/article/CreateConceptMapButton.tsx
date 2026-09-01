"use client";

import { useRouter } from "next/navigation";

type CreateConceptMapButtonProps = {
  pageKey: string;
};

export default function CreateConceptMapButton({
  pageKey,
}: CreateConceptMapButtonProps) {
  const router = useRouter();

  function handleClick() {
    router.push(`/article/${encodeURIComponent(pageKey)}/concept-map`);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
    >
      Crea mappa concettuale →
    </button>
  );
}
