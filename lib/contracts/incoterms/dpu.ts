 // lib/contracts/incoterms.dpu.ts
import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const DPU_AR: ContractTemplate = {
  id: 2409,
  slug: "incoterms-dpu-premium-ar",
  title: "عقد بيع دولي (DPU) بريموم — تسليم في المكان بعد التفريغ (Incoterms 2020)",
  lang: "ar",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family: Arial, "Noto Naskh Arabic", "Amiri", sans-serif; padding:26px; line-height:1.9; color:#111}
    h1{font-size:20px; margin:0 0 10px}
    h2{font-size:15px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #e5e5e5; padding:12px 14px; border-radius:12px; margin:12px 0}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:10px}
    .k{color:#333; font-size:12px}
    .v{font-weight:600}
    table{width:100%; border-collapse:collapse; margin-top:8px}
    th,td{border:1px solid #e5e5e5; padding:10px; vertical-align:top}
    th{background:#fafafa; text-align:right}
    .sig{margin-top:14px}
    .hr{height:1px; background:#eee; margin:14px 0}
    .rtl{text-align:right}
  </style>
</head>
<body>

  <h1 class="rtl">عقد بيع دولي — شرط (DPU) — Incoterms® {{incotermsEdition}}</h1>
  <div class="muted rtl">
    رقم المرجع: <b>{{contractRef}}</b> — تاريخ العقد: <b>{{contractDate}}</b> — مكان الإبرام: <b>{{contractCity}}</b>
  </div>

  <div class="box rtl">
    <div class="grid">
      <div>
        <div class="k">البائع</div>
        <div class="v">{{sellerName}}</div>
        <div>{{sellerAddress}}</div>
        <div class="muted">سجل/ترخيص: {{sellerReg}}</div>
      </div>
      <div>
        <div class="k">المشتري</div>
        <div class="v">{{buyerName}}</div>
        <div>{{buyerAddress}}</div>
        <div class="muted">سجل/ترخيص: {{buyerReg}}</div>
      </div>
    </div>
  </div>

  <h2 class="rtl">1) التعاريف والتفسير</h2>
  <div class="rtl">
    لأغراض هذا العقد، يُقصد بمصطلح <b>Incoterms®</b> القواعد الصادرة عن غرفة التجارة الدولية، ويُقصد بشرط
    <b>DPU (Delivered at Place Unloaded)</b> أن التزام البائع يتم عند تسليم البضاعة <b>بعد تفريغها</b> من وسيلة النقل
    في <b>المكان/النقطة المُسمّاة</b> المتفق عليها. وفي حال التعارض، تسود أحكام هذا العقد على أي مراسلات سابقة.
  </div>

  <h2 class="rtl">2) البضاعة والمواصفات</h2>
  <div class="box rtl">
    <div><b>وصف البضاعة:</b> {{goodsDescription}}</div>
    <div class="muted"><b>رمز HS (اختياري):</b> {{hsCode}}</div>
    <div class="hr"></div>
    <div><b>الكمية:</b> {{quantity}} — <b>الوحدة:</b> {{unit}} — <b>التسامح:</b> {{tolerance}}</div>
    <div class="muted rtl">التعبئة والتغليف: {{packaging}} — الوسم/العلامات: {{marking}}</div>
  </div>

  <h2 class="rtl">3) الثمن والعملة وشروط الدفع</h2>
  <div class="box rtl">
    <table>
      <tr>
        <th>سعر الوحدة</th>
        <td>{{unitPrice}}</td>
        <th>السعر الإجمالي</th>
        <td>{{totalPrice}}</td>
      </tr>
      <tr>
        <th>العملة</th>
        <td>{{currency}}</td>
        <th>شروط الدفع</th>
        <td>{{paymentTerms}}</td>
      </tr>
    </table>
    <div class="muted rtl">أي رسوم مصرفية/تحويلات/اعتمادات تتحملها الجهة المحددة في شروط الدفع أعلاه، ما لم يُتفق خلاف ذلك كتابةً.</div>
  </div>

  <h2 class="rtl">4) شرط التسليم (DPU) — المكان المُسمّى والتفريغ</h2>
  <div class="box rtl">
    <div><b>إصدار Incoterms:</b> {{incotermsEdition}}</div>
    <div><b>المكان المُسمّى للتسليم بعد التفريغ:</b> {{placeOfDelivery}}</div>
    <div class="muted rtl">تفاصيل النقطة/المرفق/الرصيف/البوابة (إن وجدت): {{deliveryPointDetails}}</div>
    <div class="hr"></div>
    <div><b>جدول الشحن/الإرسال:</b> {{deliverySchedule}}</div>
    <div class="muted rtl">
      يلتزم البائع بتوفير وسيلة النقل المناسبة وإتمام التسليم <b>بعد التفريغ</b> في المكان المُسمّى، مع مراعاة اشتراطات
      الوصول والتصاريح التشغيلية في موقع التسليم، ما لم يحدد العقد خلاف ذلك.
    </div>
  </div>

  <h2 class="rtl">5) انتقال المخاطر وتوزيع التكاليف</h2>
  <div class="rtl">
    1. تنتقل مخاطر الهلاك أو التلف من البائع إلى المشتري عند إتمام التسليم وفق DPU، أي بعد تفريغ البضاعة في المكان المُسمّى. <br/>
    2. يتحمل البائع التكاليف حتى التسليم بعد التفريغ في المكان المُسمّى، بما في ذلك النقل الرئيسي وأي مناولة لازمة للتفريغ، ما لم ينص العقد على غير ذلك. <br/>
    3. يتحمل المشتري التكاليف اللاحقة للتسليم، بما في ذلك أي تخزين لاحق أو نقل داخلي بعد نقطة التسليم، إلا إذا نشأت بسبب إخلال من البائع.
  </div>

  <h2 class="rtl">6) التخليص الجمركي والضرائب</h2>
  <div class="box rtl">
    <div><b>التصدير (على البائع):</b> يلتزم البائع بإتمام إجراءات التصدير والتراخيص اللازمة.</div>
    <div><b>الاستيراد (على المشتري):</b> يلتزم المشتري بإتمام إجراءات الاستيراد والتراخيص والرسوم والضرائب ذات الصلة.</div>
    <div class="muted rtl">أي استثناءات أو ترتيبات خاصة: {{customsNotes}}</div>
  </div>

  <h2 class="rtl">7) الفحص والاستلام والمطابقة</h2>
  <div class="box rtl">
    <div><b>الفحص والاستلام:</b> {{inspection}}</div>
    <div class="muted rtl">
      يعتبر الاستلام نهائياً ما لم يقدم المشتري إشعاراً كتابياً بالعيوب الظاهرة خلال المدة المتفق عليها في بند الفحص،
      وبما لا يخل بضمانات المطابقة المنصوص عليها صراحةً في هذا العقد.
    </div>
  </div>

  <h2 class="rtl">8) المستندات</h2>
  <div class="box rtl">
    <div><b>قائمة المستندات:</b> {{documentsList}}</div>
    <div class="muted rtl">يلتزم البائع بتقديم المستندات المتفق عليها بالصيغة والعدد وفي التوقيت المتوافق مع شروط الدفع والتخليص.</div>
  </div>

  <h2 class="rtl">9) التأمين</h2>
  <div class="rtl">
    وفق شرط DPU، لا يوجد التزام افتراضي على البائع بتوفير التأمين ما لم يُتفق خلاف ذلك.
    <div class="box rtl">
      <div><b>نطاق التغطية (إن اتُفق):</b> {{insuranceCoverage}}</div>
      <div><b>شركة التأمين (إن اتُفق):</b> {{insuranceCompany}}</div>
      <div><b>رقم الوثيقة (إن اتُفق):</b> {{insurancePolicyNo}}</div>
    </div>
  </div>

  <h2 class="rtl">10) القوة القاهرة والظروف الطارئة</h2>
  <div class="box rtl">
    <div>{{forceMajeure}}</div>
    <div class="muted rtl">يلتزم الطرف المتأثر بإخطار الطرف الآخر خلال مدة معقولة وتقديم ما يثبت الواقعة وآثارها والإجراءات المتخذة للتخفيف.</div>
  </div>

  <h2 class="rtl">11) القانون الواجب التطبيق وفض النزاعات</h2>
  <div class="box rtl">
    <div><b>القانون الواجب التطبيق:</b> {{governingLaw}}</div>
    <div><b>فض النزاعات:</b> {{disputeResolution}}</div>
    <div class="muted rtl"><b>مقر التحكيم (إن وجد):</b> {{arbitrationSeat}}</div>
    <div class="muted rtl"><b>لغة العقد المعتمدة:</b> {{languagePrevails}}</div>
  </div>

  <h2 class="rtl">12) أحكام ختامية</h2>
  <div class="rtl">
    1. لا يُعد أي تنازل عن حق تنازلاً دائماً ما لم يكن مكتوباً. <br/>
    2. لا يجوز التنازل عن العقد إلا بموافقة كتابية من الطرف الآخر، باستثناء تحويل الحقوق المالية ضمن حدود القانون. <br/>
    3. هذا العقد يمثل كامل الاتفاق، وأي تعديل لا يكون نافذاً إلا كتابةً وموقعاً من الطرفين.
  </div>

  <div class="hr"></div>
  <h2 class="rtl">التوقيعات</h2>
  <div class="box rtl sig">
    <table>
      <tr>
        <th>عن البائع</th>
        <th>عن المشتري</th>
      </tr>
      <tr>
        <td>
          <div><b>الاسم/الصفة:</b> {{sellerSignName}}</div>
          <div><b>التاريخ:</b> {{sellerSignDate}}</div>
          <div class="muted">التوقيع: ____________</div>
        </td>
        <td>
          <div><b>الاسم/الصفة:</b> {{buyerSignName}}</div>
          <div><b>التاريخ:</b> {{buyerSignDate}}</div>
          <div class="muted">التوقيع: ____________</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="muted rtl">ملاحظة: Incoterms® علامة مسجلة لغرفة التجارة الدولية (ICC). هذا العقد وثيقة تعاقدية مستقلة وليست نصاً رسمياً لقواعد Incoterms.</div>
