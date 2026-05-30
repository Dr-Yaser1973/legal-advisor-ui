//lib/contracts/catalog/pro/supply.ts
import type { ContractTemplate } from "../engine/types";
export const SUPPLY_AR: ContractTemplate = {
  id: 1501,
  slug: "pro-supply-ar",
  title: "عقد توريد (PRO) — عربي",
  lang: "ar",
  group: "PRO",

  fields: [
    // ── معلومات العقد ──
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد" },

    // ── المشتري ──
    { key: "buyerName", label: "اسم المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerId", label: "هوية/سجل المشتري", required: true, type: "text", group: "المشتري" },

    // ── المورد ──
    { key: "supplierName", label: "اسم المورد", required: true, type: "text", group: "المورد" },
    { key: "supplierId", label: "هوية/سجل المورد", required: true, type: "text", group: "المورد" },

    // ── المواد ──
    { key: "goodsDescription", label: "وصف المواد/المنتجات", required: true, type: "textarea", group: "المواد" },
    { key: "quantity", label: "الكمية", required: true, type: "text", group: "المواد" },

    // ── السعر والدفع ──
    { key: "unitPrice", label: "سعر الوحدة", required: true, type: "number", group: "السعر والدفع" },
    { key: "totalPrice", label: "القيمة الإجمالية", required: true, type: "number", group: "السعر والدفع" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "السعر والدفع",
      options: ["دينار عراقي", "دولار أمريكي", "يورو"] },
    { key: "paymentTerms", label: "شروط الدفع", required: true, type: "textarea", group: "السعر والدفع" },

    // ── التسليم ──
    { key: "deliveryLocation", label: "مكان التسليم", required: true, type: "text", group: "التسليم" },
    { key: "deliveryDate", label: "موعد التسليم", required: true, type: "date", group: "التسليم" },

    // ── أحكام ──
    { key: "delayPenalty", label: "غرامة التأخير", required: false, type: "textarea", group: "أحكام" },
    { key: "inspectionClause", label: "آلية الفحص والاستلام", required: false, type: "textarea", group: "أحكام" },
    { key: "terminationClause", label: "إنهاء العقد", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الحاكم", required: false, type: "text", group: "أحكام",
      placeholder: "القانون المدني العراقي رقم 40 لسنة 1951" },
    { key: "disputeCity", label: "الاختصاص القضائي", required: false, type: "text", group: "أحكام",
      placeholder: "بغداد" },
  ],
  html: `
<div class="doc" dir="rtl" lang="ar">

  <h2>عقد توريد (PRO)</h2>

  <p><b>رقم العقد:</b> {{contractRef}}</p>
  <p><b>التاريخ:</b> {{contractDate}}</p>
  <p><b>المكان:</b> {{contractCity}}</p>

  <h3>أولاً: أطراف العقد</h3>
  <p><b>المشتري:</b> {{buyerName}} ({{buyerId}})</p>
  <p><b>المورد:</b> {{supplierName}} ({{supplierId}})</p>

  <h3>ثانياً: موضوع العقد</h3>
  <p>يلتزم المورد بتوريد المنتجات التالية:</p>
  <p>{{goodsDescription}}</p>
  <p><b>الكمية:</b> {{quantity}}</p>

  <h3>ثالثاً: السعر والدفع</h3>
  <p><b>سعر الوحدة:</b> {{unitPrice}} {{currency}}</p>
  <p><b>القيمة الإجمالية:</b> {{totalPrice}} {{currency}}</p>
  <p><b>شروط الدفع:</b> {{paymentTerms}}</p>

  <h3>رابعاً: التسليم</h3>
  <p><b>مكان التسليم:</b> {{deliveryLocation}}</p>
  <p><b>موعد التسليم:</b> {{deliveryDate}}</p>

  <h3>خامساً: الفحص والاستلام</h3>
  <p>{{inspectionClause}}</p>

  <h3>سادساً: غرامة التأخير</h3>
  <p>{{delayPenalty}}</p>

  <h3>سابعاً: إنهاء العقد</h3>
  <p>{{terminationClause}}</p>

  <h3>ثامناً: القانون والاختصاص</h3>
  <p><b>القانون الحاكم:</b> {{governingLaw}}</p>
  <p><b>الاختصاص القضائي:</b> {{disputeCity}}</p>

  <br/><br/>
  <div>
    <b>توقيع المشتري:</b> ___________________
  </div>
  <br/>
  <div>
    <b>توقيع المورد:</b> ___________________
  </div>

</div>
`.trim(),
};

