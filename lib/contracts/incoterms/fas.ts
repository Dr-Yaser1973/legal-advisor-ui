 // lib/contracts/incoterms/fas.ts
import type { ContractTemplate } from "@/lib/contracts/engine/types"; // أو مسارك الصحيح للتايب

export const FAS_AR: ContractTemplate = {
  id: 2110,
  slug: "incoterms-fas-premium-ar",
  title: "عقد بيع دولي – FAS (Free Alongside Ship) – نسخة عربية بريموم",
  lang: "ar",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family: Arial, "Noto Naskh Arabic", "Amiri", sans-serif; padding:26px; line-height:1.85; color:#111}
    h1{font-size:20px; margin:0 0 8px}
    h2{font-size:15px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #e3e3e3; border-radius:12px; padding:12px 14px; margin:10px 0}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:10px}
    .row{display:flex; justify-content:space-between; gap:10px}
    .k{color:#555; min-width:140px}
    table{width:100%; border-collapse:collapse; margin-top:8px}
    td,th{border:1px solid #e6e6e6; padding:8px; vertical-align:top}
    .sig{margin-top:18px}
    .hr{height:1px; background:#eee; margin:14px 0}
    .small{font-size:12px}
    .right{text-align:right}
  </style>
</head>
<body>

  <div class="row">
    <div>
      <h1>عقد بيع دولي وفق شرط FAS (Free Alongside Ship)</h1>
      <div class="muted">وفق قواعد Incoterms® {{incotermsEdition}} — (ميناء الشحن المسمّى)</div>
    </div>
    <div class="right small">
      <div><b>رقم المرجع:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>المدينة:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="grid">
      <div>
        <b>أولاً: البائع</b>
        <div class="hr"></div>
        <div><span class="k">الاسم:</span> {{sellerName}}</div>
        <div><span class="k">العنوان:</span> {{sellerAddress}}</div>
        <div><span class="k">السجل/الترخيص:</span> {{sellerReg}}</div>
      </div>
      <div>
        <b>ثانياً: المشتري</b>
        <div class="hr"></div>
        <div><span class="k">الاسم:</span> {{buyerName}}</div>
        <div><span class="k">العنوان:</span> {{buyerAddress}}</div>
        <div><span class="k">السجل/الترخيص:</span> {{buyerReg}}</div>
      </div>
    </div>
  </div>

  <h2>1) موضوع العقد والبضاعة</h2>
  <div class="box">
    <div><span class="k">وصف البضاعة:</span> {{goodsDescription}}</div>
    <div><span class="k">رمز HS (اختياري):</span> {{hsCode}}</div>
    <div class="grid" style="margin-top:8px">
      <div><span class="k">الكمية:</span> {{quantity}}</div>
      <div><span class="k">الوحدة:</span> {{unit}}</div>
    </div>
    <div><span class="k">التسامح:</span> {{tolerance}}</div>
    <div><span class="k">التعبئة والتغليف:</span> {{packaging}}</div>
    <div><span class="k">الوسم/العلامات:</span> {{marking}}</div>
  </div>

  <h2>2) السعر وشروط الدفع</h2>
  <div class="box">
    <div class="grid">
      <div><span class="k">سعر الوحدة:</span> {{unitPrice}}</div>
      <div><span class="k">السعر الإجمالي:</span> {{totalPrice}}</div>
    </div>
    <div><span class="k">العملة:</span> {{currency}}</div>
    <div><span class="k">شروط الدفع:</span> {{paymentTerms}}</div>
  </div>

  <h2>3) شرط التسليم FAS — المكان والمخاطر</h2>
  <div class="box">
    <div><b>يتفق الطرفان</b> على أن التسليم يتم وفق شرط <b>FAS</b> في <b>ميناء الشحن</b> التالي:</div>
    <table>
      <tr>
        <th style="width:35%">البند</th>
        <th>البيان</th>
      </tr>
      <tr>
        <td>إصدار Incoterms</td>
        <td>{{incotermsEdition}}</td>
      </tr>
      <tr>
        <td>ميناء الشحن المسمّى</td>
        <td>{{portOfShipment}}</td>
      </tr>
      <tr>
        <td>السفينة/الرحلة (إن وجدت)</td>
        <td>{{vesselName}}</td>
      </tr>
      <tr>
        <td>نقطة وضع البضاعة “بجانب السفينة”</td>
        <td>{{alongsidePoint}}</td>
      </tr>
      <tr>
        <td>النافذة/الجدول الزمني للتسليم</td>
        <td>{{deliverySchedule}}</td>
      </tr>
    </table>

    <div class="hr"></div>
    <div>
      <b>انتقال المخاطر:</b> تنتقل مخاطر الهلاك أو التلف من البائع إلى المشتري عند وضع البضاعة <b>بجانب السفينة</b> في ميناء الشحن المسمّى وفق FAS، ما لم يُتفق على غير ذلك صراحة.
    </div>
    <div class="small muted" style="margin-top:6px">
      ملاحظة تشغيلية: هذا الشرط مناسب للشحن البحري/النهري غير المعبأ بالحاويات عادةً، ويجب ضبط “نقطة التسليم” بدقة لتفادي النزاع.
    </div>
  </div>

  <h2>4) التخليص والتكاليف</h2>
  <div class="box">
    <div><span class="k">التخليص للتصدير (على البائع):</span> {{exportClearance}}</div>
    <div><span class="k">المناولة داخل الميناء حتى بجانب السفينة:</span> {{handlingAtQuay}}</div>
    <div class="hr"></div>
    <div>
      بعد تحقق التسليم وفق FAS، يتحمل المشتري — ما لم يُذكر خلافه — تكاليف الشحن البحري، والتحميل على السفينة، والتأمين (إن اختاره)، وأي رسوم لاحقة.
    </div>
  </div>

  <h2>5) المستندات والفحص</h2>
  <div class="box">
    <div><span class="k">قائمة المستندات:</span> {{documentsList}}</div>
    <div><span class="k">الفحص والاستلام:</span> {{inspection}}</div>
  </div>

  <h2>6) القوة القاهرة</h2>
  <div class="box">{{forceMajeure}}</div>

  <h2>7) القانون الواجب التطبيق وفض النزاعات</h2>
  <div class="box">
    <div><span class="k">القانون الواجب التطبيق:</span> {{governingLaw}}</div>
    <div><span class="k">آلية فض النزاع:</span> {{disputeResolution}}</div>
    <div><span class="k">مقر التحكيم (إن وجد):</span> {{arbitrationSeat}}</div>
    <div><span class="k">لغة العقد المعتمدة:</span> {{languagePrevails}}</div>
  </div>

  <div class="sig">
    <div class="grid">
      <div class="box">
        <b>توقيع البائع</b>
        <div class="hr"></div>
        <div><span class="k">الاسم/الصفة:</span> {{sellerSignName}}</div>
        <div><span class="k">التاريخ:</span> {{sellerSignDate}}</div>
        <div style="margin-top:18px" class="muted">التوقيع: ____________________</div>
      </div>
      <div class="box">
        <b>توقيع المشتري</b>
        <div class="hr"></div>
        <div><span class="k">الاسم/الصفة:</span> {{buyerSignName}}</div>
        <div><span class="k">التاريخ:</span> {{buyerSignDate}}</div>
        <div style="margin-top:18px" class="muted">التوقيع: ____________________</div>
      </div>
    </div>
  </div>

  <div class="muted small" style="margin-top:14px">
    تنبيه: Incoterms® علامة مسجلة لغرفة التجارة الدولية (ICC). هذا العقد قالب عام ويُستحسن مراجعته قانونيًا وفق وقائع الصفقة والقانون المختار.
  </div>

