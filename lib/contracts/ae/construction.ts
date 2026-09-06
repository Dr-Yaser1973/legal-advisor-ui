// lib/contracts/ae/construction.ts
// عقد مقاولة وفق قانون المعاملات المدنية الاتحادي الإماراتي رقم 5 لسنة 1985
// (أحكام المقاولة، والضمان العشري للمباني والمنشآت الثابتة — المادة 880).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const AE = getJurisdiction("AE");

export const CONSTRUCTION_AE_AR: ContractTemplate = {
  id: 5301,
  slug: "ae-construction-ar",
  title: "عقد مقاولة (الإمارات) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "دبي" },

    { key: "ownerName", label: "اسم رب العمل (صاحب المشروع)", required: true, type: "text", group: "رب العمل" },
    { key: "ownerId", label: "الهوية/الرخصة لرب العمل", required: true, type: "text", group: "رب العمل" },
    { key: "ownerAddress", label: "عنوان رب العمل", required: true, type: "text", group: "رب العمل" },

    { key: "contractorName", label: "اسم المقاول", required: true, type: "text", group: "المقاول" },
    { key: "contractorId", label: "الرخصة التجارية للمقاول", required: true, type: "text", group: "المقاول" },
    { key: "contractorAddress", label: "عنوان المقاول", required: true, type: "text", group: "المقاول" },

    { key: "workDescription", label: "وصف الأعمال المطلوبة", required: true, type: "textarea", group: "محل المقاولة" },
    { key: "workLocation", label: "موقع تنفيذ الأعمال", required: true, type: "text", group: "محل المقاولة" },
    { key: "specifications", label: "المواصفات الفنية/المخططات المرجعية", required: false, type: "textarea", group: "محل المقاولة" },
    { key: "materialsBy", label: "توريد المواد", required: true, type: "select", group: "محل المقاولة",
      options: ["المقاول يورّد المواد والعمل", "رب العمل يورّد المواد والمقاول يقدّم العمل فقط"] },

    { key: "priceType", label: "طريقة تحديد الأجر", required: true, type: "select", group: "المالية",
      options: ["إجمالي مقطوع", "بحسب الوحدة/المقايسة", "بحسب التكلفة زائد نسبة"] },
    { key: "priceAmount", label: "قيمة المقاولة", required: true, type: "number", group: "المالية" },
    { key: "priceCurrency", label: "العملة", required: true, type: "select", group: "المالية",
      options: currencyOptionsAr(AE.currencies) },
    { key: "paymentSchedule", label: "جدول الدفعات/المستخلصات", required: true, type: "textarea", group: "المالية" },
    { key: "retention", label: "نسبة التأمين المحتجز (إن وجدت)", required: false, type: "text", group: "المالية", placeholder: "مثال: 10%" },

    { key: "startDate", label: "تاريخ بدء التنفيذ", required: true, type: "date", group: "المدة" },
    { key: "endDate", label: "تاريخ التسليم النهائي", required: true, type: "date", group: "المدة" },
    { key: "delayPenalty", label: "شرط الغرامة عن التأخير", required: false, type: "text", group: "المدة", placeholder: "مثال: 0.5% عن كل أسبوع تأخير بحد أقصى 10%" },

    { key: "warrantyPeriod", label: "مدة ضمان العيوب بعد التسليم", required: false, type: "text", group: "أحكام", placeholder: "مثال: سنة (وضمان عشري للمباني)" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: AE.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: AE.defaultCourtCityAr },

    { key: "ownerSignName", label: "اسم موقع رب العمل", required: true, type: "text", group: "التواقيع" },
    { key: "contractorSignName", label: "اسم موقع المقاول", required: true, type: "text", group: "التواقيع" },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد مقاولة</div>
    <div class="subtitle">مصاغ وفق قانون المعاملات المدنية الاتحادي رقم 5 لسنة 1985 (أحكام المقاولة والضمان العشري م880)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <table class="tbl">
      <tr><td class="th">رب العمل</td><td><b>الاسم:</b> {{ownerName}} — <b>الهوية/الرخصة:</b> {{ownerId}} — <b>العنوان:</b> {{ownerAddress}}</td></tr>
      <tr><td class="th">المقاول</td><td><b>الاسم:</b> {{contractorName}} — <b>الرخصة:</b> {{contractorId}} — <b>العنوان:</b> {{contractorAddress}}</td></tr>
    </table>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل المقاولة</div>
    <div class="p"><b>وصف الأعمال:</b> {{workDescription}}</div>
    <div class="p"><b>موقع التنفيذ:</b> {{workLocation}}</div>
    <div class="p"><b>المواصفات/المخططات:</b> {{specifications}}</div>
    <div class="p"><b>توريد المواد:</b> {{materialsBy}}</div>
    <div class="clause">إذا تعهّد المقاول بتقديم مادة العمل كلها أو بعضها كان مسؤولاً عن جودتها ويضمنها لرب العمل.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: قيمة المقاولة والدفعات</div>
    <div class="p"><b>طريقة تحديد الأجر:</b> {{priceType}}</div>
    <div class="p"><b>القيمة:</b> {{priceAmount}} {{priceCurrency}}</div>
    <div class="p"><b>جدول الدفعات:</b> {{paymentSchedule}}</div>
    <div class="p"><b>التأمين المحتجز:</b> {{retention}}</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: المدة والتسليم والتأخير</div>
    <div class="p"><b>بدء التنفيذ:</b> {{startDate}} — <b>التسليم النهائي:</b> {{endDate}}</div>
    <div class="p"><b>غرامة التأخير:</b> {{delayPenalty}}</div>
    <ol class="ol">
      <li>يلتزم المقاول بإنجاز العمل وفق المواصفات وفي الميعاد المتفق عليه وتسليمه لرب العمل.</li>
      <li>يلتزم رب العمل بتسلّم العمل وأداء الأجر عند التسليم ما لم يوجد اتفاق أو عرف يقضي بغيره.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: الضمان والمسؤولية</div>
    <ol class="ol">
      <li>يضمن المقاول ما ينشأ من عيوب في التنفيذ، وتسري مدة ضمان العيوب: <b>{{warrantyPeriod}}</b>.</li>
      <li>في مقاولات المباني والمنشآت الثابتة يضمن المقاول والمهندس (عند وجوده) ما يقع من تهدّم كلي أو جزئي أو عيب يهدد سلامة ومتانة المبنى لمدة عشر سنوات من التسليم (الضمان العشري — المادة 880 معاملات مدنية).</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع رب العمل</div><div class="sig-line"></div><div class="sig-name">{{ownerSignName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع المقاول</div><div class="sig-line"></div><div class="sig-name">{{contractorSignName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const CONSTRUCTION_AE_EN: ContractTemplate = {
  id: 5302,
  slug: "ae-construction-en",
  title: "Construction / Works Contract (UAE) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Dubai" },

    { key: "ownerName", label: "Owner (Employer) Name", required: true, type: "text", group: "Owner" },
    { key: "ownerId", label: "Owner ID / Licence", required: true, type: "text", group: "Owner" },
    { key: "ownerAddress", label: "Owner Address", required: true, type: "text", group: "Owner" },

    { key: "contractorName", label: "Contractor Name", required: true, type: "text", group: "Contractor" },
    { key: "contractorId", label: "Contractor Trade Licence", required: true, type: "text", group: "Contractor" },
    { key: "contractorAddress", label: "Contractor Address", required: true, type: "text", group: "Contractor" },

    { key: "workDescription", label: "Scope of Works", required: true, type: "textarea", group: "Works" },
    { key: "workLocation", label: "Site Location", required: true, type: "text", group: "Works" },
    { key: "specifications", label: "Technical Specs / Drawings", required: false, type: "textarea", group: "Works" },
    { key: "materialsBy", label: "Materials Supplied By", required: true, type: "select", group: "Works",
      options: ["Contractor supplies materials and labour", "Owner supplies materials; Contractor labour only"] },

    { key: "priceType", label: "Pricing Method", required: true, type: "select", group: "Financial",
      options: ["Lump sum", "Unit rate / BoQ", "Cost plus fee"] },
    { key: "priceAmount", label: "Contract Value", required: true, type: "number", group: "Financial" },
    { key: "priceCurrency", label: "Currency", required: true, type: "select", group: "Financial",
      options: currencyOptionsEn(AE.currencies) },
    { key: "paymentSchedule", label: "Payment / Interim Certificates Schedule", required: true, type: "textarea", group: "Financial" },
    { key: "retention", label: "Retention (if any)", required: false, type: "text", group: "Financial", placeholder: "e.g. 10%" },

    { key: "startDate", label: "Commencement Date", required: true, type: "date", group: "Time" },
    { key: "endDate", label: "Completion Date", required: true, type: "date", group: "Time" },
    { key: "delayPenalty", label: "Delay Penalty (LDs)", required: false, type: "text", group: "Time" },

    { key: "warrantyPeriod", label: "Defects Liability Period", required: false, type: "text", group: "Provisions", placeholder: "e.g. 1 year (10-year decennial for buildings)" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: AE.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: AE.defaultCourtCityEn },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Construction / Works Contract</div>
      <div class="muted">Governed by the UAE Civil Transactions Law No. 5 of 1985 (Muqawala; decennial liability, Art. 880).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div class="row">
      <div><b>Owner:</b> {{ownerName}}<br/><b>ID/Licence:</b> {{ownerId}}<br/><b>Address:</b> {{ownerAddress}}</div>
      <div><b>Contractor:</b> {{contractorName}}<br/><b>Licence:</b> {{contractorId}}<br/><b>Address:</b> {{contractorAddress}}</div>
    </div>
  </div></div>

  <div class="sec"><h3>2. Scope of Works</h3><div class="box">
    <div><b>Scope:</b> {{workDescription}}</div>
    <div><b>Site:</b> {{workLocation}}</div>
    <div><b>Specs/Drawings:</b> {{specifications}}</div>
    <div><b>Materials:</b> {{materialsBy}}</div>
  </div></div>

  <div class="sec"><h3>3. Price & Payment</h3><div class="box">
    <div><b>Pricing:</b> {{priceType}} — <b>Value:</b> {{priceAmount}} {{priceCurrency}}</div>
    <div><b>Schedule:</b> {{paymentSchedule}}</div>
    <div><b>Retention:</b> {{retention}}</div>
  </div></div>

  <div class="sec"><h3>4. Time & Delay</h3><div class="box">
    <div><b>Commencement:</b> {{startDate}} — <b>Completion:</b> {{endDate}}</div>
    <div><b>Delay Penalty:</b> {{delayPenalty}}</div>
  </div></div>

  <div class="sec"><h3>5. Warranty & Liability</h3><div class="box">
    <div><b>Defects Liability Period:</b> {{warrantyPeriod}}</div>
    <div class="muted">For buildings and fixed works, the Contractor (and engineer, if any) is liable for total/partial collapse or defects threatening the building's safety and stability for ten years from delivery (decennial liability, Art. 880 Civil Transactions Law).</div>
  </div></div>

  <div class="sec"><h3>6. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Owner Signature</b><br/><br/>Name: {{ownerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Contractor Signature</b><br/><br/>Name: {{contractorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
