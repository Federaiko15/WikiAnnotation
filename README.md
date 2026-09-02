# WikiAnnotation

> Generazione di appunti visuali e mappe concettuali a partire da contenuti enciclopedici, con l’aiuto di Wikipedia e modelli di intelligenza artificiale.

## Stato del progetto

🚧 **Work in progress**

WikiAnnotation è un’applicazione sperimentale che esplora una pipeline automatizzata per trasformare una voce Wikipedia in una sintesi didattica visuale.

L’obiettivo è aiutare studenti e utenti a comprendere e ripassare argomenti complessi attraverso:

- ricerca di argomenti su Wikipedia;
- recupero del contenuto della voce selezionata;
- pulizia e suddivisione del testo in sezioni;
- generazione di un blueprint educativo strutturato;
- trasformazione del blueprint in un’infografica manoscritta;
- collegamento permanente alla fonte originale.

## Obiettivo

L’applicazione parte da un argomento scelto dall’utente, ad esempio:

```text
Alessandro Magno
```

oppure:

```text
Seconda guerra mondiale
```

Il contenuto della voce Wikipedia viene quindi elaborato in più fasi, con l’obiettivo di ottenere appunti sintetici e visivamente organizzati.

## Pipeline applicativa

```text
Ricerca dell’argomento
        ↓
Selezione della voce Wikipedia
        ↓
Recupero dell’HTML della pagina
        ↓
Parsing e pulizia con Cheerio
        ↓
Suddivisione in sezioni e contenuti utili
        ↓
Agente educativo: HTML pulito → blueprint
        ↓
Agente visuale: blueprint → prompt per immagine
        ↓
Generazione dell’infografica
        ↓
Visualizzazione degli appunti e della fonte
```

La separazione in due agenti consente di distinguere il contenuto dalla sua rappresentazione grafica:

1. il primo agente seleziona e organizza le informazioni;
2. il secondo agente prepara le istruzioni visuali per la generazione dell’immagine.

## Funzionalità previste

- Ricerca di pagine Wikipedia tramite testo libero.
- Supporto per più lingue di Wikipedia.
- Visualizzazione dei risultati di ricerca.
- Apertura della pagina originale selezionata.
- Recupero del contenuto esteso della voce.
- Parsing dell’HTML e rimozione degli elementi non utili.
- Suddivisione dei contenuti in moduli didattici.
- Generazione di blueprint strutturati in formato JSON.
- Generazione di appunti visuali tramite OpenAI Image API.
- Evidenziazione di parole chiave e concetti importanti.
- Possibilità futura di creare quiz, schemi testuali e mappe interattive.

## Esempi di output

Gli output visuali sono pensati come appunti didattici in stile sketchnote: titolo centrale, moduli tematici, timeline, mappe, diagrammi, doodle e collegamenti fra concetti.

### Alessandro Magno

![Appunti visuali su Alessandro Magno](./assets/alessandro-magno.jpg)

L’infografica organizza informazioni relative a identità, formazione, ascesa al trono, campagne militari, governo, integrazione culturale e spedizione in India.

### Seconda guerra mondiale

![Appunti visuali sulla Seconda guerra mondiale](./assets/seconda-guerra-mondiale.jpg)

L’infografica rappresenta cronologia, alleanze, teatri principali, tattiche e tecnologie, crimini, resistenza e conseguenze geopolitiche.

### Interazione ormone–ambiente

![Appunti visuali sull’interazione ormone-ambiente](./assets/interazione-ormone-ambiente.jpg)

L’infografica mostra le relazioni fra ormoni, ambiente, genetica, stress, epigenetica, recettori e risposta comportamentale.

> **Nota:** salva le immagini nella cartella `assets/` usando questi nomi:
>
> ```text
> assets/
> ├── alessandro-magno.png
> ├── seconda-guerra-mondiale.png
> └── interazione-ormone-ambiente.png
> ```

## Architettura prevista

```text
app/
├── api/
│   ├── notes/
│   │   ├── blueprint/
│   │   │   └── route.ts
│   │   └── image/
│   │       └── route.ts
│   └── wiki/
│       └── parse/
│           └── route.ts
│
├── article/
│   └── [title]/
│       ├── page.tsx
│       └── concept-map/
│           └── page.tsx
│
└── page.tsx

components/
├── article/
│   └── CreateConceptMapButton.tsx
└── notes/
    └── GenerateVisualNotesButton.tsx

lib/
├── ai/
│   ├── agents/
│   ├── prompts/
│   ├── schemas/
│   └── services/
└── wikipedia/
    ├── parseWikipediaPage.ts
    └── types.ts
```

## Tecnologie

- **Next.js** — framework full-stack basato su React.
- **TypeScript** — tipizzazione statica e organizzazione del codice.
- **Cheerio** — parsing e manipolazione dell’HTML lato server.
- **Wikipedia / Wikimedia API** — ricerca e recupero delle voci.
- **OpenAI API** — generazione del blueprint e delle immagini.
- **Vercel AI SDK** — integrazione TypeScript con modelli linguistici e output strutturati.
- **Zod** — validazione degli input e degli output JSON.
- **Tailwind CSS** — styling dell’interfaccia, se abilitato nel progetto.

## Struttura degli agenti

### Agente 1: Educational Blueprint Agent

Riceve:

- titolo dell’articolo;
- livello di apprendimento;
- lingua di output;
- sezioni HTML ripulite;
- contenuti testuali estratti.

