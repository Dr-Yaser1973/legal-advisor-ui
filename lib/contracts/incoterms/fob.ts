 import type { ContractTemplate } from "@/lib/contracts/engine/types"; // عدّل المسار حسب مشروعك

export const FOB_AR: ContractTemplate = {
  id: 2030,
  slug: "incoterms-fob-premium-ar",
  title: "عقد بيع دولي – FOB (Incoterms) – صياغة احترافية",
  lang: "ar",
  group: "INCOTERMS",
  html: `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family: Arial, "Noto Naskh Arabic", "Amiri", sans-serif; padding:28px; line-height:1.9; color:#111;}
    h1{font-size:20px; margin:0 0 10px; text-align:center;}
    h2{font-size:14px; margin:18px 0 8px;}
    .meta{font-size:12px; color:#444; margin:6px 0 14px;}
    .box{border:1px solid #ddd; border-radius:12px; padding:12px 14px; margin:10px 0;}
    .row{display:flex; gap:10px; flex-wrap:wrap;}
    .col{flex:1; min-width:240px;}
    table{width:100%; border-collapse:collapse; margin-top:6px;}
    td,th{border:1px solid #e2e2e2; padding:8px; font-size:12px; vertical-align:top;}
    .muted{color:#666; font-size:12px;}
    .sign{margin-top:18px;}
    .sign td{height:90px;}
    .small{font-size:11px; color:#555;}
    .rtl{text-align:right;}
  </style>
</head>
<body>

<h1>عقد بيع دولي وفق شرط FOB (Incoterms®)</h1>
<div class="meta rtl">
  رقم المرجع: <b>{{contractRef}}</b> — تاريخ العقد: <b>{{contractDate}}</b> — مدينة الإبرام: <b>{{contractCity}}</b>
</div>

<div class="box rtl">
  <h2>أولاً: أطراف العقد</h2>
  <div class="row">
    <div class="col">
      <b>البائع:</b> {{sellerName}}<br/>
      <span class="muted">العنوان:</span> {{sellerAddress}}<br/>
      <span class="muted">السجل/الترخيص:</span> {{sellerReg}}
    </div>
    <div class="col">
      <b>المشتري:</b> {{buyerName}}<br/>
      <span class="muted">العنوان:</span> {{buyerAddress}}<br/>
      <span class="muted">السجل/الترخيص:</span> {{buyerReg}}
    </div>
  </div>
</div>

<div class="box rtl">
  <h2>ثانياً: التعاريف والمرجعية</h2>
  <div>
    1) يُقصد بشرط <b>FOB</b> “التسليم على ظهر السفينة” وفق قواعد Incoterms® إصدار <b>{{incotermsEdition}}</b>.<br/>
    2) في حال التعارض بين هذا العقد وقواعد Incoterms®، يُعمل بأحكام هذا العقد بالقدر اللازم، مع بقاء تفسير المصطلحات وفق Incoterms®.
  </div>
</div>

<div class="box rtl">
  <h2>ثالثاً: البضاعة والكمية والسعر</h2>
  <table>
    <tr>
      <th>وصف البضاعة</th>
      <th>HS (اختياري)</th>
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

  <div class="small rtl">
    يقرّ الطرفان بأن السعر يشمل التزامات كل طرف وفق شرط FOB حصراً، ولا يُحمَّل أي طرف مصاريف خارج ما ورد في هذا العقد وIncoterms®.
  </div>
</div>

<div class="box rtl">
  <h2>رابعاً: التسليم – FOB</h2>
  <div>
    1) مكان التسليم: <b>{{portOfShipment}}</b> <span class="muted">({{loadingTerminal}})</span>.<br/>
    2) يتم التسليم عندما تُوضَع البضاعة على متن السفينة التي يسميها المشتري وفقاً لآلية التسمية أدناه، عند ميناء الشحن المذكور.<br/>
    3) يلتزم البائع بإنهاء إجراءات التصدير وتحميل البضاعة على السفينة ضمن الجدول التالي: <b>{{deliverySchedule}}</b>.
  </div>

  <h2>خامساً: تسمية السفينة والإشعارات</h2>
  <div>
    1) يلتزم المشتري بتسمية السفينة/وسيلة النقل البحري وإبلاغ البائع بالتفاصيل التشغيلية وفق الآتي: <b>{{vesselNomination}}</b>.<br/>
    2) مدة الإشعار قبل تاريخ التحميل: <b>{{loadingNoticeDays}}</b>.<br/>
    3) أي تأخير ناتج عن عدم تسمية السفينة أو عدم جاهزيتها ضمن المدة يعدّ إخلالاً من المشتري، وتترتب عليه الرسوم/التكاليف الفعلية المثبتة.
  </div>
</div>

<div class="box rtl">
  <h2>سادساً: انتقال المخاطر والتكاليف</h2>
  <div>
    1) تنتقل مخاطر الهلاك/التلف من البائع إلى المشتري عند وضع البضاعة على متن السفينة في ميناء الشحن.<br/>
    2) يتحمل كل طرف التكاليف المترتبة عليه وفق FOB (Incoterms®) إصدار <b>{{incotermsEdition}}</b>، وبما لا يخالف أحكام هذا العقد.<br/>
    3) التأمين البحري: في FOB لا يلتزم البائع بالتأمين ما لم يُتفق على خلافه صراحةً ضمن شروط إضافية منفصلة.
  </div>
</div>

<div class="box rtl">
  <h2>سابعاً: المستندات والفحص</h2>
  <div>
    1) يلتزم البائع بتقديم المستندات التالية (أو ما يعادلها حسب الاتفاق): <b>{{documentsList}}</b>.<br/>
    2) الفحص/المعاينة والاستلام والاعتراض: <b>{{inspection}}</b>.
  </div>

  <h2>ثامناً: التعبئة والوسم</h2>
  <div>
    التعبئة والتغليف: <b>{{packaging}}</b>.<br/>
    الوسم/العلامات: <b>{{marking}}</b>.
  </div>
</div>

<div class="box rtl">
  <h2>تاسعاً: القوة القاهرة</h2>
  <div>
    <b>{{forceMajeure}}</b>
  </div>

  <h2>عاشراً: القانون الواجب التطبيق وتسوية النزاعات</h2>
  <div>
    القانون الواجب التطبيق: <b>{{governingLaw}}</b>.<br/>
    آلية فض النزاعات: <b>{{disputeResolution}}</b>.<br/>
    مقر التحكيم (إن وجد): <b>{{arbitrationSeat}}</b>.<br/>
    لغة العقد المعتمدة: <b>{{languagePrevails}}</b>.
  </div>
</div>

<div class="box rtl">
  <h2>حادي عشر: أحكام عامة</h2>
  <div>
    1) يمثل هذا العقد كامل الاتفاق بين الطرفين ويلغي ما سبقه من مراسلات/تفاهمات تتعلق بذات الموضوع.<br/>
    2) لا يُعدّ أي تنازل عن حق نافذاً إلا إذا كان مكتوباً وصادراً عن الطرف صاحب الحق.<br/>
    3) في حال بطلان أي بند، يبقى باقي العقد صحيحاً ونافذاً بالقدر المسموح قانوناً.
  </div>
</div>

<h2 class="rtl">التواقيع</h2>
<table class="sign">
  <tr>
    <th class="rtl">البائع</th>
    <th class="rtl">المشتري</th>
  </tr>
  <tr>
    <td class="rtl">
      الاسم/الصفة: {{sellerSignName}}<br/>
      التاريخ: {{sellerSignDate}}<br/>
      التوقيع والختم:
    </td>
    <td class="rtl">
      الاسم/الصفة: {{buyerSignName}}<br/>
      التاريخ: {{buyerSignDate}}<br/>
      التوقيع والختم:
    </td>
  </tr>
</table>

<p class="small rtl">
  تم تحرير هذا العقد من نسختين، ويجوز اعتماد النسخة العربية/الإنجليزية وفق بند “لغة العقد المعتمدة” أعلاه.
</p>

</body>
</html>`,
};


