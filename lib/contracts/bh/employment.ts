// lib/contracts/bh/employment.ts
// عقد عمل وفق قانون العمل في القطاع الأهلي البحريني رقم 36 لسنة 2012.
// فترة التجربة لا تجاوز ثلاثة أشهر (وتُمدّد إلى ستة أشهر باتفاق كتابي)، والإنهاء أثناءها بإشعار يوم واحد على الأقل.
// وبعد التثبيت مهلة الإشعار لإنهاء العقد غير محدد المدة لا تقل عن 30 يوماً (المادة 99).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const BH = getJurisdiction("BH");
const BH_LABOUR_AR = "قانون العمل في القطاع الأهلي البحريني رقم 36 لسنة 2012";
const BH_LABOUR_EN = "Bahraini Private Sector Labour Law No. 36 of 2012";

export const EMPLOYMENT_BH_AR: ContractTemplate = {
  id: 19301,
  slug: "bh-employment-ar",
  title: "عقد عمل (البحرين) — عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "BH",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "المنامة" },

    { key: "employerName", label: "اسم صاحب العمل/المنشأة", required: true, type: "text", group: "الأطراف" },
    { key: "employerReg", label: "السجل التجاري/رقم المنشأة", required: false, type: "text", group: "الأطراف" },
    { key: "employerAddress", label: "عنوان صاحب العمل", required: false, type: "text", group: "الأطراف" },
    { key: "employeeName", label: "اسم العامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeId", label: "الرقم الشخصي/جواز السفر للعامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeNationality", label: "الجنسية", required: false, type: "text", group: "الأطراف" },
    { key: "employeeAddress", label: "عنوان العامل", required: false, type: "text", group: "الأطراف" },

    { key: "jobTitle", label: "المسمى الوظيفي", required: true, type: "text", group: "الوظيفة" },
    { key: "jobDescription", label: "وصف المهام", required: true, type: "textarea", group: "الوظيفة" },
    { key: "workplace", label: "مكان العمل", required: false, type: "text", group: "الوظيفة" },

    { key: "salary", label: "الأجر الأساسي", required: true, type: "number", group: "الأجر" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "الأجر",
      options: currencyOptionsAr(BH.currencies) },
    { key: "allowances", label: "بدلات/علاوات (إن وجدت)", required: false, type: "text", group: "الأجر" },
    { key: "paymentFrequency", label: "دورية صرف الأجر", required: true, type: "select", group: "الأجر",
      options: ["شهري", "أسبوعي", "نصف شهري"] },

    { key: "startDate", label: "تاريخ بدء العمل", required: true, type: "date", group: "المدة" },
    { key: "contractType", label: "نوع العقد", required: true, type: "select", group: "المدة",
      options: ["غير محدد المدة", "محدد المدة"] },
    { key: "contractDuration", label: "مدة العقد (إن كان محدد المدة)", required: false, type: "text", group: "المدة", placeholder: "مثال: سنة قابلة للتجديد" },
    { key: "probationPeriod", label: "فترة التجربة (بحد أقصى 3 أشهر، وتُمدّد إلى 6 باتفاق كتابي)", required: false, type: "text", group: "المدة", placeholder: "مثال: 3 أشهر" },

    { key: "workingHours", label: "ساعات العمل", required: true, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 8 ساعات يومياً / 48 ساعة أسبوعياً" },
    { key: "weeklyRest", label: "الراحة الأسبوعية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: الجمعة والسبت" },
    { key: "annualLeave", label: "الإجازة السنوية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 30 يوماً" },

    { key: "confidentiality", label: "بند السرية (اختياري)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الحاكم", required: false, type: "text", group: "أحكام", placeholder: BH_LABOUR_AR },
    { key: "disputeCity", label: "الاختصاص القضائي", required: false, type: "text", group: "أحكام", placeholder: BH.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد عمل</div>
    <div class="subtitle">مصاغ وفق قانون العمل في القطاع الأهلي البحريني رقم 36 لسنة 2012</div>
    <div class="meta">
      <div><b>رقم العقد:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>مكان الإبرام:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>الطرف الأول (صاحب العمل):</b> {{employerName}} — السجل التجاري/رقم المنشأة: {{employerReg}} — العنوان: {{employerAddress}}.</div>
    <div class="p"><b>الطرف الثاني (العامل):</b> {{employeeName}} — الرقم الشخصي/الجواز: {{employeeId}} — الجنسية: {{employeeNationality}} — العنوان: {{employeeAddress}}.</div>
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
    <div class="clause">يلتزم صاحب العمل بأداء الأجر عبر نظام حماية الأجور، وبتسجيل العامل البحريني لدى الهيئة العامة للتأمين الاجتماعي وفق النظام.</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: مدة العقد وفترة التجربة</div>
    <div class="p"><b>نوع العقد:</b> {{contractType}} — <b>مدة العقد:</b> {{contractDuration}}</div>
    <div class="p"><b>تاريخ بدء العمل:</b> {{startDate}} — <b>فترة التجربة:</b> {{probationPeriod}}</div>
    <div class="clause">لا تجاوز فترة التجربة ثلاثة أشهر، ويجوز مدّها إلى ستة أشهر بموافقة كتابية من الطرفين. ولأي منهما إنهاء العقد أثناءها بإشعار كتابي مسبق لا يقلّ عن يوم واحد ودون تعويض.</div>
  </div>

  <div class="box">
    <div class="h">خامساً: ساعات العمل والإجازات</div>
    <div class="p"><b>ساعات العمل:</b> {{workingHours}}</div>
    <div class="p"><b>الراحة الأسبوعية:</b> {{weeklyRest}}</div>
    <div class="p"><b>الإجازة السنوية:</b> {{annualLeave}}</div>
    <div class="clause">تُنظَّم ساعات العمل والراحات والإجازات (السنوية والمرضية والرسمية) وفق أحكام قانون العمل باعتبارها الحد الأدنى لحقوق العامل، ويقع باطلاً كل شرط ينتقص منها.</div>
  </div>

  <div class="box">
    <div class="h">سادساً: إنهاء العقد</div>
    <ol class="ol">
      <li>في العقد غير محدد المدة، لأي من الطرفين إنهاؤه بإشعار كتابي مسبق لا تقل مدته عن ثلاثين يوماً، ما لم يُتفق على مدة أطول، مع أداء أجر مدة الإشعار عند عدم مراعاته (المادة 99).</li>
      <li>يترتب على الفصل التعسفي التعويض المقرّر قانوناً، ويستحق العامل غير البحريني مكافأة نهاية الخدمة عن مدة خدمته وشهادة خبرة.</li>
      <li>في العقد محدد المدة ينتهي بانقضاء مدّته، ويترتب على الإنهاء المبكر غير المشروع التعويض وفق القانون.</li>
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
      <li>يخضع هذا العقد لأحكام <b>{{governingLaw}}</b>، وكل شرط فيه يخالف حقوق العامل المقررة قانوناً يقع باطلاً.</li>
      <li>تختص المحكمة المختصة في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن هذا العقد.</li>
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

export const EMPLOYMENT_BH_EN: ContractTemplate = {
  id: 19302,
  slug: "bh-employment-en",
  title: "Employment Agreement (Bahrain) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "BH",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Manama" },

    { key: "employerName", label: "Employer / Company Name", required: true, type: "text", group: "Parties" },
    { key: "employerReg", label: "Commercial Reg. / Establishment No.", required: false, type: "text", group: "Parties" },
    { key: "employerAddress", label: "Employer Address", required: false, type: "text", group: "Parties" },
    { key: "employeeName", label: "Employee Name", required: true, type: "text", group: "Parties" },
    { key: "employeeId", label: "Employee CPR / Passport", required: true, type: "text", group: "Parties" },
    { key: "employeeNationality", label: "Nationality", required: false, type: "text", group: "Parties" },
    { key: "employeeAddress", label: "Employee Address", required: false, type: "text", group: "Parties" },

    { key: "jobTitle", label: "Job Title", required: true, type: "text", group: "Role" },
    { key: "jobDescription", label: "Duties", required: true, type: "textarea", group: "Role" },
    { key: "workplace", label: "Workplace", required: false, type: "text", group: "Role" },

    { key: "salary", label: "Basic Salary", required: true, type: "number", group: "Pay" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Pay",
      options: currencyOptionsEn(BH.currencies) },
    { key: "allowances", label: "Allowances", required: false, type: "text", group: "Pay" },
    { key: "paymentFrequency", label: "Pay Frequency", required: true, type: "select", group: "Pay",
      options: ["Monthly", "Weekly", "Bi-weekly"] },

    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "contractType", label: "Contract Type", required: true, type: "select", group: "Term",
      options: ["Indefinite", "Fixed-term"] },
    { key: "contractDuration", label: "Duration (if fixed-term)", required: false, type: "text", group: "Term" },
    { key: "probationPeriod", label: "Probation (max 3 months, extendable to 6 by written agreement)", required: false, type: "text", group: "Term", placeholder: "e.g. 3 months" },

    { key: "workingHours", label: "Working Hours", required: true, type: "text", group: "Hours & Leave", placeholder: "e.g. 8 hrs/day, 48 hrs/week" },
    { key: "weeklyRest", label: "Weekly Rest", required: false, type: "text", group: "Hours & Leave" },
    { key: "annualLeave", label: "Annual Leave", required: false, type: "text", group: "Hours & Leave", placeholder: "e.g. 30 days" },

    { key: "confidentiality", label: "Confidentiality (optional)", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: BH_LABOUR_EN },
    { key: "disputeCity", label: "Jurisdiction", required: false, type: "text", group: "Provisions", placeholder: BH.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Employment Agreement</div>
      <div class="muted">Governed by the Bahraini Private Sector Labour Law No. 36 of 2012.</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Employer:</b> {{employerName}} — CR/Est. No.: {{employerReg}} — {{employerAddress}}</div>
    <div><b>Employee:</b> {{employeeName}} — CPR/Passport: {{employeeId}} — Nationality: {{employeeNationality}} — {{employeeAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Role</h3><div class="box">
    <div><b>Job Title:</b> {{jobTitle}}</div>
    <div><b>Duties:</b> {{jobDescription}}</div>
    <div><b>Workplace:</b> {{workplace}}</div>
  </div></div>

  <div class="sec"><h3>3. Pay</h3><div class="box">
    <div><b>Basic Salary:</b> {{salary}} {{currency}} — paid {{paymentFrequency}}</div>
    <div><b>Allowances:</b> {{allowances}}</div>
    <div class="muted">Wages are paid through the Wage Protection System; Bahraini employees are registered with the Social Insurance Organisation under the applicable law.</div>
  </div></div>

  <div class="sec"><h3>4. Term & Probation</h3><div class="box">
    <div><b>Type:</b> {{contractType}} — <b>Duration:</b> {{contractDuration}}</div>
    <div><b>Start Date:</b> {{startDate}} — <b>Probation:</b> {{probationPeriod}}</div>
    <div class="muted">Probation may not exceed three months and may be extended to six months by written agreement of both parties. During it either party may terminate on at least one day's prior written notice, without compensation.</div>
  </div></div>

  <div class="sec"><h3>5. Hours & Leave</h3><div class="box">
    <div><b>Working Hours:</b> {{workingHours}}</div>
    <div><b>Weekly Rest:</b> {{weeklyRest}}</div>
    <div><b>Annual Leave:</b> {{annualLeave}}</div>
    <div class="muted">Hours, rest and leave follow the Labour Law as the minimum floor of the Employee's rights; any term reducing them is void.</div>
  </div></div>

  <div class="sec"><h3>6. Termination</h3><div class="box">
    <div class="muted">
      (a) An indefinite contract may be ended by either party on prior written notice of not less than 30 days unless a longer period is agreed; a party who does not observe the notice pays the wage for its period (Art. 99).<br/>
      (b) Arbitrary dismissal gives rise to statutory compensation, and a non-Bahraini employee is entitled to an end-of-service leaving indemnity for the period of service and an experience certificate.<br/>
      (c) A fixed-term contract ends on expiry; unlawful early termination triggers statutory compensation.
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
