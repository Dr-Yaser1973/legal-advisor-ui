// lib/contracts/kw/loan.ts
// عقد قرض وفق القانون المدني الكويتي (المرسوم بقانون رقم 67 لسنة 1980) — أحكام القرض.
// ملاحظة: تُراعى في احتساب الفوائد الحدود التي يقرّرها قانون التجارة رقم 68 لسنة 1980
// وتعليمات بنك الكويت المركزي (الحد الأقصى لسعر الفائدة).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const KW = getJurisdiction("KW");

export const LOAN_KW_AR: ContractTemplate = {
  id: 13901,
  slug: "kw-loan-ar",
  title: "عقد قرض (الكويت) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "KW",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "الكويت" },

    { key: "lenderName", label: "اسم المُقرِض", required: true, type: "text", group: "المُقرِض" },
    { key: "lenderId", label: "الرقم المدني/السجل للمُقرِض", required: true, type: "text", group: "المُقرِض" },
    { key: "lenderAddress", label: "عنوان المُقرِض", required: true, type: "text", group: "المُقرِض" },

    { key: "borrowerName", label: "اسم المُقترِض", required: true, type: "text", group: "المُقترِض" },
    { key: "borrowerId", label: "الرقم المدني/السجل للمُقترِض", required: true, type: "text", group: "المُقترِض" },
    { key: "borrowerAddress", label: "عنوان المُقترِض", required: true, type: "text", group: "المُقترِض" },

    { key: "loanAmount", label: "مبلغ القرض", required: true, type: "number", group: "القرض" },
    { key: "loanCurrency", label: "العملة", required: true, type: "select", group: "القرض",
      options: currencyOptionsAr(KW.currencies) },
    { key: "amountText", label: "المبلغ كتابةً", required: false, type: "text", group: "القرض" },
    { key: "handoverMethod", label: "طريقة تسليم المبلغ", required: true, type: "select", group: "القرض",
      options: ["نقداً", "حوالة بنكية", "شيك"] },

    { key: "hasInterest", label: "الفائدة", required: true, type: "select", group: "الفائدة والسداد",
      options: ["قرض بدون فائدة", "قرض بفائدة اتفاقية ضمن الحدود القانونية"] },
    { key: "interestRate", label: "سعر الفائدة السنوي (إن وجدت)", required: false, type: "text", group: "الفائدة والسداد", placeholder: "مثال: وفق الحد الأقصى المقرّر من بنك الكويت المركزي" },
    { key: "repaymentType", label: "طريقة السداد", required: true, type: "select", group: "الفائدة والسداد",
      options: ["دفعة واحدة في تاريخ الاستحقاق", "أقساط دورية"] },
    { key: "repaymentSchedule", label: "جدول السداد/الأقساط", required: true, type: "textarea", group: "الفائدة والسداد" },
    { key: "dueDate", label: "تاريخ استحقاق السداد النهائي", required: true, type: "date", group: "الفائدة والسداد" },

    { key: "collateral", label: "الضمانات (إن وجدت: كفالة/رهن)", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: KW.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (المحكمة)", required: true, type: "text", group: "أحكام", placeholder: KW.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد قرض</div>
    <div class="subtitle">مصاغ وفق القانون المدني الكويتي (المرسوم بقانون رقم 67 لسنة 1980) — أحكام القرض</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>المُقرِض:</b> {{lenderName}} — الرقم المدني/السجل: {{lenderId}} — العنوان: {{lenderAddress}}</div>
    <div class="p"><b>المُقترِض:</b> {{borrowerName}} — الرقم المدني/السجل: {{borrowerId}} — العنوان: {{borrowerAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: مبلغ القرض وتسليمه</div>
    <div class="p"><b>المبلغ:</b> {{loanAmount}} {{loanCurrency}} <span class="muted">({{amountText}})</span></div>
    <div class="p"><b>طريقة التسليم:</b> {{handoverMethod}}</div>
    <div class="clause">يقرّ المُقترِض باستلام مبلغ القرض من المُقرِض على الوجه المبيّن أعلاه، ويلتزم بردّ مثله جنساً وقدراً وصفةً في ميعاد الاستحقاق، عملاً بأحكام القرض في القانون المدني الكويتي.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الفائدة والسداد</div>
    <div class="p"><b>الفائدة:</b> {{hasInterest}} — <b>السعر:</b> {{interestRate}}</div>
    <div class="p"><b>طريقة السداد:</b> {{repaymentType}}</div>
    <div class="p"><b>جدول السداد:</b> {{repaymentSchedule}}</div>
    <div class="p"><b>تاريخ الاستحقاق النهائي:</b> {{dueDate}}</div>
    <div class="clause">إذا اتُّفق على فائدة وجب ألا تجاوز الحد الأقصى الذي يقرّره قانون التجارة رقم 68 لسنة 1980 وتعليمات بنك الكويت المركزي، وكل ما جاوز الحد المسموح يُخفَّض إليه.</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: الضمانات والشروط الخاصة</div>
    <div class="p"><b>الضمانات:</b> {{collateral}}</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">خامساً: القانون الواجب التطبيق وتسوية النزاعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص المحكمة المختصة في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع المُقرِض</div><div class="sig-line"></div><div class="sig-name">{{lenderName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع المُقترِض</div><div class="sig-line"></div><div class="sig-name">{{borrowerName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const LOAN_KW_EN: ContractTemplate = {
  id: 13902,
  slug: "kw-loan-en",
  title: "Loan Agreement (Kuwait) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "KW",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Kuwait City" },

    { key: "lenderName", label: "Lender Name", required: true, type: "text", group: "Lender" },
    { key: "lenderId", label: "Lender Civil ID / CR", required: true, type: "text", group: "Lender" },
    { key: "lenderAddress", label: "Lender Address", required: true, type: "text", group: "Lender" },

    { key: "borrowerName", label: "Borrower Name", required: true, type: "text", group: "Borrower" },
    { key: "borrowerId", label: "Borrower Civil ID / CR", required: true, type: "text", group: "Borrower" },
    { key: "borrowerAddress", label: "Borrower Address", required: true, type: "text", group: "Borrower" },

    { key: "loanAmount", label: "Loan Amount", required: true, type: "number", group: "Loan" },
    { key: "loanCurrency", label: "Currency", required: true, type: "select", group: "Loan",
      options: currencyOptionsEn(KW.currencies) },
    { key: "handoverMethod", label: "Disbursement Method", required: true, type: "select", group: "Loan",
      options: ["Cash", "Bank Transfer", "Cheque"] },

    { key: "hasInterest", label: "Interest", required: true, type: "select", group: "Interest & Repayment",
      options: ["Interest-free", "With agreed interest within legal limits"] },
    { key: "interestRate", label: "Annual Interest Rate (if any)", required: false, type: "text", group: "Interest & Repayment", placeholder: "e.g. within the CBK maximum rate" },
    { key: "repaymentType", label: "Repayment", required: true, type: "select", group: "Interest & Repayment",
      options: ["Lump sum at maturity", "Periodic instalments"] },
    { key: "repaymentSchedule", label: "Repayment Schedule", required: true, type: "textarea", group: "Interest & Repayment" },
    { key: "dueDate", label: "Final Due Date", required: true, type: "date", group: "Interest & Repayment" },

    { key: "collateral", label: "Security (guarantee/pledge, if any)", required: false, type: "textarea", group: "Provisions" },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: KW.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: KW.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Loan Agreement</div>
      <div class="muted">Governed by the Kuwaiti Civil Code (Decree-Law No. 67 of 1980) — Loan provisions.</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Lender:</b> {{lenderName}} — ID/CR: {{lenderId}} — {{lenderAddress}}</div>
    <div><b>Borrower:</b> {{borrowerName}} — ID/CR: {{borrowerId}} — {{borrowerAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Loan Amount & Disbursement</h3><div class="box">
    <div><b>Amount:</b> {{loanAmount}} {{loanCurrency}}</div>
    <div><b>Disbursement:</b> {{handoverMethod}}</div>
    <div class="muted">The Borrower acknowledges receipt and undertakes to repay the like in kind, quantity and quality at maturity under the Civil Code.</div>
  </div></div>

  <div class="sec"><h3>3. Interest & Repayment</h3><div class="box">
    <div><b>Interest:</b> {{hasInterest}} — <b>Rate:</b> {{interestRate}}</div>
    <div><b>Repayment:</b> {{repaymentType}}</div>
    <div><b>Schedule:</b> {{repaymentSchedule}}</div>
    <div><b>Final Due Date:</b> {{dueDate}}</div>
    <div class="muted">Where interest is agreed, it may not exceed the maximum set by the Commercial Code (Law No. 68 of 1980) and the Central Bank of Kuwait; any excess is reduced to the permitted limit.</div>
  </div></div>

  <div class="sec"><h3>4. Security & Special Terms</h3><div class="box">
    <div><b>Security:</b> {{collateral}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sec"><h3>5. Governing Law & Disputes</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Lender Signature</b><br/><br/>Name: {{lenderName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Borrower Signature</b><br/><br/>Name: {{borrowerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
