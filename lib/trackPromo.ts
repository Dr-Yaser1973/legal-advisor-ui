// lib/trackPromo.ts
// تتبّع خفيف لأداء الإعلانات (ظهور/نقر) عبر beacon لا يعطّل التنقّل.
export function trackPromo(id: number, e: "click" | "impression") {
  if (typeof navigator === "undefined") return;
  try {
    const url = `/api/promo-banners/${id}/track?e=${e}`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      fetch(url, { method: "POST", keepalive: true }).catch(() => {});
    }
  } catch {
    /* التتبّع لا يجب أن يكسر أي شيء */
  }
}
