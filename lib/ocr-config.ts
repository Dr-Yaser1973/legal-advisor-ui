 function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

const rawServiceUrl = (process.env.OCR_SERVICE_URL || "").trim();
const rawSecret = (process.env.OCR_WORKER_SECRET || "").trim();

export const OCR_CONFIG = {
  serviceUrl: rawServiceUrl ? normalizeUrl(rawServiceUrl) : "",
  secret: rawSecret,
  isReady: Boolean(rawServiceUrl && rawSecret),
};

// ===============================
// Logs تشغيل ذكية (بدون تسريب أسرار)
// ===============================
if (!rawServiceUrl) {
  console.error("❌ OCR_SERVICE_URL is missing");
} else {
  console.log("🧠 OCR_SERVICE_URL =", OCR_CONFIG.serviceUrl);
}

if (!rawSecret) {
  console.error("❌ OCR_WORKER_SECRET is missing");
} else {
  console.log("🧠 OCR_WORKER_SECRET loaded (length =", rawSecret.length, ")");
}

if (!OCR_CONFIG.isReady) {
  console.warn("⚠️ OCR CONFIG NOT READY — OCR calls will fail");
}