</body>
</html>
`,
};
// lib/contracts/incoterms/fas.en.ts


export const FAS_EN: ContractTemplate = {
  id: 2111,
  slug: "incoterms-fas-premium-en",
  title: "International Sale Contract – FAS (Free Alongside Ship) – Premium English",
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
    h1{font-size:20px; margin:0 0 8px}
    h2{font-size:15px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #e3e3e3; border-radius:12px; padding:12px 14px; margin:10px 0}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:10px}
    .row{display:flex; justify-content:space-between; gap:10px}
    .k{color:#555; min-width:160px; display:inline-block}
    table{width:100%; border-collapse:collapse; margin-top:8px}
    td,th{border:1px solid #e6e6e6; padding:8px; vertical-align:top}
    .hr{height:1px; background:#eee; margin:14px 0}
    .small{font-size:12px}
  </style>
</head>
<body>

  <div class="row">
    <div>
      <h1>International Sale Contract under FAS (Free Alongside Ship)</h1>
      <div class="muted">Incoterms® {{incotermsEdition}} — Named Port of Shipment</div>
    </div>
    <div class="small" style="text-align:right">
      <div><b>Ref No.:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>City:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="grid">
      <div>
        <b>Seller</b>
        <div class="hr"></div>
        <div><span class="k">Name:</span> {{sellerName}}</div>
        <div><span class="k">Address:</span> {{sellerAddress}}</div>
        <div><span class="k">Reg/License:</span> {{sellerReg}}</div>
      </div>
      <div>
        <b>Buyer</b>
        <div class="hr"></div>
        <div><span class="k">Name:</span> {{buyerName}}</div>
        <div><span class="k">Address:</span> {{buyerAddress}}</div>
        <div><span class="k">Reg/License:</span> {{buyerReg}}</div>
      </div>
    </div>
  </div>

  <h2>1) Goods</h2>
  <div class="box">
    <div><span class="k">Description:</span> {{goodsDescription}}</div>
    <div><span class="k">HS Code (optional):</span> {{hsCode}}</div>
    <div class="grid" style="margin-top:8px">
      <div><span class="k">Quantity:</span> {{quantity}}</div>
      <div><span class="k">Unit:</span> {{unit}}</div>
    </div>
    <div><span class="k">Tolerance:</span> {{tolerance}}</div>
    <div><span class="k">Packaging:</span> {{packaging}}</div>
    <div><span class="k">Marking:</span> {{marking}}</div>
  </div>

  <h2>2) Price & Payment</h2>
  <div class="box">
    <div class="grid">
      <div><span class="k">Unit Price:</span> {{unitPrice}}</div>
      <div><span class="k">Total Price:</span> {{totalPrice}}</div>
    </div>
    <div><span class="k">Currency:</span> {{currency}}</div>
    <div><span class="k">Payment Terms:</span> {{paymentTerms}}</div>
  </div>

  <h2>3) Delivery Term — FAS</h2>
  <div class="box">
    <div><b>The Parties agree</b> that delivery shall be under <b>FAS</b> at the following named port of shipment:</div>

    <table>
      <tr>
        <th style="width:35%">Item</th>
        <th>Details</th>
      </tr>
      <tr>
        <td>Incoterms Edition</td>
        <td>{{incotermsEdition}}</td>
      </tr>
      <tr>
        <td>Named Port of Shipment</td>
        <td>{{portOfShipment}}</td>
      </tr>
      <tr>
        <td>Vessel/Voyage (if any)</td>
        <td>{{vesselName}}</td>
      </tr>
      <tr>
        <td>Alongside Point</td>
        <td>{{alongsidePoint}}</td>
      </tr>
      <tr>
        <td>Delivery Window / Schedule</td>
        <td>{{deliverySchedule}}</td>
      </tr>
    </table>

    <div class="hr"></div>
    <div>
      <b>Risk Transfer:</b> Risk of loss or damage shall pass from Seller to Buyer when the Goods are placed <b>alongside the vessel</b> at the named port of shipment under FAS, unless expressly agreed otherwise.
    </div>
    <div class="small muted" style="margin-top:6px">
      Operational note: FAS is typically suitable for sea/inland-waterway shipments; the “alongside point” should be specified precisely to avoid disputes.
    </div>
  </div>

  <h2>4) Export Clearance & Costs</h2>
  <div class="box">
    <div><span class="k">Export clearance (Seller):</span> {{exportClearance}}</div>
    <div><span class="k">Port handling up to alongside:</span> {{handlingAtQuay}}</div>
    <div class="hr"></div>
    <div>
      After valid FAS delivery, Buyer shall (unless stated otherwise) bear ocean freight, loading on board, insurance (if any), and subsequent charges.
    </div>
  </div>

  <h2>5) Documents & Inspection</h2>
  <div class="box">
    <div><span class="k">Documents:</span> {{documentsList}}</div>
    <div><span class="k">Inspection/Acceptance:</span> {{inspection}}</div>
  </div>

  <h2>6) Force Majeure</h2>
  <div class="box">{{forceMajeure}}</div>

  <h2>7) Governing Law & Dispute Resolution</h2>
  <div class="box">
    <div><span class="k">Governing Law:</span> {{governingLaw}}</div>
    <div><span class="k">Dispute Resolution:</span> {{disputeResolution}}</div>
    <div><span class="k">Arbitration Seat (if any):</span> {{arbitrationSeat}}</div>
    <div><span class="k">Prevailing Language:</span> {{languagePrevails}}</div>
  </div>

  <div class="grid" style="margin-top:18px">
    <div class="box">
      <b>Seller Signature</b>
      <div class="hr"></div>
      <div><span class="k">Name/Title:</span> {{sellerSignName}}</div>
      <div><span class="k">Date:</span> {{sellerSignDate}}</div>
      <div style="margin-top:18px" class="muted">Signature: ____________________</div>
    </div>
    <div class="box">
      <b>Buyer Signature</b>
      <div class="hr"></div>
      <div><span class="k">Name/Title:</span> {{buyerSignName}}</div>
      <div><span class="k">Date:</span> {{buyerSignDate}}</div>
      <div style="margin-top:18px" class="muted">Signature: ____________________</div>
    </div>
  </div>

  <div class="muted small" style="margin-top:14px">
    Notice: Incoterms® is a registered trademark of the ICC. This is a general template and should be reviewed for the specific transaction and chosen law.
  </div>

</body>
</html>
`,
};
