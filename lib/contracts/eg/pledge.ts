// lib/contracts/eg/pledge.ts
// عقد رهن حيازي (ضمان دين) وفق القانون المدني المصري رقم 131 لسنة 1948
// (الرهن الحيازي: المواد 1096 وما بعدها؛ ويُشار إلى الرهن الرسمي: المواد 1030 وما بعدها).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "./_shared";

const EG = getJurisdiction("EG");

export const PLEDGE_EG_AR: ContractTemplate = {
  id: 3701,
  slug: "eg-pledge-ar",
  title: "عقد رهن حيازي (مصر) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    { key: "pledgorName", label: "اسم الراهن", required: true, type: "text", group: "الراهن" },
    { key: "pledgorId", label: "الرقم القومي/السجل للراهن", required: true, type: "text", group: "الراهن" },
    { key: "pledgorAddress", label: "عنوان الراهن", required: true, type: "text", group: "الراهن" },

    { key: "pledgeeName", label: "اسم المرتهن (الدائن)", required: true, type: "text", group: "المرتهن" },
    { key: "pledgeeId", label: "الرقم القومي/السجل للمرتهن", required: true, type: "text", group: "المرتهن" },
    { key: "pledgeeAddress", label: "عنوان المرتهن", required: true, type: "text", group: "المرتهن" },

    { key: "debtDescription", label: "وصف الدين المضمون وسببه", required: true, type: "textarea", group: "الدين المضمون" },
    { key: "debtAmount", label: "مقدار الدين", required: true, type: "number", group: "الدين المضمون" },
    { key: "debtCurrency", label: "العملة", required: true, type: "select", group: "الدين المضمون",
      options: currencyOptionsAr(EG.currencies) },
    { key: "debtDueDate", label: "تاريخ استحقاق الدين", required: true, type: "date", group: "الدين المضمون" },

    { key: "pledgedAsset", label: "وصف المال المرهون (منقول/عقار)", required: true, type: "textarea", group: "المرهون" },
    { key: "assetValue", label: "القيمة التقديرية للمرهون", required: false, type: "text", group: "المرهون" },
    { key: "possession", label: "من يحوز المرهون", required: true, type: "select", group: "المرهون",
      options: ["يُسلَّم المرهون إلى المرتهن", "يُسلَّم إلى عدل (شخص ثالث) يتفق عليه الطرفان"] },

    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: EG.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: EG.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد رهن حيازي (ضماناً لدين)</div>
    <div class="subtitle">مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948 (الرهن الحيازي: المواد 1096 وما بعدها)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>الراهن:</b> {{pledgorName}} — الرقم القومي/السجل: {{pledgorId}} — العنوان: {{pledgorAddress}}</div>
    <div class="p"><b>المرتهن (الدائن):</b> {{pledgeeName}} — الرقم القومي/السجل: {{pledgeeId}} — العنوان: {{pledgeeAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: الدين المضمون</div>
    <div class="p"><b>وصف الدين وسببه:</b> {{debtDescription}}</div>
    <div class="p"><b>مقدار الدين:</b> {{debtAmount}} {{debtCurrency}} — <b>تاريخ الاستحقاق:</b> {{debtDueDate}}</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: المال المرهون وحيازته</div>
    <div class="p"><b>وصف المرهون:</b> {{pledgedAsset}}</div>
    <div class="p"><b>القيمة التقديرية:</b> {{assetValue}}</div>
    <div class="p"><b>الحيازة:</b> {{possession}}</div>
    <div class="clause">لا يتمّ الرهن الحيازي إلا بتسليم المرهون إلى المرتهن أو إلى عدلٍ يتفق عليه الطرفان، ويبقى المرهون محبوساً ضماناً للدين وملحقاته (المواد 1096 و1104 مدني).</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: التزامات الطرفين</div>
    <ol class="ol">
      <li>يحافظ المرتهن (أو العدل) على المرهون بعناية الشخص المعتاد، ويردّه عند الوفاء بالدين كاملاً.</li>
      <li>للراهن ثمار المرهون ما لم يُتفق على أن تُخصم من الدين. ولا يجوز للمرتهن استعمال المرهون أو تملّكه دون إجراءات القانون.</li>
      <li>يقع باطلاً كل اتفاق يجعل المرهون ملكاً للمرتهن عند عدم الوفاء (شرط الطريق الممهّد/تملّك المرهون — المادة 1052 مدني).</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: التنفيذ عند عدم الوفاء</div>
    <div class="p">إذا لم يُوفَّ الدين في ميعاده جاز للمرتهن التنفيذ على المرهون وبيعه بالمزاد وفق الإجراءات القانونية واستيفاء دينه من ثمنه بحق الأولوية، ويُردّ الفائض للراهن.</div>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع الراهن</div><div class="sig-line"></div><div class="sig-name">{{pledgorName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع المرتهن</div><div class="sig-line"></div><div class="sig-name">{{pledgeeName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const PLEDGE_EG_EN: ContractTemplate = {
  id: 3702,
  slug: "eg-pledge-en",
  title: "Possessory Pledge Agreement (Egypt) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

    { key: "pledgorName", label: "Pledgor Name", required: true, type: "text", group: "Pledgor" },
    { key: "pledgorId", label: "Pledgor ID / Reg.", required: true, type: "text", group: "Pledgor" },
    { key: "pledgorAddress", label: "Pledgor Address", required: true, type: "text", group: "Pledgor" },

    { key: "pledgeeName", label: "Pledgee (Creditor) Name", required: true, type: "text", group: "Pledgee" },
    { key: "pledgeeId", label: "Pledgee ID / Reg.", required: true, type: "text", group: "Pledgee" },
    { key: "pledgeeAddress", label: "Pledgee Address", required: true, type: "text", group: "Pledgee" },

    { key: "debtDescription", label: "Secured Debt & Cause", required: true, type: "textarea", group: "Secured Debt" },
    { key: "debtAmount", label: "Debt Amount", required: true, type: "number", group: "Secured Debt" },
    { key: "debtCurrency", label: "Currency", required: true, type: "select", group: "Secured Debt",
      options: currencyOptionsEn(EG.currencies) },
    { key: "debtDueDate", label: "Due Date", required: true, type: "date", group: "Secured Debt" },

    { key: "pledgedAsset", label: "Pledged Asset (movable/immovable)", required: true, type: "textarea", group: "Pledged Asset" },
    { key: "assetValue", label: "Estimated Value", required: false, type: "text", group: "Pledged Asset" },
    { key: "possession", label: "Holder of the Asset", required: true, type: "select", group: "Pledged Asset",
      options: ["Delivered to the Pledgee", "Delivered to an agreed third-party custodian"] },

    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: EG.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: EG.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Possessory Pledge Agreement</div>
      <div class="muted">Governed by the Egyptian Civil Code No. 131 of 1948 (Possessory Pledge, Arts. 1096 ff.).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Pledgor:</b> {{pledgorName}} — ID/Reg: {{pledgorId}} — {{pledgorAddress}}</div>
    <div><b>Pledgee (Creditor):</b> {{pledgeeName}} — ID/Reg: {{pledgeeId}} — {{pledgeeAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Secured Debt</h3><div class="box">
    <div><b>Debt & Cause:</b> {{debtDescription}}</div>
    <div><b>Amount:</b> {{debtAmount}} {{debtCurrency}} — <b>Due:</b> {{debtDueDate}}</div>
  </div></div>

  <div class="sec"><h3>3. Pledged Asset & Possession</h3><div class="box">
    <div><b>Asset:</b> {{pledgedAsset}}</div>
    <div><b>Estimated Value:</b> {{assetValue}}</div>
    <div><b>Possession:</b> {{possession}}</div>
    <div class="muted">A possessory pledge is perfected only by delivering the asset to the Pledgee or an agreed custodian; it is retained as security for the debt and its accessories (Arts. 1096, 1104 Civil Code).</div>
  </div></div>

  <div class="sec"><h3>4. Obligations</h3><div class="box">
    <div class="muted">
      The Pledgee/custodian preserves the asset with the care of an ordinary person and returns it upon full payment. Any clause vesting ownership of the asset in the Pledgee upon default is void (Art. 1052 Civil Code).
    </div>
  </div></div>

  <div class="sec"><h3>5. Enforcement on Default</h3><div class="box">
    <div class="muted">On default, the Pledgee may enforce against the asset, sell it by public auction under the statutory procedure, recover the debt from the proceeds by priority, and return any surplus to the Pledgor.</div>
  </div></div>

  <div class="sec"><h3>6. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Pledgor Signature</b><br/><br/>Name: {{pledgorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Pledgee Signature</b><br/><br/>Name: {{pledgeeName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
