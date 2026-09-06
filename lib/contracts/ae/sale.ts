// lib/contracts/ae/sale.ts
// عقد بيع منقول وفق قانون المعاملات المدنية الاتحادي الإماراتي رقم 5 لسنة 1985
// (أحكام البيع، وضمان التعرّض والاستحقاق، وضمان العيوب الخفية).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const AE = getJurisdiction("AE");

export const SALE_AE_AR: ContractTemplate = {
  id: 5101,
  slug: "ae-sale-movable-ar",
  title: "عقد بيع منقول (الإمارات) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "دبي" },

    { key: "sellerName", label: "اسم البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerId", label: "الهوية الإماراتية/الرخصة التجارية للبائع", required: true, type: "text", group: "البائع" },
    { key: "sellerAddress", label: "عنوان البائع", required: true, type: "text", group: "البائع" },
    { key: "sellerPhone", label: "هاتف البائع", required: false, type: "text", group: "البائع" },

    { key: "buyerName", label: "اسم المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerId", label: "الهوية الإماراتية/الرخصة التجارية للمشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerAddress", label: "عنوان المشتري", required: true, type: "text", group: "المشتري" },
    { key: "buyerPhone", label: "هاتف المشتري", required: false, type: "text", group: "المشتري" },

    { key: "movableDescription", label: "وصف المنقول وصفاً دقيقاً", required: true, type: "textarea", group: "المبيع" },
    { key: "movableIdentifiers", label: "أرقام/سمات تعريفية (هيكل/سيريال/لوحة)", required: false, type: "text", group: "المبيع" },
    { key: "condition", label: "حالة المنقول عند البيع", required: true, type: "text", group: "المبيع" },

    { key: "priceAmount", label: "الثمن رقماً", required: true, type: "number", group: "الثمن والسداد" },
    { key: "priceCurrency", label: "العملة", required: true, type: "select", group: "الثمن والسداد",
      options: currencyOptionsAr(AE.currencies) },
    { key: "priceText", label: "الثمن كتابةً", required: false, type: "text", group: "الثمن والسداد" },
    { key: "paymentMethod", label: "طريقة السداد", required: true, type: "select", group: "الثمن والسداد",
      options: ["نقداً", "تحويل بنكي", "شيك", "أقساط"] },
    { key: "paymentSchedule", label: "جدول/تفاصيل السداد (إن وجد)", required: false, type: "textarea", group: "الثمن والسداد" },

    { key: "deliveryPlace", label: "مكان التسليم", required: true, type: "text", group: "التسليم" },
    { key: "deliveryDate", label: "تاريخ/موعد التسليم", required: true, type: "date", group: "التسليم" },

    { key: "warranty", label: "الضمان/الإبراء من العيوب الخفية (إن وجد)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: AE.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: AE.defaultCourtCityAr },

    { key: "sellerSignName", label: "اسم موقع البائع", required: true, type: "text", group: "التواقيع" },
    { key: "buyerSignName", label: "اسم موقع المشتري", required: true, type: "text", group: "التواقيع" },
    { key: "witness1", label: "الشاهد الأول (اختياري)", required: false, type: "text", group: "التواقيع" },
    { key: "witness2", label: "الشاهد الثاني (اختياري)", required: false, type: "text", group: "التواقيع" },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد بيع منقول</div>
    <div class="subtitle">مصاغ وفق قانون المعاملات المدنية الاتحادي رقم 5 لسنة 1985</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: أطراف العقد</div>
    <table class="tbl">
      <tr><td class="th">البائع</td><td><b>الاسم:</b> {{sellerName}} — <b>الهوية/الرخصة:</b> {{sellerId}} — <b>العنوان:</b> {{sellerAddress}} — <b>الهاتف:</b> {{sellerPhone}}</td></tr>
      <tr><td class="th">المشتري</td><td><b>الاسم:</b> {{buyerName}} — <b>الهوية/الرخصة:</b> {{buyerId}} — <b>العنوان:</b> {{buyerAddress}} — <b>الهاتف:</b> {{buyerPhone}}</td></tr>
    </table>
    <div class="note">ويُشار إلى البائع والمشتري معاً بـ <b>"الطرفين"</b>، وإلى كلٍ منهما بـ <b>"طرف"</b>.</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل العقد (المنقول المبيع)</div>
    <div class="p"><b>وصف المنقول:</b> {{movableDescription}}</div>
    <div class="p"><b>سمات/أرقام تعريفية:</b> {{movableIdentifiers}}</div>
    <div class="p"><b>حالة المنقول:</b> {{condition}}</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الثمن وطريقة السداد</div>
    <div class="p">اتفق الطرفان على أن ثمن المنقول هو: <b>{{priceAmount}} {{priceCurrency}}</b> <span class="muted">({{priceText}})</span></div>
    <div class="p"><b>طريقة السداد:</b> {{paymentMethod}}</div>
    <div class="p"><b>تفاصيل/جدول السداد:</b> {{paymentSchedule}}</div>
    <div class="clause">يلتزم المشتري بأداء الثمن في المكان والزمان المتفق عليهما، ويقرّ البائع باستلامه بحسب ما يثبت بالإيصالات عند الاقتضاء، والعقد شريعة المتعاقدين (المادة 267 معاملات مدنية).</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: التسليم ونقل الملكية والتبعة</div>
    <div class="p"><b>مكان التسليم:</b> {{deliveryPlace}} — <b>موعد التسليم:</b> {{deliveryDate}}</div>
    <ol class="ol">
      <li>يلتزم البائع بتسليم المبيع بالحالة المتفق عليها وبكل ملحقاته وتوابعه.</li>
      <li>تنتقل ملكية المنقول إلى المشتري ما لم يُتفق على غير ذلك، وينتقل خطر هلاك المبيع إلى المشتري من وقت التسليم الفعلي.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: ضمان التعرّض والاستحقاق والعيوب الخفية</div>
    <ol class="ol">
      <li>يضمن البائع عدم التعرّض للمشتري في الانتفاع بالمبيع وخلوّه من حقوق الغير (ضمان الاستحقاق).</li>
      <li>يضمن البائع العيوب الخفية في المبيع وفقاً لأحكام قانون المعاملات المدنية، ما لم يُتفق على الإعفاء منها في حدود ما يجيزه القانون.</li>
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
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن هذا العقد ما لم يتفق الطرفان كتابةً على خلاف ذلك.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع البائع</div><div class="sig-line"></div><div class="sig-name">{{sellerSignName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع المشتري</div><div class="sig-line"></div><div class="sig-name">{{buyerSignName}}</div></div>
  </div>
  <div class="signs">
    <div class="sig"><div class="sig-h">الشاهد الأول</div><div class="sig-line"></div><div class="sig-name">{{witness1}}</div></div>
    <div class="sig"><div class="sig-h">الشاهد الثاني</div><div class="sig-line"></div><div class="sig-name">{{witness2}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const SALE_AE_EN: ContractTemplate = {
  id: 5102,
  slug: "ae-sale-movable-en",
  title: "Movable Property Sale Agreement (UAE) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place/City of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Dubai" },

    { key: "sellerName", label: "Seller Name", required: true, type: "text", group: "Seller" },
    { key: "sellerId", label: "Seller Emirates ID / Trade Licence", required: true, type: "text", group: "Seller" },
    { key: "sellerAddress", label: "Seller Address", required: true, type: "text", group: "Seller" },
    { key: "sellerPhone", label: "Seller Contact", required: false, type: "text", group: "Seller" },

    { key: "buyerName", label: "Buyer Name", required: true, type: "text", group: "Buyer" },
    { key: "buyerId", label: "Buyer Emirates ID / Trade Licence", required: true, type: "text", group: "Buyer" },
    { key: "buyerAddress", label: "Buyer Address", required: true, type: "text", group: "Buyer" },
    { key: "buyerPhone", label: "Buyer Contact", required: false, type: "text", group: "Buyer" },

    { key: "itemDescription", label: "Detailed Description", required: true, type: "textarea", group: "Item" },
    { key: "itemSerial", label: "Serial/VIN/Plate (if any)", required: false, type: "text", group: "Item" },
    { key: "itemCondition", label: "Condition + Known Defects", required: true, type: "text", group: "Item" },

    { key: "priceAmount", label: "Price (Number)", required: true, type: "number", group: "Price & Payment" },
    { key: "priceCurrency", label: "Currency", required: true, type: "select", group: "Price & Payment",
      options: currencyOptionsEn(AE.currencies) },
    { key: "paymentMethod", label: "Payment Method", required: true, type: "select", group: "Price & Payment",
      options: ["Cash", "Bank Transfer", "Cheque", "Installments"] },
    { key: "paymentSchedule", label: "Payment Schedule (if any)", required: false, type: "textarea", group: "Price & Payment" },

    { key: "deliveryPlace", label: "Delivery Place", required: true, type: "text", group: "Delivery" },
    { key: "deliveryDate", label: "Delivery Date", required: true, type: "date", group: "Delivery" },

    { key: "warrantyTerms", label: "Warranty / Defects Terms (if any)", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: AE.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: AE.defaultCourtCityEn },
    { key: "notes", label: "Additional Notes", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Movable Property Sale Agreement</div>
      <div class="muted">Governed by the UAE Civil Transactions Law No. 5 of 1985.</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div class="row">
      <div><b>Seller:</b> {{sellerName}}<br/><b>ID/Licence:</b> {{sellerId}}<br/><b>Address:</b> {{sellerAddress}}<br/><b>Contact:</b> {{sellerPhone}}</div>
      <div><b>Buyer:</b> {{buyerName}}<br/><b>ID/Licence:</b> {{buyerId}}<br/><b>Address:</b> {{buyerAddress}}<br/><b>Contact:</b> {{buyerPhone}}</div>
    </div>
    <div class="muted">The Seller and Buyer are collectively the "Parties".</div>
  </div></div>

  <div class="sec"><h3>2. Subject Matter</h3><div class="box">
    <div><b>Description:</b> {{itemDescription}}</div>
    <div><b>Serial/VIN/Plate:</b> {{itemSerial}}</div>
    <div><b>Condition / Defects:</b> {{itemCondition}}</div>
    <div class="muted">Seller represents lawful ownership and that the item is free of third-party rights unless expressly disclosed.</div>
  </div></div>

  <div class="sec"><h3>3. Price & Payment</h3><div class="box">
    <div><b>Price:</b> {{priceAmount}} ({{priceCurrency}})</div>
    <div><b>Payment Method:</b> {{paymentMethod}}</div>
    <div><b>Schedule/Installments:</b> {{paymentSchedule}}</div>
    <div class="muted">This Agreement is binding on the Parties and may be varied or rescinded only by mutual consent or on grounds provided by law (Art. 267 Civil Transactions Law).</div>
  </div></div>

  <div class="sec"><h3>4. Delivery, Title & Risk</h3><div class="box">
    <div><b>Delivery Place:</b> {{deliveryPlace}}</div>
    <div><b>Delivery Date:</b> {{deliveryDate}}</div>
    <div class="muted">Title passes unless otherwise agreed; risk of loss passes to the Buyer upon actual delivery.</div>
  </div></div>

  <div class="sec"><h3>5. Warranty of Title & Hidden Defects</h3><div class="box">
    <div><b>Warranty Terms (if any):</b> {{warrantyTerms}}</div>
    <div class="muted">Seller warrants quiet possession and remains liable for hidden defects under the Civil Transactions Law, save for a lawful exclusion of liability.</div>
  </div></div>

  <div class="sec"><h3>6. Governing Law & Dispute Resolution</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction/Court:</b> {{disputeCity}}</div>
    <div class="muted">If left blank, the laws of the United Arab Emirates apply and the courts of {{contractCity}} have jurisdiction unless otherwise agreed in writing.</div>
    <div><b>Notes:</b> {{notes}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Seller Signature</b><br/><br/>Name: {{sellerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Buyer Signature</b><br/><br/>Name: {{buyerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
