import Link from "next/link";
import GenerateBlueprintButton from "@/components/article/GenerateBlueprintButton";

type ConceptMapPageProps = {
  params: Promise<{
    title: string;
  }>;
};

export default async function ConceptMapPage({ params }: ConceptMapPageProps) {
  const { title } = await params;
  const pageKey = decodeURIComponent(title);
  const displayTitle = pageKey.replace(/_/g, " ");

  return (
    <main className="article-container">
      <div className="article-card">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-neutral-800">
          <div>
            <Link
              href={`/article/${encodeURIComponent(pageKey)}`}
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              ← Torna alla voce
            </Link>
            <h1 className="article-title mt-2">
              Mappa concettuale: {displayTitle}
            </h1>
          </div>
        </div>

        <GenerateBlueprintButton pageKey={pageKey} />
      </div>
    </main>
  );
}

