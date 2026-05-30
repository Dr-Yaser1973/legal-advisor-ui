 import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const DPU_AR: ContractTemplate = {
  id: 2110,
  slug: "incoterms-dpu-premium-ar",
  title: "عقد بيع دولي – DPU (Incoterms®)",
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
    // DPU-specific
    { key: "namedDestination", label: "مكان الوصول المحدد", required: true, type: "text", group: "التسليم",
      placeholder: "الميناء، المستودع، محطة الشحن، الميناء الجاف..." },
    { key: "deliverySchedule", label: "جدول التسليم", required: true, type: "text", group: "التسليم" },
    { key: "modeOfTransport", label: "وسيلة النقل", required: false, type: "select", group: "التسليم",
      options: ["بري", "بحري", "جوي", "متعدد الوسائط"] },
    { key: "destinationCountry", label: "دولة الوصول", required: true, type: "text", group: "التسليم" },
    { key: "unloadingDetails", label: "تفاصيل التفريغ وترتيباته", required: true, type: "textarea", group: "التسليم",
      placeholder: "البائع يتولى التفريغ على نفقته — يحدد الطرفان الجهة المنفذة وآلية التنسيق" },
    { key: "unloadingEquipment", label: "معدات التفريغ ومسؤوليتها", required: false, type: "textarea", group: "التسليم",
      placeholder: "رافعة، رافعة شوكية — من يوفرها؟" },
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
    .unload-box{border:1px solid #4b8cc8;border-radius:12px;padding:12px 14px;margin:10px 0;background:#f5faff;}
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

<h1>عقد بيع دولي وفق شرط DPU (Incoterms® {{incotermsEdition}})</h1>
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
  <p>يُقصد بشرط <b>DPU (التسليم في المكان المحدد بعد التفريغ)</b> ما ورد تعريفه في <b>قواعد Incoterms® {{incotermsEdition}}</b> الصادرة عن ICC.</p>
  <p class="small">
    DPU هو الشرط الوحيد في Incoterms® الذي يُلزم البائع بتفريغ البضاعة في مكان الوصول.
    الفرق عن DAP: في DAP البائع يُسلّم دون تفريغ، أما في DPU فالتسليم لا يتم إلا <b>بعد إتمام التفريغ</b>.
    لا يشمل DPU تخليص الاستيراد أو دفع رسوم الاستيراد — هذا التزام المشتري.
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
  <h2>رابعاً: التسليم وفق DPU</h2>
  <table>
    <tr><th style="width:35%">مكان الوصول المحدد</th><td><b>{{namedDestination}}</b></td></tr>
    <tr><th>دولة الوصول</th><td>{{destinationCountry}}</td></tr>
    <tr><th>جدول التسليم</th><td>{{deliverySchedule}}</td></tr>
    <tr><th>وسيلة النقل</th><td>{{modeOfTransport}}</td></tr>
  </table>
  <ul>
    <li>يتم التسليم عند <b>إتمام تفريغ البضاعة</b> ووضعها تحت تصرف المشتري في <b>{{namedDestination}}</b>.</li>
    <li>البائع هو الشرط الوحيد في Incoterms® الملزَم بالتفريغ — لا يتم التسليم دون إتمامه.</li>
    <li>يلتزم البائع بإنهاء إجراءات التصدير الجمركي في بلد الإرسال.</li>
    <li>يلتزم المشتري بإنهاء إجراءات الاستيراد الجمركي ودفع الرسوم في <b>{{destinationCountry}}</b>.</li>
  </ul>
</div>

<div class="unload-box">
  <h2>خامساً: التفريغ — الميزة الجوهرية في DPU</h2>
  <table>
    <tr><th style="width:35%">تفاصيل التفريغ وترتيباته</th><td>{{unloadingDetails}}</td></tr>
    <tr><th>معدات التفريغ ومسؤوليتها</th><td>{{unloadingEquipment}}</td></tr>
  </table>
  <ul>
    <li>يتحمل البائع جميع تكاليف ومخاطر التفريغ حتى إتمامه في مكان الوصول المحدد.</li>
    <li>في حال تعذّر التفريغ بسبب ظروف المكان أو قيود المشتري، يتحمل المشتري التكاليف الإضافية الناتجة.</li>
    <li>يُنصح بتحديد جهة التفريغ المنفذة وآلية التنسيق كتابةً لتفادي النزاعات العملية.</li>
  </ul>
</div>

<div class="box">
  <h2>سادساً: انتقال المخاطر والتكاليف</h2>
  <ul>
    <li>تنتقل مخاطر الهلاك أو التلف إلى المشتري بعد إتمام التفريغ في <b>{{namedDestination}}</b>.</li>
    <li>يتحمل البائع جميع تكاليف النقل والتفريغ والتأمين الاختياري حتى إتمام التسليم.</li>
    <li>يتحمل المشتري رسوم الاستيراد والتخليص الجمركي وما بعد التسليم.</li>
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


export const DPU_EN: ContractTemplate = {
  id: 2111,
  slug: "incoterms-dpu-premium-en",
  title: "International Sale Contract – DPU (Incoterms®)",
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
    { key: "namedDestination", label: "Named Place of Destination", required: true, type: "text", group: "Delivery",
      placeholder: "Port, warehouse, freight terminal, dry port..." },
    { key: "deliverySchedule", label: "Delivery Schedule", required: true, type: "text", group: "Delivery" },
    { key: "modeOfTransport", label: "Mode of Transport", required: false, type: "select", group: "Delivery",
      options: ["Road", "Sea", "Air", "Multimodal"] },
    { key: "destinationCountry", label: "Destination Country", required: true, type: "text", group: "Delivery" },
    { key: "unloadingDetails", label: "Unloading Details & Arrangements", required: true, type: "textarea", group: "Delivery",
      placeholder: "Seller unloads at own cost — specify executing party and coordination mechanism" },
    { key: "unloadingEquipment", label: "Unloading Equipment & Responsibility", required: false, type: "textarea", group: "Delivery",
      placeholder: "Crane, forklift — who provides?" },
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
  <title>DPU Contract</title>
  <style>
    body{font-family:"Times New Roman",Arial,serif;padding:28px;line-height:1.7;color:#111;font-size:13.5px;}
    h1{font-size:20px;margin:0 0 10px;text-align:center;}
    h2{font-size:15px;margin:18px 0 8px;}
    .meta{font-size:12px;color:#444;margin:6px 0 14px;}
    .box{border:1px solid #ddd;border-radius:10px;padding:12px 14px;margin:10px 0;}
    .unload-box{border:1px solid #4b8cc8;border-radius:10px;padding:12px 14px;margin:10px 0;background:#f5faff;}
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

<h1>International Sale Contract (DPU – Incoterms® {{incotermsEdition}})</h1>
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
  <p>The term <b>DPU (Delivered at Place Unloaded)</b> shall be interpreted in accordance with <b>Incoterms® {{incotermsEdition}}</b> issued by the ICC.</p>
  <p class="small">
    DPU is the <b>only Incoterms® rule</b> that requires the Seller to unload the Goods at destination.
    Unlike DAP (where Seller delivers ready for unloading), under DPU delivery is only complete
    <b>after unloading is finished</b>. Import clearance and duties remain the Buyer's obligation.
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
  <h2>4. Delivery – DPU</h2>
  <table>
    <tr><th style="width:35%">Named Place of Destination</th><td><b>{{namedDestination}}</b></td></tr>
    <tr><th>Destination Country</th><td>{{destinationCountry}}</td></tr>
    <tr><th>Delivery Schedule</th><td>{{deliverySchedule}}</td></tr>
    <tr><th>Mode of Transport</th><td>{{modeOfTransport}}</td></tr>
  </table>
  <ul>
    <li>Delivery is effected when the Goods are <b>unloaded and placed at the Buyer's disposal</b> at <b>{{namedDestination}}</b>.</li>
    <li>Seller is the only party obligated to unload under Incoterms® — delivery is not complete until unloading is finished.</li>
    <li>Seller shall complete all export customs formalities in the country of dispatch.</li>
    <li>Buyer shall be responsible for import clearance and payment of import duties in <b>{{destinationCountry}}</b>.</li>
  </ul>
</div>

<div class="unload-box">
  <h2>5. Unloading — Key Feature of DPU</h2>
  <table>
    <tr><th style="width:35%">Unloading Details & Arrangements</th><td>{{unloadingDetails}}</td></tr>
    <tr><th>Unloading Equipment & Responsibility</th><td>{{unloadingEquipment}}</td></tr>
  </table>
  <ul>
    <li>Seller bears all costs and risks of unloading until completion at the named destination.</li>
    <li>If unloading is delayed or prevented due to Buyer's site conditions or restrictions, any additional costs shall be borne by Buyer.</li>
    <li>Parties are advised to specify the executing party and coordination mechanism in writing to avoid operational disputes.</li>
  </ul>
</div>

<div class="box">
  <h2>6. Transfer of Risk and Costs</h2>
  <ul>
    <li>Risk transfers from Seller to Buyer after unloading is completed at <b>{{namedDestination}}</b>.</li>
    <li>Seller bears all costs of carriage, unloading, and optional insurance until delivery is complete.</li>
    <li>Buyer bears import duties, customs clearance, and all costs after delivery.</li>
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