// lib/contracts/ae/guarantee.ts
// عقد كفالة وفق قانون المعاملات المدنية الاتحادي الإماراتي رقم 5 لسنة 1985 (أحكام الكفالة).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const AE = getJurisdiction("AE");

export const GUARANTEE_AE_AR: ContractTemplate = {
  id: 5801,
  slug: "ae-guarantee-ar",
  title: "عقد كفالة (الإمارات) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "دبي" },

    { key: "creditorName", label: "اسم الدائن", required: true, type: "text", group: "الدائن" },
    { key: "creditorId", label: "الهوية/الرخصة للدائن", required: true, type: "text", group: "الدائن" },
    { key: "creditorAddress", label: "عنوان الدائن", required: true, type: "text", group: "الدائن" },

    { key: "debtorName", label: "اسم المدين الأصلي", required: true, type: "text", group: "المدين الأصلي" },
    { key: "debtorId", label: "الهوية/الرخصة للمدين", required: true, type: "text", group: "المدين الأصلي" },
    { key: "debtorAddress", label: "عنوان المدين", required: true, type: "text", group: "المدين الأصلي" },

    { key: "guarantorName", label: "اسم الكفيل", required: true, type: "text", group: "الكفيل" },
    { key: "guarantorId", label: "الهوية/الرخصة للكفيل", required: true, type: "text", group: "الكفيل" },
    { key: "guarantorAddress", label: "عنوان الكفيل", required: true, type: "text", group: "الكفيل" },

    { key: "debtDescription", label: "وصف الدين/الالتزام المكفول وسببه", required: true, type: "textarea", group: "محل الكفالة" },
    { key: "debtAmount", label: "مقدار الدين المكفول", required: true, type: "number", group: "محل الكفالة" },
    { key: "debtCurrency", label: "العملة", required: true, type: "select", group: "محل الكفالة",
      options: currencyOptionsAr(AE.currencies) },
    { key: "guaranteeScope", label: "نطاق الكفالة", required: true, type: "select", group: "محل الكفالة",
      options: ["أصل الدين وملحقاته", "أصل الدين فقط"] },
    { key: "guaranteeType", label: "نوع الكفالة", required: true, type: "select", group: "محل الكفالة",
      options: ["كفالة عادية (للكفيل الدفع بالتجريد)", "كفالة تضامنية (يجوز مطالبة الكفيل مباشرة)"] },
    { key: "guaranteeDuration", label: "مدة الكفالة (إن وجدت)", required: false, type: "text", group: "محل الكفالة" },

    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: AE.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: AE.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد كفالة</div>
    <div class="subtitle">مصاغ وفق قانون المعاملات المدنية الاتحادي رقم 5 لسنة 1985 (أحكام الكفالة)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: الأطراف</div>
    <div class="p"><b>الدائن:</b> {{creditorName}} — الهوية/الرخصة: {{creditorId}} — العنوان: {{creditorAddress}}</div>
    <div class="p"><b>المدين الأصلي:</b> {{debtorName}} — الهوية/الرخصة: {{debtorId}} — العنوان: {{debtorAddress}}</div>
    <div class="p"><b>الكفيل:</b> {{guarantorName}} — الهوية/الرخصة: {{guarantorId}} — العنوان: {{guarantorAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل الكفالة</div>
    <div class="p"><b>وصف الالتزام المكفول:</b> {{debtDescription}}</div>
    <div class="p"><b>مقدار الدين:</b> {{debtAmount}} {{debtCurrency}}</div>
    <div class="p"><b>نطاق الكفالة:</b> {{guaranteeScope}} — <b>نوعها:</b> {{guaranteeType}} — <b>مدتها:</b> {{guaranteeDuration}}</div>
    <div class="clause">يكفل الكفيل تنفيذ التزام المدين إذا لم يفِ به المدين نفسه، ولا تصحّ الكفالة إلا إذا كان الالتزام المكفول صحيحاً، وتثبت الكفالة بالكتابة.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: أثر الكفالة</div>
    <ol class="ol">
      <li>في الكفالة العادية لا يُطالَب الكفيل بالوفاء إلا بعد تجريد المدين الأصلي من أمواله (الدفع بالتجريد).</li>
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

export const GUARANTEE_AE_EN: ContractTemplate = {
  id: 5802,
  slug: "ae-guarantee-en",
  title: "Suretyship / Guarantee (UAE) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Dubai" },

    { key: "creditorName", label: "Creditor Name", required: true, type: "text", group: "Creditor" },
    { key: "creditorId", label: "Creditor ID / Licence", required: true, type: "text", group: "Creditor" },
    { key: "creditorAddress", label: "Creditor Address", required: true, type: "text", group: "Creditor" },

    { key: "debtorName", label: "Principal Debtor Name", required: true, type: "text", group: "Principal Debtor" },
    { key: "debtorId", label: "Debtor ID / Licence", required: true, type: "text", group: "Principal Debtor" },
    { key: "debtorAddress", label: "Debtor Address", required: true, type: "text", group: "Principal Debtor" },

    { key: "guarantorName", label: "Guarantor (Surety) Name", required: true, type: "text", group: "Guarantor" },
    { key: "guarantorId", label: "Guarantor ID / Licence", required: true, type: "text", group: "Guarantor" },
    { key: "guarantorAddress", label: "Guarantor Address", required: true, type: "text", group: "Guarantor" },

    { key: "debtDescription", label: "Guaranteed Obligation & Cause", required: true, type: "textarea", group: "Scope" },
    { key: "debtAmount", label: "Guaranteed Amount", required: true, type: "number", group: "Scope" },
    { key: "debtCurrency", label: "Currency", required: true, type: "select", group: "Scope",
      options: currencyOptionsEn(AE.currencies) },
    { key: "guaranteeScope", label: "Scope of Guarantee", required: true, type: "select", group: "Scope",
      options: ["Principal + accessories", "Principal only"] },
    { key: "guaranteeType", label: "Type", required: true, type: "select", group: "Scope",
      options: ["Ordinary (benefit of discussion)", "Joint & several (direct claim)"] },
    { key: "guaranteeDuration", label: "Duration (if any)", required: false, type: "text", group: "Scope" },

    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: AE.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: AE.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Suretyship / Guarantee</div>
      <div class="muted">Governed by the UAE Civil Transactions Law No. 5 of 1985 (suretyship).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Creditor:</b> {{creditorName}} — ID/Licence: {{creditorId}} — {{creditorAddress}}</div>
    <div><b>Principal Debtor:</b> {{debtorName}} — ID/Licence: {{debtorId}} — {{debtorAddress}}</div>
    <div><b>Guarantor:</b> {{guarantorName}} — ID/Licence: {{guarantorId}} — {{guarantorAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Scope of Guarantee</h3><div class="box">
    <div><b>Guaranteed Obligation:</b> {{debtDescription}}</div>
    <div><b>Amount:</b> {{debtAmount}} {{debtCurrency}}</div>
    <div><b>Scope:</b> {{guaranteeScope}} &nbsp; <b>Type:</b> {{guaranteeType}} &nbsp; <b>Duration:</b> {{guaranteeDuration}}</div>
    <div class="muted">The surety undertakes to perform the debtor's obligation if the debtor fails; the guarantee is valid only if the guaranteed obligation is valid and is evidenced in writing.</div>
  </div></div>

  <div class="sec"><h3>3. Effect</h3><div class="box">
    <div class="muted">
      (a) In an ordinary guarantee the surety is not sued until the principal debtor's assets are discussed (benefit of discussion).<br/>
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
