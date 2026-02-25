//lip/external-sources/openalex.ts
export type ExternalHit = {
  source: "OPENALEX";
  externalId: string;
  title: string;
  url: string;
  publishedAt?: string | null;
  docType?: string | null;
  language?: string | null;
  jurisdiction?: string | null;
  raw?: any;
};

const OPENALEX_BASE = "https://api.openalex.org";

export async function searchOpenAlexWorks(q: string, perPage = 10): Promise<ExternalHit[]> {
  const apiKey = process.env.OPENALEX_API_KEY; // اختياري لكنه مُستحسن
  const url = new URL(`${OPENALEX_BASE}/works`);
  url.searchParams.set("search", q);
  url.searchParams.set("per_page", String(Math.min(25, Math.max(1, perPage))));

  const res = await fetch(url.toString(), {
    headers: apiKey ? { "Authorization": `Bearer ${apiKey}` } : {},
    // OpenAlex يقبل بدون Authorization أيضًا، لكن المفتاح يحسّن الحصص في بعض الحالات
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAlex error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const results = Array.isArray(data?.results) ? data.results : [];

  return results.map((r: any) => ({
    source: "OPENALEX",
    externalId: String(r?.id || ""), // OpenAlex ID
    title: String(r?.title || "Untitled"),
    url: String(r?.id || r?.primary_location?.landing_page_url || ""),
    publishedAt: r?.publication_date || null,
    docType: r?.type || "academic_work",
    language: r?.language || null,
    jurisdiction: null,
    raw: r,
  }));
}

