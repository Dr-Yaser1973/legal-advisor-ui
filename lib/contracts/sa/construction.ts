// lib/contracts/sa/construction.ts
// عقد مقاولة وفق نظام المعاملات المدنية السعودي (المرسوم الملكي م/191 لسنة 1444هـ) — أحكام المقاولة،
// والضمان العشري للمباني والمنشآت الثابتة (مسؤولية المقاول والمهندس المتضامنة عن التهدّم والعيوب لعشر سنوات).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const SA = getJurisdiction("SA");

export const CONSTRUCTION_SA_AR: ContractTemplate = {
  id: 11401,
  slug: "sa-construction-ar",
  title: "عقد مقاولة (السعودية) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "SA",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "الرياض" },

    { key: "ownerName", label: "اسم رب العمل (صاحب المشروع)", required: true, type: "text", group: "رب العمل" },
    { key: "ownerId", label: "رقم الهوية/السجل لرب العمل", required: true, type: "text", group: "رب العمل" },
    { key: "ownerAddress", label: "عنوان رب العمل", required: true, type: "text", group: "رب العمل" },

    { key: "contractorName", label: "اسم المقاول", required: true, type: "text", group: "المقاول" },
    { key: "contractorId", label: "السجل التجاري/رقم الهوية للمقاول", required: true, type: "text", group: "المقاول" },
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
      options: currencyOptionsAr(SA.currencies) },
    { key: "paymentSchedule", label: "جدول الدفعات/المستخلصات", required: true, type: "textarea", group: "المالية" },
    { key: "retention", label: "نسبة المحتجزات (إن وجدت)", required: false, type: "text", group: "المالية", placeholder: "مثال: 10%" },

    { key: "startDate", label: "تاريخ بدء التنفيذ", required: true, type: "date", group: "المدة" },
    { key: "endDate", label: "تاريخ التسليم النهائي", required: true, type: "date", group: "المدة" },
    { key: "delayPenalty", label: "شرط الغرامة عن التأخير", required: false, type: "text", group: "المدة", placeholder: "مثال: 0.5% عن كل أسبوع تأخير بحد أقصى 10%" },

    { key: "warrantyPeriod", label: "مدة ضمان العيوب بعد التسليم", required: false, type: "text", group: "أحكام", placeholder: "مثال: سنة (وضمان عشري للمباني)" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "النظام الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: SA.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (المحكمة)", required: true, type: "text", group: "أحكام", placeholder: SA.defaultCourtCityAr },

    { key: "ownerSignName", label: "اسم موقع رب العمل", required: true, type: "text", group: "التواقيع" },
    { key: "contractorSignName", label: "اسم موقع المقاول", required: true, type: "text", group: "التواقيع" },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد مقاولة</div>
    <div class="subtitle">مصاغ وفق نظام المعاملات المدنية السعودي (م/191 لسنة 1444هـ) — أحكام المقاولة والضمان العشري</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <table class="tbl">
      <tr><td class="th">رب العمل</td><td><b>الاسم:</b> {{ownerName}} — <b>الهوية/السجل:</b> {{ownerId}} — <b>العنوان:</b> {{ownerAddress}}</td></tr>
      <tr><td class="th">المقاول</td><td><b>الاسم:</b> {{contractorName}} — <b>الهوية/السجل:</b> {{contractorId}} — <b>العنوان:</b> {{contractorAddress}}</td></tr>
    </table>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل المقاولة</div>
    <div class="p"><b>وصف الأعمال:</b> {{workDescription}}</div>
    <div class="p"><b>موقع التنفيذ:</b> {{workLocation}}</div>
    <div class="p"><b>المواصفات/المخططات:</b> {{specifications}}</div>
    <div class="p"><b>توريد المواد:</b> {{materialsBy}}</div>
    <div class="clause">إذا تعهّد المقاول بتقديم مادة العمل كلها أو بعضها كان مسؤولاً عن جودتها ويضمنها لرب العمل، عملاً بأحكام المقاولة في نظام المعاملات المدنية.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: قيمة المقاولة والدفعات</div>
    <div class="p"><b>طريقة تحديد الأجر:</b> {{priceType}}</div>
    <div class="p"><b>القيمة:</b> {{priceAmount}} {{priceCurrency}}</div>
    <div class="p"><b>جدول الدفعات:</b> {{paymentSchedule}}</div>
    <div class="p"><b>المحتجزات:</b> {{retention}}</div>
    <div class="clause">في المقاولة بأجر إجمالي (مقطوع) على أساس تصميم متفق عليه لا يجوز للمقاول المطالبة بزيادة الأجر بسبب ارتفاع الأسعار أو تغيّر التكاليف، إلا في الحدود التي يقرّرها النظام.</div>
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
      <li>في مقاولات المباني والمنشآت الثابتة يضمن المقاول والمهندس (عند وجوده) متضامنين ما يقع خلال عشر سنوات من تهدّم كلي أو جزئي أو عيب يهدّد متانة البناء وسلامته، ولو كان الخلل ناشئاً عن عيب في الأرض، ما لم يتضمن العقد مدة أطول (الضمان العشري وفق نظام المعاملات المدنية).</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة</div>
    <div class="p">{{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">سابعاً: النظام الواجب التطبيق وتسوية النزاعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص المحكمة المختصة في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
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

export const CONSTRUCTION_SA_EN: ContractTemplate = {
  id: 11402,
  slug: "sa-construction-en",
  title: "Construction / Works Contract (Saudi Arabia) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "SA",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Riyadh" },

    { key: "ownerName", label: "Owner (Employer) Name", required: true, type: "text", group: "Owner" },
    { key: "ownerId", label: "Owner National ID / CR", required: true, type: "text", group: "Owner" },
    { key: "ownerAddress", label: "Owner Address", required: true, type: "text", group: "Owner" },

    { key: "contractorName", label: "Contractor Name", required: true, type: "text", group: "Contractor" },
    { key: "contractorId", label: "Contractor CR / ID", required: true, type: "text", group: "Contractor" },
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
      options: currencyOptionsEn(SA.currencies) },
    { key: "paymentSchedule", label: "Payment / Interim Certificates Schedule", required: true, type: "textarea", group: "Financial" },
    { key: "retention", label: "Retention (if any)", required: false, type: "text", group: "Financial", placeholder: "e.g. 10%" },

    { key: "startDate", label: "Commencement Date", required: true, type: "date", group: "Time" },
    { key: "endDate", label: "Completion Date", required: true, type: "date", group: "Time" },
    { key: "delayPenalty", label: "Delay Penalty (LDs)", required: false, type: "text", group: "Time" },

    { key: "warrantyPeriod", label: "Defects Liability Period", required: false, type: "text", group: "Provisions", placeholder: "e.g. 1 year (10-year decennial for buildings)" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: SA.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: SA.defaultCourtCityEn },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Construction / Works Contract</div>
      <div class="muted">Governed by the Saudi Civil Transactions Law (M/191 of 1444H) — Muqawala and decennial liability.</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div class="row">
      <div><b>Owner:</b> {{ownerName}}<br/><b>ID/CR:</b> {{ownerId}}<br/><b>Address:</b> {{ownerAddress}}</div>
      <div><b>Contractor:</b> {{contractorName}}<br/><b>ID/CR:</b> {{contractorId}}<br/><b>Address:</b> {{contractorAddress}}</div>
    </div>
  </div></div>

  <div class="sec"><h3>2. Scope of Works</h3><div class="box">
    <div><b>Scope:</b> {{workDescription}}</div>
    <div><b>Site:</b> {{workLocation}}</div>
    <div><b>Specs/Drawings:</b> {{specifications}}</div>
    <div><b>Materials:</b> {{materialsBy}}</div>
    <div class="muted">Where the Contractor supplies the materials, it warrants their quality to the Owner under the Civil Transactions Law.</div>
  </div></div>

  <div class="sec"><h3>3. Price & Payment</h3><div class="box">
    <div><b>Pricing:</b> {{priceType}} — <b>Value:</b> {{priceAmount}} {{priceCurrency}}</div>
    <div><b>Schedule:</b> {{paymentSchedule}}</div>
    <div><b>Retention:</b> {{retention}}</div>
    <div class="muted">Under a lump-sum price based on an agreed design, the Contractor may not claim an increase merely because prices or costs rose, save as allowed by law.</div>
  </div></div>

  <div class="sec"><h3>4. Time & Delay</h3><div class="box">
    <div><b>Commencement:</b> {{startDate}} — <b>Completion:</b> {{endDate}}</div>
    <div><b>Delay Penalty:</b> {{delayPenalty}}</div>
  </div></div>

  <div class="sec"><h3>5. Warranty & Liability</h3><div class="box">
    <div><b>Defects Liability Period:</b> {{warrantyPeriod}}</div>
    <div class="muted">For buildings and fixed structures, the Contractor and the engineer (where involved) are jointly liable for total or partial collapse and for defects threatening the building's stability and safety for ten years from delivery — even where the fault stems from a defect in the ground — unless a longer period is agreed (decennial liability under the Civil Transactions Law).</div>
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
