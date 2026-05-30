 //lib/contracts/pro/employment.ts
import type { ContractTemplate } from "../engine/types";

export const EMPLOYMENT_AR: ContractTemplate = {
  id: 1601,
  slug: "pro-employment-ar",
  title: "عقد عمل (PRO) — عربي",
  lang: "ar",
  group: "PRO",

  fields: [
    // ── معلومات العقد ──
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد" },

    // ── الأطراف ──
    { key: "employerName", label: "اسم صاحب العمل", required: true, type: "text", group: "الأطراف" },
    { key: "employerAddress", label: "عنوان صاحب العمل", required: false, type: "text", group: "الأطراف" },
    { key: "employeeName", label: "اسم الموظف", required: true, type: "text", group: "الأطراف" },
    { key: "employeeId", label: "هوية الموظف", required: true, type: "text", group: "الأطراف" },
    { key: "employeeAddress", label: "عنوان الموظف", required: false, type: "text", group: "الأطراف" },

    // ── الوظيفة ──
    { key: "jobTitle", label: "المسمى الوظيفي", required: true, type: "text", group: "الوظيفة" },
    { key: "jobDescription", label: "وصف المهام", required: true, type: "textarea", group: "الوظيفة" },
    { key: "workplace", label: "مكان العمل", required: false, type: "text", group: "الوظيفة" },

    // ── الأجر ──
    { key: "salary", label: "الراتب", required: true, type: "number", group: "الأجر" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "الأجر",
      options: ["دينار عراقي", "دولار أمريكي", "يورو"] },
    { key: "paymentFrequency", label: "دورية الدفع", required: true, type: "select", group: "الأجر",
      options: ["شهري", "أسبوعي", "نصف شهري", "سنوي"] },

    // ── المدة ──
    { key: "startDate", label: "تاريخ بدء العمل", required: true, type: "date", group: "المدة" },
    { key: "contractType", label: "نوع العقد", required: true, type: "select", group: "المدة",
      options: ["محدد المدة", "غير محدد المدة"] },
    { key: "contractDuration", label: "مدة العقد", required: true, type: "text", group: "المدة",
      placeholder: "مثال: سنة واحدة" },
    { key: "probationPeriod", label: "فترة التجربة", required: false, type: "text", group: "المدة",
      placeholder: "مثال: 3 أشهر" },

    // ── ساعات العمل ──
    { key: "workingHours", label: "ساعات العمل", required: true, type: "text", group: "ساعات العمل",
      placeholder: "مثال: 8 ساعات يومياً، 5 أيام أسبوعياً" },
    { key: "weeklyRest", label: "الراحة الأسبوعية", required: false, type: "text", group: "ساعات العمل",
      placeholder: "مثال: الجمعة" },
    { key: "annualLeave", label: "الإجازة السنوية", required: false, type: "text", group: "ساعات العمل",
      placeholder: "مثال: 30 يوماً" },

    // ── أحكام ──
    { key: "terminationClause", label: "أحكام إنهاء العقد", required: true, type: "textarea", group: "أحكام" },
    { key: "confidentiality", label: "بند السرية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الحاكم", required: false, type: "text", group: "أحكام",
      placeholder: "قانون العمل العراقي رقم 37 لسنة 2015" },
    { key: "disputeCity", label: "الاختصاص القضائي", required: false, type: "text", group: "أحكام",
      placeholder: "بغداد" },
  ],

  html: `
<div class="doc rtl">

  <div class="header">
    <div class="title">عقد عمل</div>
    <div class="subtitle">نموذج احترافي (PRO)</div>
    <div class="meta">
      <div><b>رقم العقد:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>مكان الإبرام:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: أطراف العقد</div>
    <p><b>صاحب العمل:</b> {{employerName}} – {{employerAddress}}</p>
    <p><b>الموظف:</b> {{employeeName}} – هوية: {{employeeId}} – {{employeeAddress}}</p>
    <div class="note">ويُشار إليهما معاً بـ "الطرفين".</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: الوظيفة والمهام</div>
    <p><b>المسمى الوظيفي:</b> {{jobTitle}}</p>
    <p><b>مكان العمل:</b> {{workplace}}</p>
    <p><b>وصف المهام:</b> {{jobDescription}}</p>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الأجر</div>
    <p><b>الراتب:</b> {{salary}} {{currency}}</p>
    <p><b>دورية الدفع:</b> {{paymentFrequency}}</p>
    <div class="clause">
      يلتزم صاحب العمل بدفع الأجر في موعده المحدد وفقاً لأحكام قانون العمل النافذ.
    </div>
  </div>

  <div class="box">
    <div class="h">رابعاً: مدة العقد</div>
    <p><b>نوع العقد:</b> {{contractType}}</p>
    <p>يبدأ العمل بتاريخ {{startDate}} ولمدة {{contractDuration}}.</p>
    <p><b>فترة التجربة:</b> {{probationPeriod}}</p>
  </div>

  <div class="box">
    <div class="h">خامساً: ساعات العمل والإجازات</div>
    <p><b>ساعات العمل:</b> {{workingHours}}</p>
    <p><b>الراحة الأسبوعية:</b> {{weeklyRest}}</p>
    <p><b>الإجازة السنوية:</b> {{annualLeave}}</p>
  </div>

  <div class="box">
    <div class="h">سادساً: إنهاء العقد</div>
    <p>{{terminationClause}}</p>
  </div>

  <div class="box">
    <div class="h">سابعاً: السرية</div>
    <p>{{confidentiality}}</p>
  </div>

  <div class="box">
    <div class="h">ثامناً: القانون والاختصاص</div>
    <p>يخضع هذا العقد لأحكام {{governingLaw}}.</p>
    <p>تختص محاكم {{disputeCity}} بالنظر في أي نزاع ينشأ عن هذا العقد.</p>
  </div>

  <div class="signs">
    <div class="sig"><b>صاحب العمل</b><br/><br/>{{employerName}}</div>
    <div class="sig"><b>الموظف</b><br/><br/>{{employeeName}}</div>
  </div>

</div>
`.trim(),
};

