// lib/contracts/eg/settlement.ts
// عقد صلح وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد الصلح 549 وما بعدها).
import type { ContractTemplate } from "../engine/types";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "./_shared";

const EG = getJurisdiction("EG");

export const SETTLEMENT_EG_AR: ContractTemplate = {
  id: 4101,
  slug: "eg-settlement-ar",
  title: "عقد صلح (مصر) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    { key: "party1Name", label: "اسم الطرف الأول", required: true, type: "text", group: "الطرف الأول" },
    { key: "party1Id", label: "الرقم القومي/السجل للطرف الأول", required: true, type: "text", group: "الطرف الأول" },
    { key: "party1Address", label: "عنوان الطرف الأول", required: true, type: "text", group: "الطرف الأول" },

    { key: "party2Name", label: "اسم الطرف الثاني", required: true, type: "text", group: "الطرف الثاني" },
    { key: "party2Id", label: "الرقم القومي/السجل للطرف الثاني", required: true, type: "text", group: "الطرف الثاني" },
    { key: "party2Address", label: "عنوان الطرف الثاني", required: true, type: "text", group: "الطرف الثاني" },

    { key: "disputeSubject", label: "موضوع النزاع محل الصلح", required: true, type: "textarea", group: "النزاع" },
    { key: "disputeBackground", label: "خلفية النزاع/الدعوى (إن وجدت)", required: false, type: "textarea", group: "النزاع",
      placeholder: "مثال: الدعوى رقم .../... أمام محكمة ..." },

    { key: "party1Concessions", label: "ما ينزل عنه الطرف الأول", required: true, type: "textarea", group: "بنود الصلح" },
    { key: "party2Concessions", label: "ما ينزل عنه الطرف الثاني", required: true, type: "textarea", group: "بنود الصلح" },
    { key: "settlementAmount", label: "مبلغ التسوية (إن وجد)", required: false, type: "text", group: "بنود الصلح" },
    { key: "executionTerms", label: "كيفية وتوقيت تنفيذ الصلح", required: true, type: "textarea", group: "بنود الصلح" },
    { key: "waiver", label: "التنازل عن الدعاوى/إسقاط الحق في المطالبة", required: true, type: "textarea", group: "بنود الصلح",
      placeholder: "مثال: يتنازل الطرفان عن كافة الدعاوى المتبادلة بشأن هذا النزاع" },

    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: EG.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: EG.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد صلح</div>
    <div class="subtitle">مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد الصلح 549 وما بعدها)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا الصلح</div>
    <div class="p"><b>الطرف الأول:</b> {{party1Name}} — الرقم القومي/السجل: {{party1Id}} — العنوان: {{party1Address}}</div>
    <div class="p"><b>الطرف الثاني:</b> {{party2Name}} — الرقم القومي/السجل: {{party2Id}} — العنوان: {{party2Address}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: النزاع محل الصلح</div>
    <div class="p"><b>الموضوع:</b> {{disputeSubject}}</div>
    <div class="p"><b>الخلفية/الدعوى:</b> {{disputeBackground}}</div>
    <div class="clause">الصلح عقد يحسم به الطرفان نزاعاً قائماً أو يتوقّيان به نزاعاً محتملاً، وذلك بأن ينزل كلٌّ منهما على وجه التقابل عن جزء من ادّعائه (المادة 549 مدني).</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: بنود الصلح والتنازلات المتقابلة</div>
    <ol class="ol">
      <li><b>ينزل الطرف الأول عن:</b> {{party1Concessions}}</li>
      <li><b>ينزل الطرف الثاني عن:</b> {{party2Concessions}}</li>
      <li><b>مبلغ التسوية:</b> {{settlementAmount}}</li>
      <li><b>كيفية التنفيذ وتوقيته:</b> {{executionTerms}}</li>
      <li><b>التنازل عن الدعاوى:</b> {{waiver}}</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">رابعاً: أثر الصلح</div>
    <div class="p">تنقضي بالصلح الحقوق والادّعاءات التي نزل عنها كلٌّ من الطرفين نهائياً، ويحسم الصلح النزاع فيما تناوله من مسائل، ولا يجوز الرجوع فيه إلا بالأسباب التي يقرّرها القانون.</div>
  </div>

  <div class="box">
    <div class="h">خامساً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن تفسير أو تنفيذ هذا الصلح.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع الطرف الأول</div><div class="sig-line"></div><div class="sig-name">{{party1Name}}</div></div>
    <div class="sig"><div class="sig-h">توقيع الطرف الثاني</div><div class="sig-line"></div><div class="sig-name">{{party2Name}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const SETTLEMENT_EG_EN: ContractTemplate = {
  id: 4102,
  slug: "eg-settlement-en",
  title: "Settlement Agreement (Egypt) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

    { key: "party1Name", label: "Party 1 Name", required: true, type: "text", group: "Party 1" },
    { key: "party1Id", label: "Party 1 ID / Reg.", required: true, type: "text", group: "Party 1" },
    { key: "party1Address", label: "Party 1 Address", required: true, type: "text", group: "Party 1" },

    { key: "party2Name", label: "Party 2 Name", required: true, type: "text", group: "Party 2" },
    { key: "party2Id", label: "Party 2 ID / Reg.", required: true, type: "text", group: "Party 2" },
    { key: "party2Address", label: "Party 2 Address", required: true, type: "text", group: "Party 2" },

    { key: "disputeSubject", label: "Subject of the Dispute", required: true, type: "textarea", group: "Dispute" },
    { key: "disputeBackground", label: "Background / Case No. (if any)", required: false, type: "textarea", group: "Dispute" },

    { key: "party1Concessions", label: "Party 1 Concessions", required: true, type: "textarea", group: "Settlement Terms" },
    { key: "party2Concessions", label: "Party 2 Concessions", required: true, type: "textarea", group: "Settlement Terms" },
    { key: "settlementAmount", label: "Settlement Amount (if any)", required: false, type: "text", group: "Settlement Terms" },
    { key: "executionTerms", label: "Execution & Timing", required: true, type: "textarea", group: "Settlement Terms" },
    { key: "waiver", label: "Waiver / Release of Claims", required: true, type: "textarea", group: "Settlement Terms" },

    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: EG.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: EG.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Settlement Agreement</div>
      <div class="muted">Governed by the Egyptian Civil Code No. 131 of 1948 (Compromise/Settlement, Arts. 549 ff.).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Party 1:</b> {{party1Name}} — ID/Reg: {{party1Id}} — {{party1Address}}</div>
    <div><b>Party 2:</b> {{party2Name}} — ID/Reg: {{party2Id}} — {{party2Address}}</div>
  </div></div>

  <div class="sec"><h3>2. The Dispute</h3><div class="box">
    <div><b>Subject:</b> {{disputeSubject}}</div>
    <div><b>Background/Case:</b> {{disputeBackground}}</div>
    <div class="muted">A settlement is a contract by which the parties end an existing dispute or prevent a potential one, each making reciprocal concessions on part of its claim (Art. 549 Civil Code).</div>
  </div></div>

  <div class="sec"><h3>3. Settlement Terms (Reciprocal Concessions)</h3><div class="box">
    <div>(a) Party 1 concedes: {{party1Concessions}}</div>
    <div>(b) Party 2 concedes: {{party2Concessions}}</div>
    <div>(c) Settlement Amount: {{settlementAmount}}</div>
    <div>(d) Execution & Timing: {{executionTerms}}</div>
    <div>(e) Waiver/Release: {{waiver}}</div>
  </div></div>

  <div class="sec"><h3>4. Effect</h3><div class="box">
    <div class="muted">The rights and claims waived by each party are extinguished definitively; the settlement conclusively resolves the matters it covers and may not be rescinded except on grounds fixed by law.</div>
  </div></div>

  <div class="sec"><h3>5. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Party 1 Signature</b><br/><br/>Name: {{party1Name}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Party 2 Signature</b><br/><br/>Name: {{party2Name}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
