export function makeSnippet(text: string, q: string, maxLen = 220) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const query = (q || "").trim();
  if (!query) return clean.slice(0, maxLen) + (clean.length > maxLen ? "…" : "");

  const idx = clean.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return clean.slice(0, maxLen) + (clean.length > maxLen ? "…" : "");

  const start = Math.max(0, idx - Math.floor(maxLen / 3));
  const end = Math.min(clean.length, start + maxLen);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < clean.length ? "…" : "";
  return prefix + clean.slice(start, end) + suffix;
}

export function highlightHtml(snippet: string, q: string) {
  const query = (q || "").trim();
  if (!query) return escapeHtml(snippet);
  const safe = escapeHtml(snippet);
  const re = new RegExp(escapeRegExp(query), "ig");
  return safe.replace(re, (m) => `<mark class="rounded px-1 bg-yellow-500/20 text-yellow-200">${m}</mark>`);
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

