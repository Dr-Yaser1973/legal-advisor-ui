 import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const FCA_AR: ContractTemplate = {
  id: 2037,
  slug: "incoterms-fca-premium-ar",
  title: "عقد بيع دولي – FCA (Incoterms®)",
  lang: "ar",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>FCA Contract</title>
  <style>
    body{
      font-family:"Noto Naskh Arabic","Amiri","Arial",sans-serif;
      padding:28px;
      line-height:1.9;
      color:#111;
      font-size:13.5px;
    }
    h1{font-size:20px;margin:0 0 10px;text-align:center;}
    h2{font-size:15px;margin:18px 0 8px;}
    h3{font-size:14px;margin:14px 0 6px;}
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

<h1>عقد بيع دولي وفق شرط FCA (Incoterms® {{incotermsEdition}})</h1>

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
    يُقصد بشرط <b>FCA (التسليم للناقل)</b> ما ورد تعريفه وتفسيره في
    <b>قواعد Incoterms® {{incotermsEdition}}</b> الصادرة عن غرفة التجارة الدولية (ICC).
  </p>
  <p class="small">
    يُعد شرط FCA من أنسب شروط التجارة الدولية، ويُوصى به عمليًا كبديل مهني لشرط EXW،
    لكونه يحقق توازنًا أوضح في الالتزامات بين البائع والمشتري.
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
</div>

<div class="box">
  <h2>رابعاً: التسليم وفق شرط FCA</h2>
  <table>
    <tr>
      <th style="width:30%">مكان التسليم</th>
      <td>{{deliveryPlace}}</td>
    </tr>
    <tr>
      <th>موعد/فترة التسليم</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <ul>
    <li>
      يتم التسليم عندما يسلّم البائع البضاعة، بعد تخليصها للتصدير،
      إلى الناقل أو الشخص الذي يعيّنه المشتري في مكان التسليم المحدد.
    </li>
    <li>
      إذا كان مكان التسليم هو مقر البائع، يلتزم البائع بتحميل البضاعة
      على وسيلة النقل التي يوفّرها الناقل.
    </li>
    <li>
      إذا كان مكان التسليم خارج مقر البائع، لا يلتزم البائع بالتفريغ
      من وسيلة النقل الخاصة به.
    </li>
  </ul>
</div>

<div class="box">
  <h2>خامساً: انتقال المخاطر والتكاليف</h2>
  <ul>
    <li>
      تنتقل مخاطر الهلاك أو التلف من البائع إلى المشتري عند إتمام التسليم
      وفق شرط FCA في مكان التسليم المتفق عليه.
    </li>
    <li>
      يتحمل المشتري جميع التكاليف اللاحقة، بما في ذلك النقل الرئيسي،
      التأمين، والتخليص للاستيراد والرسوم والضرائب.
    </li>
  </ul>
</div>

<div class="box">
  <h2>سادساً: التخليص الجمركي والنقل</h2>
  <ul>
    <li>
      يلتزم البائع بإتمام إجراءات التخليص للتصدير والحصول على التراخيص
      اللازمة وفق القوانين المعمول بها في بلد التصدير.
    </li>
    <li>
      يلتزم المشتري بإتمام إجراءات التخليص للاستيراد في بلد المقصد
      وتحمل الرسوم والضرائب ذات الصلة.
    </li>
  </ul>
</div>

<div class="box">
  <h2>سابعاً: المستندات وإثبات التسليم</h2>
  <p>
    يلتزم البائع بتقديم المستندات التالية (أو ما يعادلها):
    <b>{{documentsList}}</b>.
  </p>
  <p class="small">
    يلتزم البائع، بناءً على طلب المشتري، بتقديم ما يثبت تسليم البضاعة للناقل
    متى كان ذلك متعارفًا عليه تجاريًا.
  </p>
</div>

<div class="box">
  <h2>ثامناً: الفحص والتعبئة والوسم</h2>
  <p>
    يتم الفحص والاستلام وفق الآتي:
    <b>{{inspection}}</b>.
  </p>
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


export const FCA_EN: ContractTemplate = {
  id: 2036,
  slug: "incoterms-fca-premium-en",
  title: "International Sale Contract – FCA (Incoterms®)",
  lang: "en",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>FCA Contract</title>
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
    The trade term <b>FCA (Free Carrier)</b> shall be interpreted in accordance with
    <b>Incoterms® {{incotermsEdition}}</b> issued by the International Chamber of Commerce (ICC).
  </p>
  <p class="small">
    FCA is suitable for all modes of transport and is often recommended as a practical alternative to EXW
    in international trade.
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
  <h2>4. Delivery – FCA</h2>
  <table>
    <tr>
      <th style="width:30%">Place of Delivery</th>
      <td>{{deliveryPlace}}</td>
    </tr>
    <tr>
      <th>Delivery Schedule</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <ul>
    <li>
      Delivery shall be effected when the Seller delivers the Goods, cleared for export,
      to the carrier or another person nominated by Buyer at the named place of delivery.
    </li>
    <li>
      If delivery takes place at Seller’s premises, Seller shall be responsible for loading the Goods onto the collecting vehicle.
    </li>
    <li>
      If delivery takes place at another place, Seller is not responsible for unloading.
    </li>
  </ul>
</div>

<div class="box">
  <h2>5. Transfer of Risk and Costs</h2>
  <ul>
    <li>
      Risk of loss or damage to the Goods shall pass from Seller to Buyer at the moment of delivery
      in accordance with FCA at the named place.
    </li>
    <li>
      Buyer shall bear all costs thereafter, including main carriage, insurance, and import clearance.
    </li>
  </ul>
</div>

<div class="box">
  <h2>6. Customs Clearance and Transport</h2>
  <ul>
    <li>
      Seller shall be responsible for export customs clearance and export formalities.
    </li>
    <li>
      Buyer shall be responsible for import clearance, duties, taxes, and licences at destination.
    </li>
  </ul>
</div>

<div class="box">
  <h2>7. Documents and Proof of Delivery</h2>
  <p>
    Seller shall provide Buyer with the following documents (or their equivalents):
    <b>{{documentsList}}</b>.
  </p>
  <p class="small">
    At Buyer’s request, Seller shall provide proof of delivery to the carrier, where customary.
  </p>
</div>

<div class="box">
  <h2>8. Inspection, Packaging and Marking</h2>
  <p>
    Inspection and acceptance shall be carried out as follows:
    <b>{{inspection}}</b>.
  </p>
  <p>
    Packaging: <b>{{packaging}}</b><br/>
    Marking: <b>{{marking}}</b>
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
    <li>If any provision is held invalid, the remainder of the Contract shall remain in full force and effect.</li>
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
