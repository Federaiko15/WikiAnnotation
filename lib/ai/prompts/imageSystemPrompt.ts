export const IMAGE_SYSTEM_PROMPT = [
  `
Using the supplied CONTENT BLUEPRINT, create a visually striking handwritten
educational sketchnote.

The blueprint is the authoritative source. Preserve its topic, central visual,
modules, titles, concept labels, facts, vocabulary, highlights, examples,
relationships, sequences, and comparisons.

Do not invent, add, remove, repeat, expand, paraphrase, or reinterpret content.

Reproduce supplied compact text accurately. Never turn fragments into
sentences or paragraphs.

Do not create sections such as "Why It Matters", "Key Points", "Summary",
"Conclusion", "Recap", or "Takeaways".

CENTRAL COMPOSITION:
Place the title at the top in a simple hand-drawn rectangular box with a clean
black outline, white interior, and orange shaded side and bottom edge,
creating a subtle flat 3D lift. Use this lifted-box treatment ONLY for the title.

Place the blueprint's central visual in the middle of the page, below or beside
the title, as the main large drawing.

Arrange the knowledge modules organically around the central visual.
Use an open, asymmetric composition with different module sizes and generous
white space. Do not use a rigid grid and do not number modules.

MODULES:
Each module should have:
- an unnumbered ALL-CAPS handwritten header;
- its concept label and compact facts;
- the blueprint's visual representation;
- 1–3 simple topic-specific doodles when useful;
- meaningful visual connections to the central topic.

Do not place modules inside cards, UI panels, rounded boxes, rigid frames,
or complete rectangles.

Use loose separators only when useful: short underlines, partial corners,
rough L-shapes, wavy lines, dotted dividers, brackets, arrows, or no separator.

DOODLES:
Draw simple black line cartoons like a teacher sketching on a whiteboard.
Objects should be recognisable using only a few identifying details.

When people are present, use round white heads, clearly visible simple eyes,
minimal expressive faces, thin limbs, and contextual identifiers such as
clothing, hairstyle, prop, tool, posture, or companion.

Avoid realistic anatomy, detailed faces, complex textures, polished characters,
stock illustrations, commercial pictograms, and glossy rendering.

VISUAL NETWORK:
Use purposeful hand-drawn arrows, leader lines, dotted lines, brackets,
pointer marks, circles, and visual pathways.

Every connector must communicate a relationship from the blueprint.
Avoid decorative or unnecessary connections.

COLOUR:
Use black or dark charcoal for outlines, lettering, and connectors.
Keep the page predominantly black on white.

Use restrained teal and orange for occasional flat fills, highlights,
and the shaded title-box edge.

Use muted red or yellow only when semantically necessary for warning,
hierarchy, or contrast.

Do not colour every icon or fill large areas.

HIGHLIGHTS:
The ==double equals== markers are instructions, not visible characters.
Do not draw them.

Highlight only the exact marked spans inside their original compact text
with one continuous, slightly irregular translucent marker stroke.

Never highlight unmarked text and never extract highlighted words into
separate labels or key-term sections.

BACKGROUND AND STYLE:
Use pristine bright white paper with no ruled lines, grid, beige tint,
cream tone, parchment, or grey cast.

Keep everything flat and genuinely hand-drawn.

No gradients, glossy lighting, heavy rendered shadows, paper-cut effects,
foreshortening, logos, branding, watermarks, UI elements, stickers,
corporate styling, or generic clip-art.

TYPOGRAPHY:
Use clear, highly legible handwritten lettering.

Use distinct ALL-CAPS handwritten printing for major headers and compact
handwritten lettering elsewhere.

Reproduce all supplied titles, labels, vocabulary, dates, measurements,
equations, and annotations accurately.

Do not generate fake text, pseudo-writing, or invented labels.

If space is limited, reduce decoration and doodles rather than reducing,
rewriting, or inventing content.

VISUAL STYLE:
Loose, hand-drawn classroom sketchnote; bright white paper;
simple contextual line cartoons; open, irregular module structure;
restrained colour; compact information; friendly and highly legible.

Aspect Ratio: [3:4, 1:1, 9:16, 16:9]
`,

  `
Using the supplied CONTENT BLUEPRINT, create a handwritten educational
study summary.

The blueprint is the ONLY source of factual content. Preserve all essential
information, including the topic, titles, facts, dates, numbers, measurements,
technical terms, relationships, comparisons, sequences, and marked highlights.

Do not invent, add, remove, repeat, or introduce unsupported information.

The final image must look like a handwritten university study page or
well-organised handwritten summary, NOT like a dense infographic,
concept map, dashboard, or collection of cards.

LAYOUT:
Create one continuous, readable page with a clear top-to-bottom reading flow.

Place the main title prominently at the top using neat handwritten lettering.
Below it, organise the blueprint information into coherent handwritten
paragraphs and short sections.

Transform compatible compact facts into concise handwritten summary text,
without adding new information or changing their meaning.

Use short sentences and compact paragraphs rather than isolated infographic
fragments.

Do not force every blueprint module to become a separate visual block.
Group closely related information naturally when this improves readability,
while preserving all essential facts.

Use generous white space between sections, but keep the overall page feeling
like a real handwritten set of study notes.

TEXT:
The text is the main element of the image.

Use natural handwritten lettering throughout the page.
Major section titles should be handwritten ALL-CAPS.
Supporting content should use smaller, highly legible handwritten writing.

Preserve exact technical terms, names, dates, measurements, equations,
and important terminology from the blueprint.

Do not generate fake text, pseudo-writing, invented labels, or unrelated notes.

HIGHLIGHTS:
The ==double equals== markers indicate text that must receive a handwritten
highlighter stroke. Do not draw the == symbols.

Highlight only the marked spans, keeping them embedded inside their original
text.

Use one continuous translucent marker stroke with a slightly irregular
handwritten appearance.

Never highlight unmarked text and never extract highlighted terms into
separate key-term boxes or labels.

ILLUSTRATIONS:
Include at most TWO explanatory drawings on the entire page.

Only add a drawing when it genuinely helps explain an important concept from
the blueprint.

Choose the drawings from the blueprint's central visual or most important
visual representations.

Drawings must be simple educational hand sketches:
thin dark outlines, minimal detail, flat restrained colour, and immediately
recognisable shapes.

Do not illustrate every module.

Do not add decorative doodles simply to fill empty space.

Avoid realistic rendering, glossy effects, complex textures, detailed
characters, stock illustrations, icons, pictograms, or cinematic scenes.

The drawings should support the handwritten summary rather than dominate it.

STRUCTURE:
Do not use cards, dashboards, rigid infographic panels, UI containers,
rounded boxes, or a rigid grid.

Sections may be separated by:
- white space;
- short handwritten underlines;
- simple arrows;
- small brackets;
- very light hand-drawn separators.

Use only a simple hand-drawn title treatment if a title box is useful.
Do not create complete boxes around every section.

VISUAL CONNECTIONS:
Use only a few meaningful arrows or leader lines when they clarify a
relationship, sequence, cause, or process from the blueprint.

Do not turn the page into a network diagram.

COLOUR:
Keep the page predominantly black and white.

Use black or dark charcoal for handwritten text and drawings.

Use restrained teal or orange for occasional highlights and emphasis.
Muted red or yellow may be used only when semantically necessary.

Do not colour large areas or every element.

BACKGROUND:
Use pristine bright white paper.

No ruled paper, graph paper, beige, cream, parchment, grey cast,
paper texture, gradients, glossy lighting, heavy shadows, or decorative
background elements.

FINAL APPEARANCE:
The result should resemble an excellent handwritten university study summary:
clear, personal, organised, information-dense but readable, with natural
handwritten text and no more than two meaningful explanatory drawings.

It should feel like something a student could genuinely study from.

Aspect Ratio: [3:4, 1:1, 9:16, 16:9]
`,

  `
Using the supplied CONTENT BLUEPRINT, create a simple formal conceptual map
in a classic hierarchical tree structure.

The blueprint is the ONLY source of factual content.

Preserve the topic, central concept, module titles, concept labels, facts,
relationships, sequences, comparisons, dates, numbers, measurements,
technical terms, and marked highlights.

Do not invent, add, remove, repeat, paraphrase, or expand information.

The final image must be a traditional educational concept map:
formal, simple, hierarchical, geometric, and easy to read.

Do not create a sketchnote, illustrated infographic, handwritten study page,
dashboard, or decorative poster.

HIERARCHY:
Place the main topic at the top or centre as the ROOT NODE.

Below it, create clear hierarchical branches leading to the main knowledge
modules.

Each major module should become a clearly identifiable node or branch.

Organise information from general concepts to progressively more specific
facts.

Use a simple top-down tree whenever possible.

If the topic naturally requires a radial structure, use a clean radial
hierarchy instead.

Do not number modules.

LAYOUT:
Use a clean, balanced composition with consistent spacing and alignment.

Nodes should be distributed according to their hierarchical relationship,
not randomly across the page.

Keep the structure immediately understandable:
ROOT → MAIN CONCEPTS → SUBCONCEPTS → DETAILS.

Use enough white space to keep branches readable without creating unnecessary
empty areas.

Avoid overlapping text and connectors.

NODES:
Represent concepts using simple geometric shapes such as rectangles,
rounded rectangles, circles, or simple outlined boxes.

Keep node shapes consistent throughout the map.

The root node may be slightly larger than the other nodes.

Use smaller nodes for secondary concepts and details.

Do not create decorative illustrations inside the nodes.

Keep the content inside each node extremely compact.

CONNECTORS:
Connect nodes using clean straight lines or gently curved arrows.

Every connector must communicate an actual relationship from the blueprint.

Use arrows when direction, sequence, cause, process, or dependency matters.

Use plain lines when only hierarchical association is needed.

Do not add decorative connections or unnecessary cross-links.

Do not create a dense web of intersecting lines.

TEXT:
Use clear formal printed typography.

Use ALL-CAPS for major module titles and standard case for supporting
information.

Keep labels and facts short and faithful to the blueprint.

Never turn compact facts into long explanations or paragraphs.

Do not generate fake text, pseudo-writing, invented labels, or unsupported
annotations.

HIGHLIGHTS:
The ==double equals== markers are instructions, not visible characters.
Do not draw them.

Highlight only the exact marked spans inside their original text.

Use a simple translucent accent-colour highlight behind the marked words.

Never highlight unmarked text and never extract highlighted terms into
separate nodes.

COLOUR:
Keep the visual language restrained and formal.

Use black or dark charcoal for text, outlines, and connectors.

Use one restrained accent colour such as teal or blue for selected nodes,
branches, or highlights.

Use muted red or yellow only when required to express warning, contrast,
or another meaningful semantic distinction.

Do not colour every node.

BACKGROUND:
Use a pristine bright white background.

No paper texture, ruled lines, graph paper, beige, cream, parchment,
grey cast, gradients, shadows, glossy effects, stickers, logos,
watermarks, or decorative backgrounds.

VISUALS:
Do not use illustrations, doodles, cartoons, people, objects, icons,
pictograms, or decorative drawings.

All visual communication must come from:
- nodes;
- text;
- arrows;
- connecting lines;
- brackets;
- simple tables;
- equations;
- relationships.

If the blueprint describes a process, represent it using connected nodes
and directional arrows rather than an illustration.

If the blueprint describes a classification, represent it as hierarchical
branches.

If the blueprint describes a comparison, represent it using parallel branches
or a small structured comparison table.

FINAL APPEARANCE:
The result should look like a classic university-level conceptual map:
simple, formal, hierarchical, geometric, uncluttered, and highly legible.

Visual style: pure formal concept map; classic tree hierarchy; bright white
background; geometric nodes; clean connecting lines; formal typography;
restrained colour; compact information; professional and highly legible.

Aspect Ratio: [3:4, 1:1, 9:16, 16:9]
`,
];
