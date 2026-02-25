//lib/contracts/pro/employment.ts
import type { ContractTemplate } from "../engine/types";
export const EMPLOYMENT_AR: ContractTemplate = {
  id: 1601,
  slug: "pro-employment-ar",
  title: "عقد عمل (PRO) — عربي",
  lang: "ar",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "رقم العقد", required: true },
    { key: "contractDate", label: "تاريخ العقد", required: true },
    { key: "contractCity", label: "مكان الإبرام", required: true },

    { key: "employerName", label: "اسم صاحب العمل", required: true },
    { key: "employeeName", label: "اسم الموظف", required: true },
    { key: "employeeId", label: "هوية الموظف", required: true },

    { key: "jobTitle", label: "المسمى الوظيفي", required: true },
    { key: "jobDescription", label: "وصف المهام", required: true },

    { key: "salary", label: "الراتب", required: true },
    { key: "currency", label: "العملة", required: true },
    { key: "paymentFrequency", label: "دورية الدفع", required: true },

    { key: "startDate", label: "تاريخ بدء العمل", required: true },
    { key: "contractDuration", label: "مدة العقد", required: true },

    { key: "probationPeriod", label: "فترة التجربة", required: false },
    { key: "workingHours", label: "ساعات العمل", required: true },

    { key: "terminationClause", label: "إنهاء العقد", required: true },

    { key: "governingLaw", label: "القانون الحاكم", required: false },
    { key: "disputeCity", label: "الاختصاص القضائي", required: false },
  ],

  html: `
<div class="doc" dir="rtl" lang="ar">
  <h2>عقد عمل (PRO)</h2>
  <p><b>رقم العقد:</b> {{contractRef}}</p>
  <p><b>التاريخ:</b> {{contractDate}}</p>
  <p><b>المكان:</b> {{contractCity}}</p>

  <h3>أولاً: الأطراف</h3>
  <p><b>صاحب العمل:</b> {{employerName}}</p>
  <p><b>الموظف:</b> {{employeeName}} ({{employeeId}})</p>

  <h3>ثانياً: الوظيفة</h3>
  <p><b>المسمى الوظيفي:</b> {{jobTitle}}</p>
  <p>{{jobDescription}}</p>

  <h3>ثالثاً: الأجر</h3>
  <p>{{salary}} {{currency}} — {{paymentFrequency}}</p>

  <h3>رابعاً: مدة العقد</h3>
  <p>يبدأ العمل بتاريخ {{startDate}} ولمدة {{contractDuration}}</p>

  <h3>خامساً: ساعات العمل</h3>
  <p>{{workingHours}}</p>

  <h3>سادساً: إنهاء العقد</h3>
  <p>{{terminationClause}}</p>

  <h3>سابعاً: القانون والاختصاص</h3>
  <p>{{governingLaw}} — {{disputeCity}}</p>

  <br/><br/>
  <div>
    <b>توقيع صاحب العمل:</b> ___________________
  </div>
  <br/>
  <div>
    <b>توقيع الموظف:</b> ___________________
  </div>
</div>
`.trim(),
};

 export const EMPLOYMENT_EN: ContractTemplate ={
  id: 1602,
  slug: "pro-employment-en",
  title: "Employment Contract (PRO) — English",
  lang: "en",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "Contract Ref", required: true },
    { key: "contractDate", label: "Contract Date", required: true },
    { key: "contractCity", label: "Place of Execution", required: true },

    { key: "employerName", label: "Employer Name", required: true },
    { key: "employeeName", label: "Employee Name", required: true },
    { key: "employeeId", label: "Employee ID", required: true },

    { key: "jobTitle", label: "Job Title", required: true },
    { key: "jobDescription", label: "Job Description", required: true },

    { key: "salary", label: "Salary", required: true },
    { key: "currency", label: "Currency", required: true },
    { key: "paymentFrequency", label: "Payment Frequency", required: true },

    { key: "startDate", label: "Start Date", required: true },
    { key: "contractDuration", label: "Contract Duration", required: true },

    { key: "probationPeriod", label: "Probation Period", required: false },
    { key: "workingHours", label: "Working Hours", required: true },

    { key: "terminationClause", label: "Termination Clause", required: true },

    { key: "governingLaw", label: "Governing Law", required: false },
    { key: "disputeCity", label: "Jurisdiction/Court", required: false },
  ],

  html: `
<div class="doc" dir="ltr" lang="en">
  <h2>Employment Contract (PRO)</h2>
  <p><b>Ref:</b> {{contractRef}}</p>
  <p><b>Date:</b> {{contractDate}}</p>
  <p><b>Place:</b> {{contractCity}}</p>

  <h3>1. Parties</h3>
  <p><b>Employer:</b> {{employerName}}</p>
  <p><b>Employee:</b> {{employeeName}} ({{employeeId}})</p>

  <h3>2. Position</h3>
  <p><b>Job Title:</b> {{jobTitle}}</p>
  <p>{{jobDescription}}</p>

  <h3>3. Compensation</h3>
  <p>{{salary}} {{currency}} — {{paymentFrequency}}</p>

  <h3>4. Term</h3>
  <p>Employment starts on {{startDate}} for a duration of {{contractDuration}}.</p>

  <h3>5. Working Hours</h3>
  <p>{{workingHours}}</p>

  <h3>6. Termination</h3>
  <p>{{terminationClause}}</p>

  <h3>7. Governing Law & Jurisdiction</h3>
  <p>{{governingLaw}} — {{disputeCity}}</p>

  <br/><br/>
  <div>
    <b>Employer Signature:</b> ___________________
  </div>
  <br/>
  <div>
    <b>Employee Signature:</b> ___________________
  </div>
</div>
`.trim(),
};