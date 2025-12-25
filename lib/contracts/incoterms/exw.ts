 import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const EXW_AR: ContractTemplate = {
  id: 2034,
  slug: "incoterms-exw-premium-ar",
  title: "عقد بيع دولي – EXW (Incoterms®)",
  lang: "ar",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>EXW Contract</title>
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

<h1>عقد بيع دولي وفق شرط EXW (Incoterms® {{incotermsEdition}})</h1>

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
  <h2>ثانياً: التعريفات والتنبيه التفسيري</h2>
  <p>
    يُقصد بشرط <b>EXW (التسليم في مقر البائع)</b> ما ورد تعريفه في
    <b>قواعد Incoterms® {{incotermsEdition}}</b> الصادرة عن غرفة التجارة الدولية (ICC).
  </p>
  <p class="small">
    يقر الطرفان علمهما بأن EXW يُعدّ من أقل شروط البيع التزامًا على البائع،
    وأنه قد لا يكون مناسبًا في بعض المعاملات الدولية إذا لم يكن المشتري قادرًا
    عمليًا أو قانونيًا على إتمام إجراءات التصدير في بلد البائع.
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
  <h2>رابعاً: التسليم وفق شرط EXW</h2>
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
      يتم التسليم عندما يضع البائع البضاعة تحت تصرّف المشتري في مكان التسليم المتفق عليه
      (مصنع/مستودع/مقر البائع)، دون تحميلها على أي وسيلة نقل.
    </li>
    <li>
      لا يلتزم البائع بتحميل البضاعة أو تخليصها للتصدير ما لم يُنص صراحةً على خلاف ذلك في هذا العقد.
    </li>
  </ul>
</div>

<div class="box">
  <h2>خامساً: انتقال المخاطر والتكاليف</h2>
  <ul>
    <li>
      تنتقل مخاطر الهلاك أو التلف من البائع إلى المشتري بمجرد وضع البضاعة تحت تصرّف المشتري
      في مكان التسليم المحدد.
    </li>
    <li>
      يتحمل المشتري جميع التكاليف والمخاطر اللاحقة، بما في ذلك التحميل، النقل الداخلي،
      التخليص للتصدير والاستيراد، الرسوم، الضرائب، وأجور النقل والتأمين.
    </li>
  </ul>
</div>

<div class="box">
  <h2>سادساً: التخليص الجمركي والتراخيص</h2>
  <p>
    يلتزم المشتري بإتمام جميع إجراءات التصدير والاستيراد والحصول على التراخيص والموافقات اللازمة،
    ويتحمّل وحده المسؤولية القانونية عن ذلك، ما لم يتم الاتفاق كتابيًا على قيام البائع
    بالمساعدة دون تحمّل مسؤولية.
  </p>
</div>

<div class="box">
  <h2>سابعاً: المستندات والمساعدة</h2>
  <p>
    يلتزم البائع، بناءً على طلب المشتري وعلى نفقته ومخاطره، بتقديم المساعدة المعقولة
    في الحصول على المعلومات أو المستندات اللازمة للتصدير، دون أن يُعد ذلك التزامًا أصيلاً عليه.
  </p>
</div>

<div class="box">
  <h2>ثامناً: الفحص والاستلام</h2>
  <p>
    يتم فحص البضاعة واستلامها في مكان التسليم المحدد.
    ويتحمل المشتري مسؤولية أي تأخير أو إخفاق في الاستلام في الموعد المتفق عليه.
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


export const EXW_EN: ContractTemplate = {
  id: 2035,
  slug: "incoterms-exw-premium-en",
  title: "International Sale Contract – EXW (Incoterms®)",
  lang: "en",
  group: "INCOTERMS",

  html: `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>EXW Contract</title>
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

<h1>International Sale Contract (EXW – Incoterms® {{incotermsEdition}})</h1>

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
  <h2>2. Definitions and Interpretative Notice</h2>
  <p>
    The term <b>EXW (Ex Works)</b> shall be interpreted in accordance with
    <b>Incoterms® {{incotermsEdition}}</b> issued by the International Chamber of Commerce (ICC).
  </p>
  <p class="small">
    The Parties acknowledge that EXW represents the minimum obligation for the Seller and may be unsuitable
    in certain international transactions where the Buyer is unable, in practice or by law, to carry out export clearance in the Seller’s country.
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
  <h2>4. Delivery – EXW</h2>
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
      Delivery shall be effected when the Seller places the Goods at the disposal of the Buyer
      at the agreed place of delivery (factory, warehouse, or other premises), not loaded on any collecting vehicle.
    </li>
    <li>
      The Seller shall have no obligation to load the Goods or to clear them for export unless expressly agreed otherwise in writing.
    </li>
  </ul>
</div>

<div class="box">
  <h2>5. Transfer of Risk and Costs</h2>
  <ul>
    <li>
      Risk of loss or damage to the Goods shall pass from Seller to Buyer once the Goods are placed at the Buyer’s disposal at the place of delivery.
    </li>
    <li>
      Buyer shall bear all costs and risks thereafter, including loading, inland transport, export and import clearance,
      duties, taxes, freight, and insurance.
    </li>
  </ul>
</div>

<div class="box">
  <h2>6. Customs Clearance and Licences</h2>
  <p>
    Buyer shall be solely responsible for obtaining all export and import licences, permits, and approvals,
    and for carrying out all customs formalities, unless otherwise expressly agreed in writing.
  </p>
</div>

<div class="box">
  <h2>7. Documents and Assistance</h2>
  <p>
    Upon Buyer’s request and at Buyer’s cost and risk, Seller shall provide reasonable assistance
    in obtaining information or documents required for export or import, without assuming any responsibility.
  </p>
</div>

<div class="box">
  <h2>8. Inspection and Acceptance</h2>
  <p>
    Inspection and acceptance of the Goods shall take place at the agreed place of delivery.
    Buyer shall bear the consequences of any failure to take delivery at the agreed time.
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
