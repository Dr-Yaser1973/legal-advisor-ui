import type { ContractTemplate } from "../engine/types";

export const CONSTRUCTION_AR: ContractTemplate = {
  id: 1301,
  slug: "pro-construction-ar",
  title: "عقد مقاولة احترافي (Pro) – عربي",
  lang: "ar",
  group: "PRO",

  fields: [
    // ── معلومات العقد ──
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد" },

    // ── رب العمل ──
    { key: "employerName", label: "اسم رب العمل", required: true, type: "text", group: "رب العمل" },
    { key: "employerId", label: "هوية/سجل رب العمل", required: true, type: "text", group: "رب العمل" },

    // ── المقاول ──
    { key: "contractorName", label: "اسم المقاول", required: true, type: "text", group: "المقاول" },
    { key: "contractorId", label: "هوية/سجل المقاول", required: true, type: "text", group: "المقاول" },

    // ── المشروع ──
    { key: "projectName", label: "اسم المشروع", required: true, type: "text", group: "المشروع" },
    { key: "projectLocation", label: "موقع المشروع", required: true, type: "text", group: "المشروع" },
    { key: "scopeOfWork", label: "نطاق الأعمال", required: true, type: "textarea", group: "المشروع" },

    // ── القيمة المالية ──
    { key: "contractPrice", label: "قيمة العقد", required: true, type: "number", group: "القيمة المالية" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "القيمة المالية",
      options: ["دينار عراقي", "دولار أمريكي", "يورو"] },
    { key: "advancePayment", label: "الدفعة المقدمة (إن وجدت)", required: false, type: "text", group: "القيمة المالية" },
    { key: "paymentSchedule", label: "جدول الدفعات", required: true, type: "textarea", group: "القيمة المالية" },
    { key: "retentionPercentage", label: "نسبة الاستقطاع (%)", required: false, type: "number", group: "القيمة المالية" },

    // ── المدة ──
    { key: "startDate", label: "تاريخ المباشرة", required: true, type: "date", group: "المدة" },
    { key: "completionDate", label: "تاريخ الإنجاز", required: true, type: "date", group: "المدة" },

    // ── أحكام ──
    { key: "delayPenalty", label: "غرامة التأخير اليومية", required: true, type: "text", group: "أحكام",
      placeholder: "مثال: 100,000 دينار عن كل يوم" },
    { key: "defectsLiabilityPeriod", label: "مدة ضمان العيوب", required: true, type: "text", group: "أحكام",
      placeholder: "مثال: سنة واحدة" },
    { key: "forceMajeureClause", label: "أحكام القوة القاهرة", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام",
      placeholder: "القانون المدني العراقي رقم 40 لسنة 1951" },
    { key: "disputeCity", label: "الاختصاص المكاني", required: true, type: "text", group: "أحكام",
      placeholder: "بغداد" },
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
    // ── Contract Info ──
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info" },

    // ── Employer ──
    { key: "employerName", label: "Employer Name", required: true, type: "text", group: "Employer" },
    { key: "employerId", label: "Employer ID/Registration", required: true, type: "text", group: "Employer" },

    // ── Contractor ──
    { key: "contractorName", label: "Contractor Name", required: true, type: "text", group: "Contractor" },
    { key: "contractorId", label: "Contractor ID/Registration", required: true, type: "text", group: "Contractor" },

    // ── Project ──
    { key: "projectName", label: "Project Name", required: true, type: "text", group: "Project" },
    { key: "projectLocation", label: "Project Location", required: true, type: "text", group: "Project" },
    { key: "scopeOfWork", label: "Scope of Work", required: true, type: "textarea", group: "Project" },

    // ── Financials ──
    { key: "contractPrice", label: "Contract Price", required: true, type: "number", group: "Financials" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Financials",
      options: ["IQD", "USD", "EUR"] },
    { key: "advancePayment", label: "Advance Payment (if any)", required: false, type: "text", group: "Financials" },
    { key: "paymentSchedule", label: "Payment Schedule", required: true, type: "textarea", group: "Financials" },
    { key: "retentionPercentage", label: "Retention Percentage (%)", required: false, type: "number", group: "Financials" },

    // ── Time ──
    { key: "startDate", label: "Commencement Date", required: true, type: "date", group: "Time" },
    { key: "completionDate", label: "Completion Date", required: true, type: "date", group: "Time" },

    // ── Provisions ──
    { key: "delayPenalty", label: "Daily Delay Penalty", required: true, type: "text", group: "Provisions",
      placeholder: "e.g. USD 100 per day" },
    { key: "defectsLiabilityPeriod", label: "Defects Liability Period", required: true, type: "text", group: "Provisions",
      placeholder: "e.g. One year" },
    { key: "forceMajeureClause", label: "Force Majeure Clause", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions",
      placeholder: "Iraqi Civil Code No. 40 of 1951" },
    { key: "disputeCity", label: "Jurisdiction/Court", required: false, type: "text", group: "Provisions",
      placeholder: "Baghdad" },
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
