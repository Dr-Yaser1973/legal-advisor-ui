 // lib/contracts/incoterms.ts
import type { ContractTemplate } from "@/lib/contracts/engine/types";

export const DAP_AR: ContractTemplate = {
  id: 2409,
  slug: "incoterms-dap-ar",
  title: "عقد بيع دولي وفق Incoterms (DAP) - نسخة عربية",
  lang: "ar",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root{--b:#111;--g:#666;--line:#e5e7eb;--bg:#fafafa;}
    body{font-family: Arial,"Noto Naskh Arabic","Amiri",sans-serif; padding:28px; line-height:1.85; color:var(--b);}
    h1{font-size:20px; margin:0 0 10px;}
    h2{font-size:14px; margin:18px 0 8px;}
    .meta{font-size:12px; color:var(--g); margin-bottom:14px}
    .box{border:1px solid var(--line); border-radius:12px; padding:12px 14px; background:var(--bg); margin:10px 0;}
    .row{display:flex; gap:10px; flex-wrap:wrap}
    .cell{flex:1 1 240px}
    .k{color:var(--g); font-size:12px}
    .v{font-weight:700}
    table{width:100%; border-collapse:collapse; margin-top:8px}
    th,td{border:1px solid var(--line); padding:8px; vertical-align:top; font-size:13px}
    th{background:#f3f4f6; text-align:right}
    .small{font-size:12px; color:var(--g)}
    .sign{margin-top:18px}
    .signgrid{display:flex; gap:12px; flex-wrap:wrap}
    .signbox{flex:1 1 320px; border:1px solid var(--line); border-radius:12px; padding:12px}
    .hr{height:1px;background:var(--line);margin:10px 0}
  </style>
</head>
<body>

  <h1>عقد بيع دولي (DAP) وفق قواعد Incoterms® {{incotermsEdition}}</h1>
  <div class="meta">
    رقم المرجع: <b>{{contractRef}}</b> &nbsp;|&nbsp;
    تاريخ العقد: <b>{{contractDate}}</b> &nbsp;|&nbsp;
    مدينة الإبرام: <b>{{contractCity}}</b>
  </div>

  <div class="box">
    <div class="row">
      <div class="cell">
        <div class="k">البائع</div>
        <div class="v">{{sellerName}}</div>
        <div class="small">العنوان: {{sellerAddress}}</div>
        <div class="small">السجل/الترخيص: {{sellerReg}}</div>
      </div>
      <div class="cell">
        <div class="k">المشتري</div>
        <div class="v">{{buyerName}}</div>
        <div class="small">العنوان: {{buyerAddress}}</div>
        <div class="small">السجل/الترخيص: {{buyerReg}}</div>
      </div>
    </div>
  </div>

  <h2>1) التعاريف والتفسير</h2>
  <div class="box">
    <div>
      أ) يقصد بمصطلح <b>DAP (Delivered At Place)</b> تسليم البضاعة عندما يضع البائع البضاعة تحت تصرف المشتري على وسيلة النقل الواصلة،
      <b>جاهزة للتفريغ</b> في <b>مكان التسليم المحدد</b>، ويتحمل البائع مخاطر نقل البضاعة إلى ذلك المكان.
    </div>
    <div class="small" style="margin-top:6px">
      ب) تُطبق قواعد Incoterms® الصادرة عن غرفة التجارة الدولية بالإصدار المذكور أعلاه، ما لم يتعارض ذلك مع نصوص هذا العقد.
    </div>
  </div>

  <h2>2) موضوع العقد ووصف البضاعة</h2>
  <table>
    <tr>
      <th style="width:28%">وصف البضاعة</th>
      <td>{{goodsDescription}}</td>
    </tr>
    <tr>
      <th>رمز HS (اختياري)</th>
      <td>{{hsCode}}</td>
    </tr>
    <tr>
      <th>الكمية</th>
      <td>{{quantity}} {{unit}} (نسبة التسامح: {{tolerance}})</td>
    </tr>
    <tr>
      <th>التعبئة والتغليف</th>
      <td>{{packaging}}</td>
    </tr>
    <tr>
      <th>الوسم/العلامات</th>
      <td>{{marking}}</td>
    </tr>
  </table>

  <h2>3) السعر وشروط الدفع</h2>
  <div class="box">
    <div class="row">
      <div class="cell"><span class="k">سعر الوحدة:</span> <span class="v">{{unitPrice}}</span></div>
      <div class="cell"><span class="k">السعر الإجمالي:</span> <span class="v">{{totalPrice}}</span></div>
      <div class="cell"><span class="k">العملة:</span> <span class="v">{{currency}}</span></div>
    </div>
    <div class="hr"></div>
    <div><b>شروط الدفع:</b> {{paymentTerms}}</div>
  </div>

  <h2>4) شروط التسليم (DAP) — مكان التسليم والالتزامات</h2>
  <div class="box">
    <div><b>مكان التسليم المحدد (Place of Delivery):</b> {{placeOfDelivery}}</div>
    <div class="small" style="margin-top:6px">
      يتفق الطرفان على أن مكان التسليم أعلاه هو النقطة الحاكمة لتحديد انتقال المخاطر وفق DAP.
    </div>
    <div class="hr"></div>
    <div><b>جدول/موعد الشحن أو الوصول:</b> {{deliverySchedule}}</div>
  </div>

  <h2>5) انتقال المخاطر وتخصيص التكاليف</h2>
  <table>
    <tr>
      <th style="width:30%">انتقال المخاطر</th>
      <td>
        تنتقل مخاطر هلاك/تلف البضاعة من البائع إلى المشتري عند وضع البضاعة تحت تصرف المشتري على وسيلة النقل الواصلة
        <b>جاهزة للتفريغ</b> في <b>مكان التسليم المحدد</b> (DAP).
      </td>
    </tr>
    <tr>
      <th>التفريغ</th>
      <td>
        ما لم يُتفق كتابةً على خلاف ذلك، فإن <b>التفريغ</b> يقع على عاتق <b>المشتري</b> في مكان التسليم.
      </td>
    </tr>
    <tr>
      <th>التخليص الجمركي</th>
      <td>
        يتحمل البائع إجراءات وتكاليف <b>التصدير</b> (إن وجدت)، بينما يتحمل المشتري إجراءات وتكاليف <b>الاستيراد</b> والرسوم والضرائب
        والتصاريح اللازمة داخل بلد المقصد، ما لم يتفق الطرفان على خلاف ذلك صراحةً.
      </td>
    </tr>
  </table>

  <h2>6) النقل والتأمين</h2>
  <div class="box">
    <div>
      أ) يلتزم البائع بترتيب النقل إلى مكان التسليم المحدد، وبالمستوى المعقول من العناية في اختيار الناقل ومسار النقل.
    </div>
    <div style="margin-top:8px">
      ب) <b>التأمين:</b> لا يفرض DAP إلزامًا تلقائيًا بالتأمين. اتفق الطرفان على ما يلي:
      <div class="small" style="margin-top:6px">
        نطاق التغطية (إن وجد): {{insuranceCoverage}} &nbsp;|&nbsp;
        شركة التأمين: {{insuranceCompany}} &nbsp;|&nbsp;
        رقم الوثيقة: {{insurancePolicyNo}}
      </div>
    </div>
  </div>

  <h2>7) المستندات والتسليمات</h2>
  <div class="box">
    <div><b>قائمة المستندات المتفق عليها:</b> {{documentsList}}</div>
    <div class="small" style="margin-top:6px">
      يلتزم البائع بتزويد المشتري بالمستندات التجارية/النقلية اللازمة لإثبات الشحن/النقل وفقًا لمتطلبات هذا العقد والعرف التجاري.
    </div>
  </div>

  <h2>8) الفحص والاستلام والمطالبات</h2>
  <div class="box">
    <div><b>الفحص والاستلام:</b> {{inspection}}</div>
    <div class="small" style="margin-top:6px">
      على المشتري إخطار البائع بأي عيب ظاهر أو نقص خلال مدة معقولة من تاريخ التسليم، مع تقديم الأدلة الداعمة بحسب طبيعة البضاعة.
    </div>
  </div>

  <h2>9) القوة القاهرة</h2>
  <div class="box">
    {{forceMajeure}}
  </div>

  <h2>10) القانون الواجب التطبيق وفض النزاعات</h2>
  <div class="box">
    <div><b>القانون الواجب التطبيق:</b> {{governingLaw}}</div>
    <div style="margin-top:8px"><b>فض النزاعات:</b> {{disputeResolution}}</div>
    <div class="small" style="margin-top:6px">مقر التحكيم (إن وجد): {{arbitrationSeat}}</div>
    <div class="small" style="margin-top:6px">اللغة المعتمدة/الراجحة: {{languagePrevails}}</div>
  </div>

  <h2>11) أحكام ختامية</h2>
  <div class="box">
    <div>
      أ) لا يعد أي تعديل أو تنازل نافذًا إلا إذا كان مكتوبًا وموقعًا من الطرفين.
      <br/>
      ب) في حال تعارض أي بند مع قواعد Incoterms®، يُعمل بما لا يخالف جوهر DAP وبما يحقق نية الطرفين.
    </div>
  </div>

  <div class="sign">
    <div class="signgrid">
      <div class="signbox">
        <div class="v">توقيع البائع</div>
        <div class="small">الاسم/الصفة: {{sellerSignName}}</div>
        <div class="small">التاريخ: {{sellerSignDate}}</div>
      </div>
      <div class="signbox">
        <div class="v">توقيع المشتري</div>
        <div class="small">الاسم/الصفة: {{buyerSignName}}</div>
        <div class="small">التاريخ: {{buyerSignDate}}</div>
      </div>
    </div>
  </div>

