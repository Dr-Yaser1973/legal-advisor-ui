 // app/(site)/contracts/_components/incotermsFieldUi.ts

export type IncotermsTerm =
  | "EXW" | "FCA" | "FAS" | "FOB"
  | "CFR" | "CIF" | "CPT" | "CIP"
  | "DAP" | "DPU" | "DDP";

export type FieldUi = { label: string; hint?: string; order: number };
export type FieldUiMap = Record<string, FieldUi>;

/** دمج بسيط: base + overrides (overrides تفوز) */
function mergeUi(base: FieldUiMap, overrides?: FieldUiMap): FieldUiMap {
  return { ...base, ...(overrides || {}) };
}

/** =========================
 *  COMMON (AR) لكل العقود
 *  ========================= */
export const INCOTERMS_COMMON_UI_AR: FieldUiMap = {
  contractRef: { label: "رقم المرجع", hint: "مثال: INC-2025-001", order: 10 },
  contractDate: { label: "تاريخ العقد", hint: "YYYY-MM-DD", order: 20 },
  contractCity: { label: "مدينة الإبرام", order: 30 },

  sellerName: { label: "اسم البائع", order: 40 },
  sellerAddress: { label: "عنوان البائع", order: 50 },
  sellerReg: { label: "سجل/ترخيص البائع", order: 60 },

  buyerName: { label: "اسم المشتري", order: 70 },
  buyerAddress: { label: "عنوان المشتري", order: 80 },
  buyerReg: { label: "سجل/ترخيص المشتري", order: 90 },

  goodsDescription: { label: "وصف البضاعة", hint: "نوع/موديل/مواصفة قياسية", order: 100 },
  hsCode: { label: "رمز HS (اختياري)", order: 110 },
  quantity: { label: "الكمية", order: 120 },
  unit: { label: "وحدة القياس", hint: "طن / كغم / قطعة...", order: 130 },
  tolerance: { label: "نسبة التسامح", hint: "±5% مثلاً", order: 140 },

  unitPrice: { label: "سعر الوحدة", order: 150 },
  totalPrice: { label: "السعر الإجمالي", order: 160 },
  currency: { label: "العملة", hint: "USD / EUR ...", order: 170 },
  paymentTerms: { label: "شروط الدفع", hint: "اعتماد مستندي / تحويل / دفعات...", order: 180 },

  incotermsEdition: { label: "إصدار Incoterms", hint: "2020 (الأشيع)", order: 190 },

  portOfShipment: { label: "ميناء/مكان الشحن أو التسليم", order: 200 },
  portOfDestination: { label: "ميناء/مكان المقصد", order: 210 },
  deliverySchedule: { label: "موعد/جدول التسليم/الشحن", order: 220 },

  documentsList: { label: "قائمة المستندات", hint: "B/L, Invoice, Packing List, CO ...", order: 260 },
  inspection: { label: "الفحص والاستلام", hint: "جهة الفحص/مدة الاعتراض", order: 270 },

  packaging: { label: "التعبئة والتغليف", order: 280 },
  marking: { label: "الوسم/العلامات", order: 290 },
  forceMajeure: { label: "القوة القاهرة", order: 300 },

  governingLaw: { label: "القانون الواجب التطبيق", order: 310 },
  disputeResolution: { label: "فض النزاعات", hint: "محاكم/تحكيم/وساطة", order: 320 },
  arbitrationSeat: { label: "مقر التحكيم (إن وجد)", order: 330 },
  languagePrevails: { label: "لغة العقد المعتمدة", hint: "العربية/الإنجليزية/كلاهما", order: 340 },

  sellerSignName: { label: "اسم/صفة موقعّع البائع", order: 350 },
  sellerSignDate: { label: "تاريخ توقيع البائع", order: 360 },
  buyerSignName: { label: "اسم/صفة موقعّع المشتري", order: 370 },
  buyerSignDate: { label: "تاريخ توقيع المشتري", order: 380 },
};

/** =========================
 *  COMMON (EN) لكل العقود
 *  ========================= */
export const INCOTERMS_COMMON_UI_EN: FieldUiMap = {
  contractRef: { label: "Contract Reference", hint: "e.g., INC-2025-001", order: 10 },
  contractDate: { label: "Contract Date", hint: "YYYY-MM-DD", order: 20 },
  contractCity: { label: "Place of Execution", order: 30 },

  sellerName: { label: "Seller Name", order: 40 },
  sellerAddress: { label: "Seller Address", order: 50 },
  sellerReg: { label: "Seller Registration/License", order: 60 },

  buyerName: { label: "Buyer Name", order: 70 },
  buyerAddress: { label: "Buyer Address", order: 80 },
  buyerReg: { label: "Buyer Registration/License", order: 90 },

  goodsDescription: { label: "Goods Description", hint: "Type/Model/Standard Spec", order: 100 },
  hsCode: { label: "HS Code (Optional)", order: 110 },
  quantity: { label: "Quantity", order: 120 },
  unit: { label: "Unit of Measure", hint: "MT / KG / PCS ...", order: 130 },
  tolerance: { label: "Tolerance", hint: "e.g., ±5%", order: 140 },

  unitPrice: { label: "Unit Price", order: 150 },
  totalPrice: { label: "Total Price", order: 160 },
  currency: { label: "Currency", hint: "USD / EUR ...", order: 170 },
  paymentTerms: { label: "Payment Terms", hint: "L/C / TT / milestones ...", order: 180 },

  incotermsEdition: { label: "Incoterms® Edition", hint: "2020 (common)", order: 190 },

  portOfShipment: { label: "Place/Port of Delivery or Shipment", order: 200 },
  portOfDestination: { label: "Place/Port of Destination", order: 210 },
  deliverySchedule: { label: "Delivery/Shipment Schedule", order: 220 },

  documentsList: { label: "Documents List", hint: "B/L, Invoice, Packing List, COO ...", order: 260 },
  inspection: { label: "Inspection & Acceptance", hint: "Inspector/claim period", order: 270 },

  packaging: { label: "Packaging", order: 280 },
  marking: { label: "Marking", order: 290 },
  forceMajeure: { label: "Force Majeure", order: 300 },

  governingLaw: { label: "Governing Law", order: 310 },
  disputeResolution: { label: "Dispute Resolution", hint: "Courts/Arbitration/Mediation", order: 320 },
  arbitrationSeat: { label: "Arbitration Seat (if any)", order: 330 },
  languagePrevails: { label: "Prevailing Language", hint: "Arabic/English/Both", order: 340 },

  sellerSignName: { label: "Seller Signatory (Name/Title)", order: 350 },
  sellerSignDate: { label: "Seller Signature Date", order: 360 },
  buyerSignName: { label: "Buyer Signatory (Name/Title)", order: 370 },
  buyerSignDate: { label: "Buyer Signature Date", order: 380 },
};

