// lib/contracts/eg/employment.ts
// عقد عمل وفق قانون العمل المصري رقم 14 لسنة 2025 (النافذ اعتباراً من 1 سبتمبر 2025،
// والذي حلّ محلّ القانون رقم 12 لسنة 2003). فترة الاختبار لا تزيد على ثلاثة أشهر
// ولا يجوز وضع العامل تحت الاختبار أكثر من مرة لدى صاحب عمل واحد.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";

const EG = getJurisdiction("EG");
const EG_LABOUR_AR = "قانون العمل المصري رقم 14 لسنة 2025";
const EG_LABOUR_EN = "Egyptian Labour Law No. 14 of 2025";

export const EMPLOYMENT_EG_AR: ContractTemplate = {
  id: 3601,
  slug: "eg-employment-ar",
  title: "عقد عمل (مصر) — عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    { key: "employerName", label: "اسم صاحب العمل/المنشأة", required: true, type: "text", group: "الأطراف" },
    { key: "employerReg", label: "السجل التجاري/البطاقة الضريبية", required: false, type: "text", group: "الأطراف" },
    { key: "employerAddress", label: "عنوان صاحب العمل", required: false, type: "text", group: "الأطراف" },
    { key: "employeeName", label: "اسم العامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeId", label: "الرقم القومي للعامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeInsurance", label: "الرقم التأميني (إن وجد)", required: false, type: "text", group: "الأطراف" },
    { key: "employeeAddress", label: "عنوان العامل", required: false, type: "text", group: "الأطراف" },

    { key: "jobTitle", label: "المسمى الوظيفي", required: true, type: "text", group: "الوظيفة" },
    { key: "jobDescription", label: "وصف المهام", required: true, type: "textarea", group: "الوظيفة" },
    { key: "workplace", label: "مكان العمل", required: false, type: "text", group: "الوظيفة" },

    { key: "salary", label: "الأجر الأساسي", required: true, type: "number", group: "الأجر" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "الأجر",
      options: currencyOptionsAr(EG.currencies) },
    { key: "allowances", label: "بدلات/حوافز (إن وجدت)", required: false, type: "text", group: "الأجر" },
    { key: "paymentFrequency", label: "دورية صرف الأجر", required: true, type: "select", group: "الأجر",
      options: ["شهري", "أسبوعي", "نصف شهري"] },

    { key: "startDate", label: "تاريخ بدء العمل", required: true, type: "date", group: "المدة" },
    { key: "contractType", label: "نوع العقد", required: true, type: "select", group: "المدة",
      options: ["غير محدد المدة", "محدد المدة"] },
    { key: "contractDuration", label: "مدة العقد (إن كان محدد المدة)", required: false, type: "text", group: "المدة", placeholder: "مثال: سنة واحدة قابلة للتجديد" },
    { key: "probationPeriod", label: "فترة الاختبار (بحد أقصى 3 أشهر)", required: false, type: "text", group: "المدة", placeholder: "مثال: 3 أشهر" },

    { key: "workingHours", label: "ساعات العمل", required: true, type: "text", group: "ساعات العمل ونظامه", placeholder: "مثال: 8 ساعات يومياً بحد أقصى 48 ساعة أسبوعياً" },
    { key: "weeklyRest", label: "الراحة الأسبوعية", required: false, type: "text", group: "ساعات العمل ونظامه", placeholder: "مثال: الجمعة" },
    { key: "annualLeave", label: "الإجازة السنوية", required: false, type: "text", group: "ساعات العمل ونظامه", placeholder: "مثال: 21 يوماً" },

    { key: "confidentiality", label: "بند السرية (اختياري)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الحاكم", required: false, type: "text", group: "أحكام", placeholder: EG_LABOUR_AR },
    { key: "disputeCity", label: "الاختصاص القضائي (محكمة عمالية)", required: false, type: "text", group: "أحكام", placeholder: EG.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد عمل</div>
    <div class="subtitle">مصاغ وفق قانون العمل المصري رقم 14 لسنة 2025</div>
    <div class="meta">
      <div><b>رقم العقد:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>مكان الإبرام:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>الطرف الأول (صاحب العمل):</b> {{employerName}} — السجل/البطاقة الضريبية: {{employerReg}} — العنوان: {{employerAddress}}.</div>
    <div class="p"><b>الطرف الثاني (العامل):</b> {{employeeName}} — الرقم القومي: {{employeeId}} — الرقم التأميني: {{employeeInsurance}} — العنوان: {{employeeAddress}}.</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: طبيعة العمل ومكانه</div>
    <div class="p"><b>المسمى الوظيفي:</b> {{jobTitle}}</div>
    <div class="p"><b>وصف المهام:</b> {{jobDescription}}</div>
    <div class="p"><b>مكان العمل:</b> {{workplace}}</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الأجر</div>
    <div class="p"><b>الأجر الأساسي:</b> {{salary}} {{currency}} — يُصرف بشكل {{paymentFrequency}}.</div>
    <div class="p"><b>البدلات/الحوافز:</b> {{allowances}}</div>
    <div class="clause">
      يلتزم صاحب العمل بأداء الأجر في موعده وبما لا يقل عن الحد الأدنى للأجور المقرَّر قانوناً، وبإخضاع العامل لنظام التأمينات الاجتماعية طبقاً للقانون.
    </div>
  </div>

  <div class="box">
    <div class="h">رابعاً: مدة العقد وفترة الاختبار</div>
    <div class="p"><b>نوع العقد:</b> {{contractType}}</div>
    <div class="p"><b>مدة العقد:</b> {{contractDuration}}</div>
    <div class="p"><b>تاريخ بدء العمل:</b> {{startDate}}</div>
    <div class="p"><b>فترة الاختبار:</b> {{probationPeriod}}</div>
    <div class="clause">
      لا تزيد فترة الاختبار على ثلاثة أشهر، ولا يجوز وضع العامل تحت الاختبار أكثر من مرة واحدة لدى صاحب العمل ذاته (قانون العمل رقم 14 لسنة 2025).
    </div>
  </div>

  <div class="box">
    <div class="h">خامساً: ساعات العمل والإجازات</div>
    <div class="p"><b>ساعات العمل:</b> {{workingHours}}</div>
    <div class="p"><b>الراحة الأسبوعية:</b> {{weeklyRest}}</div>
    <div class="p"><b>الإجازة السنوية:</b> {{annualLeave}}</div>
    <div class="clause">
      تُنظَّم ساعات العمل والراحات والإجازات (السنوية والمرضية والرسمية) وفق أحكام قانون العمل المصري رقم 14 لسنة 2025 ولوائحه التنفيذية باعتبارها الحد الأدنى لحقوق العامل.
    </div>
  </div>

  <div class="box">
    <div class="h">سادساً: إنهاء العقد</div>
    <ol class="ol">
      <li>في العقد غير محدد المدة، لكل طرف إنهاؤه بإخطار كتابي مسبق وفق المدد المقررة قانوناً، مع حظر الفصل التعسفي.</li>
      <li>في العقد محدد المدة، ينتهي بانقضاء مدّته، ويترتب على الإنهاء المبكر غير المبرَّر التعويض وفق القانون.</li>
      <li>يستحق العامل مستحقاته وشهادة خبرة عند انتهاء الخدمة طبقاً للقانون.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سابعاً: أحكام إضافية</div>
    <div class="p"><b>السرية:</b> {{confidentiality}}</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">ثامناً: القانون الحاكم وتسوية المنازعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد لأحكام <b>{{governingLaw}}</b> وكل حكم فيه يخالف حقوق العامل المقررة قانوناً يقع باطلاً.</li>
      <li>تختص المحاكم العمالية في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن هذا العقد.</li>
      <li>حُرِّر العقد من ثلاث نسخ: نسخة لكل طرف وثالثة لمكتب التأمينات الاجتماعية المختص.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig">
      <div class="sig-h">توقيع صاحب العمل</div>
      <div class="sig-line"></div>
      <div class="sig-name">{{employerName}}</div>
    </div>
    <div class="sig">
      <div class="sig-h">توقيع العامل</div>
      <div class="sig-line"></div>
      <div class="sig-name">{{employeeName}}</div>
    </div>
  </div>

  <style>
    .rtl{direction:rtl;text-align:right}
    .doc{font-family:"Noto Naskh Arabic","Amiri",Arial,sans-serif;font-size:16px;line-height:1.9;color:#111;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
    .header{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:12px}
    .title{font-size:20px;font-weight:800;margin-bottom:2px}
    .subtitle{font-size:12px;color:#444;margin-bottom:10px}
    .meta{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#222}
    .box{border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin:10px 0}
    .h{font-size:15px;font-weight:800;margin-bottom:10px}
    .p{margin:6px 0}
    .clause{margin-top:8px;padding:10px;border-radius:12px;background:#fafafa;border:1px dashed #e5e7eb}
    .ol{margin:0;padding-right:18px}
    .ol li{margin:6px 0}
    .signs{display:flex;gap:12px;margin-top:14px}
    .sig{flex:1;border:1px solid #e5e7eb;border-radius:14px;padding:12px}
    .sig-h{font-weight:800;margin-bottom:10px}
    .sig-line{height:26px;border-bottom:1px solid #111}
    .sig-name{margin-top:8px;font-size:12px;color:#333}
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>
</div>
  `.trim(),
};

export const EMPLOYMENT_EG_EN: ContractTemplate = {
  id: 3602,
  slug: "eg-employment-en",
  title: "Employment Agreement (Egypt) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

    { key: "employerName", label: "Employer / Company Name", required: true, type: "text", group: "Parties" },
    { key: "employerReg", label: "Commercial Reg. / Tax ID", required: false, type: "text", group: "Parties" },
    { key: "employerAddress", label: "Employer Address", required: false, type: "text", group: "Parties" },
    { key: "employeeName", label: "Employee Name", required: true, type: "text", group: "Parties" },
    { key: "employeeId", label: "Employee National ID", required: true, type: "text", group: "Parties" },
    { key: "employeeAddress", label: "Employee Address", required: false, type: "text", group: "Parties" },

    { key: "jobTitle", label: "Job Title", required: true, type: "text", group: "Role" },
    { key: "jobDescription", label: "Duties", required: true, type: "textarea", group: "Role" },
    { key: "workplace", label: "Workplace", required: false, type: "text", group: "Role" },

    { key: "salary", label: "Basic Salary", required: true, type: "number", group: "Pay" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Pay",
      options: currencyOptionsEn(EG.currencies) },
    { key: "allowances", label: "Allowances / Incentives", required: false, type: "text", group: "Pay" },
    { key: "paymentFrequency", label: "Pay Frequency", required: true, type: "select", group: "Pay",
      options: ["Monthly", "Weekly", "Bi-weekly"] },

    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "contractType", label: "Contract Type", required: true, type: "select", group: "Term",
      options: ["Indefinite", "Fixed-term"] },
    { key: "contractDuration", label: "Duration (if fixed-term)", required: false, type: "text", group: "Term" },
    { key: "probationPeriod", label: "Probation (max 3 months)", required: false, type: "text", group: "Term", placeholder: "e.g. 3 months" },

    { key: "workingHours", label: "Working Hours", required: true, type: "text", group: "Hours & Leave", placeholder: "e.g. 8 hrs/day, max 48 hrs/week" },
    { key: "weeklyRest", label: "Weekly Rest", required: false, type: "text", group: "Hours & Leave" },
    { key: "annualLeave", label: "Annual Leave", required: false, type: "text", group: "Hours & Leave", placeholder: "e.g. 21 days" },

    { key: "confidentiality", label: "Confidentiality (optional)", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: EG_LABOUR_EN },
    { key: "disputeCity", label: "Jurisdiction (Labour Court)", required: false, type: "text", group: "Provisions", placeholder: EG.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  <style>
    .doc{font-family:Arial,sans-serif;line-height:1.8;font-size:16px;color:#111;background:#fff}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:1px solid #ddd;padding-bottom:10px;margin-bottom:14px}
    .title{font-size:18px;font-weight:700}
    .meta{font-size:12px;color:#444}
    .box{border:1px solid #e5e5e5;border-radius:12px;padding:12px;margin:10px 0}
    .sec{margin:14px 0}
    .sec h3{margin:0 0 6px;font-size:14px}
    .muted{color:#555;font-size:12px}
    .sig{display:flex;gap:18px;margin-top:18px}
    .sig .sbox{flex:1;border:1px dashed #bbb;border-radius:12px;padding:12px;min-height:110px}
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>

  <div class="hdr">
    <div>
      <div class="title">Employment Agreement</div>
      <div class="muted">Governed by the Egyptian Labour Law No. 14 of 2025 (in force from 1 Sept 2025).</div>
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
      <div><b>Employer:</b> {{employerName}} — Reg./Tax ID: {{employerReg}} — Address: {{employerAddress}}</div>
      <div><b>Employee:</b> {{employeeName}} — National ID: {{employeeId}} — Address: {{employeeAddress}}</div>
    </div>
  </div>

  <div class="sec">
    <h3>2. Role</h3>
    <div class="box">
      <div><b>Job Title:</b> {{jobTitle}}</div>
      <div><b>Duties:</b> {{jobDescription}}</div>
      <div><b>Workplace:</b> {{workplace}}</div>
    </div>
  </div>

  <div class="sec">
    <h3>3. Pay</h3>
    <div class="box">
      <div><b>Basic Salary:</b> {{salary}} {{currency}} — paid {{paymentFrequency}}</div>
      <div><b>Allowances/Incentives:</b> {{allowances}}</div>
      <div class="muted">Employer pays wages on time, no less than the statutory minimum wage, and enrols the Employee in social insurance per law.</div>
    </div>
  </div>

  <div class="sec">
    <h3>4. Term & Probation</h3>
    <div class="box">
      <div><b>Type:</b> {{contractType}} &nbsp; <b>Duration:</b> {{contractDuration}}</div>
      <div><b>Start Date:</b> {{startDate}} &nbsp; <b>Probation:</b> {{probationPeriod}}</div>
      <div class="muted">Probation may not exceed three months, and an employee may be placed on probation only once with the same employer (Law No. 14 of 2025).</div>
    </div>
  </div>

  <div class="sec">
    <h3>5. Hours & Leave</h3>
    <div class="box">
      <div><b>Working Hours:</b> {{workingHours}}</div>
      <div><b>Weekly Rest:</b> {{weeklyRest}}</div>
      <div><b>Annual Leave:</b> {{annualLeave}}</div>
      <div class="muted">Hours, rest and leave follow the Egyptian Labour Law No. 14 of 2025 as the minimum floor of the Employee's rights.</div>
    </div>
  </div>

  <div class="sec">
    <h3>6. Termination</h3>
    <div class="box">
      <div class="muted">
        (a) Indefinite contracts may be ended by either Party with statutory written notice; arbitrary dismissal is prohibited.<br/>
        (b) Fixed-term contracts end on expiry; unjustified early termination triggers statutory compensation.<br/>
        (c) On separation the Employee receives all dues and an experience certificate per law.
      </div>
    </div>
  </div>

  <div class="sec">
    <h3>7. Governing Law & Disputes</h3>
    <div class="box">
      <div><b>Governing Law:</b> {{governingLaw}}</div>
      <div><b>Jurisdiction:</b> {{disputeCity}}</div>
      <div class="muted">Any clause reducing the Employee's statutory rights is void. Executed in three originals (each Party and the competent social-insurance office).</div>
    </div>
  </div>

  <div class="sig">
    <div class="sbox"><b>Employer Signature</b><br/><br/>Name: {{employerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Employee Signature</b><br/><br/>Name: {{employeeName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
