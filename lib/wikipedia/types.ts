export interface WikiSection {
  title: string;
  level: 1 | 2 | 3;
  content: string[];
  text: string;
}

export interface ParsedWikiPage {
  title: string;
  sourceUrl: string;
  sections: WikiSection[];
}
