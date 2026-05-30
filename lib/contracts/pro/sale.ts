 import type { ContractTemplate } from "../engine/types";

export const SALE_AR: ContractTemplate = {
  id: 1101,
  slug: "pro-sale-movable-ar",
  title: "عقد بيع منقول احترافي (Pro) – عربي",
  lang: "ar",
  group: "PRO",
  fields: [
    // ── معلومات العقد ──
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد" },

    // ── البائع ──
    { key: "sellerName", label: "اسم البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerId", label: "هوية/سجل البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerAddress", label: "عنوان البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerPhone", label: "هاتف البائع", required: false, type: "text", group: "البائع" },

    // ── المشتري ──
    { key: "buyerName", label: "اسم المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerId", label: "هوية/سجل المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerAddress", label: "عنوان المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerPhone", label: "هاتف المشتري", required: false, type: "text", group: "المشتري" },

    // ── المبيع ──
    { key: "movableDescription", label: "وصف المنقول وصفاً دقيقاً", required: true, type: "textarea", group: "المبيع" },
    { key: "movableIdentifiers", label: "أرقام/سمات تعريفية (هيكل/سيريال/لوحة)", required: false, type: "text", group: "المبيع" },
    { key: "condition", label: "حالة المنقول عند البيع", required: true, type: "text", group: "المبيع" },

    // ── الثمن والسداد ──
    { key: "priceAmount", label: "الثمن رقماً", required: true, type: "number", group: "الثمن والسداد" },
    { key: "priceCurrency", label: "العملة", required: true, type: "select", group: "الثمن والسداد",
      options: ["دينار عراقي", "دولار أمريكي", "يورو"] },
    { key: "priceText", label: "الثمن كتابةً", required: false, type: "text", group: "الثمن والسداد" },
    { key: "paymentMethod", label: "طريقة السداد", required: true, type: "select", group: "الثمن والسداد",
      options: ["نقداً", "تحويل بنكي", "صك", "أقساط"] },
    { key: "paymentSchedule", label: "جدول/تفاصيل السداد (إن وجد)", required: false, type: "textarea", group: "الثمن والسداد" },

    // ── التسليم ──
    { key: "deliveryPlace", label: "مكان التسليم", required: true, type: "text", group: "التسليم" },
    { key: "deliveryDate", label: "تاريخ/موعد التسليم", required: true, type: "date", group: "التسليم" },

    // ── أحكام ──
    { key: "warranty", label: "الضمان/الإبراء (إن وجد)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام",
      placeholder: "القانون المدني العراقي رقم 40 لسنة 1951" },
    { key: "disputeCity", label: "الاختصاص المكاني (مدينة المحكمة)", required: true, type: "text", group: "أحكام",
      placeholder: "بغداد" },

    // ── التواقيع ──
    { key: "sellerSignName", label: "اسم موقع البائع", required: true, type: "text", group: "التواقيع" },
    { key: "buyerSignName", label: "اسم موقع المشتري", required: true, type: "text", group: "التواقيع" },
    { key: "witness1", label: "الشاهد الأول (اختياري)", required: false, type: "text", group: "التواقيع" },
    { key: "witness2", label: "الشاهد الثاني (اختياري)", required: false, type: "text", group: "التواقيع" },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد بيع منقول</div>
    <div class="subtitle">نموذج احترافي (PRO)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> <span class="v">{{contractRef}}</span></div>
      <div><span class="k">التاريخ:</span> <span class="v">{{contractDate}}</span></div>
      <div><span class="k">مدينة الإبرام:</span> <span class="v">{{contractCity}}</span></div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: أطراف العقد</div>

    <table class="tbl">
      <tr>
        <td class="th">البائع</td>
        <td>
          <div><b>الاسم:</b> {{sellerName}}</div>
          <div><b>الهوية/السجل:</b> {{sellerId}}</div>
          <div><b>العنوان:</b> {{sellerAddress}}</div>
          <div><b>الهاتف:</b> {{sellerPhone}}</div>
        </td>
      </tr>
      <tr>
        <td class="th">المشتري</td>
        <td>
          <div><b>الاسم:</b> {{buyerName}}</div>
          <div><b>الهوية/السجل:</b> {{buyerId}}</div>
          <div><b>العنوان:</b> {{buyerAddress}}</div>
          <div><b>الهاتف:</b> {{buyerPhone}}</div>
        </td>
      </tr>
    </table>

    <div class="note">
      ويُشار إلى البائع والمشتري معًا بـ <b>“الطرفين”</b>، وإلى كلٍ منهما بـ <b>“طرف”</b>.
    </div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل العقد (المنقول المبيع)</div>
    <div class="p"><b>وصف المنقول:</b> {{movableDescription}}</div>
    <div class="p"><b>سمات/أرقام تعريفية:</b> {{movableIdentifiers}}</div>
    <div class="p"><b>حالة المنقول:</b> {{condition}}</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الثمن وطريقة السداد</div>
    <div class="p">
      اتفق الطرفان على أن ثمن المنقول هو: <b>{{priceAmount}} {{priceCurrency}}</b>
      <span class="muted">({{priceText}})</span>
    </div>
    <div class="p"><b>طريقة السداد:</b> {{paymentMethod}}</div>
    <div class="p"><b>تفاصيل/جدول السداد:</b> {{paymentSchedule}}</div>

    <div class="clause">
      يقرّ المشتري بسداد الثمن وفق ما تقدم، ويقرّ البائع باستلامه وفقًا لأحكام هذا العقد وما يثبت بالسندات/الإيصالات عند الاقتضاء.
    </div>
  </div>

  <div class="box">
    <div class="h">رابعاً: التسليم ونقل الحيازة</div>
    <div class="p"><b>مكان التسليم:</b> {{deliveryPlace}}</div>
    <div class="p"><b>موعد التسليم:</b> {{deliveryDate}}</div>

    <ol class="ol">
      <li>يلتزم البائع بتسليم المنقول للمشتري بالحالة المتفق عليها وتمكينه من حيازته الفعلية في الموعد المحدد.</li>
      <li>تنتقل تبعة الهلاك والعيوب اللاحقة للتسليم إلى المشتري من تاريخ التسليم الفعلي، ما لم يتفق الطرفان على خلاف ذلك.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: الإقرارات والتعهدات</div>
    <ol class="ol">
      <li>يقرّ البائع بملكيته للمنقول وخلوه – قدر علمه – من أي حقوق للغير أو حجوزات أو نزاعات، ما لم يُذكر خلاف ذلك ضمن الشروط الخاصة.</li>
      <li>يقرّ المشتري بأنه عاين المنقول المعاينة النافية للجهالة وقَبِلَ شراءه وفق الوصف والحالة المبينة في هذا العقد.</li>
      <li><b>الضمان/الإبراء:</b> {{warranty}}</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة</div>
    <div class="p">{{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">سابعاً: القانون الواجب التطبيق وتسوية النزاعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويفسر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تكون محاكم <b>{{disputeCity}}</b> مختصة مكانياً بنظر أي نزاع ينشأ عن هذا العقد ما لم يتفق الطرفان على خلاف ذلك كتابةً.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">ثامناً: أحكام ختامية</div>
    <ol class="ol">
      <li>يعدّ هذا العقد كامل الاتفاق بين الطرفين ويلغي ما سبقه من تفاهمات بشأن موضوعه.</li>
      <li>أي تعديل أو إضافة لا تكون نافذة إلا إذا كانت مكتوبة وموقعة من الطرفين.</li>
      <li>حُرر هذا العقد من نسختين أصليتين بيد كل طرف نسخة للعمل بموجبها.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig">
      <div class="sig-h">توقيع البائع</div>
      <div class="sig-line"></div>
      <div class="sig-name">{{sellerSignName}}</div>
    </div>
    <div class="sig">
      <div class="sig-h">توقيع المشتري</div>
      <div class="sig-line"></div>
      <div class="sig-name">{{buyerSignName}}</div>
    </div>
  </div>

  <div class="witnesses">
    <div class="w">
      <div class="w-h">الشاهد الأول</div>
      <div class="w-line"></div>
      <div class="w-name">{{witness1}}</div>
    </div>
    <div class="w">
      <div class="w-h">الشاهد الثاني</div>
      <div class="w-line"></div>
      <div class="w-name">{{witness2}}</div>
    </div>
  </div>

  <style>
    .rtl{direction:rtl;text-align:right}
    .doc{
  font-family: "Noto Naskh Arabic","Amiri",Arial,sans-serif;
  font-size:16px;              /* بدل 13px */
  line-height:1.9;
  color:#111;
  background:#fff;             /* هذا هو المفتاح */
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

    .header{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:12px}
    .title{font-size:20px;font-weight:800;margin-bottom:2px}
    .subtitle{font-size:12px;color:#444;margin-bottom:10px}
    .meta{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#222}
    .k{color:#444}
    .box{border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin:10px 0}
    .h{font-size:15px;font-weight:800;margin-bottom:10px}
    .p{margin:6px 0}
    .note{margin-top:10px;font-size:12px;color:#333}
    .muted{color:#666;font-size:12px}
    .tbl{width:100%;border-collapse:collapse}
    .tbl td{border:1px solid #e5e7eb;padding:10px;vertical-align:top}
    .th{width:120px;background:#f7f7f7;font-weight:800}
    .ol{margin:0;padding-right:18px}
    .ol li{margin:6px 0}
    .clause{margin-top:8px;padding:10px;border-radius:12px;background:#fafafa;border:1px dashed #e5e7eb}
    .signs{display:flex;gap:12px;margin-top:14px}
    .sig{flex:1;border:1px solid #e5e7eb;border-radius:14px;padding:12px}
    .sig-h{font-weight:800;margin-bottom:10px}
    .sig-line{height:26px;border-bottom:1px solid #111}
    .sig-name{margin-top:8px;font-size:12px;color:#333}
    .witnesses{display:flex;gap:12px;margin-top:10px}
    .w{flex:1;border:1px solid #e5e7eb;border-radius:14px;padding:12px}
    .w-h{font-weight:800;margin-bottom:10px}
    .w-line{height:22px;border-bottom:1px solid #111}
    .w-name{margin-top:8px;font-size:12px;color:#333}
    @media print {
  .box {
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 10px 0 !important;
  }
}

  </style>
</div>
  `.trim(),
};


export const SALE_EN: ContractTemplate = {
  id: 1102,
  slug: "pro-sale-movable-en",
  title: "Movable Property Sale Agreement (PRO) — English",
  lang: "en",
  group: "PRO",
  fields: [
    // ── Contract Info ──
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place/City of Execution", required: true, type: "text", group: "Contract Info" },

    // ── Seller ──
    { key: "sellerName", label: "Seller Name", required: true, type: "text", group: "Seller" },
    { key: "sellerId", label: "Seller ID/Registration", required: true, type: "text", group: "Seller" },
    { key: "sellerAddress", label: "Seller Address", required: true, type: "text", group: "Seller" },
    { key: "sellerPhone", label: "Seller Contact", required: false, type: "text", group: "Seller" },

    // ── Buyer ──
    { key: "buyerName", label: "Buyer Name", required: true, type: "text", group: "Buyer" },
    { key: "buyerId", label: "Buyer ID/Registration", required: true, type: "text", group: "Buyer" },
    { key: "buyerAddress", label: "Buyer Address", required: true, type: "text", group: "Buyer" },
    { key: "buyerPhone", label: "Buyer Contact", required: false, type: "text", group: "Buyer" },

    // ── Item ──
    { key: "itemType", label: "Item Type", required: true, type: "text", group: "Item" },
    { key: "itemDescription", label: "Detailed Description", required: true, type: "textarea", group: "Item" },
    { key: "itemSerial", label: "Serial/VIN/Plate (if any)", required: false, type: "text", group: "Item" },
    { key: "itemCondition", label: "Condition + Known Defects", required: true, type: "text", group: "Item" },
    { key: "itemAccessories", label: "Accessories/Documents Delivered", required: false, type: "text", group: "Item" },

    // ── Price & Payment ──
    { key: "priceAmount", label: "Price (Number)", required: true, type: "number", group: "Price & Payment" },
    { key: "priceCurrency", label: "Currency", required: true, type: "select", group: "Price & Payment",
      options: ["IQD", "USD", "EUR"] },
    { key: "paymentMethod", label: "Payment Method", required: true, type: "select", group: "Price & Payment",
      options: ["Cash", "Bank Transfer", "Cheque", "Installments"] },
    { key: "paymentSchedule", label: "Payment Schedule (if any)", required: false, type: "textarea", group: "Price & Payment" },

    // ── Delivery ──
    { key: "deliveryPlace", label: "Delivery Place", required: true, type: "text", group: "Delivery" },
    { key: "deliveryDate", label: "Delivery Date", required: true, type: "date", group: "Delivery" },
    { key: "deliveryProtocol", label: "Delivery/Inspection Report (optional)", required: false, type: "text", group: "Delivery" },

    // ── Provisions ──
    { key: "warrantyTerms", label: "Warranty Terms (if any)", required: false, type: "textarea", group: "Provisions" },
    { key: "inspectionPeriod", label: "Inspection/Objection Period (days)", required: false, type: "number", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions",
      placeholder: "Iraqi Civil Code No. 40 of 1951" },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions",
      placeholder: "Baghdad" },
    { key: "notes", label: "Additional Notes", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  <style>
     .doc{
  font-family: Arial, sans-serif;
  line-height:1.8;
  font-size:16px;
  color:#111;
  background:#fff;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
}

    .hdr{display:flex; justify-content:space-between; align-items:flex-start; gap:12px; border-bottom:1px solid #ddd; padding-bottom:10px; margin-bottom:14px}
    .title{font-size:18px; font-weight:700}
    .meta{font-size:12px; color:#444}
    .box{border:1px solid #e5e5e5; border-radius:12px; padding:12px; margin:10px 0}
    .sec{margin:14px 0}
    .sec h3{margin:0 0 6px; font-size:14px}
    .row{display:flex; gap:12px; flex-wrap:wrap}
    .row > div{flex:1; min-width:220px}
    table{width:100%; border-collapse:collapse; margin-top:6px}
    td,th{border:1px solid #eee; padding:8px; vertical-align:top}
    .muted{color:#555; font-size:12px}
    .sig{display:flex; gap:18px; margin-top:18px}
    .sig .sbox{flex:1; border:1px dashed #bbb; border-radius:12px; padding:12px; min-height:110px}
    @media print {
  .box {
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 10px 0 !important;
  }
}

  </style>

  <div class="hdr">
    <div>
      <div class="title">Movable Property Sale Agreement (PRO)</div>
      <div class="muted">This agreement sets core obligations: price, delivery, title transfer, warranties, and dispute resolution.</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="sec">
      <h3>1. Parties</h3>
      <div class="row">
        <div>
          <b>Seller:</b> {{sellerName}}<br/>
          <b>ID/Reg:</b> {{sellerId}}<br/>
          <b>Address:</b> {{sellerAddress}}<br/>
          <b>Contact:</b> {{sellerPhone}}
        </div>
        <div>
          <b>Buyer:</b> {{buyerName}}<br/>
          <b>ID/Reg:</b> {{buyerId}}<br/>
          <b>Address:</b> {{buyerAddress}}<br/>
          <b>Contact:</b> {{buyerPhone}}
        </div>
      </div>
      <div class="muted">The Seller and Buyer are collectively referred to as the “Parties”.</div>
    </div>
  </div>

  <div class="sec">
     <h3>2. Subject Matter (Movable Item)</h3>
    <table>
      <tr>
        <th style="width:30%">Item</th>
        <th>Details</th>
      </tr>
      <tr>
        <td><b>Type</b></td>
        <td>{{itemType}}</td>
      </tr>
      <tr>
        <td><b>Description</b></td>
        <td>{{itemDescription}}</td>
      </tr>
      <tr>
        <td><b>Serial/VIN/Plate</b></td>
        <td>{{itemSerial}}</td>
      </tr>
      <tr>
        <td><b>Condition / Defects</b></td>
        <td>{{itemCondition}}</td>
      </tr>
      <tr>
        <td><b>Accessories / Documents</b></td>
        <td>{{itemAccessories}}</td>
      </tr>
    </table>
    <div class="muted">Seller represents lawful ownership and that the item is free of third-party claims unless expressly disclosed in writing.</div>
  </div>

  <div class="sec">
    <h3>3. Price & Payment</h3>
    <div class="box">
      <div><b>Price:</b> {{priceAmount}} ({{priceCurrency}})</div>
      <div><b>Payment Method:</b> {{paymentMethod}}</div>
      <div><b>Schedule/Installments:</b> {{paymentSchedule}}</div>
      <div class="muted">Title transfer is governed by this agreement and applicable law without prejudice to remedies upon breach.</div>
    </div>
  </div>

  <div class="sec">
    <h3>4. Delivery, Inspection & Risk</h3>
    <div class="box">
      <div><b>Delivery Place:</b> {{deliveryPlace}}</div>
      <div><b>Delivery Date:</b> {{deliveryDate}}</div>
      <div><b>Delivery/Inspection Report:</b> {{deliveryProtocol}}</div>
      <div class="muted">
        (a) Delivery shall be evidenced by a delivery/acceptance report where applicable.<br/>
        (b) Risk of loss/damage passes to Buyer upon actual delivery/acceptance.<br/>
        (c) Buyer may inspect and object within {{inspectionPeriod}} day(s) from delivery; otherwise delivery is deemed accepted, except for hidden defects proven under law.
      </div>
    </div>
  </div>

  <div class="sec">
    <h3>5. Warranty & Hidden Defects</h3>
    <div class="box">
      <div><b>Warranty Terms (if any):</b> {{warrantyTerms}}</div>
      <div class="muted">
        Seller warrants title and non-interference, and remains liable for hidden defects in accordance with the governing law, unless explicitly agreed otherwise in a manner not violating public order.
      </div>
    </div>
  </div>

  <div class="sec">
    <h3>6. Representations & Undertakings</h3>
    <div class="box">
      <div>6.1 The Parties confirm their capacity and that consent is free from coercion or material misrepresentation.</div>
      <div>6.2 Seller shall deliver the item and relevant documents (if any) free of liens/attachments/third-party rights unless disclosed.</div>
      <div>6.3 Buyer shall pay the price as stated herein.</div>
    </div>
  </div>

  <div class="sec">
    <h3>7. Breach & Termination</h3>
    <div class="box">
      <div class="muted">
        If a Party materially breaches, the other Party may serve notice and grant a reasonable cure period (unless urgency/nature of obligation does not allow). Failing cure, the non-breaching Party may seek termination and damages under law.
      </div>
    </div>
  </div>

  <div class="sec">
    <h3>8. Governing Law & Dispute Resolution</h3>
    <div class="box">
      <div><b>Governing Law:</b> {{governingLaw}}</div>
      <div><b>Jurisdiction/Court:</b> {{disputeCity}}</div>
      <div class="muted">If left blank, the laws of the Republic of Iraq apply and courts of {{contractCity}} have jurisdiction unless otherwise agreed in writing.</div>
    </div>
  </div>

  <div class="sec">
    <h3>9. General Provisions</h3>
    <div class="box">
      <div>9.1 Headings are for convenience only and do not affect interpretation.</div>
      <div>9.2 Amendments must be in writing and signed by both Parties.</div>
      <div>9.3 This agreement is executed in two originals, one for each Party.</div>
      <div><b>Notes:</b> {{notes}}</div>
    </div>
  </div>

  <div class="sig">
    <div class="sbox">
      <b>Seller Signature</b><br/><br/>
      Name: {{sellerName}}<br/>
      Signature: ___________________<br/>
      Date: {{contractDate}}
    </div>
    <div class="sbox">
      <b>Buyer Signature</b><br/><br/>
      Name: {{buyerName}}<br/>
      Signature: ___________________<br/>
      Date: {{contractDate}}
    </div>
  </div>
</div>
`,
};
