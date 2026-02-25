//lib/external-sources/courtlistener.ts
export type ExternalHit = {
  source: "COURTLISTENER";
  externalId: string;
  title: string;
  url: string;
  publishedAt?: string | null;
  docType?: string | null;
  language?: string | null;
  jurisdiction?: string | null;
  raw?: any;
};

const CL_BASE = "https://www.courtlistener.com/api/rest/v3";

export async function searchCourtListener(q: string, perPage = 10): Promise<ExternalHit[]> {
  const token = process.env.COURTLISTENER_API_TOKEN; // بعض endpoints قد تعمل بدونه لكن الأفضل وضعه
  const url = new URL(`${CL_BASE}/search/`);
  url.searchParams.set("q", q);
  url.searchParams.set("type", "o"); // opinions/clusters (مناسب للسوابق)
  url.searchParams.set("page_size", String(Math.min(25, Math.max(1, perPage))));

  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Token ${token}` } : {},
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CourtListener error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const results = Array.isArray(data?.results) ? data.results : [];

  return results.map((r: any) => ({
    source: "COURTLISTENER",
    externalId: String(r?.id || r?.absolute_url || ""),
    title: String(r?.caseName || r?.case_name || r?.citation || "Untitled"),
    url: r?.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : "https://www.courtlistener.com",
    publishedAt: r?.dateFiled || r?.date_filed || null,
    docType: "case_law",
    language: "en",
    jurisdiction: r?.court || r?.court_id || null,
    raw: r,
  }));
}

