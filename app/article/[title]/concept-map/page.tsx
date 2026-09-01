import { parseWikipediaPage } from "@/lib/wikipedia/parseWikipediaPage";

type ConceptMapPageProps = {
  params: Promise<{
    title: string;
  }>;
};

export default async function ConceptMapPage({ params }: ConceptMapPageProps) {
  const { title } = await params;

  const pageKey = decodeURIComponent(title);

  const parsedPage = await parseWikipediaPage("it", pageKey);

  return (
    <main>
      <h1>Mappa concettuale: {parsedPage.title}</h1>

      <p>Sezioni estratte: {parsedPage.sections.length}</p>

      {parsedPage.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>

          {section.content.map((paragraph, index) => (
            <p key={`${section.title}-${index}`}>{paragraph}</p>
          ))}
        </section>
      ))}
    </main>
  );
}
