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
    <button type="button" className="prova-card" onClick={choosePage}>
      <h2 className="prova-card-title">{title}</h2>

      {description && <p className="prova-card-description">{description}</p>}
    </button>
  );
}
