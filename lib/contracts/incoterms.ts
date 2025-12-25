// lib/contracts/incoterms.ts
export const INCOTERMS_11 = [
  { code: "EXW", labelEn: "Ex Works", labelAr: "تسليم في مقر البائع" },
  { code: "FCA", labelEn: "Free Carrier", labelAr: "تسليم للناقل" },
  { code: "FAS", labelEn: "Free Alongside Ship", labelAr: "تسليم بمحاذاة السفينة" },
  { code: "FOB", labelEn: "Free On Board", labelAr: "تسليم على ظهر السفينة" },
  { code: "CFR", labelEn: "Cost and Freight", labelAr: "تكلفة وأجور الشحن" },
  { code: "CIF", labelEn: "Cost, Insurance and Freight", labelAr: "تكلفة وتأمين وأجور الشحن" },
  { code: "CPT", labelEn: "Carriage Paid To", labelAr: "أجور النقل مدفوعة إلى" },
  { code: "CIP", labelEn: "Carriage and Insurance Paid To", labelAr: "أجور النقل والتأمين مدفوعة إلى" },
  { code: "DAP", labelEn: "Delivered At Place", labelAr: "تسليم في المكان" },
  { code: "DPU", labelEn: "Delivered at Place Unloaded", labelAr: "تسليم في المكان بعد التفريغ" },
  { code: "DDP", labelEn: "Delivered Duty Paid", labelAr: "تسليم مع دفع الرسوم" },
] as const;

