 import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const FCA_AR: ContractTemplate = {
  id: 2070,
  slug: "incoterms-fca-premium-ar",
  title: "عقد بيع دولي – FCA (Incoterms®)",
  lang: "ar",
  group: "INCOTERMS",

  fields: [
    { key: "contractRef", label: "رقم المرجع", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد" },
    { key: "incotermsEdition", label: "إصدار Incoterms", required: true, type: "select", group: "معلومات العقد",
      options: ["2020", "2010"] },
    { key: "sellerName", label: "اسم البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerAddress", label: "عنوان البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerReg", label: "السجل/الترخيص", required: false, type: "text", group: "البائع" },
    { key: "buyerName", label: "اسم المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerAddress", label: "عنوان المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerReg", label: "السجل/الترخيص", required: false, type: "text", group: "المشتري" },
    { key: "goodsDescription", label: "وصف البضاعة", required: true, type: "textarea", group: "البضاعة" },
    { key: "hsCode", label: "رمز HS (اختياري)", required: false, type: "text", group: "البضاعة" },
    { key: "quantity", label: "الكمية", required: true, type: "text", group: "البضاعة" },
    { key: "unit", label: "الوحدة", required: true, type: "text", group: "البضاعة", placeholder: "طن، قطعة، كرتون" },
    { key: "tolerance", label: "نسبة التسامح", required: false, type: "text", group: "البضاعة", placeholder: "±5%" },
    { key: "unitPrice", label: "سعر الوحدة", required: true, type: "number", group: "السعر والدفع" },
    { key: "totalPrice", label: "السعر الإجمالي", required: true, type: "number", group: "السعر والدفع" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "السعر والدفع",
      options: ["دولار أمريكي", "يورو", "دينار عراقي"] },
    { key: "paymentTerms", label: "شروط الدفع", required: true, type: "textarea", group: "السعر والدفع",
      placeholder: "مثال: اعتماد مستندي L/C" },
    // FCA-specific
    { key: "namedPlace", label: "مكان التسليم المحدد", required: true, type: "text", group: "التسليم",
      placeholder: "مستودع البائع، محطة الشحن، المطار..." },
    { key: "deliverySchedule", label: "جدول التسليم", required: true, type: "text", group: "التسليم" },
    { key: "modeOfTransport", label: "وسيلة النقل", required: false, type: "select", group: "التسليم",
      options: ["بري", "بحري", "جوي", "متعدد الوسائط"] },
    { key: "carrierDetails", label: "تفاصيل الناقل", required: false, type: "textarea", group: "التسليم",
      placeholder: "اسم شركة الشحن، رقم التعاقد" },
    { key: "onBoardNotation", label: "تدوين الشحن على بوليصة الشحن (FCA 2020)", required: false, type: "textarea", group: "التسليم",
      placeholder: "إذا طلب المشتري بوليصة شحن بحري تتضمن تدوين 'على متن السفينة' وفق FCA Incoterms 2020" },
    { key: "documentsList", label: "المستندات المطلوبة", required: true, type: "textarea", group: "المستندات والفحص",
      placeholder: "الفاتورة التجارية، وثيقة النقل، شهادة المنشأ" },
    { key: "inspection", label: "الفحص والمعاينة", required: false, type: "textarea", group: "المستندات والفحص" },
    { key: "packaging", label: "التعبئة والتغليف", required: false, type: "textarea", group: "المستندات والفحص" },
    { key: "marking", label: "الوسم/العلامات", required: false, type: "text", group: "المستندات والفحص" },
    { key: "forceMajeure", label: "القوة القاهرة", required: false, type: "textarea", group: "أحكام قانونية" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام قانونية" },
    { key: "disputeResolution", label: "آلية فض النزاعات", required: true, type: "textarea", group: "أحكام قانونية",
      placeholder: "التحكيم وفق قواعد غرفة التجارة الدولية" },
    { key: "arbitrationSeat", label: "مقر التحكيم (إن وجد)", required: false, type: "text", group: "أحكام قانونية" },
    { key: "languagePrevails", label: "لغة العقد المعتمدة", required: false, type: "select", group: "أحكام قانونية",
      options: ["العربية", "الإنجليزية"] },
    { key: "sellerSignName", label: "اسم موقع البائع", required: true, type: "text", group: "التواقيع" },
    { key: "sellerSignDate", label: "تاريخ توقيع البائع", required: false, type: "date", group: "التواقيع" },
    { key: "buyerSignName", label: "اسم موقع المشتري", required: true, type: "text", group: "التواقيع" },
    { key: "buyerSignDate", label: "تاريخ توقيع المشتري", required: false, type: "date", group: "التواقيع" },
  ],

  html: `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family:Arial,"Noto Naskh Arabic","Amiri",sans-serif;padding:28px;line-height:1.9;color:#111;font-size:13.5px;}
    h1{font-size:20px;margin:0 0 10px;text-align:center;}
    h2{font-size:14px;margin:18px 0 8px;}
    .meta{font-size:12px;color:#444;margin:6px 0 14px;text-align:right;}
    .box{border:1px solid #ddd;border-radius:12px;padding:12px 14px;margin:10px 0;}
    table{width:100%;border-collapse:collapse;margin-top:6px;}
    td,th{border:1px solid #e2e2e2;padding:8px;font-size:12px;vertical-align:top;text-align:right;}
    th{background:#f6f6f6;}
    .muted{color:#666;font-size:12px;}
    .small{font-size:11px;color:#555;}
    .sign td{height:90px;}
    ul{margin:6px 18px;}li{margin:4px 0;}
  </style>
</head>
<body>

<h1>عقد بيع دولي وفق شرط FCA (Incoterms® {{incotermsEdition}})</h1>
<div class="meta">
  رقم المرجع: <b>{{contractRef}}</b> &nbsp;|&nbsp;
  تاريخ العقد: <b>{{contractDate}}</b> &nbsp;|&nbsp;
  مدينة الإبرام: <b>{{contractCity}}</b>
</div>

<div class="box">
  <h2>أولاً: أطراف العقد</h2>
  <table>
    <tr>
      <th style="width:20%">البائع</th>
      <td>{{sellerName}}<br/><span class="muted">العنوان:</span> {{sellerAddress}}<br/><span class="muted">السجل:</span> {{sellerReg}}</td>
    </tr>
    <tr>
      <th>المشتري</th>
      <td>{{buyerName}}<br/><span class="muted">العنوان:</span> {{buyerAddress}}<br/><span class="muted">السجل:</span> {{buyerReg}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>ثانياً: التعاريف والمرجعية</h2>
  <p>يُقصد بشرط <b>FCA (التسليم إلى الناقل)</b> ما ورد تعريفه في <b>قواعد Incoterms® {{incotermsEdition}}</b> الصادرة عن ICC.</p>
  <p class="small">
    FCA مرن ومناسب لجميع وسائط النقل بما فيها الحاويات. يتم التسليم عند تسليم البضاعة للناقل
    الذي يعيّنه المشتري في المكان المحدد. إذا كان المكان في مقر البائع، يتحمل البائع التحميل.
    إذا كان في مكان آخر، تنتقل المخاطر عند وضع البضاعة تحت تصرف الناقل.
  </p>
</div>

<div class="box">
  <h2>ثالثاً: البضاعة والكمية والسعر</h2>
  <table>
    <tr><th>وصف البضاعة</th><th>رمز HS</th><th>الكمية</th><th>الوحدة</th><th>نسبة التسامح</th></tr>
    <tr><td>{{goodsDescription}}</td><td>{{hsCode}}</td><td>{{quantity}}</td><td>{{unit}}</td><td>{{tolerance}}</td></tr>
  </table>
  <table>
    <tr><th>سعر الوحدة</th><th>السعر الإجمالي</th><th>العملة</th><th>شروط الدفع</th></tr>
    <tr><td>{{unitPrice}}</td><td>{{totalPrice}}</td><td>{{currency}}</td><td>{{paymentTerms}}</td></tr>
  </table>
</div>

<div class="box">
  <h2>رابعاً: التسليم وفق FCA</h2>
  <table>
    <tr><th style="width:35%">مكان التسليم المحدد</th><td><b>{{namedPlace}}</b></td></tr>
    <tr><th>جدول التسليم</th><td>{{deliverySchedule}}</td></tr>
    <tr><th>وسيلة النقل</th><td>{{modeOfTransport}}</td></tr>
    <tr><th>تفاصيل الناقل</th><td>{{carrierDetails}}</td></tr>
  </table>
  <ul>
    <li>يتم التسليم عند تسليم البضاعة للناقل المعيَّن من المشتري في المكان المحدد أعلاه.</li>
    <li>إذا كان مكان التسليم في مقر البائع: يتحمل البائع تحميل البضاعة على وسيلة النقل.</li>
    <li>إذا كان مكان التسليم في موقع آخر: تنتقل المخاطر عند وضع البضاعة تحت تصرف الناقل دون تفريغها من وسيلة النقل الأولى.</li>
    <li>يلتزم البائع بإنهاء إجراءات التصدير الجمركي.</li>
  </ul>
</div>

<div class="box">
  <h2>خامساً: تدوين الشحن على بوليصة الشحن (FCA 2020)</h2>
  <p>{{onBoardNotation}}</p>
  <p class="small">
    وفق تعديل Incoterms® 2020: يحق للمشتري توجيه الناقل لإصدار بوليصة شحن بحري تتضمن تدوين
    "على متن السفينة" لصالح البائع، مما يمكّن البائع من تقديمها ضمن مستندات الاعتماد المستندي.
  </p>
</div>

<div class="box">
  <h2>سادساً: انتقال المخاطر والتكاليف</h2>
  <ul>
    <li>تنتقل مخاطر الهلاك أو التلف إلى المشتري عند إتمام التسليم في <b>{{namedPlace}}</b>.</li>
    <li>يتحمل المشتري جميع تكاليف النقل الرئيسي والتأمين والرسوم الجمركية للاستيراد.</li>
    <li>يتحمل البائع تكاليف التصدير الجمركي والنقل حتى مكان التسليم.</li>
  </ul>
</div>

<div class="box">
  <h2>سابعاً: المستندات والفحص</h2>
  <p>يلتزم البائع بتقديم: <b>{{documentsList}}</b>.</p>
  <p>الفحص والاستلام: <b>{{inspection}}</b>.</p>
  <p>التعبئة والتغليف: <b>{{packaging}}</b> — الوسم: <b>{{marking}}</b>.</p>
</div>

<div class="box">
  <h2>ثامناً: القوة القاهرة</h2>
  <p>{{forceMajeure}}</p>
</div>

<div class="box">
  <h2>تاسعاً: القانون الواجب التطبيق وتسوية النزاعات</h2>
  <table>
    <tr><th style="width:30%">القانون الواجب التطبيق</th><td>{{governingLaw}}</td></tr>
    <tr><th>آلية فض النزاعات</th><td>{{disputeResolution}}</td></tr>
    <tr><th>مقر التحكيم</th><td>{{arbitrationSeat}}</td></tr>
    <tr><th>لغة العقد</th><td>{{languagePrevails}}</td></tr>
  </table>
</div>

<div class="box">
  <h2>عاشراً: أحكام عامة</h2>
  <ul>
    <li>يمثل هذا العقد كامل الاتفاق بين الطرفين.</li>
    <li>لا يكون أي تعديل نافذاً إلا إذا كان مكتوباً وموقعاً من الطرفين.</li>
    <li>في حال بطلان أي بند، يبقى باقي العقد صحيحاً ونافذاً.</li>
  </ul>
</div>

<h2>التواقيع</h2>
<table class="sign">
  <tr><th style="width:50%">عن البائع</th><th style="width:50%">عن المشتري</th></tr>
  <tr>
    <td>الاسم/الصفة: {{sellerSignName}}<br/>التاريخ: {{sellerSignDate}}<br/>التوقيع والختم:</td>
    <td>الاسم/الصفة: {{buyerSignName}}<br/>التاريخ: {{buyerSignDate}}<br/>التوقيع والختم:</td>
  </tr>
</table>
<p class="small">تم تحرير هذا العقد من نسختين أصليتين.</p>

</body>
</html>`,
};


export const FCA_EN: ContractTemplate = {
  id: 2071,
  slug: "incoterms-fca-premium-en",
  title: "International Sale Contract – FCA (Incoterms®)",
  lang: "en",
  group: "INCOTERMS",

  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info" },
    { key: "incotermsEdition", label: "Incoterms Edition", required: true, type: "select", group: "Contract Info",
      options: ["2020", "2010"] },
    { key: "sellerName", label: "Seller Name", required: true, type: "text", group: "Seller" },
    { key: "sellerAddress", label: "Seller Address", required: true, type: "text", group: "Seller" },
    { key: "sellerReg", label: "Registration/ID", required: false, type: "text", group: "Seller" },
    { key: "buyerName", label: "Buyer Name", required: true, type: "text", group: "Buyer" },
    { key: "buyerAddress", label: "Buyer Address", required: true, type: "text", group: "Buyer" },
    { key: "buyerReg", label: "Registration/ID", required: false, type: "text", group: "Buyer" },
    { key: "goodsDescription", label: "Goods Description", required: true, type: "textarea", group: "Goods" },
    { key: "hsCode", label: "HS Code (optional)", required: false, type: "text", group: "Goods" },
    { key: "quantity", label: "Quantity", required: true, type: "text", group: "Goods" },
    { key: "unit", label: "Unit", required: true, type: "text", group: "Goods", placeholder: "ton, piece, carton" },
    { key: "tolerance", label: "Tolerance", required: false, type: "text", group: "Goods", placeholder: "±5%" },
    { key: "unitPrice", label: "Unit Price", required: true, type: "number", group: "Price & Payment" },
    { key: "totalPrice", label: "Total Price", required: true, type: "number", group: "Price & Payment" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Price & Payment",
      options: ["USD", "EUR", "IQD"] },
    { key: "paymentTerms", label: "Payment Terms", required: true, type: "textarea", group: "Price & Payment",
      placeholder: "e.g. Letter of Credit (L/C)" },
    { key: "namedPlace", label: "Named Place of Delivery", required: true, type: "text", group: "Delivery",
      placeholder: "Seller's warehouse, freight terminal, airport..." },
    { key: "deliverySchedule", label: "Delivery Schedule", required: true, type: "text", group: "Delivery" },
    { key: "modeOfTransport", label: "Mode of Transport", required: false, type: "select", group: "Delivery",
      options: ["Road", "Sea", "Air", "Multimodal"] },
    { key: "carrierDetails", label: "Carrier Details", required: false, type: "textarea", group: "Delivery",
      placeholder: "Carrier name, contract reference" },
    { key: "onBoardNotation", label: "On-Board Notation (FCA 2020)", required: false, type: "textarea", group: "Delivery",
      placeholder: "If Buyer requires an on-board B/L under FCA Incoterms 2020" },
    { key: "documentsList", label: "Required Documents", required: true, type: "textarea", group: "Documents & Inspection",
      placeholder: "Commercial invoice, transport document, certificate of origin" },
    { key: "inspection", label: "Inspection & Claims", required: false, type: "textarea", group: "Documents & Inspection" },
    { key: "packaging", label: "Packaging", required: false, type: "textarea", group: "Documents & Inspection" },
    { key: "marking", label: "Marking", required: false, type: "text", group: "Documents & Inspection" },
    { key: "forceMajeure", label: "Force Majeure", required: false, type: "textarea", group: "Legal Provisions" },
    { key: "governingLaw", label: "Governing Law", required: true, type: "text", group: "Legal Provisions" },
    { key: "disputeResolution", label: "Dispute Resolution", required: true, type: "textarea", group: "Legal Provisions",
      placeholder: "Arbitration under ICC Rules" },
    { key: "arbitrationSeat", label: "Arbitration Seat (if any)", required: false, type: "text", group: "Legal Provisions" },
    { key: "languagePrevails", label: "Contract Language", required: false, type: "select", group: "Legal Provisions",
      options: ["English", "Arabic"] },
    { key: "sellerSignName", label: "Seller Signatory Name", required: true, type: "text", group: "Signatures" },
    { key: "sellerSignDate", label: "Seller Signature Date", required: false, type: "date", group: "Signatures" },
    { key: "buyerSignName", label: "Buyer Signatory Name", required: true, type: "text", group: "Signatures" },
    { key: "buyerSignDate", label: "Buyer Signature Date", required: false, type: "date", group: "Signatures" },
  ],

  html: `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>FCA Contract</title>
  <style>
    body{font-family:"Times New Roman",Arial,serif;padding:28px;line-height:1.7;color:#111;font-size:13.5px;}
    h1{font-size:20px;margin:0 0 10px;text-align:center;}
    h2{font-size:15px;margin:18px 0 8px;}
    .meta{font-size:12px;color:#444;margin:6px 0 14px;}
    .box{border:1px solid #ddd;border-radius:10px;padding:12px 14px;margin:10px 0;}
    table{width:100%;border-collapse:collapse;margin-top:6px;}
    td,th{border:1px solid #e2e2e2;padding:8px;font-size:12.5px;vertical-align:top;}
    th{background:#f6f6f6;text-align:left;}
    .muted{color:#666;font-size:12px;}
    .small{font-size:11.5px;color:#555;}
    .sign td{height:90px;}
    ul{margin:6px 18px;}li{margin:4px 0;}
  </style>
</head>
<body>

<h1>International Sale Contract (FCA – Incoterms® {{incotermsEdition}})</h1>
<div class="meta">
  Contract Ref: <b>{{contractRef}}</b> &nbsp;|&nbsp;
  Contract Date: <b>{{contractDate}}</b> &nbsp;|&nbsp;
  Place of Execution: <b>{{contractCity}}</b>
</div>

<div class="box">
  <h2>1. Parties</h2>
  <table>
    <tr>
      <th style="width:20%">Seller</th>
      <td>{{sellerName}}<br/><span class="muted">Address:</span> {{sellerAddress}}<br/><span class="muted">Reg/ID:</span> {{sellerReg}}</td>
    </tr>
    <tr>
      <th>Buyer</th>
      <td>{{buyerName}}<br/><span class="muted">Address:</span> {{buyerAddress}}<br/><span class="muted">Reg/ID:</span> {{buyerReg}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>2. Definitions and Reference</h2>
  <p>The term <b>FCA (Free Carrier)</b> shall be interpreted in accordance with <b>Incoterms® {{incotermsEdition}}</b> issued by the ICC.</p>
  <p class="small">
    FCA is suitable for all modes of transport including containerised shipments. Delivery occurs when Goods are
    handed over to the Buyer's nominated carrier at the named place. If at Seller's premises, Seller loads;
    if elsewhere, Seller delivers without unloading. Seller completes export clearance.
  </p>
</div>

<div class="box">
  <h2>3. Goods, Quantity and Price</h2>
  <table>
    <tr><th>Goods Description</th><th>HS Code</th><th>Quantity</th><th>Unit</th><th>Tolerance</th></tr>
    <tr><td>{{goodsDescription}}</td><td>{{hsCode}}</td><td>{{quantity}}</td><td>{{unit}}</td><td>{{tolerance}}</td></tr>
  </table>
  <table>
    <tr><th>Unit Price</th><th>Total Price</th><th>Currency</th><th>Payment Terms</th></tr>
    <tr><td>{{unitPrice}}</td><td>{{totalPrice}}</td><td>{{currency}}</td><td>{{paymentTerms}}</td></tr>
  </table>
</div>

<div class="box">
  <h2>4. Delivery – FCA</h2>
  <table>
    <tr><th style="width:35%">Named Place of Delivery</th><td><b>{{namedPlace}}</b></td></tr>
    <tr><th>Delivery Schedule</th><td>{{deliverySchedule}}</td></tr>
    <tr><th>Mode of Transport</th><td>{{modeOfTransport}}</td></tr>
    <tr><th>Carrier Details</th><td>{{carrierDetails}}</td></tr>
  </table>
  <ul>
    <li>Delivery is effected when the Goods are handed to the Buyer's nominated carrier at the named place.</li>
    <li>If the named place is Seller's premises: Seller is responsible for loading onto the collecting vehicle.</li>
    <li>If the named place is elsewhere: risk transfers when Goods are placed at the carrier's disposal, not unloaded from Seller's vehicle.</li>
    <li>Seller shall complete all export customs formalities.</li>
  </ul>
</div>

<div class="box">
  <h2>5. On-Board Notation (FCA Incoterms® 2020)</h2>
  <p>{{onBoardNotation}}</p>
  <p class="small">
    Under Incoterms® 2020: Buyer may instruct its carrier to issue an on-board bill of lading to Seller,
    enabling Seller to present it under a documentary credit (L/C).
  </p>
</div>

<div class="box">
  <h2>6. Transfer of Risk and Costs</h2>
  <ul>
    <li>Risk transfers from Seller to Buyer upon delivery at <b>{{namedPlace}}</b>.</li>
    <li>Buyer bears all costs of main carriage, insurance, and import clearance.</li>
    <li>Seller bears export clearance costs and delivery to the named place.</li>
  </ul>
</div>

<div class="box">
  <h2>7. Documents and Inspection</h2>
  <p>Seller shall provide: <b>{{documentsList}}</b>.</p>
  <p>Inspection, acceptance and claims: <b>{{inspection}}</b>.</p>
  <p>Packaging: <b>{{packaging}}</b> — Marking: <b>{{marking}}</b>.</p>
</div>

<div class="box">
  <h2>8. Force Majeure</h2>
  <p>{{forceMajeure}}</p>
</div>

<div class="box">
  <h2>9. Governing Law and Dispute Resolution</h2>
  <table>
    <tr><th style="width:30%">Governing Law</th><td>{{governingLaw}}</td></tr>
    <tr><th>Dispute Resolution</th><td>{{disputeResolution}}</td></tr>
    <tr><th>Arbitration Seat (if any)</th><td>{{arbitrationSeat}}</td></tr>
    <tr><th>Contract Language</th><td>{{languagePrevails}}</td></tr>
  </table>
</div>

<div class="box">
  <h2>10. Final Provisions</h2>
  <ul>
    <li>This Contract constitutes the entire agreement between the Parties.</li>
    <li>No amendment shall be valid unless made in writing and signed by both Parties.</li>
    <li>If any provision is held invalid, the remainder shall remain in full force.</li>
  </ul>
</div>

<h2>Signatures</h2>
<table class="sign">
  <tr><th style="width:50%">For the Seller</th><th style="width:50%">For the Buyer</th></tr>
  <tr>
    <td>Name/Title: {{sellerSignName}}<br/>Date: {{sellerSignDate}}<br/>Signature &amp; Seal:</td>
    <td>Name/Title: {{buyerSignName}}<br/>Date: {{buyerSignDate}}<br/>Signature &amp; Seal:</td>
  </tr>
</table>
<p class="small">This Contract is executed in two originals, each Party receiving one copy.</p>

</body>
</html>`,
};