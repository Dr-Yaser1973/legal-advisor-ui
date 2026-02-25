import type { ContractTemplate } from "../engine/types";

export const CONSTRUCTION_AR: ContractTemplate = {
  id: 1301,
  slug: "pro-construction-ar",
  title: "عقد مقاولة احترافي (Pro) – عربي",
  lang: "ar",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "رقم العقد", required: true },
    { key: "contractDate", label: "تاريخ العقد", required: true },
    { key: "contractCity", label: "مدينة الإبرام", required: true },

    { key: "employerName", label: "اسم رب العمل", required: true },
    { key: "employerId", label: "هوية/سجل رب العمل", required: true },

    { key: "contractorName", label: "اسم المقاول", required: true },
    { key: "contractorId", label: "هوية/سجل المقاول", required: true },

    { key: "projectName", label: "اسم المشروع", required: true },
    { key: "projectLocation", label: "موقع المشروع", required: true },
    { key: "scopeOfWork", label: "نطاق الأعمال", required: true },

    { key: "contractPrice", label: "قيمة العقد", required: true },
    { key: "currency", label: "العملة", required: true },

    { key: "advancePayment", label: "الدفعة المقدمة (إن وجدت)", required: false },
    { key: "paymentSchedule", label: "جدول الدفعات", required: true },

    { key: "startDate", label: "تاريخ المباشرة", required: true },
    { key: "completionDate", label: "تاريخ الإنجاز", required: true },

    { key: "delayPenalty", label: "غرامة التأخير اليومية", required: true },
    { key: "retentionPercentage", label: "نسبة الاستقطاع (Retention %)", required: false },

    { key: "defectsLiabilityPeriod", label: "مدة ضمان العيوب", required: true },

    { key: "forceMajeureClause", label: "أحكام القوة القاهرة", required: false },

    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true },
    { key: "disputeCity", label: "الاختصاص المكاني", required: true },
  ],

  html: `
<div class="doc rtl">

<h2>عقد مقاولة</h2>

<p><b>رقم:</b> {{contractRef}}</p>
<p><b>التاريخ:</b> {{contractDate}}</p>

<h3>1. الأطراف</h3>
<p><b>رب العمل:</b> {{employerName}} – {{employerId}}</p>
<p><b>المقاول:</b> {{contractorName}} – {{contractorId}}</p>

<h3>2. موضوع العقد</h3>
<p>يتعهد المقاول بتنفيذ مشروع "{{projectName}}" الكائن في {{projectLocation}} وفق نطاق الأعمال التالي:</p>
<p>{{scopeOfWork}}</p>

<h3>3. قيمة العقد</h3>
<p>{{contractPrice}} {{currency}}</p>
<p>الدفعة المقدمة: {{advancePayment}}</p>
<p>جدول الدفعات: {{paymentSchedule}}</p>
<p>نسبة الاستقطاع: {{retentionPercentage}}</p>

<h3>4. مدة التنفيذ</h3>
<p>تبدأ الأعمال في {{startDate}} وتنتهي في {{completionDate}}.</p>

<h3>5. غرامات التأخير</h3>
<p>في حال التأخير يلتزم المقاول بدفع غرامة مقدارها {{delayPenalty}} عن كل يوم تأخير.</p>

<h3>6. ضمان العيوب</h3>
<p>تكون مدة ضمان العيوب {{defectsLiabilityPeriod}} من تاريخ الاستلام النهائي.</p>

<h3>7. القوة القاهرة</h3>
<p>{{forceMajeureClause}}</p>

<h3>8. القانون والاختصاص</h3>
<p>يخضع العقد لأحكام {{governingLaw}}.</p>
<p>تختص محاكم {{disputeCity}} بالنظر في النزاعات.</p>

<br/><br/>
<p>توقيع رب العمل: __________________</p>
<p>توقيع المقاول: __________________</p>

</div>
`.trim(),
};

export const CONSTRUCTION_EN: ContractTemplate = {
  id: 1302,
  slug: "pro-construction-en",
  title: "Construction Contract (PRO) — English",
  lang: "en",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "Contract Ref", required: true },
    { key: "contractDate", label: "Contract Date", required: true },
    { key: "contractCity", label: "Place of Execution", required: true },

    { key: "employerName", label: "Employer Name", required: true },
    { key: "employerId", label: "Employer ID/Registration", required: true },

    { key: "contractorName", label: "Contractor Name", required: true },
    { key: "contractorId", label: "Contractor ID/Registration", required: true },

    { key: "projectName", label: "Project Name", required: true },
    { key: "projectLocation", label: "Project Location", required: true },
    { key: "scopeOfWork", label: "Scope of Work", required: true },

    { key: "contractPrice", label: "Contract Price", required: true },
    { key: "currency", label: "Currency", required: true },

    { key: "advancePayment", label: "Advance Payment (if any)", required: false },
    { key: "paymentSchedule", label: "Payment Schedule", required: true },

    { key: "startDate", label: "Commencement Date", required: true },
    { key: "completionDate", label: "Completion Date", required: true },

    { key: "delayPenalty", label: "Daily Delay Penalty", required: true },
    { key: "retentionPercentage", label: "Retention Percentage (%)", required: false },

    { key: "defectsLiabilityPeriod", label: "Defects Liability Period", required: true },
    { key: "forceMajeureClause", label: "Force Majeure Clause", required: false },

    { key: "governingLaw", label: "Governing Law", required: false },
    { key: "disputeCity", label: "Jurisdiction/Court", required: false },
  ],

  html: `
<div class="doc" dir="ltr" lang="en">

  <h2>Construction Contract (PRO)</h2>

  <p><b>Ref:</b> {{contractRef}}</p>
  <p><b>Date:</b> {{contractDate}}</p>
  <p><b>Place:</b> {{contractCity}}</p>

  <h3>1. Parties</h3>
  <p><b>Employer:</b> {{employerName}} ({{employerId}})</p>
  <p><b>Contractor:</b> {{contractorName}} ({{contractorId}})</p>

  <h3>2. Subject Matter</h3>
  <p>The Contractor undertakes to execute the project titled "{{projectName}}" located at {{projectLocation}} in accordance with the following scope of work:</p>
  <p>{{scopeOfWork}}</p>

  <h3>3. Contract Price & Payment</h3>
  <p><b>Total Contract Price:</b> {{contractPrice}} {{currency}}</p>
  <p><b>Advance Payment:</b> {{advancePayment}}</p>
  <p><b>Payment Schedule:</b> {{paymentSchedule}}</p>
  <p><b>Retention:</b> {{retentionPercentage}}%</p>

  <h3>4. Time for Completion</h3>
  <p>Works shall commence on {{startDate}} and be completed by {{completionDate}}.</p>

  <h3>5. Delay Damages</h3>
  <p>If the Contractor fails to complete the works on time, the Contractor shall pay liquidated damages in the amount of {{delayPenalty}} per day of delay.</p>

  <h3>6. Defects Liability</h3>
  <p>The Contractor shall remain liable for defects for a period of {{defectsLiabilityPeriod}} from the date of final handover.</p>

  <h3>7. Force Majeure</h3>
  <p>{{forceMajeureClause}}</p>

  <h3>8. Governing Law & Jurisdiction</h3>
  <p><b>Governing Law:</b> {{governingLaw}}</p>
  <p><b>Jurisdiction:</b> {{disputeCity}}</p>

  <br/><br/>
  <div>
    <b>Employer Signature:</b> ___________________
  </div>
  <br/>
  <div>
    <b>Contractor Signature:</b> ___________________
  </div>

</div>
`.trim(),
};
