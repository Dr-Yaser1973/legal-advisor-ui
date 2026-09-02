// lib/contracts/eg/sale.ts
// عقد بيع منقول وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد البيع 418 وما بعدها،
// وضمان العيوب الخفية 447 وما بعدها).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";

const EG = getJurisdiction("EG");

export const SALE_EG_AR: ContractTemplate = {
  id: 3101,
  slug: "eg-sale-movable-ar",
  title: "عقد بيع منقول (مصر) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    // ── معلومات العقد ──
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    // ── البائع ──
    { key: "sellerName", label: "اسم البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerId", label: "الرقم القومي/السجل التجاري للبائع", required: true, type: "text", group: "البائع" },
    { key: "sellerAddress", label: "عنوان البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerPhone", label: "هاتف البائع", required: false, type: "text", group: "البائع" },

    // ── المشتري ──
    { key: "buyerName", label: "اسم المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerId", label: "الرقم القومي/السجل التجاري للمشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerAddress", label: "عنوان المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerPhone", label: "هاتف المشتري", required: false, type: "text", group: "المشتري" },

    // ── المبيع ──
    { key: "movableDescription", label: "وصف المنقول وصفاً دقيقاً", required: true, type: "textarea", group: "المبيع" },
    { key: "movableIdentifiers", label: "أرقام/سمات تعريفية (هيكل/سيريال/لوحة)", required: false, type: "text", group: "المبيع" },
    { key: "condition", label: "حالة المنقول عند البيع", required: true, type: "text", group: "المبيع" },

    // ── الثمن والسداد ──
    { key: "priceAmount", label: "الثمن رقماً", required: true, type: "number", group: "الثمن والسداد" },
    { key: "priceCurrency", label: "العملة", required: true, type: "select", group: "الثمن والسداد",
      options: currencyOptionsAr(EG.currencies) },
    { key: "priceText", label: "الثمن كتابةً", required: false, type: "text", group: "الثمن والسداد" },
    { key: "paymentMethod", label: "طريقة السداد", required: true, type: "select", group: "الثمن والسداد",
      options: ["نقداً", "تحويل بنكي", "شيك", "أقساط"] },
    { key: "paymentSchedule", label: "جدول/تفاصيل السداد (إن وجد)", required: false, type: "textarea", group: "الثمن والسداد" },

    // ── التسليم ──
    { key: "deliveryPlace", label: "مكان التسليم", required: true, type: "text", group: "التسليم" },
    { key: "deliveryDate", label: "تاريخ/موعد التسليم", required: true, type: "date", group: "التسليم" },

    // ── أحكام ──
    { key: "warranty", label: "الضمان/الإبراء من العيوب الخفية (إن وجد)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام",
      placeholder: EG.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام",
      placeholder: EG.defaultCourtCityAr },

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
    <div class="subtitle">مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948</div>
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
          <div><b>الرقم القومي/السجل:</b> {{sellerId}}</div>
          <div><b>العنوان:</b> {{sellerAddress}}</div>
          <div><b>الهاتف:</b> {{sellerPhone}}</div>
        </td>
      </tr>
      <tr>
        <td class="th">المشتري</td>
        <td>
          <div><b>الاسم:</b> {{buyerName}}</div>
          <div><b>الرقم القومي/السجل:</b> {{buyerId}}</div>
          <div><b>العنوان:</b> {{buyerAddress}}</div>
          <div><b>الهاتف:</b> {{buyerPhone}}</div>
        </td>
      </tr>
    </table>
    <div class="note">
      ويُشار إلى البائع والمشتري معاً بـ <b>"الطرفين"</b>، وإلى كلٍ منهما بـ <b>"طرف"</b>.
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
      يلتزم المشتري بدفع الثمن في المكان والزمان المتفق عليهما عملاً بالمادة (456) من القانون المدني،
      ويقرّ البائع باستلامه بحسب ما يثبت بالإيصالات عند الاقتضاء.
    </div>
  </div>

  <div class="box">
    <div class="h">رابعاً: التسليم ونقل الملكية والتبعة</div>
    <div class="p"><b>مكان التسليم:</b> {{deliveryPlace}}</div>
    <div class="p"><b>موعد التسليم:</b> {{deliveryDate}}</div>
    <ol class="ol">
      <li>يلتزم البائع بتسليم المبيع بالحالة المتفق عليها وبكل ملحقاته وتوابعه (المواد 431–435 مدني).</li>
      <li>تنتقل ملكية المنقول إلى المشتري بمجرد انعقاد البيع، ما لم يتفق على غير ذلك، وينتقل خطر هلاك المبيع إلى المشتري من وقت التسليم الفعلي (المادة 437 مدني).</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: ضمان الاستحقاق والعيوب الخفية</div>
    <ol class="ol">
      <li>يضمن البائع للمشتري عدم التعرّض له في الانتفاع بالمبيع وخلوّه من حقوق الغير (ضمان الاستحقاق – المواد 439 وما بعدها مدني).</li>
      <li>يضمن البائع العيوب الخفية في المبيع وفقاً للمواد (447 وما بعدها) من القانون المدني، ما لم يُتفق على الإعفاء منها في حدود ما يجيزه القانون.</li>
      <li><b>اتفاق الضمان/الإبراء:</b> {{warranty}}</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة</div>
    <div class="p">{{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">سابعاً: القانون الواجب التطبيق وتسوية النزاعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تكون محاكم <b>{{disputeCity}}</b> هي المختصة بنظر أي نزاع ينشأ عن هذا العقد ما لم يتفق الطرفان كتابةً على خلاف ذلك.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">ثامناً: أحكام ختامية</div>
    <ol class="ol">
      <li>يمثّل هذا العقد كامل الاتفاق بين الطرفين ويُلغي ما سبقه من تفاهمات بشأن موضوعه.</li>
      <li>لا يكون أي تعديل نافذاً إلا إذا كان مكتوباً وموقعاً من الطرفين.</li>
      <li>حُرِّر هذا العقد من نسختين أصليتين بيد كل طرف نسخة للعمل بموجبها.</li>
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
    .doc{font-family:"Noto Naskh Arabic","Amiri",Arial,sans-serif;font-size:16px;line-height:1.9;color:#111;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
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
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>
</div>
  `.trim(),
};

export const SALE_EG_EN: ContractTemplate = {
  id: 3102,
  slug: "eg-sale-movable-en",
  title: "Movable Property Sale Agreement (Egypt) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place/City of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

    { key: "sellerName", label: "Seller Name", required: true, type: "text", group: "Seller" },
    { key: "sellerId", label: "Seller National ID / Commercial Reg.", required: true, type: "text", group: "Seller" },
    { key: "sellerAddress", label: "Seller Address", required: true, type: "text", group: "Seller" },
    { key: "sellerPhone", label: "Seller Contact", required: false, type: "text", group: "Seller" },

    { key: "buyerName", label: "Buyer Name", required: true, type: "text", group: "Buyer" },
    { key: "buyerId", label: "Buyer National ID / Commercial Reg.", required: true, type: "text", group: "Buyer" },
    { key: "buyerAddress", label: "Buyer Address", required: true, type: "text", group: "Buyer" },
    { key: "buyerPhone", label: "Buyer Contact", required: false, type: "text", group: "Buyer" },

    { key: "itemDescription", label: "Detailed Description", required: true, type: "textarea", group: "Item" },
    { key: "itemSerial", label: "Serial/VIN/Plate (if any)", required: false, type: "text", group: "Item" },
    { key: "itemCondition", label: "Condition + Known Defects", required: true, type: "text", group: "Item" },

    { key: "priceAmount", label: "Price (Number)", required: true, type: "number", group: "Price & Payment" },
    { key: "priceCurrency", label: "Currency", required: true, type: "select", group: "Price & Payment",
      options: currencyOptionsEn(EG.currencies) },
    { key: "paymentMethod", label: "Payment Method", required: true, type: "select", group: "Price & Payment",
      options: ["Cash", "Bank Transfer", "Cheque", "Installments"] },
    { key: "paymentSchedule", label: "Payment Schedule (if any)", required: false, type: "textarea", group: "Price & Payment" },

    { key: "deliveryPlace", label: "Delivery Place", required: true, type: "text", group: "Delivery" },
    { key: "deliveryDate", label: "Delivery Date", required: true, type: "date", group: "Delivery" },

    { key: "warrantyTerms", label: "Warranty / Defects Terms (if any)", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions",
      placeholder: EG.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions",
      placeholder: EG.defaultCourtCityEn },
    { key: "notes", label: "Additional Notes", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  <style>
    .doc{font-family:Arial,sans-serif;line-height:1.8;font-size:16px;color:#111;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:1px solid #ddd;padding-bottom:10px;margin-bottom:14px}
    .title{font-size:18px;font-weight:700}
    .meta{font-size:12px;color:#444}
    .box{border:1px solid #e5e5e5;border-radius:12px;padding:12px;margin:10px 0}
    .sec{margin:14px 0}
    .sec h3{margin:0 0 6px;font-size:14px}
    .row{display:flex;gap:12px;flex-wrap:wrap}
    .row > div{flex:1;min-width:220px}
    .muted{color:#555;font-size:12px}
    .sig{display:flex;gap:18px;margin-top:18px}
    .sig .sbox{flex:1;border:1px dashed #bbb;border-radius:12px;padding:12px;min-height:110px}
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>

  <div class="hdr">
    <div>
      <div class="title">Movable Property Sale Agreement</div>
      <div class="muted">Governed by the Egyptian Civil Code No. 131 of 1948.</div>
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
      <div class="muted">The Seller and Buyer are collectively referred to as the "Parties".</div>
    </div>
  </div>

  <div class="sec">
    <h3>2. Subject Matter</h3>
    <div class="box">
      <div><b>Description:</b> {{itemDescription}}</div>
      <div><b>Serial/VIN/Plate:</b> {{itemSerial}}</div>
      <div><b>Condition / Defects:</b> {{itemCondition}}</div>
      <div class="muted">Seller represents lawful ownership and that the item is free of third-party rights unless expressly disclosed (Arts. 439 ff. Civil Code).</div>
    </div>
  </div>

  <div class="sec">
    <h3>3. Price & Payment</h3>
    <div class="box">
      <div><b>Price:</b> {{priceAmount}} ({{priceCurrency}})</div>
      <div><b>Payment Method:</b> {{paymentMethod}}</div>
      <div><b>Schedule/Installments:</b> {{paymentSchedule}}</div>
      <div class="muted">Buyer shall pay the price at the agreed time and place (Art. 456 Civil Code).</div>
    </div>
  </div>

  <div class="sec">
    <h3>4. Delivery, Title & Risk</h3>
    <div class="box">
      <div><b>Delivery Place:</b> {{deliveryPlace}}</div>
      <div><b>Delivery Date:</b> {{deliveryDate}}</div>
      <div class="muted">Title passes upon conclusion of the sale unless otherwise agreed; risk of loss passes to the Buyer upon actual delivery (Art. 437 Civil Code).</div>
    </div>
  </div>

  <div class="sec">
    <h3>5. Warranty of Title & Hidden Defects</h3>
    <div class="box">
      <div><b>Warranty Terms (if any):</b> {{warrantyTerms}}</div>
      <div class="muted">Seller warrants quiet possession and remains liable for hidden defects under Arts. 447 ff. of the Civil Code, save for a lawful exclusion of liability.</div>
    </div>
  </div>

  <div class="sec">
    <h3>6. Governing Law & Dispute Resolution</h3>
    <div class="box">
      <div><b>Governing Law:</b> {{governingLaw}}</div>
      <div><b>Jurisdiction/Court:</b> {{disputeCity}}</div>
      <div class="muted">If left blank, the laws of the Arab Republic of Egypt apply and the courts of {{contractCity}} have jurisdiction unless otherwise agreed in writing.</div>
    </div>
  </div>

  <div class="sec">
    <h3>7. General Provisions</h3>
    <div class="box">
      <div>7.1 Amendments must be in writing and signed by both Parties.</div>
      <div>7.2 This agreement is executed in two originals, one for each Party.</div>
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