export const EMPLOYMENT_EN: ContractTemplate = {
  id: 1602,
  slug: "pro-employment-en",
  title: "Employment Contract (PRO) — English",
  lang: "en",
  group: "PRO",

  fields: [
    // ── Contract Info ──
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info" },

    // ── Parties ──
    { key: "employerName", label: "Employer Name", required: true, type: "text", group: "Parties" },
    { key: "employerAddress", label: "Employer Address", required: false, type: "text", group: "Parties" },
    { key: "employeeName", label: "Employee Name", required: true, type: "text", group: "Parties" },
    { key: "employeeId", label: "Employee ID", required: true, type: "text", group: "Parties" },
    { key: "employeeAddress", label: "Employee Address", required: false, type: "text", group: "Parties" },

    // ── Position ──
    { key: "jobTitle", label: "Job Title", required: true, type: "text", group: "Position" },
    { key: "jobDescription", label: "Job Description", required: true, type: "textarea", group: "Position" },
    { key: "workplace", label: "Workplace", required: false, type: "text", group: "Position" },

    // ── Compensation ──
    { key: "salary", label: "Salary", required: true, type: "number", group: "Compensation" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Compensation",
      options: ["IQD", "USD", "EUR"] },
    { key: "paymentFrequency", label: "Payment Frequency", required: true, type: "select", group: "Compensation",
      options: ["Monthly", "Weekly", "Bi-weekly", "Annual"] },

    // ── Term ──
    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "contractType", label: "Contract Type", required: true, type: "select", group: "Term",
      options: ["Fixed-term", "Indefinite"] },
    { key: "contractDuration", label: "Contract Duration", required: true, type: "text", group: "Term",
      placeholder: "e.g. One year" },
    { key: "probationPeriod", label: "Probation Period", required: false, type: "text", group: "Term",
      placeholder: "e.g. 3 months" },

    // ── Working Hours ──
    { key: "workingHours", label: "Working Hours", required: true, type: "text", group: "Working Hours",
      placeholder: "e.g. 8 hours/day, 5 days/week" },
    { key: "weeklyRest", label: "Weekly Rest", required: false, type: "text", group: "Working Hours" },
    { key: "annualLeave", label: "Annual Leave", required: false, type: "text", group: "Working Hours",
      placeholder: "e.g. 30 days" },

    // ── Provisions ──
    { key: "terminationClause", label: "Termination Clause", required: true, type: "textarea", group: "Provisions" },
    { key: "confidentiality", label: "Confidentiality Clause", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions",
      placeholder: "Iraqi Labor Law No. 37 of 2015" },
    { key: "disputeCity", label: "Jurisdiction", required: false, type: "text", group: "Provisions",
      placeholder: "Baghdad" },
  ],

  html: `
<div class="doc" dir="ltr">

  <div class="header">
    <div class="title">Employment Contract</div>
    <div class="subtitle">Professional Template (PRO)</div>
    <div class="meta">
      <div><b>Contract Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place of Execution:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">1. Parties</div>
    <p><b>Employer:</b> {{employerName}} – {{employerAddress}}</p>
    <p><b>Employee:</b> {{employeeName}} – ID: {{employeeId}} – {{employeeAddress}}</p>
    <div class="note">Hereinafter jointly referred to as "the Parties".</div>
  </div>

  <div class="box">
    <div class="h">2. Position &amp; Duties</div>
    <p><b>Job Title:</b> {{jobTitle}}</p>
    <p><b>Workplace:</b> {{workplace}}</p>
    <p><b>Duties:</b> {{jobDescription}}</p>
  </div>

  <div class="box">
    <div class="h">3. Compensation</div>
    <p><b>Salary:</b> {{salary}} {{currency}}</p>
    <p><b>Payment Frequency:</b> {{paymentFrequency}}</p>
    <div class="clause">
      The Employer shall pay the salary on its due date in accordance with the applicable Labor Law.
    </div>
  </div>

  <div class="box">
    <div class="h">4. Term</div>
    <p><b>Contract Type:</b> {{contractType}}</p>
    <p>Employment starts on {{startDate}} for a duration of {{contractDuration}}.</p>
    <p><b>Probation Period:</b> {{probationPeriod}}</p>
  </div>

  <div class="box">
    <div class="h">5. Working Hours &amp; Leave</div>
    <p><b>Working Hours:</b> {{workingHours}}</p>
    <p><b>Weekly Rest:</b> {{weeklyRest}}</p>
    <p><b>Annual Leave:</b> {{annualLeave}}</p>
  </div>

  <div class="box">
    <div class="h">6. Termination</div>
    <p>{{terminationClause}}</p>
  </div>

  <div class="box">
    <div class="h">7. Confidentiality</div>
    <p>{{confidentiality}}</p>
  </div>

  <div class="box">
    <div class="h">8. Governing Law &amp; Jurisdiction</div>
    <p>This contract is governed by {{governingLaw}}.</p>
    <p>The courts of {{disputeCity}} shall have jurisdiction over any dispute.</p>
  </div>

  <div class="signs">
    <div class="sig"><b>Employer</b><br/><br/>{{employerName}}</div>
    <div class="sig"><b>Employee</b><br/><br/>{{employeeName}}</div>
  </div>

</div>
`.trim(),
};