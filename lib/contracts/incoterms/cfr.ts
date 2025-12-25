 import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const CFR_AR: ContractTemplate = {
  id: 2033,
  slug: "incoterms-cfr-premium-ar",
  title: "عقد بيع دولي – CFR (Incoterms®)",
  lang: "ar",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>CFR Contract</title>
  <style>
    body{
      font-family: "Noto Naskh Arabic","Amiri","Arial",sans-serif;
      padding:28px;
      line-height:1.9;
      color:#111;
      font-size:13.5px;
    }
    h1{font-size:20px;margin:0 0 10px;text-align:center;}
    h2{font-size:15px;margin:18px 0 8px;}
    .meta{font-size:12px;color:#444;margin:6px 0 14px;text-align:right;}
    .box{border:1px solid #ddd;border-radius:10px;padding:12px 14px;margin:10px 0;}
    table{width:100%;border-collapse:collapse;margin-top:6px;}
    td,th{border:1px solid #e2e2e2;padding:8px;font-size:12.5px;vertical-align:top;text-align:right;}
    th{background:#f6f6f6;}
    .muted{color:#666;font-size:12px;}
    .small{font-size:11.5px;color:#555;}
    ul{margin:6px 18px;}
    li{margin:4px 0;}
    .sign td{height:90px;}
  </style>
</head>
<body>

<h1>عقد بيع دولي وفق شرط CFR (Incoterms® {{incotermsEdition}})</h1>

<div class="meta">
  رقم المرجع: <b>{{contractRef}}</b> &nbsp;|&nbsp;
  تاريخ العقد: <b>{{contractDate}}</b> &nbsp;|&nbsp;
  مكان الإبرام: <b>{{contractCity}}</b>
</div>

<div class="box">
  <h2>أولاً: أطراف العقد</h2>
  <table>
    <tr>
      <th style="width:20%">البائع</th>
      <td>
        {{sellerName}}<br/>
        <span class="muted">العنوان:</span> {{sellerAddress}}<br/>
        <span class="muted">السجل/الهوية:</span> {{sellerReg}}
      </td>
    </tr>
    <tr>
      <th>المشتري</th>
      <td>
        {{buyerName}}<br/>
        <span class="muted">العنوان:</span> {{buyerAddress}}<br/>
        <span class="muted">السجل/الهوية:</span> {{buyerReg}}
      </td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>ثانياً: التعريفات والمرجعية</h2>
  <p>
    يُقصد بشرط <b>CFR (التكلفة وأجرة النقل)</b> ما ورد تعريفه وتفسيره في
    <b>قواعد Incoterms® {{incotermsEdition}}</b> الصادرة عن غرفة التجارة الدولية (ICC).
  </p>
  <p class="small">
    في حال وجود أي تعارض بين هذا العقد وقواعد Incoterms®، تُطبّق أحكام هذا العقد بالقدر اللازم.
  </p>
</div>

<div class="box">
  <h2>ثالثاً: البضاعة والكمية والثمن</h2>
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
      <th>الثمن الإجمالي</th>
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

  <p class="small">
    يشمل الثمن تكلفة البضاعة وأجرة النقل البحري حتى ميناء المقصد المسمّى،
    وذلك وفق شرط CFR وIncoterms® {{incotermsEdition}}.
  </p>
</div>

<div class="box">
  <h2>رابعاً: التسليم وفق شرط CFR</h2>
  <table>
    <tr>
      <th style="width:30%">ميناء الشحن</th>
      <td>{{portOfShipment}}</td>
    </tr>
    <tr>
      <th>ميناء المقصد</th>
      <td>{{portOfDestination}}</td>
    </tr>
    <tr>
      <th>موعد/جدول الشحن</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <h3>انتقال المخاطر</h3>
  <ul>
    <li>
      تنتقل مخاطر الهلاك أو التلف من البائع إلى المشتري عند وضع البضاعة على متن السفينة
      في ميناء الشحن المذكور أعلاه.
    </li>
    <li>
      يتحمل المشتري المخاطر من تلك اللحظة، رغم تحمّل البائع تكلفة النقل البحري إلى ميناء المقصد.
    </li>
  </ul>
</div>

<div class="box">
  <h2>خامساً: النقل والتكاليف</h2>
  <ul>
    <li>
      يلتزم البائع بإبرام عقد النقل البحري ودفع أجرة الشحن حتى ميناء المقصد.
    </li>
    <li>
      يلتزم البائع بإتمام إجراءات التخليص للتصدير وفق القوانين المعمول بها.
    </li>
    <li>
      يتحمل المشتري جميع التكاليف والمخاطر بعد التسليم على متن السفينة،
      بما في ذلك التفريغ والتخليص للاستيراد والرسوم والضرائب في بلد الوصول.
    </li>
  </ul>
</div>

<div class="box">
  <h2>سادساً: التأمين</h2>
  <p>
    لا يلتزم البائع، بموجب شرط CFR، بتوفير التأمين على البضاعة.
    ويتحمل المشتري مسؤولية ترتيب التأمين البحري على نفقته الخاصة،
    ما لم يتم الاتفاق صراحةً وبشكل مكتوب على خلاف ذلك.
  </p>
</div>

<div class="box">
  <h2>سابعاً: المستندات والفحص</h2>
  <p>
    يلتزم البائع بتسليم المستندات التالية (أو ما يعادلها):
    <b>{{documentsList}}</b>.
  </p>
  <p>
    يتم الفحص والاستلام والاعتراض وفق الآلية التالية:
    <b>{{inspection}}</b>.
  </p>
</div>

<div class="box">
  <h2>ثامناً: التعبئة والوسم</h2>
  <p>
    التعبئة والتغليف: <b>{{packaging}}</b><br/>
    الوسم/العلامات: <b>{{marking}}</b>
  </p>
</div>

<div class="box">
  <h2>تاسعاً: القوة القاهرة</h2>
  <p>
    {{forceMajeure}}
  </p>
</div>

<div class="box">
  <h2>عاشراً: القانون الواجب التطبيق وتسوية المنازعات</h2>
  <table>
    <tr>
      <th style="width:30%">القانون الواجب التطبيق</th>
      <td>{{governingLaw}}</td>
    </tr>
    <tr>
      <th>فض النزاعات</th>
      <td>{{disputeResolution}}</td>
    </tr>
    <tr>
      <th>مقر التحكيم (إن وجد)</th>
      <td>{{arbitrationSeat}}</td>
    </tr>
    <tr>
      <th>لغة العقد</th>
      <td>{{languagePrevails}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>حادي عشر: أحكام ختامية</h2>
  <ul>
    <li>يمثل هذا العقد كامل الاتفاق بين الطرفين ويلغي ما سبقه من تفاهمات.</li>
    <li>لا يكون أي تعديل نافذًا إلا إذا كان مكتوبًا وموقعًا من الطرفين.</li>
    <li>في حال بطلان أي بند، يبقى باقي العقد صحيحًا ونافذًا.</li>
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

<p class="small">
  تم تحرير هذا العقد من نسختين أصليتين، تسلّم كل طرف نسخة للعمل بموجبها.
</p>

</body>
</html>`,
};

export const CFR_EN: ContractTemplate = {
  id: 2032,
  slug: "incoterms-cfr-premium-en",
  title: "International Sale Contract – CFR (Incoterms®)",
  lang: "en",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>CFR Contract</title>
  <style>
    body{
      font-family:"Times New Roman", Arial, serif;
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
    ul{margin:6px 18px;}
    li{margin:4px 0;}
    .sign td{height:90px;}
  </style>
</head>
<body>

<h1>International Sale Contract (CFR – Incoterms® {{incotermsEdition}})</h1>

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
    The trade term <b>CFR (Cost and Freight)</b> shall be interpreted in accordance with
    <b>Incoterms® {{incotermsEdition}}</b> issued by the International Chamber of Commerce (ICC).
  </p>
  <p class="small">
    In the event of any inconsistency between this Contract and Incoterms®, the provisions of this Contract shall prevail to the extent necessary.
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
    The Contract Price includes the cost of the Goods and the freight necessary to bring the Goods to the named port of destination, strictly in accordance with CFR.
  </p>
</div>

<div class="box">
  <h2>4. Delivery – CFR</h2>
  <p>
    Delivery shall be effected on a <b>CFR</b> basis as follows:
  </p>
  <table>
    <tr>
      <th style="width:30%">Port of Shipment</th>
      <td>{{portOfShipment}}</td>
    </tr>
    <tr>
      <th>Port of Destination</th>
      <td>{{portOfDestination}}</td>
    </tr>
    <tr>
      <th>Shipment Schedule</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <h3>4.1 Transfer of Risk</h3>
  <ul>
    <li>
      Risk of loss or damage to the Goods shall transfer from Seller to Buyer when the Goods are placed on board the vessel at the port of shipment.
    </li>
    <li>
      From that point onward, all risks shall be borne by Buyer, even though Seller bears the cost of freight to the port of destination.
    </li>
  </ul>
</div>

<div class="box">
  <h2>5. Carriage and Costs</h2>
  <ul>
    <li>
      Seller shall contract and pay for carriage of the Goods by sea to the port of destination stated above.
    </li>
    <li>
      Seller shall complete export customs clearance and export formalities.
    </li>
    <li>
      Buyer shall bear all costs and risks after delivery on board the vessel, including unloading and import clearance at destination.
    </li>
  </ul>
</div>

<div class="box">
  <h2>6. Insurance</h2>
  <p>
    Under CFR, Seller has <b>no obligation</b> to procure marine insurance for the Goods.
    Buyer shall arrange insurance at its own discretion and expense unless otherwise expressly agreed in writing.
  </p>
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
