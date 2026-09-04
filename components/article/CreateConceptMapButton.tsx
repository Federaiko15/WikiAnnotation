import Link from "next/link";

type CreateConceptMapButtonProps = {
  pageKey: string;
};

export default function CreateConceptMapButton({
  pageKey,
}: CreateConceptMapButtonProps) {
  return (
    <Link
      href={`/article/${encodeURIComponent(pageKey)}/concept-map`}
      className="sketch-btn-teal text-base px-6 py-3.5"
    >
      <span>✎</span> Crea Mappa Concettuale ➔
    </Link>
  );
}