export const FOB_EN: ContractTemplate = {
  id: 2031,
  slug: "incoterms-fob-premium-en",
  title: "International Sale Contract – FOB (Incoterms®)",
  lang: "en",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>FOB Contract</title>
  <style>
    body{
      font-family: "Times New Roman", Arial, serif;
      padding:28px;
      line-height:1.7;
      color:#111;
      font-size:13.5px;
    }
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

<h1>International Sale Contract (FOB – Incoterms® {{incotermsEdition}})</h1>

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
    For the purposes of this Contract, the term <b>FOB (Free On Board)</b> shall be interpreted in accordance with
    <b>Incoterms® {{incotermsEdition}}</b> issued by the International Chamber of Commerce (ICC).
  </p>
  <p class="small">
    In case of inconsistency between this Contract and Incoterms®, the provisions of this Contract shall prevail to the extent necessary.
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

  <p class="small">
    The Contract Price covers the obligations of each Party strictly in accordance with the FOB term
    and Incoterms® {{incotermsEdition}}.
  </p>
</div>

<div class="box">
  <h2>4. Delivery – FOB</h2>
  <p>
    Delivery shall take place on an FOB basis at the following port:
  </p>
  <table>
    <tr>
      <th style="width:30%">Port of Shipment</th>
      <td>{{portOfShipment}}</td>
    </tr>
    <tr>
      <th>Loading Terminal (if any)</th>
      <td>{{loadingTerminal}}</td>
    </tr>
    <tr>
      <th>Shipment Schedule</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <h3>4.1 Risk Transfer</h3>
  <ul>
    <li>
      Risk of loss or damage to the Goods shall transfer from Seller to Buyer when the Goods are placed on board
      the vessel nominated by Buyer at the Port of Shipment.
    </li>
    <li>
      From that moment, all risks and costs shall be borne by Buyer, in accordance with FOB (Incoterms® {{incotermsEdition}}).
    </li>
  </ul>
</div>

<div class="box">
  <h2>5. Vessel Nomination and Notices</h2>
  <ul>
    <li>
      Buyer shall nominate the carrying vessel and provide Seller with all necessary shipping instructions in due time:
      <b>{{vesselNomination}}</b>.
    </li>
    <li>
      Minimum advance notice before loading: <b>{{loadingNoticeDays}}</b>.
    </li>
    <li>
      Any delay caused by Buyer’s failure to nominate a vessel or provide timely instructions shall be deemed Buyer’s responsibility.
    </li>
  </ul>
</div>

<div class="box">
  <h2>6. Export Clearance, Costs and Insurance</h2>
  <ul>
    <li>
      Seller shall be responsible for export customs clearance and all export formalities.
    </li>
    <li>
      Buyer shall bear all costs and risks after delivery on board the vessel, including ocean freight and marine insurance.
    </li>
    <li>
      Seller shall not be obliged to procure insurance unless expressly agreed otherwise in writing.
    </li>
  </ul>
</div>

<div class="box">
  <h2>7. Documents and Inspection</h2>
  <p>
    Seller shall provide Buyer with the following documents (or their equivalents):
    <b>{{documentsList}}</b>.
  </p>
  <p>
    Inspection, acceptance and claims shall be handled as follows:
    <b>{{inspection}}</b>.
  </p>
</div>

<div class="box">
  <h2>8. Packaging and Marking</h2>
  <p>
    Packaging and marking shall be as follows:
    <b>{{packaging}}</b> — <b>{{marking}}</b>.
  </p>
</div>

<div class="box">
  <h2>9. Force Majeure</h2>
  <p>
    {{forceMajeure}}
  </p>
</div>

<div class="box">
  <h2>10. Governing Law and Dispute Resolution</h2>
  <table>
    <tr>
      <th style="width:30%">Governing Law</th>
      <td>{{governingLaw}}</td>
    </tr>
    <tr>
      <th>Dispute Resolution</th>
      <td>{{disputeResolution}}</td>
    </tr>
    <tr>
      <th>Arbitration Seat (if any)</th>
      <td>{{arbitrationSeat}}</td>
    </tr>
    <tr>
      <th>Contract Language</th>
      <td>{{languagePrevails}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>11. Final Provisions</h2>
  <ul>
    <li>This Contract constitutes the entire agreement between the Parties.</li>
    <li>No amendment shall be valid unless made in writing and signed by both Parties.</li>
    <li>If any provision is held invalid, the remainder of the Contract shall remain in full force.</li>
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
      Signature & Seal:
    </td>
    <td>
      Name/Title: {{buyerSignName}}<br/>
      Date: {{buyerSignDate}}<br/>
      Signature & Seal:
    </td>
  </tr>
</table>

<p class="small">
  This Contract is executed in two originals, each Party receiving one copy.
</p>

</body>
</html>`,
};