Restituisce un blueprint strutturato con:

- argomento centrale;
- tipo di argomento;
- rappresentazione visuale centrale;
- 6–8 moduli tematici;
- fatti essenziali;
- date, nomi e relazioni;
- parole chiave da evidenziare;
- visualizzazione consigliata per ogni modulo.

### Agente 2: Visual Prompt Agent

Riceve il blueprint validato e lo combina con un prompt visuale fisso, responsabile di:

- stile sketchnote;
- disposizione dei moduli;
- palette cromatica;
- tipo di doodle;
- frecce e connessioni;
- evidenziazione delle parole chiave;
- rapporto d’aspetto dell’immagine.

L’output viene quindi inviato all’API di generazione immagini.

## Endpoint principali

### Generazione del blueprint

```http
POST /api/notes/blueprint
Content-Type: application/json
```

Body di esempio:

```json
{
  "language": "it",
  "pageKey": "Alessandro_Magno",
  "learningLevel": "university",
  "outputLanguage": "it"
}
```

Risposta prevista:

```json
{
  "source": {
    "title": "Alessandro Magno",
    "url": "https://it.wikipedia.org/wiki/Alessandro_Magno",
    "language": "it",
    "pageKey": "Alessandro_Magno"
  },
  "blueprint": {
    "topic": "Alessandro Magno",
    "subjectType": "person",
    "modules": []
  }
}
```

### Generazione dell’immagine

```http
POST /api/notes/image
Content-Type: application/json
```

Body di esempio:

```json
{
  "blueprint": {
    "topic": "Alessandro Magno",
    "subjectType": "person",
    "modules": []
  },
  "aspectRatio": "3:4"
}
```

Risposta prevista:

```json
{
  "mimeType": "image/png",
  "imageBase64": "...",
  "finalImagePrompt": "..."
}
```

## Configurazione locale

Crea un file `.env.local` nella root del progetto:

```env
OPENAI_API_KEY=la_tua_chiave_openai
```

La variabile deve essere utilizzata esclusivamente lato server. Non usare il prefisso `NEXT_PUBLIC_`, perché renderebbe la chiave accessibile al browser.

Dopo aver modificato `.env.local`, riavvia il server di sviluppo:

```bash
npm run dev
```

## Installazione

```bash
npm install
```

Per installare le dipendenze principali:

```bash
npm install cheerio zod ai @ai-sdk/openai openai
```

Avvia l’applicazione in modalità sviluppo:

```bash
npm run dev
```

L’app sarà disponibile all’indirizzo indicato dal server Next.js, normalmente:

```text
http://localhost:3000
```

## Considerazioni sul contenuto

Il contenuto utilizzato dall’applicazione proviene da Wikipedia e viene rielaborato attraverso modelli di intelligenza artificiale. Gli appunti generati non devono essere considerati una fonte primaria o una sostituzione dell’articolo originale.

L’applicazione dovrebbe sempre mostrare:

- il titolo della voce originale;
- il link alla pagina Wikipedia;
- la lingua della fonte;
- l’indicazione che il contenuto è stato rielaborato dall’IA;
- un avviso che invita a verificare le informazioni sulla fonte originale.

Esempio di avviso:

> Appunti generati dall’intelligenza artificiale a partire dalla voce Wikipedia indicata. Verifica sempre il contenuto sulla fonte originale.

Quando riutilizzi contenuti Wikipedia, verifica e applica correttamente i requisiti di attribuzione e licenza Creative Commons BY-SA applicabili al contenuto della voce. [Wikimedia — Content reuse](https://www.mediawiki.org/wiki/Wikimedia_APIs/Content_reuse)

## Limitazioni attuali

- La qualità del risultato dipende dalla struttura e dalla lunghezza della voce Wikipedia.
- Gli articoli molto lunghi richiedono chunking e sintesi intermedie.
- Le immagini generate possono contenere errori tipografici, soprattutto con date e testi estesi.
- La generazione delle immagini richiede una chiave API OpenAI e può avere un costo.
- Il blueprint deve essere mantenuto compatto per evitare infografiche sovraccariche.
- Il parser HTML potrebbe richiedere regole aggiuntive per tabelle e strutture particolari.
- L’immagine generata deve essere considerata un supporto visuale, non una fonte documentale.

## Sviluppi futuri

- Supporto a più provider LLM e image generation.
- Gestione completa del chunking per articoli molto lunghi.
- Streaming del progresso della generazione.
- Salvataggio delle mappe personali dell’utente.
- Modifica manuale del blueprint prima di generare l’immagine.
- Versione testuale accessibile degli appunti visuali.
- Esportazione in PNG e PDF.
- Generazione automatica di quiz e flashcard.
- Mappa concettuale realmente interattiva con nodi cliccabili.
- Riferimenti delle singole informazioni alle sezioni originali.
- Cache delle risposte Wikipedia e dei blueprint già generati.
- Sistema di limiti e crediti per controllare i costi API.

## Licenza

Aggiungi qui la licenza scelta per il codice del progetto, ad esempio MIT:

```text
MIT License
```

Il codice dell’applicazione e i contenuti provenienti da Wikipedia possono essere soggetti a condizioni diverse. Specifica chiaramente nel repository quali parti sono software originale e quali contenuti o immagini derivano da fonti esterne.

## Autore

Sviluppato da **Federico Gueli**.

Progetto sperimentale dedicato all’incontro tra sviluppo full-stack, intelligenza artificiale e strumenti didattici visuali.
 
