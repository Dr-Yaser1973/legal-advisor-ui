import type { ContractTemplate } from "../engine/types";

export const PARTNERSHIP_AR: ContractTemplate = {
  id: 1401,
  slug: "pro-partnership-ar",
  title: "عقد شراكة احترافي (Pro) – عربي",
  lang: "ar",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "رقم العقد", required: true },
    { key: "contractDate", label: "تاريخ العقد", required: true },
    { key: "contractCity", label: "مدينة الإبرام", required: true },

    { key: "partner1Name", label: "اسم الشريك الأول", required: true },
    { key: "partner2Name", label: "اسم الشريك الثاني", required: true },

    { key: "businessName", label: "اسم المشروع/النشاط", required: true },
    { key: "businessActivity", label: "طبيعة النشاط", required: true },

    { key: "capitalAmount", label: "رأس المال", required: true },
    { key: "partner1Share", label: "نسبة الشريك الأول (%)", required: true },
    { key: "partner2Share", label: "نسبة الشريك الثاني (%)", required: true },

    { key: "profitDistribution", label: "آلية توزيع الأرباح", required: true },
    { key: "managementStructure", label: "إدارة المشروع", required: true },

    { key: "withdrawalClause", label: "آلية خروج الشريك", required: true },
    { key: "nonCompeteClause", label: "شرط عدم المنافسة", required: false },

    { key: "duration", label: "مدة الشراكة", required: true },

    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true },
    { key: "disputeCity", label: "الاختصاص المكاني", required: true },
  ],

  html: `
<div class="doc rtl">

<h2>عقد شراكة</h2>

<p><b>رقم:</b> {{contractRef}}</p>
<p><b>التاريخ:</b> {{contractDate}}</p>

<h3>1. الأطراف</h3>
<p>{{partner1Name}}</p>
<p>{{partner2Name}}</p>

<h3>2. موضوع الشراكة</h3>
<p>تأسيس مشروع باسم "{{businessName}}" لممارسة النشاط التالي:</p>
<p>{{businessActivity}}</p>

<h3>3. رأس المال والحصص</h3>
<p>رأس المال: {{capitalAmount}}</p>
<p>حصة الشريك الأول: {{partner1Share}}%</p>
<p>حصة الشريك الثاني: {{partner2Share}}%</p>

<h3>4. توزيع الأرباح والخسائر</h3>
<p>{{profitDistribution}}</p>

<h3>5. الإدارة</h3>
<p>{{managementStructure}}</p>

<h3>6. مدة الشراكة</h3>
<p>{{duration}}</p>

<h3>7. خروج الشريك</h3>
<p>{{withdrawalClause}}</p>

<h3>8. عدم المنافسة</h3>
<p>{{nonCompeteClause}}</p>

<h3>9. القانون والاختصاص</h3>
<p>{{governingLaw}}</p>
<p>محاكم {{disputeCity}}</p>

<br/><br/>
<p>توقيع الشريك الأول: __________________</p>
<p>توقيع الشريك الثاني: __________________</p>

</div>
`.trim(),
};

export const PARTNERSHIP_EN: ContractTemplate = {
  id: 1402,
  slug: "pro-partnership-en",
  title: "Partnership Agreement (PRO) — English",
  lang: "en",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "Contract Ref", required: true },
    { key: "contractDate", label: "Contract Date", required: true },
    { key: "contractCity", label: "Place of Execution", required: true },

    { key: "partner1Name", label: "First Partner Name", required: true },
    { key: "partner2Name", label: "Second Partner Name", required: true },

    { key: "businessName", label: "Business Name", required: true },
    { key: "businessActivity", label: "Nature of Business", required: true },

    { key: "capitalAmount", label: "Capital Contribution", required: true },
    { key: "partner1Share", label: "Partner 1 Share (%)", required: true },
    { key: "partner2Share", label: "Partner 2 Share (%)", required: true },

    { key: "profitDistribution", label: "Profit Distribution Method", required: true },
    { key: "managementStructure", label: "Management Structure", required: true },

    { key: "withdrawalClause", label: "Withdrawal Mechanism", required: true },
    { key: "nonCompeteClause", label: "Non-Compete Clause", required: false },

    { key: "duration", label: "Duration of Partnership", required: true },

    { key: "governingLaw", label: "Governing Law", required: false },
    { key: "disputeCity", label: "Jurisdiction/Court", required: false },
  ],

  html: `
<div class="doc" dir="ltr" lang="en">

  <h2>Partnership Agreement (PRO)</h2>

  <p><b>Ref:</b> {{contractRef}}</p>
  <p><b>Date:</b> {{contractDate}}</p>
  <p><b>Place:</b> {{contractCity}}</p>

  <h3>1. Parties</h3>
  <p>{{partner1Name}}</p>
  <p>{{partner2Name}}</p>

  <h3>2. Purpose of Partnership</h3>
  <p>The Parties agree to establish a partnership under the name "{{businessName}}" to engage in the following business activity:</p>
  <p>{{businessActivity}}</p>

  <h3>3. Capital & Ownership</h3>
  <p><b>Total Capital:</b> {{capitalAmount}}</p>
  <p><b>Partner 1 Share:</b> {{partner1Share}}%</p>
  <p><b>Partner 2 Share:</b> {{partner2Share}}%</p>

  <h3>4. Profits & Losses</h3>
  <p>{{profitDistribution}}</p>

  <h3>5. Management</h3>
  <p>{{managementStructure}}</p>

  <h3>6. Duration</h3>
  <p>The partnership shall continue for {{duration}} unless terminated in accordance with this agreement.</p>

  <h3>7. Withdrawal & Exit</h3>
  <p>{{withdrawalClause}}</p>

  <h3>8. Non-Compete</h3>
  <p>{{nonCompeteClause}}</p>

  <h3>9. Governing Law & Jurisdiction</h3>
  <p><b>Governing Law:</b> {{governingLaw}}</p>
  <p><b>Jurisdiction:</b> {{disputeCity}}</p>

  <br/><br/>
  <div>
    <b>Partner 1 Signature:</b> ___________________
  </div>
  <br/>
  <div>
    <b>Partner 2 Signature:</b> ___________________
  </div>

</div>
`.trim(),
};
