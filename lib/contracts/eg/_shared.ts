// lib/contracts/eg/_shared.ts
// أنماط CSS مشتركة لقوالب العقود المصرية (لتقليل التكرار وضمان الاتساق البصري
// مع قوالب PRO القائمة). تُحقن داخل html كل قالب.

export const AR_CSS = `
  <style>
    .rtl{direction:rtl;text-align:right}
    .doc{font-family:"Noto Naskh Arabic","Amiri",Arial,sans-serif;font-size:16px;line-height:1.9;color:#111;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
    .header{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:12px}
    .title{font-size:20px;font-weight:800;margin-bottom:2px}
    .subtitle{font-size:12px;color:#444;margin-bottom:10px}
    .meta{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#222}
    .k{color:#444}
    .box{border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin:10px 0}
    .h{font-size:15px;font-weight:800;margin-bottom:10px}
    .p{margin:6px 0}
    .note{margin-top:10px;font-size:12px;color:#333}
    .muted{color:#666;font-size:12px}
    .tbl{width:100%;border-collapse:collapse}
    .tbl td{border:1px solid #e5e7eb;padding:10px;vertical-align:top}
    .th{width:120px;background:#f7f7f7;font-weight:800}
    .ol{margin:0;padding-right:18px}
    .ol li{margin:6px 0}
    .clause{margin-top:8px;padding:10px;border-radius:12px;background:#fafafa;border:1px dashed #e5e7eb}
    .signs{display:flex;gap:12px;margin-top:14px}
    .sig{flex:1;border:1px solid #e5e7eb;border-radius:14px;padding:12px}
    .sig-h{font-weight:800;margin-bottom:10px}
    .sig-line{height:26px;border-bottom:1px solid #111}
    .sig-name{margin-top:8px;font-size:12px;color:#333}
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>
`;

export const EN_CSS = `
  <style>
    .doc{font-family:Arial,sans-serif;line-height:1.8;font-size:16px;color:#111;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:1px solid #ddd;padding-bottom:10px;margin-bottom:14px}
    .title{font-size:18px;font-weight:700}
    .meta{font-size:12px;color:#444}
    .box{border:1px solid #e5e5e5;border-radius:12px;padding:12px;margin:10px 0}
    .sec{margin:14px 0}
    .sec h3{margin:0 0 6px;font-size:14px}
    .row{display:flex;gap:12px;flex-wrap:wrap}
    .row > div{flex:1;min-width:220px}
    .muted{color:#555;font-size:12px}
    .sig{display:flex;gap:18px;margin-top:18px}
    .sig .sbox{flex:1;border:1px dashed #bbb;border-radius:12px;padding:12px;min-height:110px}
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>
`;