</body>
</html>
  `.trim(),
};


export const DAP_EN: ContractTemplate = {
  id: 2409,
  slug: "incoterms-dap-premium-en",
  title: "International Sale Contract under Incoterms (DAP) – Premium English",
  lang: "en",
  group: "INCOTERMS",
  html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family: Arial, "Times New Roman", serif; padding:28px; line-height:1.75; color:#111;}
    h1{font-size:20px; margin:0 0 10px; text-align:center;}
    h2{font-size:15px; margin:18px 0 8px;}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #ddd; padding:12px 14px; border-radius:10px; margin:10px 0}
    table{width:100%; border-collapse:collapse; margin-top:8px}
    td,th{border:1px solid #e5e5e5; padding:8px; vertical-align:top}
    .sig{display:flex; gap:14px; margin-top:14px}
    .sig > div{flex:1}
  </style>
</head>
<body>

<h1>International Sale Contract (DAP) under Incoterms® {{incotermsEdition}}</h1>
<div class="muted" style="text-align:center">
  Ref: {{contractRef}} — Date: {{contractDate}} — Place: {{contractCity}}
</div>

<h2>1. Parties</h2>
<div class="box">
  <b>Seller:</b> {{sellerName}}<br/>
  <b>Address:</b> {{sellerAddress}}<br/>
  <b>Registration/License:</b> {{sellerReg}}
  <hr/>
  <b>Buyer:</b> {{buyerName}}<br/>
  <b>Address:</b> {{buyerAddress}}<br/>
  <b>Registration/License:</b> {{buyerReg}}
</div>

<h2>2. Goods</h2>
<div class="box">
  <b>Description:</b> {{goodsDescription}}<br/>
  <b>HS Code (optional):</b> {{hsCode}}<br/>
  <b>Quantity:</b> {{quantity}} {{unit}} (Tolerance: {{tolerance}})
</div>

<h2>3. Price & Payment</h2>
<div class="box">
  <table>
    <tr><th>Unit Price</th><td>{{unitPrice}} {{currency}}</td></tr>
    <tr><th>Total Price</th><td>{{totalPrice}} {{currency}}</td></tr>
    <tr><th>Payment Terms</th><td>{{paymentTerms}}</td></tr>
  </table>
</div>

<h2>4. Delivery Term: DAP — Incoterms® {{incotermsEdition}}</h2>
<div class="box">
  <p>
    The Parties agree that delivery shall be made under <b>DAP (Delivered At Place)</b> as per Incoterms® {{incotermsEdition}},
    at the <b>named place of delivery</b>: {{placeOfDelivery}}, according to the following schedule: {{deliverySchedule}}.
  </p>
  <p>
    The Seller shall bear costs and risks of bringing the goods to the named place and placing them at the Buyer's disposal,
    <b>not unloaded</b>, unless otherwise agreed in writing.
  </p>
</div>

<h2>5. Customs & Duties</h2>
<div class="box">
  <ul>
    <li><b>Export Clearance:</b> {{exportClearance}}</li>
    <li><b>Import Clearance & Duties/Taxes:</b> {{importClearance}}</li>
  </ul>
  <div class="muted">
    (Under DAP: export clearance by Seller; import clearance and duties by Buyer unless otherwise agreed.)
  </div>
</div>

<h2>6. Transport & Documents</h2>
<div class="box">
  <b>Mode of Transport:</b> {{transportMode}}<br/>
  <b>Documents:</b> {{documentsList}}
</div>

<h2>7. Inspection & Acceptance</h2>
<div class="box">
  {{inspection}}
</div>

<h2>8. Packaging & Marking</h2>
<div class="box">
  <b>Packaging:</b> {{packaging}}<br/>
  <b>Marking:</b> {{marking}}
</div>

<h2>9. Force Majeure</h2>
<div class="box">
  {{forceMajeure}}
</div>

<h2>10. Governing Law & Dispute Resolution</h2>
<div class="box">
  <b>Governing Law:</b> {{governingLaw}}<br/>
  <b>Dispute Resolution:</b> {{disputeResolution}}<br/>
  <b>Seat of Arbitration (if any):</b> {{arbitrationSeat}}<br/>
  <b>Prevailing Language:</b> {{languagePrevails}}
</div>

<h2>11. Signatures</h2>
<div class="sig">
  <div class="box">
    <b>For the Seller</b><br/>
    Name/Title: {{sellerSignName}}<br/>
    Date: {{sellerSignDate}}
  </div>
  <div class="box">
    <b>For the Buyer</b><br/>
    Name/Title: {{buyerSignName}}<br/>
    Date: {{buyerSignDate}}
  </div>
</div>

<div class="muted" style="margin-top:10px">
  If bilingual versions exist, the prevailing language shall be as stated above.
</div>

</body>
</html>`,
};