export const SUPPLY_EN: ContractTemplate = {
  id: 1502,
  slug: "pro-supply-en",
  title: "Supply Agreement (PRO) — English",
  lang: "en",
  group: "PRO",

  fields: [
    // ── Contract Info ──
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info" },

    // ── Buyer ──
    { key: "buyerName", label: "Buyer Name", required: true, type: "text", group: "Buyer" },
    { key: "buyerId", label: "Buyer ID/Registration", required: true, type: "text", group: "Buyer" },

    // ── Supplier ──
    { key: "supplierName", label: "Supplier Name", required: true, type: "text", group: "Supplier" },
    { key: "supplierId", label: "Supplier ID/Registration", required: true, type: "text", group: "Supplier" },

    // ── Goods ──
    { key: "goodsDescription", label: "Description of Goods", required: true, type: "textarea", group: "Goods" },
    { key: "quantity", label: "Quantity", required: true, type: "text", group: "Goods" },

    // ── Price & Payment ──
    { key: "unitPrice", label: "Unit Price", required: true, type: "number", group: "Price & Payment" },
    { key: "totalPrice", label: "Total Price", required: true, type: "number", group: "Price & Payment" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Price & Payment",
      options: ["IQD", "USD", "EUR"] },
    { key: "paymentTerms", label: "Payment Terms", required: true, type: "textarea", group: "Price & Payment" },

    // ── Delivery ──
    { key: "deliveryLocation", label: "Delivery Location", required: true, type: "text", group: "Delivery" },
    { key: "deliveryDate", label: "Delivery Date", required: true, type: "date", group: "Delivery" },

    // ── Provisions ──
    { key: "delayPenalty", label: "Delay Penalty", required: false, type: "textarea", group: "Provisions" },
    { key: "inspectionClause", label: "Inspection & Acceptance", required: false, type: "textarea", group: "Provisions" },
    { key: "terminationClause", label: "Termination Clause", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions",
      placeholder: "Iraqi Civil Code No. 40 of 1951" },
    { key: "disputeCity", label: "Jurisdiction/Court", required: false, type: "text", group: "Provisions",
      placeholder: "Baghdad" },
  ],

  html: `
<div class="doc" dir="ltr" lang="en">

  <h2>Supply Agreement (PRO)</h2>

  <p><b>Ref:</b> {{contractRef}}</p>
  <p><b>Date:</b> {{contractDate}}</p>
  <p><b>Place:</b> {{contractCity}}</p>

  <h3>1. Parties</h3>
  <p><b>Buyer:</b> {{buyerName}} ({{buyerId}})</p>
  <p><b>Supplier:</b> {{supplierName}} ({{supplierId}})</p>

  <h3>2. Subject Matter</h3>
  <p>The Supplier agrees to supply the following goods:</p>
  <p>{{goodsDescription}}</p>
  <p><b>Quantity:</b> {{quantity}}</p>

  <h3>3. Price & Payment</h3>
  <p><b>Unit Price:</b> {{unitPrice}} {{currency}}</p>
  <p><b>Total Price:</b> {{totalPrice}} {{currency}}</p>
  <p><b>Payment Terms:</b> {{paymentTerms}}</p>

  <h3>4. Delivery</h3>
  <p><b>Delivery Location:</b> {{deliveryLocation}}</p>
  <p><b>Delivery Date:</b> {{deliveryDate}}</p>

  <h3>5. Inspection & Acceptance</h3>
  <p>{{inspectionClause}}</p>

  <h3>6. Delay Damages</h3>
  <p>{{delayPenalty}}</p>

  <h3>7. Termination</h3>
  <p>{{terminationClause}}</p>

  <h3>8. Governing Law & Jurisdiction</h3>
  <p><b>Governing Law:</b> {{governingLaw}}</p>
  <p><b>Jurisdiction:</b> {{disputeCity}}</p>

  <br/><br/>
  <div>
    <b>Buyer Signature:</b> ___________________
  </div>
  <br/>
  <div>
    <b>Supplier Signature:</b> ___________________
  </div>

</div>
`.trim(),
};
