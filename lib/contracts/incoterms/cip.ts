 import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const CIP_AR: ContractTemplate = {
  id: 2038,
  slug: "incoterms-cip-premium-ar",
  title: "عقد بيع دولي – CIP (Incoterms®)",
  lang: "ar",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>CIP Contract</title>
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

<h1>عقد بيع دولي وفق شرط CIP (Incoterms® {{incotermsEdition}})</h1>

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
    يُقصد بشرط <b>CIP (التكلفة والتأمين وأجور النقل)</b> ما ورد تعريفه وتفسيره في
    <b>قواعد Incoterms® {{incotermsEdition}}</b> الصادرة عن غرفة التجارة الدولية (ICC).
  </p>
  <p class="small">
    يُطبّق شرط CIP على جميع وسائط النقل، ويتميّز بإلزام البائع بتأمين البضاعة
    لصالح المشتري وفق الحد الأدنى المنصوص عليه في Incoterms®، ما لم يُتفق على تغطية أوسع.
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
  <h2>رابعاً: التسليم وفق شرط CIP</h2>
  <table>
    <tr>
      <th style="width:30%">مكان التسليم</th>
      <td>{{deliveryPlace}}</td>
    </tr>
    <tr>
      <th>مكان المقصد</th>
      <td>{{placeOfDestination}}</td>
    </tr>
    <tr>
      <th>موعد/فترة التسليم</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <ul>
    <li>
      يتم التسليم عندما يسلّم البائع البضاعة إلى الناقل أو الشخص الذي يعيّنه البائع،
      وذلك في مكان التسليم المتفق عليه، بعد تخليصها للتصدير.
    </li>
    <li>
      يلتزم البائع بإبرام عقد النقل ودفع أجور النقل حتى مكان المقصد المسمّى.
    </li>
  </ul>
</div>

<div class="box">
  <h2>خامساً: انتقال المخاطر</h2>
  <ul>
    <li>
      تنتقل مخاطر الهلاك أو التلف من البائع إلى المشتري عند تسليم البضاعة
      إلى أول ناقل وفق شرط CIP، وليس عند وصولها إلى مكان المقصد.
    </li>
    <li>
      يبقى تحمّل البائع لأجور النقل والتأمين مستقلاً عن انتقال المخاطر.
    </li>
  </ul>
</div>

<div class="box">
  <h2>سادساً: التأمين</h2>
  <p>
    يلتزم البائع بإبرام عقد تأمين على البضاعة لصالح المشتري يغطي مخاطر النقل
    وفق الحد الأدنى المنصوص عليه في قواعد Incoterms® {{incotermsEdition}}
    (عادةً وفق Institute Cargo Clauses (A) ما لم يُتفق على خلاف ذلك).
  </p>
  <table>
    <tr>
      <th style="width:30%">نطاق التغطية</th>
      <td>{{insuranceCoverage}}</td>
    </tr>
    <tr>
      <th>شركة التأمين</th>
      <td>{{insuranceCompany}}</td>
    </tr>
    <tr>
      <th>رقم وثيقة التأمين</th>
      <td>{{insurancePolicyNo}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>سابعاً: التخليص الجمركي</h2>
  <ul>
    <li>
      يلتزم البائع بإتمام إجراءات التخليص للتصدير والحصول على التراخيص اللازمة.
    </li>
    <li>
      يلتزم المشتري بإتمام إجراءات التخليص للاستيراد في بلد المقصد
      وتحمل الرسوم والضرائب ذات الصلة.
    </li>
  </ul>
</div>

<div class="box">
  <h2>ثامناً: المستندات والفحص</h2>
  <p>
    يلتزم البائع بتقديم المستندات التالية (أو ما يعادلها):
    <b>{{documentsList}}</b>.
  </p>
  <p>
    يتم الفحص والاستلام وفق الآلية التالية:
    <b>{{inspection}}</b>.
  </p>
</div>

<div class="box">
  <h2>تاسعاً: التعبئة والوسم</h2>
  <p>
    التعبئة والتغليف: <b>{{packaging}}</b><br/>
    الوسم/العلامات: <b>{{marking}}</b>
  </p>
</div>

<div class="box">
  <h2>عاشراً: القوة القاهرة</h2>
  <p>
    {{forceMajeure}}
  </p>
</div>

<div class="box">
  <h2>حادي عشر: القانون الواجب التطبيق وتسوية المنازعات</h2>
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
  <h2>ثاني عشر: أحكام ختامية</h2>
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


export const CIP_EN: ContractTemplate = {
  id: 2039,
  slug: "incoterms-cip-premium-en",
  title: "International Sale Contract – CIP (Incoterms®)",
  lang: "en",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>CIP Contract</title>
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
    h3{font-size:14px;margin:14px 0 6px;}
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

<h1>International Sale Contract (CIP – Incoterms® {{incotermsEdition}})</h1>

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
    The trade term <b>CIP (Carriage and Insurance Paid To)</b> shall be interpreted in accordance with
    <b>Incoterms® {{incotermsEdition}}</b> issued by the International Chamber of Commerce (ICC).
  </p>
  <p class="small">
    CIP is applicable to all modes of transport and obliges the Seller to procure insurance
    for the benefit of the Buyer, unless otherwise agreed.
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
  <h2>4. Delivery – CIP</h2>
  <table>
    <tr>
      <th style="width:30%">Place of Delivery</th>
      <td>{{deliveryPlace}}</td>
    </tr>
    <tr>
      <th>Place of Destination</th>
      <td>{{placeOfDestination}}</td>
    </tr>
    <tr>
      <th>Delivery Schedule</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <ul>
    <li>
      Delivery shall be effected when the Seller delivers the Goods, cleared for export,
      to the first carrier or another person nominated by the Seller at the agreed place of delivery.
    </li>
    <li>
      Seller shall contract for and pay the carriage of the Goods to the named place of destination.
    </li>
  </ul>
</div>

<div class="box">
  <h2>5. Transfer of Risk</h2>
  <ul>
    <li>
      Risk of loss or damage to the Goods shall pass from Seller to Buyer
      upon delivery of the Goods to the first carrier, in accordance with CIP.
    </li>
    <li>
      The Seller’s obligation to pay carriage and insurance shall not affect the moment of risk transfer.
    </li>
  </ul>
</div>

<div class="box">
  <h2>6. Insurance</h2>
  <p>
    Seller shall procure cargo insurance covering the Buyer’s risk of loss or damage to the Goods
    during carriage, in accordance with <b>Incoterms® {{incotermsEdition}}</b>.
  </p>
  <table>
    <tr>
      <th style="width:30%">Insurance Coverage</th>
      <td>{{insuranceCoverage}}</td>
    </tr>
    <tr>
      <th>Insurance Company</th>
      <td>{{insuranceCompany}}</td>
    </tr>
    <tr>
      <th>Insurance Policy No.</th>
      <td>{{insurancePolicyNo}}</td>
    </tr>
  </table>
</div>

<div class="box">
  <h2>7. Customs Clearance</h2>
  <ul>
    <li>Seller shall be responsible for export customs clearance.</li>
    <li>Buyer shall be responsible for import clearance, duties, and taxes at destination.</li>
  </ul>
</div>

<div class="box">
  <h2>8. Documents and Inspection</h2>
  <p>
    Seller shall provide Buyer with the following documents (or their equivalents):
    <b>{{documentsList}}</b>.
  </p>
  <p>
    Inspection and acceptance shall be carried out as follows:
    <b>{{inspection}}</b>.
  </p>
</div>

<div class="box">
  <h2>9. Packaging and Marking</h2>
  <p>
    Packaging: <b>{{packaging}}</b><br/>
    Marking: <b>{{marking}}</b>
  </p>
</div>

<div class="box">
  <h2>10. Force Majeure</h2>
  <p>
    {{forceMajeure}}
  </p>
</div>

<div class="box">
  <h2>11. Governing Law and Dispute Resolution</h2>
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
  <h2>12. Final Provisions</h2>
  <ul>
    <li>This Contract constitutes the entire agreement between the Parties.</li>
    <li>No amendment shall be valid unless made in writing and signed by both Parties.</li>
    <li>If any provision is held invalid, the remainder shall remain in full force and effect.</li>
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