</body>
</html>
`.trim(),
};


export const DPU_EN: ContractTemplate = {
  id: 2410,
  slug: "incoterms-dpu-premium-en",
  title: "International Sale Contract (DPU) Premium — Delivered at Place Unloaded (Incoterms 2020)",
  lang: "en",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family: Arial, "Times New Roman", serif; padding:26px; line-height:1.75; color:#111}
    h1{font-size:20px; margin:0 0 10px}
    h2{font-size:15px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #e5e5e5; padding:12px 14px; border-radius:12px; margin:12px 0}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:10px}
    .k{color:#333; font-size:12px}
    .v{font-weight:600}
    table{width:100%; border-collapse:collapse; margin-top:8px}
    th,td{border:1px solid #e5e5e5; padding:10px; vertical-align:top}
    th{background:#fafafa; text-align:left}
    .sig{margin-top:14px}
    .hr{height:1px; background:#eee; margin:14px 0}
  </style>
</head>
<body>

  <h1>International Sale Contract — DPU — Incoterms® {{incotermsEdition}}</h1>
  <div class="muted">
    Ref: <b>{{contractRef}}</b> — Date: <b>{{contractDate}}</b> — City: <b>{{contractCity}}</b>
  </div>

  <div class="box">
    <div class="grid">
      <div>
        <div class="k">Seller</div>
        <div class="v">{{sellerName}}</div>
        <div>{{sellerAddress}}</div>
        <div class="muted">Registration/Licence: {{sellerReg}}</div>
      </div>
      <div>
        <div class="k">Buyer</div>
        <div class="v">{{buyerName}}</div>
        <div>{{buyerAddress}}</div>
        <div class="muted">Registration/Licence: {{buyerReg}}</div>
      </div>
    </div>
  </div>

  <h2>1. Definitions & Interpretation</h2>
  <div>
    “Incoterms®” means the ICC rules in force as referenced herein. Under <b>DPU (Delivered at Place Unloaded)</b>,
    the Seller delivers when the goods are <b>unloaded</b> from the arriving means of transport at the named place.
    In case of conflict, this Contract prevails over prior communications.
  </div>

  <h2>2. Goods & Specifications</h2>
  <div class="box">
    <div><b>Description:</b> {{goodsDescription}}</div>
    <div class="muted"><b>HS Code (optional):</b> {{hsCode}}</div>
    <div class="hr"></div>
    <div><b>Quantity:</b> {{quantity}} — <b>Unit:</b> {{unit}} — <b>Tolerance:</b> {{tolerance}}</div>
    <div class="muted"><b>Packing:</b> {{packaging}} — <b>Marking:</b> {{marking}}</div>
  </div>

  <h2>3. Price, Currency & Payment</h2>
  <div class="box">
    <table>
      <tr>
        <th>Unit Price</th>
        <td>{{unitPrice}}</td>
        <th>Total Price</th>
        <td>{{totalPrice}}</td>
      </tr>
      <tr>
        <th>Currency</th>
        <td>{{currency}}</td>
        <th>Payment Terms</th>
        <td>{{paymentTerms}}</td>
      </tr>
    </table>
    <div class="muted">Bank charges and payment mechanics apply as stated above unless agreed otherwise in writing.</div>
  </div>

  <h2>4. Delivery Term (DPU) — Named Place & Unloading</h2>
  <div class="box">
    <div><b>Incoterms Edition:</b> {{incotermsEdition}}</div>
    <div><b>Named place of delivery (unloaded):</b> {{placeOfDelivery}}</div>
    <div class="muted"><b>Delivery point details (if any):</b> {{deliveryPointDetails}}</div>
    <div class="hr"></div>
    <div><b>Shipment/Dispatch schedule:</b> {{deliverySchedule}}</div>
    <div class="muted">
      The Seller shall arrange carriage to the named place and effect delivery <b>after unloading</b>.
      Any site access constraints, operating hours, or handling limitations shall be communicated by the Buyer in advance.
    </div>
  </div>

  <h2>5. Risk Transfer & Allocation of Costs</h2>
  <div>
    (a) Risk transfers from Seller to Buyer upon DPU delivery, i.e., once the goods are unloaded at the named place. <br/>
    (b) Seller bears costs up to delivery after unloading at the named place, including main carriage and unloading-related handling, unless this Contract states otherwise. <br/>
    (c) Buyer bears costs after delivery, including subsequent storage and onward transport, except where caused by Seller’s breach.
  </div>

  <h2>6. Customs & Taxes</h2>
  <div class="box">
    <div><b>Export (Seller):</b> Seller shall complete export clearance and required licences.</div>
    <div><b>Import (Buyer):</b> Buyer shall complete import clearance and pay applicable duties/taxes.</div>
    <div class="muted"><b>Special arrangements (if any):</b> {{customsNotes}}</div>
  </div>

  <h2>7. Inspection, Acceptance & Conformity</h2>
  <div class="box">
    <div><b>Inspection & acceptance:</b> {{inspection}}</div>
    <div class="muted">
      Acceptance shall be deemed final unless the Buyer notifies visible defects in writing within the agreed inspection period,
      without prejudice to any express conformity warranties in this Contract.
    </div>
  </div>

  <h2>8. Documents</h2>
  <div class="box">
    <div><b>Documents list:</b> {{documentsList}}</div>
    <div class="muted">Seller shall provide the agreed documents in form/number and timing consistent with payment and clearance requirements.</div>
  </div>

  <h2>9. Insurance</h2>
  <div>
    Under DPU, there is no default obligation on Seller to insure unless agreed.
    <div class="box">
      <div><b>Coverage (if agreed):</b> {{insuranceCoverage}}</div>
      <div><b>Insurer (if agreed):</b> {{insuranceCompany}}</div>
      <div><b>Policy/Certificate No. (if agreed):</b> {{insurancePolicyNo}}</div>
    </div>
  </div>

  <h2>10. Force Majeure</h2>
  <div class="box">
    <div>{{forceMajeure}}</div>
    <div class="muted">The affected Party shall promptly notify the other Party and use reasonable efforts to mitigate impact.</div>
  </div>

  <h2>11. Governing Law & Dispute Resolution</h2>
  <div class="box">
    <div><b>Governing law:</b> {{governingLaw}}</div>
    <div><b>Dispute resolution:</b> {{disputeResolution}}</div>
    <div class="muted"><b>Arbitration seat (if any):</b> {{arbitrationSeat}}</div>
    <div class="muted"><b>Prevailing language:</b> {{languagePrevails}}</div>
  </div>

  <h2>12. Final Provisions</h2>
  <div>
    (a) No waiver is effective unless in writing. <br/>
    (b) No assignment except with written consent, save for lawful assignment of receivables. <br/>
    (c) This Contract constitutes the entire agreement; amendments must be in writing and signed by both Parties.
  </div>

  <div class="hr"></div>
  <h2>Signatures</h2>
  <div class="box sig">
    <table>
      <tr>
        <th>For the Seller</th>
        <th>For the Buyer</th>
      </tr>
      <tr>
        <td>
          <div><b>Name/Title:</b> {{sellerSignName}}</div>
          <div><b>Date:</b> {{sellerSignDate}}</div>
          <div class="muted">Signature: ____________</div>
        </td>
        <td>
          <div><b>Name/Title:</b> {{buyerSignName}}</div>
          <div><b>Date:</b> {{buyerSignDate}}</div>
          <div class="muted">Signature: ____________</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="muted">Note: Incoterms® is a registered trademark of the ICC. This document is a standalone contract, not the official ICC rules text.</div>
</body>
</html>
`.trim(),
};