/** =========================
 *  Overrides حسب Term
 *  (ضيف فقط الفروقات)
 *  ========================= */

// CIF/CIP عادة فيها تأمين
const INSURANCE_AR: FieldUiMap = {
  insuranceCoverage: { label: "نطاق التغطية التأمينية", hint: "ICC(A) أو حسب الاتفاق", order: 230 },
  insuranceCompany: { label: "شركة التأمين", order: 240 },
  insurancePolicyNo: { label: "رقم وثيقة/شهادة التأمين", order: 250 },
};
const INSURANCE_EN: FieldUiMap = {
  insuranceCoverage: { label: "Insurance Coverage", hint: "ICC(A) or as agreed", order: 230 },
  insuranceCompany: { label: "Insurer", order: 240 },
  insurancePolicyNo: { label: "Policy/Certificate No.", order: 250 },
};

// FCA يحتاج “مكان التسليم” بدقة + ناقل
const CARRIER_AR: FieldUiMap = {
  carrierName: { label: "الناقل/شركة الشحن", order: 235 },
  carrierRef: { label: "مرجع الحجز/الشحنة", order: 245 },
};
const CARRIER_EN: FieldUiMap = {
  carrierName: { label: "Carrier/Forwarder", order: 235 },
  carrierRef: { label: "Booking/Shipment Ref", order: 245 },
};

// EXW غالباً “مكان التسليم = منشأة البائع”
const EXW_TWEAK_AR: FieldUiMap = {
  portOfShipment: { label: "مكان التسليم (منشأة البائع)", order: 200 },
};
const EXW_TWEAK_EN: FieldUiMap = {
  portOfShipment: { label: "Place of Delivery (Seller’s Premises)", order: 200 },
};

// DAP/DPU/DDP تحتاج “مكان التسليم النهائي” أو “Terminal”
const DESTINATION_AR: FieldUiMap = {
  finalDeliveryPlace: { label: "مكان التسليم النهائي", hint: "عنوان/نقطة محددة", order: 205 },
};
const DESTINATION_EN: FieldUiMap = {
  finalDeliveryPlace: { label: "Final Place of Delivery", hint: "Exact address/point", order: 205 },
};

const DPU_TERMINAL_AR: FieldUiMap = {
  terminalName: { label: "اسم/محطة التفريغ (Terminal)", order: 206 },
};
const DPU_TERMINAL_EN: FieldUiMap = {
  terminalName: { label: "Terminal (Unloading Point)", order: 206 },
};

// DDP يحتاج جمارك/ضرائب (استيراد)
const DDP_IMPORT_AR: FieldUiMap = {
  importClearance: { label: "التخليص الجمركي/ضرائب الاستيراد", hint: "يتحملها البائع بموجب DDP", order: 207 },
};
const DDP_IMPORT_EN: FieldUiMap = {
  importClearance: { label: "Import Clearance & Duties/Taxes", hint: "Seller bears under DDP", order: 207 },
};

/** جدول overrides لكل Term */
export const INCOTERMS_OVERRIDES_AR: Record<IncotermsTerm, FieldUiMap> = {
  EXW: EXW_TWEAK_AR,
  FCA: CARRIER_AR,
  FAS: {},
  FOB: {},
  CFR: {},
  CIF: INSURANCE_AR,
  CPT: {},
  CIP: INSURANCE_AR,
  DAP: DESTINATION_AR,
  DPU: { ...DESTINATION_AR, ...DPU_TERMINAL_AR },
  DDP: { ...DESTINATION_AR, ...DDP_IMPORT_AR },
};

export const INCOTERMS_OVERRIDES_EN: Record<IncotermsTerm, FieldUiMap> = {
  EXW: EXW_TWEAK_EN,
  FCA: CARRIER_EN,
  FAS: {},
  FOB: {},
  CFR: {},
  CIF: INSURANCE_EN,
  CPT: {},
  CIP: INSURANCE_EN,
  DAP: DESTINATION_EN,
  DPU: { ...DESTINATION_EN, ...DPU_TERMINAL_EN },
  DDP: { ...DESTINATION_EN, ...DDP_IMPORT_EN },
};

/** API صغيرة ترجع UI النهائي حسب Term + لغة */
export function getIncotermsFieldUi(term: IncotermsTerm, lang: "ar" | "en"): FieldUiMap {
  if (lang === "ar") return mergeUi(INCOTERMS_COMMON_UI_AR, INCOTERMS_OVERRIDES_AR[term]);
  return mergeUi(INCOTERMS_COMMON_UI_EN, INCOTERMS_OVERRIDES_EN[term]);
}
