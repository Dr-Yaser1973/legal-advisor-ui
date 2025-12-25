 // lib/contracts/incoterms/ddp.ts
import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const DDP_AR: ContractTemplate = {
  id: 2460,
  slug: "incoterms-ddp-premium-ar",
  title: "عقد بيع دولي (DDP) بريموم — تسليم مع دفع الرسوم (Incoterms)",
  lang: "ar",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    *{box-sizing:border-box}
    body{font-family: Arial, "Noto Naskh Arabic","Amiri",sans-serif; padding:28px; line-height:1.9; color:#111}
    h1{font-size:20px; margin:0 0 14px; text-align:center}
    h2{font-size:15px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #ddd; border-radius:12px; padding:12px 14px; margin:10px 0}
    .grid{display:grid; grid-template-columns:1fr 1fr; gap:10px}
    .row{display:flex; gap:10px; flex-wrap:wrap}
    .pill{display:inline-block; padding:2px 10px; border:1px solid #ddd; border-radius:999px; font-size:12px; color:#333}
    table{width:100%; border-collapse:collapse; margin:8px 0}
    td,th{border:1px solid #ddd; padding:8px; vertical-align:top}
    th{background:#f6f6f6}
    .sign{height:70px}
    .rtl{text-align:right}
    .center{text-align:center}
    ol{margin:6px 0 6px 0; padding:0 18px}
    li{margin:6px 0}
  </style>
</head>
<body>

  <h1>عقد بيع دولي — شرط التسليم DDP (Delivered Duty Paid)</h1>

  <div class="center muted">
    <span class="pill">رقم المرجع: {{contractRef}}</span>
    <span class="pill">تاريخ العقد: {{contractDate}}</span>
    <span class="pill">مدينة الإبرام: {{contractCity}}</span>
  </div>

  <div class="box">
    <h2>أولاً: أطراف العقد</h2>
    <div class="grid">
      <div>
        <b>البائع</b><br/>
        الاسم: {{sellerName}}<br/>
        العنوان: {{sellerAddress}}<br/>
        السجل/الترخيص: {{sellerReg}}<br/>
      </div>
      <div>
        <b>المشتري</b><br/>
        الاسم: {{buyerName}}<br/>
        العنوان: {{buyerAddress}}<br/>
        السجل/الترخيص: {{buyerReg}}<br/>
      </div>
    </div>
  </div>

  <div class="box">
    <h2>ثانياً: التعاريف والمرجع</h2>
    <ol>
      <li>تعني عبارة <b>Incoterms</b> قواعد غرفة التجارة الدولية (ICC) الخاصة بالمصطلحات التجارية الدولية.</li>
      <li>المصطلح المعتمد في هذا العقد هو: <b>DDP — تسليم مع دفع الرسوم</b> وفق إصدار: <b>{{incotermsEdition}}</b>، ما لم يتفق الطرفان كتابةً على خلاف ذلك.</li>
      <li>مكان التسليم المحدد (Named Place of Destination): <b>{{placeOfDelivery}}</b>.</li>
    </ol>
  </div>

  <div class="box">
    <h2>ثالثاً: البضاعة والسعر والدفع</h2>
    <table>
      <tr>
        <th>وصف البضاعة</th>
        <td>{{goodsDescription}}</td>
      </tr>
      <tr>
        <th>رمز HS (اختياري)</th>
        <td>{{hsCode}}</td>
      </tr>
      <tr>
        <th>الكمية</th>
        <td>{{quantity}} (وحدة القياس: {{unit}}) — نسبة التسامح: {{tolerance}}</td>
      </tr>
      <tr>
        <th>السعر</th>
        <td>
          سعر الوحدة: {{unitPrice}}<br/>
          السعر الإجمالي: {{totalPrice}}<br/>
          العملة: {{currency}}
        </td>
      </tr>
      <tr>
        <th>شروط الدفع</th>
        <td>{{paymentTerms}}</td>
      </tr>
    </table>
  </div>

  <div class="box">
    <h2>رابعاً: التسليم والشحن والتعبئة</h2>
    <ol>
      <li>يتعهد البائع بتسليم البضاعة في <b>{{placeOfDelivery}}</b> وفق شرط DDP، بما يشمل (حيثما يلزم) الاستيراد والتخليص ودفع الرسوم والضرائب.</li>
      <li>موعد/جدول التسليم/الشحن: {{deliverySchedule}}.</li>
      <li>التعبئة والتغليف: {{packaging}}.</li>
      <li>الوسم/العلامات: {{marking}}.</li>
      <li><b>التفريغ عند الوصول</b>: {{unloadingResponsibility}}.</li>
    </ol>
  </div>

  <div class="box">
    <h2>خامساً: التزامات DDP (استيراد/تخليص/رسوم)</h2>
    <ol>
      <li>يلتزم البائع بإجراءات الاستيراد والتخليص الجمركي في دولة المقصد: <b>{{destinationCountry}}</b> عبر: {{customsBroker}} (إن وجد).</li>
      <li>يلتزم البائع بسداد الرسوم/الضرائب/الجبايات المتعلقة بالاستيراد: {{importDutiesTaxes}}.</li>
      <li>الرخص/الإجازات/الموافقات المطلوبة للاستيراد: {{importLicenses}}.</li>
      <li>في حال حدوث تأخير بسبب عدم تعاون المشتري بتقديم مستندات/بيانات لازمة قانوناً خلال مدة معقولة، يتحمل المشتري آثار ذلك التأخير ضمن حدود القانون والعرف التجاري، دون الإخلال بالتزام البائع الأساسي في DDP.</li>
    </ol>
  </div>

  <div class="box">
    <h2>سادساً: انتقال المخاطر والملكية</h2>
    <ol>
      <li>تنتقل مخاطر الهلاك/التلف إلى المشتري عند <b>إتمام التسليم في {{placeOfDelivery}}</b> وفق شرط DDP وإتاحة البضاعة للمشتري.</li>
      <li>تنتقل الملكية وفق ما يلي: {{titleTransferClause}}.</li>
    </ol>
  </div>

  <div class="box">
    <h2>سابعاً: المستندات والفحص والمطابقة</h2>
    <ol>
      <li>يلتزم البائع بتوفير/تسليم المستندات التالية كحد أدنى: {{documentsList}}.</li>
      <li>الفحص والاستلام: {{inspection}}.</li>
      <li>في حال وجود عدم مطابقة جوهرية، يحق للمشتري إخطار البائع خلال مدة معقولة مع بيان أوجه عدم المطابقة، ويجري الطرفان تسويةً ودّية أو وفق آلية فض النزاع أدناه.</li>
    </ol>
  </div>

  <div class="box">
    <h2>ثامناً: القوة القاهرة</h2>
    <div>{{forceMajeure}}</div>
  </div>

  <div class="box">
    <h2>تاسعاً: القانون الواجب التطبيق وفض النزاعات</h2>
    <ol>
      <li>القانون الواجب التطبيق: {{governingLaw}}.</li>
      <li>فض النزاعات: {{disputeResolution}}.</li>
      <li>مقر التحكيم (إن وجد): {{arbitrationSeat}}.</li>
      <li>لغة العقد المعتمدة: {{languagePrevails}}.</li>
    </ol>
  </div>

  <div class="box">
    <h2>عاشراً: التوقيعات</h2>
    <table>
      <tr>
        <th class="center">عن البائع</th>
        <th class="center">عن المشتري</th>
      </tr>
      <tr>
        <td class="sign">
          الاسم/الصفة: {{sellerSignName}}<br/>
          التاريخ: {{sellerSignDate}}<br/>
          التوقيع: ____________________
        </td>
        <td class="sign">
          الاسم/الصفة: {{buyerSignName}}<br/>
          التاريخ: {{buyerSignDate}}<br/>
          التوقيع: ____________________
        </td>
      </tr>
    </table>
  </div>

  <div class="muted center">
    تم إعداد هذا العقد بصياغة احترافية قابلة للتخصيص وفق بيانات الأطراف والمعاملة.
  </div>

</body>
</html>
  `.trim(),
};


export const DDP_EN: ContractTemplate = {
  id: 2461,
  slug: "incoterms-ddp-premium-en",
  title: "International Sale Contract (DDP) — Premium (Incoterms)",
  lang: "en",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    *{box-sizing:border-box}
    body{font-family: Arial, "Times New Roman", serif; padding:28px; line-height:1.8; color:#111}
    h1{font-size:20px; margin:0 0 14px; text-align:center}
    h2{font-size:15px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #ddd; border-radius:12px; padding:12px 14px; margin:10px 0}
    .grid{display:grid; grid-template-columns:1fr 1fr; gap:10px}
    .pill{display:inline-block; padding:2px 10px; border:1px solid #ddd; border-radius:999px; font-size:12px; color:#333}
    table{width:100%; border-collapse:collapse; margin:8px 0}
    td,th{border:1px solid #ddd; padding:8px; vertical-align:top}
    th{background:#f6f6f6}
    .sign{height:70px}
    .center{text-align:center}
    ol{margin:6px 0; padding:0 18px}
    li{margin:6px 0}
  </style>
</head>
<body>

  <h1>International Sale Contract — DDP (Delivered Duty Paid)</h1>

  <div class="center muted">
    <span class="pill">Contract Ref: {{contractRef}}</span>
    <span class="pill">Date: {{contractDate}}</span>
    <span class="pill">City: {{contractCity}}</span>
  </div>

  <div class="box">
    <h2>1. Parties</h2>
    <div class="grid">
      <div>
        <b>Seller</b><br/>
        Name: {{sellerName}}<br/>
        Address: {{sellerAddress}}<br/>
        Registration/License: {{sellerReg}}<br/>
      </div>
      <div>
        <b>Buyer</b><br/>
        Name: {{buyerName}}<br/>
        Address: {{buyerAddress}}<br/>
        Registration/License: {{buyerReg}}<br/>
      </div>
    </div>
  </div>

  <div class="box">
    <h2>2. Definitions & Reference</h2>
    <ol>
      <li><b>Incoterms</b> means the ICC rules for the use of domestic and international trade terms.</li>
      <li>The applicable term is <b>DDP — Delivered Duty Paid</b> under Incoterms <b>{{incotermsEdition}}</b>, unless otherwise agreed in writing.</li>
      <li>Named Place of Destination: <b>{{placeOfDelivery}}</b>.</li>
    </ol>
  </div>

  <div class="box">
    <h2>3. Goods, Price & Payment</h2>
    <table>
      <tr>
        <th>Goods Description</th>
        <td>{{goodsDescription}}</td>
      </tr>
      <tr>
        <th>HS Code (Optional)</th>
        <td>{{hsCode}}</td>
      </tr>
      <tr>
        <th>Quantity</th>
        <td>{{quantity}} (Unit: {{unit}}) — Tolerance: {{tolerance}}</td>
      </tr>
      <tr>
        <th>Price</th>
        <td>
          Unit Price: {{unitPrice}}<br/>
          Total Price: {{totalPrice}}<br/>
          Currency: {{currency}}
        </td>
      </tr>
      <tr>
        <th>Payment Terms</th>
        <td>{{paymentTerms}}</td>
      </tr>
    </table>
  </div>

  <div class="box">
    <h2>4. Delivery, Packing & Unloading</h2>
    <ol>
      <li>The Seller shall deliver the Goods to <b>{{placeOfDelivery}}</b> under DDP, including import clearance and payment of duties/taxes as required.</li>
      <li>Delivery/Shipment Schedule: {{deliverySchedule}}.</li>
      <li>Packing: {{packaging}}.</li>
      <li>Marking: {{marking}}.</li>
      <li><b>Unloading at destination</b>: {{unloadingResponsibility}}.</li>
    </ol>
  </div>

  <div class="box">
    <h2>5. DDP Import Clearance, Duties & Taxes</h2>
    <ol>
      <li>Destination Country: <b>{{destinationCountry}}</b>. Customs broker/agent (if any): {{customsBroker}}.</li>
      <li>Import duties/taxes/fees payable by Seller: {{importDutiesTaxes}}.</li>
      <li>Import licenses/permits/approvals: {{importLicenses}}.</li>
      <li>If Buyer fails to provide legally-required information/documents within a reasonable time, any resulting delay/cost shall be allocated as agreed and subject to applicable law, without negating Seller’s core DDP obligations.</li>
    </ol>
  </div>

  <div class="box">
    <h2>6. Risk & Title</h2>
    <ol>
      <li>Risk transfers to Buyer upon <b>delivery at {{placeOfDelivery}}</b> and making the Goods available in accordance with DDP.</li>
      <li>Title transfer clause: {{titleTransferClause}}.</li>
    </ol>
  </div>

  <div class="box">
    <h2>7. Documents, Inspection & Conformity</h2>
    <ol>
      <li>Minimum documents to be provided: {{documentsList}}.</li>
      <li>Inspection/Acceptance: {{inspection}}.</li>
      <li>In case of material non-conformity, Buyer shall notify Seller within a reasonable time, and the Parties shall seek amicable settlement or proceed under dispute resolution below.</li>
    </ol>
  </div>

  <div class="box">
    <h2>8. Force Majeure</h2>
    <div>{{forceMajeure}}</div>
  </div>

  <div class="box">
    <h2>9. Governing Law & Dispute Resolution</h2>
    <ol>
      <li>Governing Law: {{governingLaw}}.</li>
      <li>Dispute Resolution: {{disputeResolution}}.</li>
      <li>Arbitration Seat (if any): {{arbitrationSeat}}.</li>
      <li>Prevailing Language: {{languagePrevails}}.</li>
    </ol>
  </div>

  <div class="box">
    <h2>10. Signatures</h2>
    <table>
      <tr>
        <th class="center">For the Seller</th>
        <th class="center">For the Buyer</th>
      </tr>
      <tr>
        <td class="sign">
          Name/Title: {{sellerSignName}}<br/>
          Date: {{sellerSignDate}}<br/>
          Signature: ____________________
        </td>
        <td class="sign">
          Name/Title: {{buyerSignName}}<br/>
          Date: {{buyerSignDate}}<br/>
          Signature: ____________________
        </td>
      </tr>
    </table>
  </div>

  <div class="muted center">
    Premium drafting — customizable per transaction details.
  </div>

</body>
</html>
  `.trim(),
};
