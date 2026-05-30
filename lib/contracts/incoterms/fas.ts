 // lib/contracts/incoterms/fas.ts
 import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const FAS_AR: ContractTemplate = {
  id: 2040,
  slug: "incoterms-fas-premium-ar",
  title: "عقد بيع دولي – FAS (Incoterms®)",
  lang: "ar",
  group: "INCOTERMS",

  fields: [
    // ── معلومات العقد ──
    { key: "contractRef", label: "رقم المرجع", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد" },
    { key: "incotermsEdition", label: "إصدار Incoterms", required: true, type: "select", group: "معلومات العقد",
      options: ["2020", "2010"] },

    // ── البائع ──
    { key: "sellerName", label: "اسم البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerAddress", label: "عنوان البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerReg", label: "السجل/الترخيص", required: false, type: "text", group: "البائع" },

    // ── المشتري ──
    { key: "buyerName", label: "اسم المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerAddress", label: "عنوان المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerReg", label: "السجل/الترخيص", required: false, type: "text", group: "المشتري" },

    // ── البضاعة ──
    { key: "goodsDescription", label: "وصف البضاعة", required: true, type: "textarea", group: "البضاعة" },
    { key: "hsCode", label: "رمز HS (اختياري)", required: false, type: "text", group: "البضاعة" },
    { key: "quantity", label: "الكمية", required: true, type: "text", group: "البضاعة" },
    { key: "unit", label: "الوحدة", required: true, type: "text", group: "البضاعة", placeholder: "طن، قطعة، كرتون" },
    { key: "tolerance", label: "نسبة التسامح", required: false, type: "text", group: "البضاعة", placeholder: "±5%" },

    // ── السعر والدفع ──
    { key: "unitPrice", label: "سعر الوحدة", required: true, type: "number", group: "السعر والدفع" },
    { key: "totalPrice", label: "السعر الإجمالي", required: true, type: "number", group: "السعر والدفع" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "السعر والدفع",
      options: ["دولار أمريكي", "يورو", "دينار عراقي"] },
    { key: "paymentTerms", label: "شروط الدفع", required: true, type: "textarea", group: "السعر والدفع",
      placeholder: "مثال: اعتماد مستندي L/C" },

    // ── التسليم والشحن ──
    { key: "portOfShipment", label: "ميناء الشحن", required: true, type: "text", group: "التسليم والشحن" },
    { key: "quayOrBerth", label: "الرصيف/الموقع جانب السفينة", required: false, type: "text", group: "التسليم والشحن",
      placeholder: "مثال: رصيف 7، ميناء أم قصر" },
    { key: "deliverySchedule", label: "جدول الشحن", required: true, type: "text", group: "التسليم والشحن" },
    { key: "vesselNomination", label: "آلية تسمية السفينة", required: false, type: "textarea", group: "التسليم والشحن" },
    { key: "loadingNoticeDays", label: "مدة الإشعار قبل التحميل", required: false, type: "text", group: "التسليم والشحن",
      placeholder: "مثال: 7 أيام" },

    // ── المستندات والفحص ──
    { key: "documentsList", label: "المستندات المطلوبة", required: true, type: "textarea", group: "المستندات والفحص",
      placeholder: "الفاتورة التجارية، إيصال الرصيف، شهادة المنشأ" },
    { key: "inspection", label: "الفحص والمعاينة", required: false, type: "textarea", group: "المستندات والفحص" },
    { key: "packaging", label: "التعبئة والتغليف", required: false, type: "textarea", group: "المستندات والفحص" },
    { key: "marking", label: "الوسم/العلامات", required: false, type: "text", group: "المستندات والفحص" },

    // ── أحكام قانونية ──
    { key: "forceMajeure", label: "القوة القاهرة", required: false, type: "textarea", group: "أحكام قانونية" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام قانونية" },
    { key: "disputeResolution", label: "آلية فض النزاعات", required: true, type: "textarea", group: "أحكام قانونية",
      placeholder: "التحكيم وفق قواعد غرفة التجارة الدولية" },
    { key: "arbitrationSeat", label: "مقر التحكيم (إن وجد)", required: false, type: "text", group: "أحكام قانونية" },
    { key: "languagePrevails", label: "لغة العقد المعتمدة", required: false, type: "select", group: "أحكام قانونية",
      options: ["العربية", "الإنجليزية"] },

    // ── التواقيع ──
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
    ul{margin:6px 18px;}
    li{margin:4px 0;}
  </style>
</head>
<body>

<h1>عقد بيع دولي وفق شرط FAS (Incoterms® {{incotermsEdition}})</h1>
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
      <td>
        {{sellerName}}<br/>
        <span class="muted">العنوان:</span> {{sellerAddress}}<br/>
        <span class="muted">السجل/الترخيص:</span> {{sellerReg}}
      </td>
    </tr>
    <tr>
      <th>المشتري</th>
      <td>
        {{buyerName}}<br/>
        <span class="muted">العنوان:</span> {{buyerAddress}}<br/>
        <span class="muted">السجل/الترخيص:</span> {{buyerReg}}
      </td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>ثانياً: التعاريف والمرجعية</h2>
  <p>
    يُقصد بشرط <b>FAS (التسليم بجانب السفينة)</b> ما ورد تعريفه في
    <b>قواعد Incoterms® {{incotermsEdition}}</b> الصادرة عن غرفة التجارة الدولية (ICC).
  </p>
  <p class="small">
    الفرق الجوهري عن FOB: ينتقل الخطر في FAS عند وضع البضاعة <b>بجانب</b> السفينة على الرصيف أو
    في مراكب النقل الداخلي، وليس عند وضعها <b>على متن</b> السفينة.
    يتحمّل المشتري مسؤولية التحميل على السفينة وما بعده.
  </p>
</div>

<div class="box">
  <h2>ثالثاً: البضاعة والكمية والسعر</h2>
  <table>
    <tr>
      <th>وصف البضاعة</th>
      <th>رمز HS</th>
      <th>الكمية</th>
      <th>الوحدة</th>
      <th>نسبة التسامح</th>
    </tr>
    <tr>
      <td>{{goodsDescription}}</td>
      <td>{{hsCode}}</td>
      <td>{{quantity}}</td>
      <td>{{unit}}</td>
      <td>{{tolerance}}</td>
    </tr>
  </table>
  <table>
    <tr>
      <th>سعر الوحدة</th>
      <th>السعر الإجمالي</th>
      <th>العملة</th>
      <th>شروط الدفع</th>
    </tr>
    <tr>
      <td>{{unitPrice}}</td>
      <td>{{totalPrice}}</td>
      <td>{{currency}}</td>
      <td>{{paymentTerms}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>رابعاً: التسليم وفق شرط FAS</h2>
  <table>
    <tr>
      <th style="width:30%">ميناء الشحن</th>
      <td>{{portOfShipment}}</td>
    </tr>
    <tr>
      <th>الرصيف/الموقع جانب السفينة</th>
      <td>{{quayOrBerth}}</td>
    </tr>
    <tr>
      <th>جدول الشحن</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>
  <ul>
    <li>يتم التسليم عندما توضع البضاعة بجانب السفينة (على الرصيف أو في مركب الإرساء) في ميناء الشحن المتفق عليه.</li>
    <li>لا يلتزم البائع بتحميل البضاعة على السفينة — هذه مسؤولية المشتري بالكامل.</li>
    <li>يلتزم البائع بإنهاء إجراءات التصدير الجمركي قبل التسليم.</li>
  </ul>
</div>

<div class="box">
  <h2>خامساً: تسمية السفينة والإشعارات</h2>
  <ul>
    <li>يلتزم المشتري بتسمية السفينة وإبلاغ البائع بالتفاصيل التشغيلية وفق الآتي: <b>{{vesselNomination}}</b>.</li>
    <li>مدة الإشعار قبل تاريخ التحميل: <b>{{loadingNoticeDays}}</b>.</li>
    <li>أي تأخير ناتج عن عدم تسمية السفينة في الوقت المناسب يُعدّ إخلالاً من المشتري.</li>
  </ul>
</div>

<div class="box">
  <h2>سادساً: انتقال المخاطر والتكاليف</h2>
  <ul>
    <li>تنتقل مخاطر الهلاك أو التلف من البائع إلى المشتري عند وضع البضاعة <b>بجانب</b> السفينة في ميناء الشحن.</li>
    <li>يتحمل المشتري جميع تكاليف ومخاطر التحميل على السفينة، أجرة الشحن، التأمين البحري، وما يليها.</li>
    <li>يتحمل البائع تكاليف التصدير الجمركي والنقل إلى الرصيف.</li>
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
  <tr>
    <th style="width:50%">عن البائع</th>
    <th style="width:50%">عن المشتري</th>
  </tr>
  <tr>
    <td>
      الاسم/الصفة: {{sellerSignName}}<br/>
      التاريخ: {{sellerSignDate}}<br/>
      التوقيع والختم:
    </td>
    <td>
      الاسم/الصفة: {{buyerSignName}}<br/>
      التاريخ: {{buyerSignDate}}<br/>
      التوقيع والختم:
    </td>
  </tr>
</table>
<p class="small">تم تحرير هذا العقد من نسختين أصليتين.</p>

</body>
</html>`,
};


export const FAS_EN: ContractTemplate = {
  id: 2041,
  slug: "incoterms-fas-premium-en",
  title: "International Sale Contract – FAS (Incoterms®)",
  lang: "en",
  group: "INCOTERMS",

  fields: [
    // ── Contract Info ──
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info" },
    { key: "incotermsEdition", label: "Incoterms Edition", required: true, type: "select", group: "Contract Info",
      options: ["2020", "2010"] },

    // ── Seller ──
    { key: "sellerName", label: "Seller Name", required: true, type: "text", group: "Seller" },
    { key: "sellerAddress", label: "Seller Address", required: true, type: "text", group: "Seller" },
    { key: "sellerReg", label: "Registration/ID", required: false, type: "text", group: "Seller" },

    // ── Buyer ──
    { key: "buyerName", label: "Buyer Name", required: true, type: "text", group: "Buyer" },
    { key: "buyerAddress", label: "Buyer Address", required: true, type: "text", group: "Buyer" },
    { key: "buyerReg", label: "Registration/ID", required: false, type: "text", group: "Buyer" },

    // ── Goods ──
    { key: "goodsDescription", label: "Goods Description", required: true, type: "textarea", group: "Goods" },
    { key: "hsCode", label: "HS Code (optional)", required: false, type: "text", group: "Goods" },
    { key: "quantity", label: "Quantity", required: true, type: "text", group: "Goods" },
    { key: "unit", label: "Unit", required: true, type: "text", group: "Goods", placeholder: "ton, piece, carton" },
    { key: "tolerance", label: "Tolerance", required: false, type: "text", group: "Goods", placeholder: "±5%" },

    // ── Price & Payment ──
    { key: "unitPrice", label: "Unit Price", required: true, type: "number", group: "Price & Payment" },
    { key: "totalPrice", label: "Total Price", required: true, type: "number", group: "Price & Payment" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Price & Payment",
      options: ["USD", "EUR", "IQD"] },
    { key: "paymentTerms", label: "Payment Terms", required: true, type: "textarea", group: "Price & Payment",
      placeholder: "e.g. Letter of Credit (L/C)" },

    // ── Delivery & Shipment ──
    { key: "portOfShipment", label: "Port of Shipment", required: true, type: "text", group: "Delivery & Shipment" },
    { key: "quayOrBerth", label: "Quay / Berth Alongside", required: false, type: "text", group: "Delivery & Shipment",
      placeholder: "e.g. Berth 7, Umm Qasr Port" },
    { key: "deliverySchedule", label: "Shipment Schedule", required: true, type: "text", group: "Delivery & Shipment" },
    { key: "vesselNomination", label: "Vessel Nomination", required: false, type: "textarea", group: "Delivery & Shipment" },
    { key: "loadingNoticeDays", label: "Advance Notice Before Loading", required: false, type: "text", group: "Delivery & Shipment",
      placeholder: "e.g. 7 days" },

    // ── Documents & Inspection ──
    { key: "documentsList", label: "Required Documents", required: true, type: "textarea", group: "Documents & Inspection",
      placeholder: "Commercial invoice, dock receipt, certificate of origin" },
    { key: "inspection", label: "Inspection & Claims", required: false, type: "textarea", group: "Documents & Inspection" },
    { key: "packaging", label: "Packaging", required: false, type: "textarea", group: "Documents & Inspection" },
    { key: "marking", label: "Marking", required: false, type: "text", group: "Documents & Inspection" },

    // ── Legal Provisions ──
    { key: "forceMajeure", label: "Force Majeure", required: false, type: "textarea", group: "Legal Provisions" },
    { key: "governingLaw", label: "Governing Law", required: true, type: "text", group: "Legal Provisions" },
    { key: "disputeResolution", label: "Dispute Resolution", required: true, type: "textarea", group: "Legal Provisions",
      placeholder: "Arbitration under ICC Rules" },
    { key: "arbitrationSeat", label: "Arbitration Seat (if any)", required: false, type: "text", group: "Legal Provisions" },
    { key: "languagePrevails", label: "Contract Language", required: false, type: "select", group: "Legal Provisions",
      options: ["English", "Arabic"] },

    // ── Signatures ──
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
  <title>FAS Contract</title>
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
    ul{margin:6px 18px;}
    li{margin:4px 0;}
  </style>
</head>
<body>

<h1>International Sale Contract (FAS – Incoterms® {{incotermsEdition}})</h1>
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
      <td>
        {{sellerName}}<br/>
        <span class="muted">Address:</span> {{sellerAddress}}<br/>
        <span class="muted">Registration/ID:</span> {{sellerReg}}
      </td>
    </tr>
    <tr>
      <th>Buyer</th>
      <td>
        {{buyerName}}<br/>
        <span class="muted">Address:</span> {{buyerAddress}}<br/>
        <span class="muted">Registration/ID:</span> {{buyerReg}}
      </td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>2. Definitions and Reference</h2>
  <p>
    The term <b>FAS (Free Alongside Ship)</b> shall be interpreted in accordance with
    <b>Incoterms® {{incotermsEdition}}</b> issued by the International Chamber of Commerce (ICC).
  </p>
  <p class="small">
    Key distinction from FOB: Under FAS, risk transfers when the Goods are placed <b>alongside</b>
    the vessel (on the quay or in lighters) at the named port — NOT when loaded on board.
    Loading onto the vessel and all subsequent costs and risks are the Buyer's responsibility.
  </p>
</div>

<div class="box">
  <h2>3. Goods, Quantity and Price</h2>
  <table>
    <tr>
      <th>Goods Description</th>
      <th>HS Code</th>
      <th>Quantity</th>
      <th>Unit</th>
      <th>Tolerance</th>
    </tr>
    <tr>
      <td>{{goodsDescription}}</td>
      <td>{{hsCode}}</td>
      <td>{{quantity}}</td>
      <td>{{unit}}</td>
      <td>{{tolerance}}</td>
    </tr>
  </table>
  <table>
    <tr>
      <th>Unit Price</th>
      <th>Total Price</th>
      <th>Currency</th>
      <th>Payment Terms</th>
    </tr>
    <tr>
      <td>{{unitPrice}}</td>
      <td>{{totalPrice}}</td>
      <td>{{currency}}</td>
      <td>{{paymentTerms}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>4. Delivery – FAS</h2>
  <table>
    <tr>
      <th style="width:30%">Port of Shipment</th>
      <td>{{portOfShipment}}</td>
    </tr>
    <tr>
      <th>Quay / Berth Alongside</th>
      <td>{{quayOrBerth}}</td>
    </tr>
    <tr>
      <th>Shipment Schedule</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>
  <ul>
    <li>Delivery is effected when the Goods are placed alongside the nominated vessel at the named port of shipment.</li>
    <li>The Seller has no obligation to load the Goods onto the vessel — loading is entirely the Buyer's responsibility.</li>
    <li>The Seller shall complete all export customs formalities prior to delivery.</li>
  </ul>
</div>

<div class="box">
  <h2>5. Vessel Nomination and Notices</h2>
  <ul>
    <li>Buyer shall nominate the vessel and provide all required shipping instructions: <b>{{vesselNomination}}</b>.</li>
    <li>Minimum advance notice before the delivery date: <b>{{loadingNoticeDays}}</b>.</li>
    <li>Any delay caused by late or absent vessel nomination shall be deemed the Buyer's responsibility.</li>
  </ul>
</div>

<div class="box">
  <h2>6. Transfer of Risk and Costs</h2>
  <ul>
    <li>Risk transfers from Seller to Buyer once the Goods are placed <b>alongside</b> the vessel at the port of shipment.</li>
    <li>Buyer bears all costs from that point, including loading onto the vessel, ocean freight, marine insurance, and import clearance.</li>
    <li>Seller bears costs of export clearance and delivery to the named quay/berth.</li>
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
  <tr>
    <th style="width:50%">For the Seller</th>
    <th style="width:50%">For the Buyer</th>
  </tr>
  <tr>
    <td>
      Name/Title: {{sellerSignName}}<br/>
      Date: {{sellerSignDate}}<br/>
      Signature &amp; Seal:
    </td>
    <td>
      Name/Title: {{buyerSignName}}<br/>
      Date: {{buyerSignDate}}<br/>
      Signature &amp; Seal:
    </td>
  </tr>
</table>
<p class="small">This Contract is executed in two originals, each Party receiving one copy.</p>

</body>
</html>`,
};