// lib/contracts/sa/employment.ts
// عقد عمل وفق نظام العمل السعودي (المرسوم الملكي م/51 لسنة 1426هـ) وتعديلاته بالمرسوم الملكي
// م/44 لسنة 1445هـ النافذ في 19 فبراير 2025م. فترة التجربة بحد أقصى 180 يوماً، ومهلة الإشعار
// لإنهاء العقد غير محدد المدة لا تقل عن 60 يوماً (30 يوماً للعقد محدد المدة).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const SA = getJurisdiction("SA");
const SA_LABOUR_AR = "نظام العمل السعودي (م/51 لسنة 1426هـ) وتعديلاته (م/44 لسنة 1445هـ)";
const SA_LABOUR_EN = "Saudi Labor Law (Royal Decree M/51 of 1426H), as amended (M/44 of 1445H)";

export const EMPLOYMENT_SA_AR: ContractTemplate = {
  id: 11301,
  slug: "sa-employment-ar",
  title: "عقد عمل (السعودية) — عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "SA",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "الرياض" },

    { key: "employerName", label: "اسم صاحب العمل/المنشأة", required: true, type: "text", group: "الأطراف" },
    { key: "employerReg", label: "السجل التجاري/رقم المنشأة", required: false, type: "text", group: "الأطراف" },
    { key: "employerAddress", label: "عنوان صاحب العمل", required: false, type: "text", group: "الأطراف" },
    { key: "employeeName", label: "اسم العامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeId", label: "رقم الهوية/الإقامة للعامل", required: true, type: "text", group: "الأطراف" },
    { key: "employeeNationality", label: "الجنسية", required: false, type: "text", group: "الأطراف" },
    { key: "employeeAddress", label: "عنوان العامل", required: false, type: "text", group: "الأطراف" },

    { key: "jobTitle", label: "المسمى الوظيفي", required: true, type: "text", group: "الوظيفة" },
    { key: "jobDescription", label: "وصف المهام", required: true, type: "textarea", group: "الوظيفة" },
    { key: "workplace", label: "مكان العمل", required: false, type: "text", group: "الوظيفة" },

    { key: "salary", label: "الأجر الأساسي", required: true, type: "number", group: "الأجر" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "الأجر",
      options: currencyOptionsAr(SA.currencies) },
    { key: "allowances", label: "بدلات/علاوات (إن وجدت)", required: false, type: "text", group: "الأجر" },
    { key: "paymentFrequency", label: "دورية صرف الأجر", required: true, type: "select", group: "الأجر",
      options: ["شهري", "أسبوعي", "نصف شهري"] },

    { key: "startDate", label: "تاريخ بدء العمل", required: true, type: "date", group: "المدة" },
    { key: "contractType", label: "نوع العقد", required: true, type: "select", group: "المدة",
      options: ["محدد المدة", "غير محدد المدة"] },
    { key: "contractDuration", label: "مدة العقد (إن كان محدد المدة)", required: false, type: "text", group: "المدة", placeholder: "مثال: سنة قابلة للتجديد" },
    { key: "probationPeriod", label: "فترة التجربة (بحد أقصى 180 يوماً)", required: false, type: "text", group: "المدة", placeholder: "مثال: 90 يوماً" },

    { key: "workingHours", label: "ساعات العمل", required: true, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 8 ساعات يومياً / 48 ساعة أسبوعياً" },
    { key: "weeklyRest", label: "الراحة الأسبوعية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: الجمعة" },
    { key: "annualLeave", label: "الإجازة السنوية", required: false, type: "text", group: "ساعات العمل والإجازات", placeholder: "مثال: 21 يوماً (30 يوماً بعد 5 سنوات)" },

    { key: "confidentiality", label: "بند السرية/عدم المنافسة (اختياري)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "النظام الحاكم", required: false, type: "text", group: "أحكام", placeholder: SA_LABOUR_AR },
    { key: "disputeCity", label: "الاختصاص القضائي", required: false, type: "text", group: "أحكام", placeholder: SA.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد عمل</div>
    <div class="subtitle">مصاغ وفق نظام العمل السعودي (م/51 لسنة 1426هـ) وتعديلاته النافذة في 19 فبراير 2025م</div>
    <div class="meta">
      <div><b>رقم العقد:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>مكان الإبرام:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>الطرف الأول (صاحب العمل):</b> {{employerName}} — السجل التجاري/رقم المنشأة: {{employerReg}} — العنوان: {{employerAddress}}.</div>
    <div class="p"><b>الطرف الثاني (العامل):</b> {{employeeName}} — الهوية/الإقامة: {{employeeId}} — الجنسية: {{employeeNationality}} — العنوان: {{employeeAddress}}.</div>
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
    <div class="clause">يلتزم صاحب العمل بأداء الأجر بالعملة الرسمية وعبر نظام حماية الأجور، وبتسجيل العامل لدى المؤسسة العامة للتأمينات الاجتماعية (GOSI) وفق النظام.</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: مدة العقد وفترة التجربة</div>
    <div class="p"><b>نوع العقد:</b> {{contractType}} — <b>مدة العقد:</b> {{contractDuration}}</div>
    <div class="p"><b>تاريخ بدء العمل:</b> {{startDate}} — <b>فترة التجربة:</b> {{probationPeriod}}</div>
    <div class="clause">يجوز الاتفاق على فترة تجربة تُحدَّد صراحةً في العقد بما لا يتجاوز مئة وثمانين يوماً، ولأيٍّ من الطرفين إنهاء العقد خلالها. ولا تُحتسب ضمن فترة التجربة إجازة عيدي الفطر والأضحى والإجازة المرضية.</div>
  </div>

  <div class="box">
    <div class="h">خامساً: ساعات العمل والإجازات</div>
    <div class="p"><b>ساعات العمل:</b> {{workingHours}}</div>
    <div class="p"><b>الراحة الأسبوعية:</b> {{weeklyRest}}</div>
    <div class="p"><b>الإجازة السنوية:</b> {{annualLeave}}</div>
    <div class="clause">تُنظَّم ساعات العمل والراحات والإجازات (السنوية والمرضية والرسمية) وفق أحكام نظام العمل باعتبارها الحد الأدنى لحقوق العامل، ولا يجوز الاتفاق على ما ينتقص منها.</div>
  </div>

  <div class="box">
    <div class="h">سادساً: إنهاء العقد</div>
    <ol class="ol">
      <li>في العقد غير محدد المدة، لأيٍّ من الطرفين إنهاؤه بإشعار كتابي مسبب مدته لا تقل عن ستين يوماً، مع حظر الإنهاء لسبب غير مشروع وترتّب التعويض عليه.</li>
      <li>في العقد محدد المدة ينتهي بانقضاء مدّته، ومن أراد إنهاءه مبكراً بإرادته المنفردة التزم بإشعار مدته ثلاثون يوماً على الأقل ما لم يُتفق على مدة أطول، مع التعويض عن الإنهاء غير المشروع.</li>
      <li>يستحق العامل مكافأة نهاية الخدمة عن مدة خدمته وشهادة خبرة، وفق نظام العمل.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سابعاً: أحكام إضافية</div>
    <div class="p"><b>السرية/عدم المنافسة:</b> {{confidentiality}}</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">ثامناً: النظام الحاكم وتسوية المنازعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد لأحكام <b>{{governingLaw}}</b>، وكل شرط فيه يخالف حقوق العامل المقررة نظاماً يقع باطلاً.</li>
      <li>تختص المحاكم العمالية في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن هذا العقد.</li>
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

export const EMPLOYMENT_SA_EN: ContractTemplate = {
  id: 11302,
  slug: "sa-employment-en",
  title: "Employment Agreement (Saudi Arabia) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "SA",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Riyadh" },

    { key: "employerName", label: "Employer / Company Name", required: true, type: "text", group: "Parties" },
    { key: "employerReg", label: "Commercial Reg. / Establishment No.", required: false, type: "text", group: "Parties" },
    { key: "employerAddress", label: "Employer Address", required: false, type: "text", group: "Parties" },
    { key: "employeeName", label: "Employee Name", required: true, type: "text", group: "Parties" },
    { key: "employeeId", label: "Employee National ID / Iqama", required: true, type: "text", group: "Parties" },
    { key: "employeeNationality", label: "Nationality", required: false, type: "text", group: "Parties" },
    { key: "employeeAddress", label: "Employee Address", required: false, type: "text", group: "Parties" },

    { key: "jobTitle", label: "Job Title", required: true, type: "text", group: "Role" },
    { key: "jobDescription", label: "Duties", required: true, type: "textarea", group: "Role" },
    { key: "workplace", label: "Workplace", required: false, type: "text", group: "Role" },

    { key: "salary", label: "Basic Salary", required: true, type: "number", group: "Pay" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Pay",
      options: currencyOptionsEn(SA.currencies) },
    { key: "allowances", label: "Allowances", required: false, type: "text", group: "Pay" },
    { key: "paymentFrequency", label: "Pay Frequency", required: true, type: "select", group: "Pay",
      options: ["Monthly", "Weekly", "Bi-weekly"] },

    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "contractType", label: "Contract Type", required: true, type: "select", group: "Term",
      options: ["Fixed-term", "Indefinite"] },
    { key: "contractDuration", label: "Duration (if fixed-term)", required: false, type: "text", group: "Term" },
    { key: "probationPeriod", label: "Probation (max 180 days)", required: false, type: "text", group: "Term", placeholder: "e.g. 90 days" },

    { key: "workingHours", label: "Working Hours", required: true, type: "text", group: "Hours & Leave", placeholder: "e.g. 8 hrs/day, 48 hrs/week" },
    { key: "weeklyRest", label: "Weekly Rest", required: false, type: "text", group: "Hours & Leave" },
    { key: "annualLeave", label: "Annual Leave", required: false, type: "text", group: "Hours & Leave", placeholder: "e.g. 21 days (30 after 5 years)" },

    { key: "confidentiality", label: "Confidentiality / Non-compete (optional)", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: SA_LABOUR_EN },
    { key: "disputeCity", label: "Jurisdiction", required: false, type: "text", group: "Provisions", placeholder: SA.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Employment Agreement</div>
      <div class="muted">Governed by the Saudi Labor Law (Royal Decree M/51 of 1426H), as amended effective 19 February 2025.</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Employer:</b> {{employerName}} — CR/Est. No.: {{employerReg}} — {{employerAddress}}</div>
    <div><b>Employee:</b> {{employeeName}} — ID/Iqama: {{employeeId}} — Nationality: {{employeeNationality}} — {{employeeAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Role</h3><div class="box">
    <div><b>Job Title:</b> {{jobTitle}}</div>
    <div><b>Duties:</b> {{jobDescription}}</div>
    <div><b>Workplace:</b> {{workplace}}</div>
  </div></div>

  <div class="sec"><h3>3. Pay</h3><div class="box">
    <div><b>Basic Salary:</b> {{salary}} {{currency}} — paid {{paymentFrequency}}</div>
    <div><b>Allowances:</b> {{allowances}}</div>
    <div class="muted">Wages are paid in the official currency through the Wage Protection System, and the Employee is registered with the General Organization for Social Insurance (GOSI) as required by law.</div>
  </div></div>

  <div class="sec"><h3>4. Term & Probation</h3><div class="box">
    <div><b>Type:</b> {{contractType}} — <b>Duration:</b> {{contractDuration}}</div>
    <div><b>Start Date:</b> {{startDate}} — <b>Probation:</b> {{probationPeriod}}</div>
    <div class="muted">A probation period, if agreed, must be stated expressly in the contract and may not exceed 180 days; either party may terminate during it. Eid al-Fitr and Eid al-Adha holidays and sick leave do not count toward the probation period.</div>
  </div></div>

  <div class="sec"><h3>5. Hours & Leave</h3><div class="box">
    <div><b>Working Hours:</b> {{workingHours}}</div>
    <div><b>Weekly Rest:</b> {{weeklyRest}}</div>
    <div><b>Annual Leave:</b> {{annualLeave}}</div>
    <div class="muted">Hours, rest and leave follow the Saudi Labor Law as the minimum floor of the Employee's rights; no term may reduce them.</div>
  </div></div>

  <div class="sec"><h3>6. Termination</h3><div class="box">
    <div class="muted">
      (a) An indefinite-term contract may be ended by either party on a written, reasoned notice of not less than 60 days; termination for an invalid reason gives rise to compensation.<br/>
      (b) A fixed-term contract ends on expiry; a party ending it early by its own will must give at least 30 days' notice unless a longer period is agreed, with compensation for wrongful termination.<br/>
      (c) On separation the Employee is entitled to an end-of-service award for the period of service and to an experience certificate, under the Labor Law.
    </div>
  </div></div>

  <div class="sec"><h3>7. Governing Law & Disputes</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div class="muted">Any clause reducing the Employee's statutory rights is void; disputes are heard by the competent Labor Courts.</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Employer Signature</b><br/><br/>Name: {{employerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Employee Signature</b><br/><br/>Name: {{employeeName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
