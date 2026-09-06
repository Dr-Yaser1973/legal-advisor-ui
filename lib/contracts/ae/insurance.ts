// lib/contracts/ae/insurance.ts
// عقد (وثيقة) تأمين وفق قانون المعاملات المدنية الاتحادي رقم 5 لسنة 1985 (أحكام التأمين)،
// ومع مراعاة المرسوم بقانون اتحادي رقم 48 لسنة 2023 بشأن تنظيم أعمال التأمين
// (تنظّمه مصرف الإمارات العربية المتحدة المركزي).
// ملاحظة: يصدر التأمين عن شركة تأمين مرخّصة؛ هذا النموذج إرشادي لوثيقة تأمين.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const AE = getJurisdiction("AE");

export const INSURANCE_AE_AR: ContractTemplate = {
  id: 6201,
  slug: "ae-insurance-ar",
  title: "عقد (وثيقة) تأمين (الإمارات) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "رقم الوثيقة", required: true, type: "text", group: "معلومات الوثيقة" },
    { key: "contractDate", label: "تاريخ الإصدار", required: true, type: "date", group: "معلومات الوثيقة" },
    { key: "contractCity", label: "مدينة الإصدار", required: true, type: "text", group: "معلومات الوثيقة", placeholder: "دبي" },

    { key: "insurerName", label: "اسم شركة التأمين (المؤمِّن)", required: true, type: "text", group: "المؤمِّن" },
    { key: "insurerLicense", label: "رقم الترخيص لدى المصرف المركزي/الرخصة التجارية", required: true, type: "text", group: "المؤمِّن" },
    { key: "insurerAddress", label: "عنوان المؤمِّن", required: true, type: "text", group: "المؤمِّن" },

    { key: "insuredName", label: "اسم المؤمَّن له", required: true, type: "text", group: "المؤمَّن له" },
    { key: "insuredId", label: "الهوية/الرخصة للمؤمَّن له", required: true, type: "text", group: "المؤمَّن له" },
    { key: "insuredAddress", label: "عنوان المؤمَّن له", required: true, type: "text", group: "المؤمَّن له" },
    { key: "beneficiary", label: "المستفيد (إن اختلف عن المؤمَّن له)", required: false, type: "text", group: "المؤمَّن له" },

    { key: "insuranceType", label: "نوع التأمين", required: true, type: "select", group: "محل التأمين",
      options: ["تأمين على الأشياء/الممتلكات", "تأمين من المسؤولية", "تأمين على الحياة", "تأمين صحي", "تأمين مركبات", "أخرى"] },
    { key: "insuredSubject", label: "الشيء/الخطر المؤمَّن منه (وصف)", required: true, type: "textarea", group: "محل التأمين" },
    { key: "coveredRisks", label: "الأخطار المُغطّاة", required: true, type: "textarea", group: "محل التأمين" },
    { key: "exclusions", label: "الاستثناءات (الأخطار غير المغطّاة)", required: false, type: "textarea", group: "محل التأمين" },
    { key: "sumInsured", label: "مبلغ التأمين", required: true, type: "number", group: "محل التأمين" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "محل التأمين",
      options: currencyOptionsAr(AE.currencies) },

    { key: "premium", label: "قسط التأمين", required: true, type: "number", group: "القسط والمدة" },
    { key: "premiumSchedule", label: "دورية سداد القسط", required: true, type: "select", group: "القسط والمدة",
      options: ["سنوي", "نصف سنوي", "ربع سنوي", "شهري", "دفعة واحدة"] },
    { key: "coverageStart", label: "بدء سريان التغطية", required: true, type: "date", group: "القسط والمدة" },
    { key: "coverageEnd", label: "انتهاء التغطية", required: true, type: "date", group: "القسط والمدة" },

    { key: "claimProcedure", label: "إجراءات الإخطار بالحادث والمطالبة", required: true, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: AE.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: AE.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد (وثيقة) تأمين</div>
    <div class="subtitle">مصاغ وفق قانون المعاملات المدنية الاتحادي رقم 5 لسنة 1985 والمرسوم بقانون رقم 48 لسنة 2023 بشأن تنظيم أعمال التأمين</div>
    <div class="meta">
      <div><span class="k">رقم الوثيقة:</span> {{contractRef}}</div>
      <div><span class="k">تاريخ الإصدار:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإصدار:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا الوثيقة</div>
    <div class="p"><b>المؤمِّن (الشركة):</b> {{insurerName}} — الترخيص/الرخصة: {{insurerLicense}} — العنوان: {{insurerAddress}}</div>
    <div class="p"><b>المؤمَّن له:</b> {{insuredName}} — الهوية/الرخصة: {{insuredId}} — العنوان: {{insuredAddress}}</div>
    <div class="p"><b>المستفيد:</b> {{beneficiary}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل التأمين والتغطية</div>
    <div class="p"><b>نوع التأمين:</b> {{insuranceType}}</div>
    <div class="p"><b>الشيء/الخطر المؤمَّن منه:</b> {{insuredSubject}}</div>
    <div class="p"><b>الأخطار المُغطّاة:</b> {{coveredRisks}}</div>
    <div class="p"><b>الاستثناءات:</b> {{exclusions}}</div>
    <div class="p"><b>مبلغ التأمين:</b> {{sumInsured}} {{currency}}</div>
    <div class="clause">التأمين عقد يلتزم المؤمِّن بمقتضاه أن يؤدّي إلى المؤمَّن له أو المستفيد مبلغاً من المال أو إيراداً أو أي عوض مالي آخر عند تحقّق الخطر المؤمَّن منه، مقابل قسط يؤدّيه المؤمَّن له، عملاً بأحكام التأمين في قانون المعاملات المدنية.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: القسط ومدة التغطية</div>
    <div class="p"><b>قسط التأمين:</b> {{premium}} {{currency}} — <b>الدورية:</b> {{premiumSchedule}}</div>
    <div class="p"><b>سريان التغطية:</b> من {{coverageStart}} إلى {{coverageEnd}}</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: التزامات المؤمَّن له والمطالبة</div>
    <ol class="ol">
      <li>يلتزم المؤمَّن له بالإدلاء بالبيانات الجوهرية بدقة عند التعاقد، وبإخطار المؤمِّن بما يطرأ من ظروف تزيد الخطر.</li>
      <li>عند تحقّق الخطر يلتزم بإخطار المؤمِّن وفق: {{claimProcedure}}.</li>
      <li>يترتب على الكتمان أو البيانات الكاذبة الجوهرية الأثر المقرّر قانوناً على الوثيقة.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b> وأحكام المرسوم بقانون رقم 48 لسنة 2023 بشأن تنظيم أعمال التأمين.</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">عن المؤمِّن (الشركة)</div><div class="sig-line"></div><div class="sig-name">{{insurerName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع المؤمَّن له</div><div class="sig-line"></div><div class="sig-name">{{insuredName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const INSURANCE_AE_EN: ContractTemplate = {
  id: 6202,
  slug: "ae-insurance-en",
  title: "Insurance Policy / Contract (UAE) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "Policy No.", required: true, type: "text", group: "Policy Info" },
    { key: "contractDate", label: "Issue Date", required: true, type: "date", group: "Policy Info" },
    { key: "contractCity", label: "Place of Issue", required: true, type: "text", group: "Policy Info", placeholder: "Dubai" },

    { key: "insurerName", label: "Insurer (Company) Name", required: true, type: "text", group: "Insurer" },
    { key: "insurerLicense", label: "CBUAE Licence / Trade Licence", required: true, type: "text", group: "Insurer" },
    { key: "insurerAddress", label: "Insurer Address", required: true, type: "text", group: "Insurer" },

    { key: "insuredName", label: "Insured Name", required: true, type: "text", group: "Insured" },
    { key: "insuredId", label: "Insured ID / Licence", required: true, type: "text", group: "Insured" },
    { key: "insuredAddress", label: "Insured Address", required: true, type: "text", group: "Insured" },
    { key: "beneficiary", label: "Beneficiary (if different)", required: false, type: "text", group: "Insured" },

    { key: "insuranceType", label: "Type of Insurance", required: true, type: "select", group: "Cover",
      options: ["Property", "Liability", "Life", "Health", "Motor", "Other"] },
    { key: "insuredSubject", label: "Insured Subject / Risk", required: true, type: "textarea", group: "Cover" },
    { key: "coveredRisks", label: "Covered Risks", required: true, type: "textarea", group: "Cover" },
    { key: "exclusions", label: "Exclusions", required: false, type: "textarea", group: "Cover" },
    { key: "sumInsured", label: "Sum Insured", required: true, type: "number", group: "Cover" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Cover",
      options: currencyOptionsEn(AE.currencies) },

    { key: "premium", label: "Premium", required: true, type: "number", group: "Premium & Term" },
    { key: "premiumSchedule", label: "Premium Frequency", required: true, type: "select", group: "Premium & Term",
      options: ["Annual", "Semi-annual", "Quarterly", "Monthly", "Single premium"] },
    { key: "coverageStart", label: "Cover Start", required: true, type: "date", group: "Premium & Term" },
    { key: "coverageEnd", label: "Cover End", required: true, type: "date", group: "Premium & Term" },

    { key: "claimProcedure", label: "Notification & Claim Procedure", required: true, type: "textarea", group: "Provisions" },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: AE.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: AE.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Insurance Policy / Contract</div>
      <div class="muted">Governed by the UAE Civil Transactions Law No. 5 of 1985 and Decree-Law No. 48 of 2023 on the regulation of insurance activities.</div>
    </div>
    <div class="meta">
      <div><b>Policy:</b> {{contractRef}}</div>
      <div><b>Issued:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Insurer:</b> {{insurerName}} — Lic./Reg: {{insurerLicense}} — {{insurerAddress}}</div>
    <div><b>Insured:</b> {{insuredName}} — ID/Licence: {{insuredId}} — {{insuredAddress}}</div>
    <div><b>Beneficiary:</b> {{beneficiary}}</div>
  </div></div>

  <div class="sec"><h3>2. Subject & Cover</h3><div class="box">
    <div><b>Type:</b> {{insuranceType}}</div>
    <div><b>Insured Subject/Risk:</b> {{insuredSubject}}</div>
    <div><b>Covered Risks:</b> {{coveredRisks}}</div>
    <div><b>Exclusions:</b> {{exclusions}}</div>
    <div><b>Sum Insured:</b> {{sumInsured}} {{currency}}</div>
    <div class="muted">Insurance is a contract whereby the insurer, against a premium, undertakes to pay the insured or beneficiary a sum or benefit on the occurrence of the insured event, under the Civil Transactions Law.</div>
  </div></div>

  <div class="sec"><h3>3. Premium & Term</h3><div class="box">
    <div><b>Premium:</b> {{premium}} {{currency}} — <b>Frequency:</b> {{premiumSchedule}}</div>
    <div><b>Cover:</b> {{coverageStart}} to {{coverageEnd}}</div>
  </div></div>

  <div class="sec"><h3>4. Insured's Duties & Claims</h3><div class="box">
    <div class="muted">The insured must disclose material facts at inception, notify aggravations of risk, and on an event notify the insurer per: {{claimProcedure}}. Material concealment or misstatement carries the effects fixed by law.</div>
  </div></div>

  <div class="sec"><h3>5. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>For the Insurer</b><br/><br/>Name: {{insurerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Insured Signature</b><br/><br/>Name: {{insuredName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
