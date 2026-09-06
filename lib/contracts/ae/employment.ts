// lib/contracts/ae/employment.ts
// عقد عمل وفق المرسوم بقانون اتحادي رقم 33 لسنة 2021 بشأن تنظيم علاقات العمل
// (النافذ اعتباراً من 2 فبراير 2022، والذي حلّ محلّ القانون الاتحادي رقم 8 لسنة 1980).
// عقود القطاع الخاص كلها محددة المدة (بحد أقصى 3 سنوات قابلة للتجديد)،
// وفترة الاختبار لا تزيد على ستة أشهر ولا تقبل التمديد.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const AE = getJurisdiction("AE");
const AE_LABOUR_AR = "المرسوم بقانون اتحادي رقم 33 لسنة 2021 بشأن تنظيم علاقات العمل";
const AE_LABOUR_EN = "UAE Labour Law (Federal Decree-Law No. 33 of 2021)";

export const EMPLOYMENT_AE_AR: ContractTemplate = {
  id: 5601,
  slug: "ae-employment-ar",
  title: "عقد عمل (الإمارات) — عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "دبي" },

    { key: "employerName", label: "اسم صاحب العمل/المنشأة", required: true, type: "text", group: "الأطراف" },
    { key: "employerReg", label: "الرخصة التجارية/رقم المنشأة", required: false, type: "text", group: "الأطراف" },
    { key: "employerAddress", label: "عنوان صاحب العمل", required: false, type: "text", group: "الأطراف" },
    { key: "employeeName", label: "اسم العامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeId", label: "رقم الهوية الإماراتية/الجواز", required: true, type: "text", group: "الأطراف" },
    { key: "employeeNationality", label: "الجنسية", required: false, type: "text", group: "الأطراف" },
    { key: "employeeAddress", label: "عنوان العامل", required: false, type: "text", group: "الأطراف" },

    { key: "jobTitle", label: "المسمى الوظيفي", required: true, type: "text", group: "الوظيفة" },
    { key: "jobDescription", label: "وصف المهام", required: true, type: "textarea", group: "الوظيفة" },
    { key: "workplace", label: "مكان العمل", required: false, type: "text", group: "الوظيفة" },
    { key: "workModel", label: "نمط العمل", required: false, type: "select", group: "الوظيفة",
      options: ["دوام كامل", "دوام جزئي", "عمل مؤقت", "عمل مرن"] },

    { key: "salary", label: "الأجر الأساسي", required: true, type: "number", group: "الأجر" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "الأجر",
      options: currencyOptionsAr(AE.currencies) },
    { key: "allowances", label: "بدلات (سكن/مواصلات/غيرها)", required: false, type: "text", group: "الأجر" },
    { key: "paymentFrequency", label: "دورية صرف الأجر", required: true, type: "select", group: "الأجر",
      options: ["شهري", "أسبوعي", "نصف شهري"] },

    { key: "startDate", label: "تاريخ بدء العمل", required: true, type: "date", group: "المدة" },
    { key: "contractDuration", label: "مدة العقد (محدد المدة ≤ 3 سنوات)", required: true, type: "text", group: "المدة", placeholder: "مثال: سنتان قابلتان للتجديد" },
    { key: "probationPeriod", label: "فترة الاختبار (بحد أقصى 6 أشهر)", required: false, type: "text", group: "المدة", placeholder: "مثال: 6 أشهر" },

    { key: "workingHours", label: "ساعات العمل", required: true, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 8 ساعات يومياً / 48 ساعة أسبوعياً" },
    { key: "weeklyRest", label: "الراحة الأسبوعية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: يوم واحد على الأقل" },
    { key: "annualLeave", label: "الإجازة السنوية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 30 يوماً بعد سنة" },

    { key: "confidentiality", label: "بند السرية/عدم المنافسة (اختياري)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الحاكم", required: false, type: "text", group: "أحكام", placeholder: AE_LABOUR_AR },
    { key: "disputeCity", label: "الاختصاص القضائي", required: false, type: "text", group: "أحكام", placeholder: AE.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد عمل</div>
    <div class="subtitle">مصاغ وفق المرسوم بقانون اتحادي رقم 33 لسنة 2021 بشأن تنظيم علاقات العمل</div>
    <div class="meta">
      <div><b>رقم العقد:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>مكان الإبرام:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>الطرف الأول (صاحب العمل):</b> {{employerName}} — الرخصة/المنشأة: {{employerReg}} — العنوان: {{employerAddress}}.</div>
    <div class="p"><b>الطرف الثاني (العامل):</b> {{employeeName}} — الهوية/الجواز: {{employeeId}} — الجنسية: {{employeeNationality}} — العنوان: {{employeeAddress}}.</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: طبيعة العمل ونمطه</div>
    <div class="p"><b>المسمى الوظيفي:</b> {{jobTitle}}</div>
    <div class="p"><b>وصف المهام:</b> {{jobDescription}}</div>
    <div class="p"><b>مكان العمل:</b> {{workplace}} — <b>نمط العمل:</b> {{workModel}}</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الأجر</div>
    <div class="p"><b>الأجر الأساسي:</b> {{salary}} {{currency}} — يُصرف بشكل {{paymentFrequency}}.</div>
    <div class="p"><b>البدلات:</b> {{allowances}}</div>
    <div class="clause">يلتزم صاحب العمل بأداء الأجر في مواعيده عبر نظام حماية الأجور (WPS) المعتمد، ووفق أحكام قانون تنظيم علاقات العمل.</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: مدة العقد وفترة الاختبار</div>
    <div class="p"><b>نوع العقد:</b> محدد المدة — <b>المدة:</b> {{contractDuration}}</div>
    <div class="p"><b>تاريخ بدء العمل:</b> {{startDate}} — <b>فترة الاختبار:</b> {{probationPeriod}}</div>
    <div class="clause">تكون جميع عقود القطاع الخاص محددة المدة بما لا يجاوز ثلاث سنوات قابلة للتجديد أو التمديد. ولا تزيد فترة الاختبار على ستة أشهر ولا تقبل التمديد؛ ولإنهاء العقد خلالها يُخطَر الطرف الآخر كتابةً بمدة لا تقل عن 14 يوماً (المرسوم بقانون 33/2021).</div>
  </div>

  <div class="box">
    <div class="h">خامساً: ساعات العمل والإجازات</div>
    <div class="p"><b>ساعات العمل:</b> {{workingHours}}</div>
    <div class="p"><b>الراحة الأسبوعية:</b> {{weeklyRest}}</div>
    <div class="p"><b>الإجازة السنوية:</b> {{annualLeave}}</div>
    <div class="clause">تُنظَّم ساعات العمل والراحات والإجازات (السنوية والمرضية والرسمية وإجازات الأمومة) وفق أحكام قانون تنظيم علاقات العمل ولائحته التنفيذية باعتبارها الحد الأدنى لحقوق العامل.</div>
  </div>

  <div class="box">
    <div class="h">سادساً: إنهاء العقد ومكافأة نهاية الخدمة</div>
    <ol class="ol">
      <li>يجوز إنهاء العقد بإخطار كتابي مسبق لا يقل عن 30 يوماً ولا يزيد على 90 يوماً، مع مراعاة أسباب الإنهاء المشروعة وحظر الفصل التعسّفي.</li>
      <li>يستحق العامل غير المواطن مكافأة نهاية الخدمة عن مدة خدمته وفق القانون، إضافةً إلى مستحقاته الأخرى وتذكرة العودة عند الاقتضاء.</li>
      <li><b>السرية/عدم المنافسة:</b> {{confidentiality}}</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سابعاً: القانون الحاكم وتسوية المنازعات</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد لأحكام <b>{{governingLaw}}</b> وكل شرط يخالف حقوق العامل المقررة قانوناً يقع باطلاً.</li>
      <li>تختص الجهات والمحاكم المختصة في <b>{{disputeCity}}</b> بنظر أي نزاع عمّالي ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع صاحب العمل</div><div class="sig-line"></div><div class="sig-name">{{employerName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع العامل</div><div class="sig-line"></div><div class="sig-name">{{employeeName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const EMPLOYMENT_AE_EN: ContractTemplate = {
  id: 5602,
  slug: "ae-employment-en",
  title: "Employment Agreement (UAE) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Dubai" },

    { key: "employerName", label: "Employer / Company Name", required: true, type: "text", group: "Parties" },
    { key: "employerReg", label: "Trade Licence / Establishment No.", required: false, type: "text", group: "Parties" },
    { key: "employerAddress", label: "Employer Address", required: false, type: "text", group: "Parties" },
    { key: "employeeName", label: "Employee Name", required: true, type: "text", group: "Parties" },
    { key: "employeeId", label: "Emirates ID / Passport No.", required: true, type: "text", group: "Parties" },
    { key: "employeeNationality", label: "Nationality", required: false, type: "text", group: "Parties" },
    { key: "employeeAddress", label: "Employee Address", required: false, type: "text", group: "Parties" },

    { key: "jobTitle", label: "Job Title", required: true, type: "text", group: "Role" },
    { key: "jobDescription", label: "Duties", required: true, type: "textarea", group: "Role" },
    { key: "workplace", label: "Workplace", required: false, type: "text", group: "Role" },
    { key: "workModel", label: "Work Model", required: false, type: "select", group: "Role",
      options: ["Full-time", "Part-time", "Temporary", "Flexible"] },

    { key: "salary", label: "Basic Salary", required: true, type: "number", group: "Pay" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Pay",
      options: currencyOptionsEn(AE.currencies) },
    { key: "allowances", label: "Allowances (housing/transport/etc.)", required: false, type: "text", group: "Pay" },
    { key: "paymentFrequency", label: "Pay Frequency", required: true, type: "select", group: "Pay",
      options: ["Monthly", "Weekly", "Bi-weekly"] },

    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "contractDuration", label: "Duration (fixed-term ≤ 3 years)", required: true, type: "text", group: "Term", placeholder: "e.g. 2 years, renewable" },
    { key: "probationPeriod", label: "Probation (max 6 months)", required: false, type: "text", group: "Term", placeholder: "e.g. 6 months" },

    { key: "workingHours", label: "Working Hours", required: true, type: "text", group: "Hours & Leave", placeholder: "e.g. 8 hrs/day, 48 hrs/week" },
    { key: "weeklyRest", label: "Weekly Rest", required: false, type: "text", group: "Hours & Leave" },
    { key: "annualLeave", label: "Annual Leave", required: false, type: "text", group: "Hours & Leave", placeholder: "e.g. 30 days after 1 year" },

    { key: "confidentiality", label: "Confidentiality / Non-compete (optional)", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: AE_LABOUR_EN },
    { key: "disputeCity", label: "Jurisdiction", required: false, type: "text", group: "Provisions", placeholder: AE.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Employment Agreement</div>
      <div class="muted">Governed by the UAE Labour Law (Federal Decree-Law No. 33 of 2021, in force 2 Feb 2022).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Employer:</b> {{employerName}} — Licence/Est.: {{employerReg}} — {{employerAddress}}</div>
    <div><b>Employee:</b> {{employeeName}} — ID/Passport: {{employeeId}} — Nationality: {{employeeNationality}} — {{employeeAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Role</h3><div class="box">
    <div><b>Job Title:</b> {{jobTitle}}</div>
    <div><b>Duties:</b> {{jobDescription}}</div>
    <div><b>Workplace:</b> {{workplace}} — <b>Work Model:</b> {{workModel}}</div>
  </div></div>

  <div class="sec"><h3>3. Pay</h3><div class="box">
    <div><b>Basic Salary:</b> {{salary}} {{currency}} — paid {{paymentFrequency}}</div>
    <div><b>Allowances:</b> {{allowances}}</div>
    <div class="muted">Wages are paid on time through the approved Wage Protection System (WPS).</div>
  </div></div>

  <div class="sec"><h3>4. Term & Probation</h3><div class="box">
    <div><b>Type:</b> Fixed-term — <b>Duration:</b> {{contractDuration}}</div>
    <div><b>Start Date:</b> {{startDate}} — <b>Probation:</b> {{probationPeriod}}</div>
    <div class="muted">All private-sector contracts are fixed-term (max 3 years, renewable). Probation may not exceed six months and cannot be extended; termination during probation requires at least 14 days' written notice (Decree-Law 33/2021).</div>
  </div></div>

  <div class="sec"><h3>5. Hours & Leave</h3><div class="box">
    <div><b>Working Hours:</b> {{workingHours}}</div>
    <div><b>Weekly Rest:</b> {{weeklyRest}}</div>
    <div><b>Annual Leave:</b> {{annualLeave}}</div>
    <div class="muted">Hours, rest and leave follow the Labour Law and its Executive Regulation as the minimum floor of the Employee's rights.</div>
  </div></div>

  <div class="sec"><h3>6. Termination & End-of-Service</h3><div class="box">
    <div class="muted">
      (a) Either party may terminate on written notice of 30–90 days, subject to lawful grounds; arbitrary dismissal is prohibited.<br/>
      (b) A non-national employee earns end-of-service gratuity for the service period under the law, plus other dues and a return ticket where applicable.<br/>
      (c) Confidentiality / non-compete: {{confidentiality}}
    </div>
  </div></div>

  <div class="sec"><h3>7. Governing Law & Disputes</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div class="muted">Any clause reducing the Employee's statutory rights is void.</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Employer Signature</b><br/><br/>Name: {{employerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Employee Signature</b><br/><br/>Name: {{employeeName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
