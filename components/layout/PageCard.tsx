"use client";

import { useRouter } from "next/navigation";

type PageCardProps = {
  title: string;
  pageKey: string;
  description?: string;
};

export default function PageCard({
  title,
  pageKey,
  description,
}: PageCardProps) {
  const router = useRouter();

  function choosePage() {
    const safePageKey = encodeURIComponent(pageKey);

    router.push(`/article/${safePageKey}`);
  }

  return (
    <button type="button" className="prova-card group" onClick={choosePage}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="prova-card-title group-hover:text-orange-600 transition-colors">
          {title}
        </h2>
        <span className="text-sm font-sketch font-bold text-zinc-400 group-hover:text-orange-500 transition-colors">
          Apri ➔
        </span>
      </div>

      {description && <p className="prova-card-description">{description}</p>}
    </button>
  );
}
