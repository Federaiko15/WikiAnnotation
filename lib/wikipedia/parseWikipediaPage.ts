import * as cheerio from "cheerio";

import type { ParsedWikiPage, WikiSection } from "./types";

const EXCLUDED_SECTION_TITLES = new Set([
  "note",
  "riferimenti",
  "bibliografia",
  "collegamenti esterni",
  "voci correlate",
  "altri progetti",
  "categorie",
  "fonti",
  "vedi anche",
  "approfondimenti",
  "fonti primarie",
  "testi generali",
  "testi specialistici",
]);

function normalizeText(text: string): string {
  return text
    .replace(/\[\d+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeHeading(heading: string): string {
  return normalizeText(heading)
    .replace(/\[\s*modifica\s*\]/gi, "")
    .toLocaleLowerCase("it")
    .trim();
}

function isExcludedSection(heading: string): boolean {
  return EXCLUDED_SECTION_TITLES.has(normalizeHeading(heading));
}

function isMeaningfulSection(section: WikiSection): boolean {
  return section.text.length >= 80;
}

export async function parseWikipediaPage(
  language: string,
  pageKey: string,
): Promise<ParsedWikiPage> {
  const allowedLanguages = new Set(["it", "en"]);

  if (!allowedLanguages.has(language)) {
    throw new Error("Lingua Wikipedia non supportata.");
  }

  const decodedPageKey = decodeURIComponent(pageKey);

  const articleUrl =
    `https://${language}.wikipedia.org/w/rest.php/v1/page/` +
    `${encodeURIComponent(decodedPageKey)}/html`;

  const response = await fetch(articleUrl, {
    headers: {
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Impossibile recuperare la pagina Wikipedia (${response.status}).`,
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $(
    [
      "script",
      "style",
      "noscript",
      "sup.reference",
      ".reference",
      ".mw-references-wrap",
      "ol.mw-references",
      ".mw-editsection",
      ".noprint",
      ".navbox",
      ".vertical-navbox",
      ".metadata",
      ".ambox",
      ".hatnote",
      ".infobox",
      "figure",
      "table",
    ].join(", "),
  ).remove();

  const titleFromHtml = normalizeText($("h1").first().text());

  const pageTitle =
    titleFromHtml ||
    decodeURIComponent(pageKey).replace(/_/g, " ") ||
    "Senza titolo";

  const sections: WikiSection[] = [];

  let currentSection: WikiSection = {
    title: "Introduzione",
    level: 1,
    content: [],
    text: "",
  };

  function saveCurrentSection() {
    const text = currentSection.content.join("\n\n").trim();

    const sectionToSave: WikiSection = {
      ...currentSection,
      text,
    };

    if (
      !isExcludedSection(sectionToSave.title) &&
      isMeaningfulSection(sectionToSave)
    ) {
      sections.push(sectionToSave);
    }
  }

  $("h2, h3, p, ul > li, ol > li").each((_, element) => {
    const tagName = element.tagName?.toLowerCase();

    if (!tagName) {
      return;
    }

    const nodeText = normalizeText($(element).text());

    if (!nodeText) {
      return;
    }

    if (tagName === "h2" || tagName === "h3") {
      saveCurrentSection();

      currentSection = {
        title: nodeText,
        level: tagName === "h2" ? 2 : 3,
        content: [],
        text: "",
      };

      return;
    }

    if (isExcludedSection(currentSection.title)) {
      return;
    }

    const formattedText = tagName === "li" ? `- ${nodeText}` : nodeText;

    currentSection.content.push(formattedText);
  });

  saveCurrentSection();

  return {
    title: pageTitle,
    sourceUrl: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(
      decodedPageKey,
    )}`,
    sections,
  };
}
