//lib/external-sources/eurlex.ts
export type ExternalHit = {
  source: "EURLEX";
  externalId: string;
  title: string;
  url: string;
  publishedAt?: string | null;
  docType?: string | null;
  language?: string | null;
  jurisdiction?: string | null;
  raw?: any;
};

// SPARQL endpoint الخاص بمكتب منشورات الاتحاد الأوروبي (Cellar)
const CELLAR_SPARQL = "https://publications.europa.eu/webapi/rdf/sparql";

export async function searchEurLexByKeyword(q: string, limit = 10): Promise<ExternalHit[]> {
  // استعلام بسيط: يبحث في العنوان (skos:prefLabel) — قابل للتطوير لاحقًا
  const sparql = `
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

SELECT ?work ?title ?date WHERE {
  ?work dct:title ?title .
  OPTIONAL { ?work dct:date ?date . }
  FILTER (CONTAINS(LCASE(STR(?title)), LCASE("${escapeForSparql(q)}")))
}
LIMIT ${Math.min(25, Math.max(1, limit))}
`;

  const url = new URL(CELLAR_SPARQL);
  url.searchParams.set("query", sparql);
  url.searchParams.set("format", "application/sparql-results+json");

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`EUR-Lex(Cellar) SPARQL error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const bindings = data?.results?.bindings || [];

  return bindings.map((b: any) => {
    const work = String(b?.work?.value || "");
    const title = String(b?.title?.value || "Untitled");
    const date = b?.date?.value ? String(b.date.value) : null;

    return {
      source: "EURLEX",
      externalId: work,
      title,
      url: work, // غالبًا URI — يمكن لاحقًا تحويله لصفحة Eur-Lex
      publishedAt: date,
      docType: "eu_legal_document",
      language: null,
      jurisdiction: "EU",
      raw: b,
    };
  });
}

function escapeForSparql(s: string) {
  return s.replace(/["\\]/g, (m) => `\\${m}`);
}

