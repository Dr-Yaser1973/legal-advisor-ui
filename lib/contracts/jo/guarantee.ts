// lib/contracts/jo/guarantee.ts
// عقد كفالة وفق القانون المدني الأردني رقم 43 لسنة 1976 (أحكام الكفالة).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const JO = getJurisdiction("JO");

export const GUARANTEE_JO_AR: ContractTemplate = {
  id: 7801,
  slug: "jo-guarantee-ar",
  title: "عقد كفالة (الأردن) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "JO",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "عمّان" },

    { key: "creditorName", label: "اسم الدائن", required: true, type: "text", group: "الدائن" },
    { key: "creditorId", label: "الرقم الوطني/السجل للدائن", required: true, type: "text", group: "الدائن" },
    { key: "creditorAddress", label: "عنوان الدائن", required: true, type: "text", group: "الدائن" },

    { key: "debtorName", label: "اسم المدين الأصلي", required: true, type: "text", group: "المدين الأصلي" },
    { key: "debtorId", label: "الرقم الوطني/السجل للمدين", required: true, type: "text", group: "المدين الأصلي" },
    { key: "debtorAddress", label: "عنوان المدين", required: true, type: "text", group: "المدين الأصلي" },

    { key: "guarantorName", label: "اسم الكفيل", required: true, type: "text", group: "الكفيل" },
    { key: "guarantorId", label: "الرقم الوطني/السجل للكفيل", required: true, type: "text", group: "الكفيل" },
    { key: "guarantorAddress", label: "عنوان الكفيل", required: true, type: "text", group: "الكفيل" },

    { key: "debtDescription", label: "وصف الدين/الالتزام المكفول وسببه", required: true, type: "textarea", group: "محل الكفالة" },
    { key: "debtAmount", label: "مقدار الدين المكفول", required: true, type: "number", group: "محل الكفالة" },
    { key: "debtCurrency", label: "العملة", required: true, type: "select", group: "محل الكفالة",
      options: currencyOptionsAr(JO.currencies) },
    { key: "guaranteeScope", label: "نطاق الكفالة", required: true, type: "select", group: "محل الكفالة",
      options: ["أصل الدين وملحقاته (فوائد ومصروفات)", "أصل الدين فقط"] },
    { key: "guaranteeType", label: "نوع الكفالة", required: true, type: "select", group: "محل الكفالة",
      options: ["كفالة عادية (للكفيل الدفع بالتجريد)", "كفالة تضامنية (يجوز مطالبة الكفيل مباشرة)"] },
    { key: "guaranteeDuration", label: "مدة الكفالة (إن وجدت)", required: false, type: "text", group: "محل الكفالة" },

    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: JO.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: JO.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد كفالة</div>
    <div class="subtitle">مصاغ وفق القانون المدني الأردني رقم 43 لسنة 1976 (أحكام الكفالة)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: الأطراف</div>
    <div class="p"><b>الدائن:</b> {{creditorName}} — الرقم الوطني/السجل: {{creditorId}} — العنوان: {{creditorAddress}}</div>
    <div class="p"><b>المدين الأصلي:</b> {{debtorName}} — الرقم الوطني/السجل: {{debtorId}} — العنوان: {{debtorAddress}}</div>
    <div class="p"><b>الكفيل:</b> {{guarantorName}} — الرقم الوطني/السجل: {{guarantorId}} — العنوان: {{guarantorAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل الكفالة</div>
    <div class="p"><b>وصف الالتزام المكفول:</b> {{debtDescription}}</div>
    <div class="p"><b>مقدار الدين:</b> {{debtAmount}} {{debtCurrency}}</div>
    <div class="p"><b>نطاق الكفالة:</b> {{guaranteeScope}}</div>
    <div class="p"><b>نوع الكفالة:</b> {{guaranteeType}}</div>
    <div class="p"><b>مدة الكفالة:</b> {{guaranteeDuration}}</div>
    <div class="clause">يكفل الكفيل تنفيذ التزام المدين إذا لم يفِ به المدين نفسه، ولا تصحّ الكفالة إلا إذا كان الالتزام المكفول صحيحاً، عملاً بأحكام الكفالة في القانون المدني الأردني.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: أثر الكفالة</div>
    <ol class="ol">
      <li>في الكفالة العادية لا يُطالَب الكفيل بالوفاء إلا بعد الرجوع على المدين الأصلي وتجريده (الدفع بالتجريد).</li>
      <li>في الكفالة التضامنية يجوز للدائن مطالبة الكفيل مباشرةً دون تجريد، ويلتزم الكفيل بالتضامن مع المدين.</li>
      <li>إذا وفّى الكفيل الدين حلّ محلّ الدائن فيما له من حقوق قِبَل المدين (حق الرجوع والحلول).</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">رابعاً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع الكفيل</div><div class="sig-line"></div><div class="sig-name">{{guarantorName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع الدائن</div><div class="sig-line"></div><div class="sig-name">{{creditorName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const GUARANTEE_JO_EN: ContractTemplate = {
  id: 7802,
  slug: "jo-guarantee-en",
  title: "Suretyship / Guarantee (Jordan) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "JO",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Amman" },

    { key: "creditorName", label: "Creditor Name", required: true, type: "text", group: "Creditor" },
    { key: "creditorId", label: "Creditor ID / Reg.", required: true, type: "text", group: "Creditor" },
    { key: "creditorAddress", label: "Creditor Address", required: true, type: "text", group: "Creditor" },

    { key: "debtorName", label: "Principal Debtor Name", required: true, type: "text", group: "Principal Debtor" },
    { key: "debtorId", label: "Debtor ID / Reg.", required: true, type: "text", group: "Principal Debtor" },
    { key: "debtorAddress", label: "Debtor Address", required: true, type: "text", group: "Principal Debtor" },

    { key: "guarantorName", label: "Guarantor (Surety) Name", required: true, type: "text", group: "Guarantor" },
    { key: "guarantorId", label: "Guarantor ID / Reg.", required: true, type: "text", group: "Guarantor" },
    { key: "guarantorAddress", label: "Guarantor Address", required: true, type: "text", group: "Guarantor" },

    { key: "debtDescription", label: "Guaranteed Obligation & Cause", required: true, type: "textarea", group: "Scope" },
    { key: "debtAmount", label: "Guaranteed Amount", required: true, type: "number", group: "Scope" },
    { key: "debtCurrency", label: "Currency", required: true, type: "select", group: "Scope",
      options: currencyOptionsEn(JO.currencies) },
    { key: "guaranteeScope", label: "Scope of Guarantee", required: true, type: "select", group: "Scope",
      options: ["Principal + accessories (interest & costs)", "Principal only"] },
    { key: "guaranteeType", label: "Type", required: true, type: "select", group: "Scope",
      options: ["Ordinary (benefit of discussion)", "Joint & several (direct claim)"] },
    { key: "guaranteeDuration", label: "Duration (if any)", required: false, type: "text", group: "Scope" },

    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: JO.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: JO.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Suretyship / Guarantee</div>
      <div class="muted">Governed by the Jordanian Civil Code No. 43 of 1976 (Suretyship provisions).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Creditor:</b> {{creditorName}} — ID/Reg: {{creditorId}} — {{creditorAddress}}</div>
    <div><b>Principal Debtor:</b> {{debtorName}} — ID/Reg: {{debtorId}} — {{debtorAddress}}</div>
    <div><b>Guarantor:</b> {{guarantorName}} — ID/Reg: {{guarantorId}} — {{guarantorAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Scope of Guarantee</h3><div class="box">
    <div><b>Guaranteed Obligation:</b> {{debtDescription}}</div>
    <div><b>Amount:</b> {{debtAmount}} {{debtCurrency}}</div>
    <div><b>Scope:</b> {{guaranteeScope}} &nbsp; <b>Type:</b> {{guaranteeType}} &nbsp; <b>Duration:</b> {{guaranteeDuration}}</div>
    <div class="muted">The surety undertakes to perform the debtor's obligation if the debtor fails; the guarantee is valid only if the guaranteed obligation is valid.</div>
  </div></div>

  <div class="sec"><h3>3. Effect</h3><div class="box">
    <div class="muted">
      (a) In an ordinary guarantee the surety is not sued until the principal debtor is pursued and their assets discussed (benefit of discussion).<br/>
      (b) In a joint & several guarantee the creditor may claim the surety directly.<br/>
      (c) A surety who pays is subrogated to the creditor's rights against the debtor.
    </div>
  </div></div>

  <div class="sec"><h3>4. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Guarantor Signature</b><br/><br/>Name: {{guarantorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Creditor Signature</b><br/><br/>Name: {{creditorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
