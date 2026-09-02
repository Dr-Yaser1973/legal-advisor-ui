// lib/contracts/eg/deposit.ts
// عقد وديعة وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد الوديعة 718 وما بعدها).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "./_shared";

const EG = getJurisdiction("EG");

export const DEPOSIT_EG_AR: ContractTemplate = {
  id: 4001,
  slug: "eg-deposit-ar",
  title: "عقد وديعة (مصر) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    { key: "depositorName", label: "اسم المودِع", required: true, type: "text", group: "المودِع" },
    { key: "depositorId", label: "الرقم القومي/السجل للمودِع", required: true, type: "text", group: "المودِع" },
    { key: "depositorAddress", label: "عنوان المودِع", required: true, type: "text", group: "المودِع" },

    { key: "custodianName", label: "اسم المودَع لديه (الوديع)", required: true, type: "text", group: "المودَع لديه" },
    { key: "custodianId", label: "الرقم القومي/السجل للمودَع لديه", required: true, type: "text", group: "المودَع لديه" },
    { key: "custodianAddress", label: "عنوان المودَع لديه", required: true, type: "text", group: "المودَع لديه" },

    { key: "depositDescription", label: "وصف الشيء المودَع", required: true, type: "textarea", group: "الوديعة" },
    { key: "depositCondition", label: "حالة الشيء عند الإيداع", required: true, type: "text", group: "الوديعة" },
    { key: "depositValue", label: "القيمة التقديرية (إن وجدت)", required: false, type: "text", group: "الوديعة" },
    { key: "storagePlace", label: "مكان الحفظ", required: false, type: "text", group: "الوديعة" },

    { key: "isPaid", label: "طبيعة الوديعة", required: true, type: "select", group: "الأجر والمدة",
      options: ["وديعة بغير أجر (تبرعاً)", "وديعة بأجر متفق عليه"] },
    { key: "feeAmount", label: "الأجر (إن وجد)", required: false, type: "number", group: "الأجر والمدة" },
    { key: "feeCurrency", label: "العملة", required: false, type: "select", group: "الأجر والمدة",
      options: currencyOptionsAr(EG.currencies) },
    { key: "duration", label: "مدة الإيداع", required: false, type: "text", group: "الأجر والمدة", placeholder: "مثال: حتى يطلب المودِع الاسترداد" },

    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: EG.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: EG.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد وديعة</div>
    <div class="subtitle">مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد الوديعة 718 وما بعدها)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>المودِع:</b> {{depositorName}} — الرقم القومي/السجل: {{depositorId}} — العنوان: {{depositorAddress}}</div>
    <div class="p"><b>المودَع لديه:</b> {{custodianName}} — الرقم القومي/السجل: {{custodianId}} — العنوان: {{custodianAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل الوديعة</div>
    <div class="p"><b>وصف الشيء المودَع:</b> {{depositDescription}}</div>
    <div class="p"><b>الحالة عند الإيداع:</b> {{depositCondition}}</div>
    <div class="p"><b>القيمة التقديرية:</b> {{depositValue}} — <b>مكان الحفظ:</b> {{storagePlace}}</div>
    <div class="clause">تُنقَل بالوديعة حيازة الشيء إلى المودَع لديه ليتولّى حفظه على أن يردّه عيناً عند طلب المودِع (المادة 718 مدني).</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الأجر والمدة</div>
    <div class="p"><b>طبيعة الوديعة:</b> {{isPaid}}</div>
    <div class="p"><b>الأجر:</b> {{feeAmount}} {{feeCurrency}}</div>
    <div class="p"><b>مدة الإيداع:</b> {{duration}}</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: التزامات المودَع لديه</div>
    <ol class="ol">
      <li>يبذل المودَع لديه في حفظ الوديعة العناية التي يبذلها في حفظ ماله، فإن كانت بأجر لزمته عناية الشخص المعتاد (المادة 719 مدني).</li>
      <li>لا يجوز له استعمال الوديعة دون إذن المودِع، ولا إيداعها لدى الغير إلا بإذن أو لضرورة.</li>
      <li>يلتزم بردّ الوديعة بحالتها وقت الاسترداد مع ثمارها التي قبضها، في المكان المتفق عليه.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع المودِع</div><div class="sig-line"></div><div class="sig-name">{{depositorName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع المودَع لديه</div><div class="sig-line"></div><div class="sig-name">{{custodianName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const DEPOSIT_EG_EN: ContractTemplate = {
  id: 4002,
  slug: "eg-deposit-en",
  title: "Deposit / Bailment Agreement (Egypt) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

    { key: "depositorName", label: "Depositor Name", required: true, type: "text", group: "Depositor" },
    { key: "depositorId", label: "Depositor ID / Reg.", required: true, type: "text", group: "Depositor" },
    { key: "depositorAddress", label: "Depositor Address", required: true, type: "text", group: "Depositor" },

    { key: "custodianName", label: "Depositary (Custodian) Name", required: true, type: "text", group: "Depositary" },
    { key: "custodianId", label: "Depositary ID / Reg.", required: true, type: "text", group: "Depositary" },
    { key: "custodianAddress", label: "Depositary Address", required: true, type: "text", group: "Depositary" },

    { key: "depositDescription", label: "Description of Deposited Item", required: true, type: "textarea", group: "Deposit" },
    { key: "depositCondition", label: "Condition at Deposit", required: true, type: "text", group: "Deposit" },
    { key: "depositValue", label: "Estimated Value (if any)", required: false, type: "text", group: "Deposit" },
    { key: "storagePlace", label: "Place of Safekeeping", required: false, type: "text", group: "Deposit" },

    { key: "isPaid", label: "Nature", required: true, type: "select", group: "Fee & Term",
      options: ["Gratuitous", "For an agreed fee"] },
    { key: "feeAmount", label: "Fee (if any)", required: false, type: "number", group: "Fee & Term" },
    { key: "feeCurrency", label: "Currency", required: false, type: "select", group: "Fee & Term",
      options: currencyOptionsEn(EG.currencies) },
    { key: "duration", label: "Duration", required: false, type: "text", group: "Fee & Term" },

    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: EG.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: EG.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Deposit / Bailment Agreement</div>
      <div class="muted">Governed by the Egyptian Civil Code No. 131 of 1948 (Deposit, Arts. 718 ff.).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Depositor:</b> {{depositorName}} — ID/Reg: {{depositorId}} — {{depositorAddress}}</div>
    <div><b>Depositary:</b> {{custodianName}} — ID/Reg: {{custodianId}} — {{custodianAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Subject of Deposit</h3><div class="box">
    <div><b>Item:</b> {{depositDescription}}</div>
    <div><b>Condition:</b> {{depositCondition}}</div>
    <div><b>Value:</b> {{depositValue}} — <b>Storage:</b> {{storagePlace}}</div>
    <div class="muted">The deposit transfers possession to the depositary for safekeeping, to be returned in specie on the depositor's demand (Art. 718 Civil Code).</div>
  </div></div>

  <div class="sec"><h3>3. Fee & Term</h3><div class="box">
    <div><b>Nature:</b> {{isPaid}} — <b>Fee:</b> {{feeAmount}} {{feeCurrency}}</div>
    <div><b>Duration:</b> {{duration}}</div>
  </div></div>

  <div class="sec"><h3>4. Depositary's Duties</h3><div class="box">
    <div class="muted">
      The depositary keeps the item with the care used for their own property; if for a fee, the care of an ordinary person is owed (Art. 719). The item may not be used or sub-deposited without consent, and must be returned in its then-condition with any fruits collected.
    </div>
  </div></div>

  <div class="sec"><h3>5. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Depositor Signature</b><br/><br/>Name: {{depositorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Depositary Signature</b><br/><br/>Name: {{custodianName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
