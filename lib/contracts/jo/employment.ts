// lib/contracts/jo/employment.ts
// عقد عمل وفق قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته.
// فترة التجربة لا تزيد على ثلاثة أشهر (المادة 35)، وإذا استمر العامل بعدها اعتُبر العقد
// غير محدد المدة، ويجوز لصاحب العمل إنهاء الخدمة خلالها دون إشعار أو مكافأة.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const JO = getJurisdiction("JO");
const JO_LABOUR_AR = "قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته";
const JO_LABOUR_EN = "Jordanian Labour Law No. 8 of 1996 (as amended)";

export const EMPLOYMENT_JO_AR: ContractTemplate = {
  id: 7601,
  slug: "jo-employment-ar",
  title: "عقد عمل (الأردن) — عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "JO",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "عمّان" },

    { key: "employerName", label: "اسم صاحب العمل/المنشأة", required: true, type: "text", group: "الأطراف" },
    { key: "employerReg", label: "الرقم الوطني للمنشأة/السجل التجاري", required: false, type: "text", group: "الأطراف" },
    { key: "employerAddress", label: "عنوان صاحب العمل", required: false, type: "text", group: "الأطراف" },
    { key: "employeeName", label: "اسم العامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeId", label: "الرقم الوطني/جواز السفر للعامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeNationality", label: "الجنسية", required: false, type: "text", group: "الأطراف" },
    { key: "employeeAddress", label: "عنوان العامل", required: false, type: "text", group: "الأطراف" },

    { key: "jobTitle", label: "المسمى الوظيفي", required: true, type: "text", group: "الوظيفة" },
    { key: "jobDescription", label: "وصف المهام", required: true, type: "textarea", group: "الوظيفة" },
    { key: "workplace", label: "مكان العمل", required: false, type: "text", group: "الوظيفة" },

    { key: "salary", label: "الأجر الأساسي", required: true, type: "number", group: "الأجر" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "الأجر",
      options: currencyOptionsAr(JO.currencies) },
    { key: "allowances", label: "بدلات/علاوات (إن وجدت)", required: false, type: "text", group: "الأجر" },
    { key: "paymentFrequency", label: "دورية صرف الأجر", required: true, type: "select", group: "الأجر",
      options: ["شهري", "أسبوعي", "نصف شهري"] },

    { key: "startDate", label: "تاريخ بدء العمل", required: true, type: "date", group: "المدة" },
    { key: "contractType", label: "نوع العقد", required: true, type: "select", group: "المدة",
      options: ["غير محدد المدة", "محدد المدة"] },
    { key: "contractDuration", label: "مدة العقد (إن كان محدد المدة)", required: false, type: "text", group: "المدة", placeholder: "مثال: سنة قابلة للتجديد" },
    { key: "probationPeriod", label: "فترة التجربة (بحد أقصى 3 أشهر)", required: false, type: "text", group: "المدة", placeholder: "مثال: 3 أشهر" },

    { key: "workingHours", label: "ساعات العمل", required: true, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 8 ساعات يومياً / 48 ساعة أسبوعياً" },
    { key: "weeklyRest", label: "الراحة الأسبوعية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: الجمعة" },
    { key: "annualLeave", label: "الإجازة السنوية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 14 يوماً" },

    { key: "confidentiality", label: "بند السرية (اختياري)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الحاكم", required: false, type: "text", group: "أحكام", placeholder: JO_LABOUR_AR },
    { key: "disputeCity", label: "الاختصاص القضائي", required: false, type: "text", group: "أحكام", placeholder: JO.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد عمل</div>
    <div class="subtitle">مصاغ وفق قانون العمل الأردني رقم 8 لسنة 1996 وتعديلاته</div>
    <div class="meta">
      <div><b>رقم العقد:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>مكان الإبرام:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>الطرف الأول (صاحب العمل):</b> {{employerName}} — الرقم الوطني/السجل: {{employerReg}} — العنوان: {{employerAddress}}.</div>
    <div class="p"><b>الطرف الثاني (العامل):</b> {{employeeName}} — الرقم الوطني/الجواز: {{employeeId}} — الجنسية: {{employeeNationality}} — العنوان: {{employeeAddress}}.</div>
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
    <div class="p"><b>البدلات/العلاوات:</b> {{allowances}}</div>
    <div class="clause">يلتزم صاحب العمل بأداء الأجر في موعده وبما لا يقل عن الحد الأدنى للأجور المقرَّر، وبشمول العامل بالضمان الاجتماعي وفق قانون الضمان الاجتماعي الأردني.</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: مدة العقد وفترة التجربة</div>
    <div class="p"><b>نوع العقد:</b> {{contractType}} — <b>مدة العقد:</b> {{contractDuration}}</div>
    <div class="p"><b>تاريخ بدء العمل:</b> {{startDate}} — <b>فترة التجربة:</b> {{probationPeriod}}</div>
    <div class="clause">لا تزيد فترة التجربة على ثلاثة أشهر، ولصاحب العمل إنهاء الخدمة خلالها دون إشعار أو مكافأة. وإذا استمر العامل في عمله بعد انتهائها اعتُبر العقد غير محدد المدة وحُسبت مدة التجربة ضمن خدمته (المادة 35 من قانون العمل).</div>
  </div>

  <div class="box">
    <div class="h">خامساً: ساعات العمل والإجازات</div>
    <div class="p"><b>ساعات العمل:</b> {{workingHours}}</div>
    <div class="p"><b>الراحة الأسبوعية:</b> {{weeklyRest}}</div>
    <div class="p"><b>الإجازة السنوية:</b> {{annualLeave}}</div>
    <div class="clause">تُنظَّم ساعات العمل والراحات والإجازات (السنوية والمرضية والرسمية) وفق أحكام قانون العمل الأردني باعتبارها الحد الأدنى لحقوق العامل.</div>
  </div>

  <div class="box">
    <div class="h">سادساً: إنهاء العقد</div>
    <ol class="ol">
      <li>في العقد غير محدد المدة، لكل طرف إنهاؤه بإشعار خطي مسبق لا تقل مدته عن شهر، مع حظر الفصل التعسفي وترتّب التعويض عليه.</li>
      <li>في العقد محدد المدة، ينتهي بانقضاء مدّته، ويترتب على الإنهاء المبكر غير المشروع التعويض وفق القانون.</li>
      <li>يستحق العامل حقوقه المقررة عند انتهاء الخدمة (مكافأة نهاية الخدمة أو حقوق الضمان الاجتماعي) وشهادة خبرة.</li>
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
      <li>يخضع هذا العقد لأحكام <b>{{governingLaw}}</b> وكل شرط فيه يخالف حقوق العامل المقررة قانوناً يقع باطلاً.</li>
      <li>تختص المحاكم في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن هذا العقد.</li>
      <li>حُرِّر العقد من نسختين بيد كل طرف نسخة.</li>
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

export const EMPLOYMENT_JO_EN: ContractTemplate = {
  id: 7602,
  slug: "jo-employment-en",
  title: "Employment Agreement (Jordan) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "JO",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Amman" },

    { key: "employerName", label: "Employer / Company Name", required: true, type: "text", group: "Parties" },
    { key: "employerReg", label: "Company National No. / Commercial Reg.", required: false, type: "text", group: "Parties" },
    { key: "employerAddress", label: "Employer Address", required: false, type: "text", group: "Parties" },
    { key: "employeeName", label: "Employee Name", required: true, type: "text", group: "Parties" },
    { key: "employeeId", label: "Employee National ID / Passport", required: true, type: "text", group: "Parties" },
    { key: "employeeNationality", label: "Nationality", required: false, type: "text", group: "Parties" },
    { key: "employeeAddress", label: "Employee Address", required: false, type: "text", group: "Parties" },

    { key: "jobTitle", label: "Job Title", required: true, type: "text", group: "Role" },
    { key: "jobDescription", label: "Duties", required: true, type: "textarea", group: "Role" },
    { key: "workplace", label: "Workplace", required: false, type: "text", group: "Role" },

    { key: "salary", label: "Basic Salary", required: true, type: "number", group: "Pay" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Pay",
      options: currencyOptionsEn(JO.currencies) },
    { key: "allowances", label: "Allowances", required: false, type: "text", group: "Pay" },
    { key: "paymentFrequency", label: "Pay Frequency", required: true, type: "select", group: "Pay",
      options: ["Monthly", "Weekly", "Bi-weekly"] },

    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "contractType", label: "Contract Type", required: true, type: "select", group: "Term",
      options: ["Indefinite", "Fixed-term"] },
    { key: "contractDuration", label: "Duration (if fixed-term)", required: false, type: "text", group: "Term" },
    { key: "probationPeriod", label: "Probation (max 3 months)", required: false, type: "text", group: "Term", placeholder: "e.g. 3 months" },

    { key: "workingHours", label: "Working Hours", required: true, type: "text", group: "Hours & Leave", placeholder: "e.g. 8 hrs/day, 48 hrs/week" },
    { key: "weeklyRest", label: "Weekly Rest", required: false, type: "text", group: "Hours & Leave" },
    { key: "annualLeave", label: "Annual Leave", required: false, type: "text", group: "Hours & Leave", placeholder: "e.g. 14 days" },

    { key: "confidentiality", label: "Confidentiality (optional)", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: JO_LABOUR_EN },
    { key: "disputeCity", label: "Jurisdiction", required: false, type: "text", group: "Provisions", placeholder: JO.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Employment Agreement</div>
      <div class="muted">Governed by the Jordanian Labour Law No. 8 of 1996 (as amended).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Employer:</b> {{employerName}} — Reg.: {{employerReg}} — {{employerAddress}}</div>
    <div><b>Employee:</b> {{employeeName}} — ID/Passport: {{employeeId}} — Nationality: {{employeeNationality}} — {{employeeAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Role</h3><div class="box">
    <div><b>Job Title:</b> {{jobTitle}}</div>
    <div><b>Duties:</b> {{jobDescription}}</div>
    <div><b>Workplace:</b> {{workplace}}</div>
  </div></div>

  <div class="sec"><h3>3. Pay</h3><div class="box">
    <div><b>Basic Salary:</b> {{salary}} {{currency}} — paid {{paymentFrequency}}</div>
    <div><b>Allowances:</b> {{allowances}}</div>
    <div class="muted">Wages are paid on time, no less than the statutory minimum wage, and the Employee is enrolled in social security under the Jordanian Social Security Law.</div>
  </div></div>

  <div class="sec"><h3>4. Term & Probation</h3><div class="box">
    <div><b>Type:</b> {{contractType}} — <b>Duration:</b> {{contractDuration}}</div>
    <div><b>Start Date:</b> {{startDate}} — <b>Probation:</b> {{probationPeriod}}</div>
    <div class="muted">Probation may not exceed three months; during it the employer may end service without notice or gratuity. If the Employee continues thereafter, the contract becomes indefinite and probation counts toward service (Art. 35, Labour Law).</div>
  </div></div>

  <div class="sec"><h3>5. Hours & Leave</h3><div class="box">
    <div><b>Working Hours:</b> {{workingHours}}</div>
    <div><b>Weekly Rest:</b> {{weeklyRest}}</div>
    <div><b>Annual Leave:</b> {{annualLeave}}</div>
    <div class="muted">Hours, rest and leave follow the Jordanian Labour Law as the minimum floor of the Employee's rights.</div>
  </div></div>

  <div class="sec"><h3>6. Termination</h3><div class="box">
    <div class="muted">
      (a) An indefinite contract may be ended by either party on written notice of not less than one month; arbitrary dismissal is prohibited and gives rise to compensation.<br/>
      (b) A fixed-term contract ends on expiry; unlawful early termination triggers statutory compensation.<br/>
      (c) On separation the Employee is entitled to statutory end-of-service entitlements (or social-security rights) and an experience certificate.
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
