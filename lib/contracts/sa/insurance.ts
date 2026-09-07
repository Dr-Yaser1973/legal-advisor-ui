// lib/contracts/sa/insurance.ts
// عقد (وثيقة) تأمين تعاوني وفق نظام مراقبة شركات التأمين التعاوني السعودي، وتحت إشراف هيئة التأمين،
// مع القواعد العامة للعقود في نظام المعاملات المدنية (م/191 لسنة 1444هـ).
// ملاحظة: يصدر التأمين عن شركة تأمين مرخّصة؛ هذا النموذج إرشادي لوثيقة تأمين.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const SA = getJurisdiction("SA");

export const INSURANCE_SA_AR: ContractTemplate = {
  id: 12201,
  slug: "sa-insurance-ar",
  title: "عقد (وثيقة) تأمين (السعودية) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "SA",
  fields: [
    { key: "contractRef", label: "رقم الوثيقة", required: true, type: "text", group: "معلومات الوثيقة" },
    { key: "contractDate", label: "تاريخ الإصدار", required: true, type: "date", group: "معلومات الوثيقة" },
    { key: "contractCity", label: "مدينة الإصدار", required: true, type: "text", group: "معلومات الوثيقة", placeholder: "الرياض" },

    { key: "insurerName", label: "اسم شركة التأمين (المؤمِّن)", required: true, type: "text", group: "المؤمِّن" },
    { key: "insurerLicense", label: "رقم ترخيص هيئة التأمين/السجل التجاري", required: true, type: "text", group: "المؤمِّن" },
    { key: "insurerAddress", label: "عنوان المؤمِّن", required: true, type: "text", group: "المؤمِّن" },

    { key: "insuredName", label: "اسم المؤمَّن له", required: true, type: "text", group: "المؤمَّن له" },
    { key: "insuredId", label: "رقم الهوية/السجل للمؤمَّن له", required: true, type: "text", group: "المؤمَّن له" },
    { key: "insuredAddress", label: "عنوان المؤمَّن له", required: true, type: "text", group: "المؤمَّن له" },
    { key: "beneficiary", label: "المستفيد (إن اختلف عن المؤمَّن له)", required: false, type: "text", group: "المؤمَّن له" },

    { key: "insuranceType", label: "نوع التأمين", required: true, type: "select", group: "محل التأمين",
      options: ["تأمين على الأشياء/الممتلكات", "تأمين من المسؤولية", "تأمين الحماية والادخار", "تأمين صحي", "تأمين مركبات", "أخرى"] },
    { key: "insuredSubject", label: "الشيء/الخطر المؤمَّن منه (وصف)", required: true, type: "textarea", group: "محل التأمين" },
    { key: "coveredRisks", label: "الأخطار المُغطّاة", required: true, type: "textarea", group: "محل التأمين" },
    { key: "exclusions", label: "الاستثناءات (الأخطار غير المغطّاة)", required: false, type: "textarea", group: "محل التأمين" },
    { key: "sumInsured", label: "مبلغ التأمين", required: true, type: "number", group: "محل التأمين" },
    { key: "currency", label: "العملة", required: true, type: "select", group: "محل التأمين",
      options: currencyOptionsAr(SA.currencies) },

    { key: "premium", label: "قسط التأمين", required: true, type: "number", group: "القسط والمدة" },
    { key: "premiumSchedule", label: "دورية سداد القسط", required: true, type: "select", group: "القسط والمدة",
      options: ["سنوي", "نصف سنوي", "ربع سنوي", "شهري", "دفعة واحدة"] },
    { key: "coverageStart", label: "بدء سريان التغطية", required: true, type: "date", group: "القسط والمدة" },
    { key: "coverageEnd", label: "انتهاء التغطية", required: true, type: "date", group: "القسط والمدة" },

    { key: "claimProcedure", label: "إجراءات الإخطار بالحادث والمطالبة", required: true, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "النظام الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: SA.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (المحكمة)", required: true, type: "text", group: "أحكام", placeholder: SA.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد (وثيقة) تأمين</div>
    <div class="subtitle">مصاغ وفق نظام مراقبة شركات التأمين التعاوني وتحت إشراف هيئة التأمين، مع القواعد العامة لنظام المعاملات المدنية</div>
    <div class="meta">
      <div><span class="k">رقم الوثيقة:</span> {{contractRef}}</div>
      <div><span class="k">تاريخ الإصدار:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإصدار:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا الوثيقة</div>
    <div class="p"><b>المؤمِّن (الشركة):</b> {{insurerName}} — الترخيص/السجل: {{insurerLicense}} — العنوان: {{insurerAddress}}</div>
    <div class="p"><b>المؤمَّن له:</b> {{insuredName}} — الهوية/السجل: {{insuredId}} — العنوان: {{insuredAddress}}</div>
    <div class="p"><b>المستفيد:</b> {{beneficiary}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل التأمين والتغطية</div>
    <div class="p"><b>نوع التأمين:</b> {{insuranceType}}</div>
    <div class="p"><b>الشيء/الخطر المؤمَّن منه:</b> {{insuredSubject}}</div>
    <div class="p"><b>الأخطار المُغطّاة:</b> {{coveredRisks}}</div>
    <div class="p"><b>الاستثناءات:</b> {{exclusions}}</div>
    <div class="p"><b>مبلغ التأمين:</b> {{sumInsured}} {{currency}}</div>
    <div class="clause">يلتزم المؤمِّن بمقتضى هذه الوثيقة بأن يؤدّي إلى المؤمَّن له أو المستفيد التعويض أو المبلغ المتفق عليه عند تحقّق الخطر المؤمَّن منه، مقابل قسط يؤدّيه المؤمَّن له، ويصدر التأمين عن شركة مرخّصة على أساس التأمين التعاوني وهو الشكل المنظّم للتأمين في المملكة.</div>
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
      <li>يترتب على الكتمان أو البيانات الكاذبة الجوهرية الأثر المقرّر نظاماً على الوثيقة.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: الشروط الخاصة والنظام الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b> ولوائح هيئة التأمين.</li>
      <li>تختص المحكمة المختصة/اللجان المختصة في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
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

export const INSURANCE_SA_EN: ContractTemplate = {
  id: 12202,
  slug: "sa-insurance-en",
  title: "Insurance Policy / Contract (Saudi Arabia) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "SA",
  fields: [
    { key: "contractRef", label: "Policy No.", required: true, type: "text", group: "Policy Info" },
    { key: "contractDate", label: "Issue Date", required: true, type: "date", group: "Policy Info" },
    { key: "contractCity", label: "Place of Issue", required: true, type: "text", group: "Policy Info", placeholder: "Riyadh" },

    { key: "insurerName", label: "Insurer (Company) Name", required: true, type: "text", group: "Insurer" },
    { key: "insurerLicense", label: "Insurance Authority Licence / CR", required: true, type: "text", group: "Insurer" },
    { key: "insurerAddress", label: "Insurer Address", required: true, type: "text", group: "Insurer" },

    { key: "insuredName", label: "Insured Name", required: true, type: "text", group: "Insured" },
    { key: "insuredId", label: "Insured ID / CR", required: true, type: "text", group: "Insured" },
    { key: "insuredAddress", label: "Insured Address", required: true, type: "text", group: "Insured" },
    { key: "beneficiary", label: "Beneficiary (if different)", required: false, type: "text", group: "Insured" },

    { key: "insuranceType", label: "Type of Insurance", required: true, type: "select", group: "Cover",
      options: ["Property", "Liability", "Protection & Savings", "Health", "Motor", "Other"] },
    { key: "insuredSubject", label: "Insured Subject / Risk", required: true, type: "textarea", group: "Cover" },
    { key: "coveredRisks", label: "Covered Risks", required: true, type: "textarea", group: "Cover" },
    { key: "exclusions", label: "Exclusions", required: false, type: "textarea", group: "Cover" },
    { key: "sumInsured", label: "Sum Insured", required: true, type: "number", group: "Cover" },
    { key: "currency", label: "Currency", required: true, type: "select", group: "Cover",
      options: currencyOptionsEn(SA.currencies) },

    { key: "premium", label: "Premium", required: true, type: "number", group: "Premium & Term" },
    { key: "premiumSchedule", label: "Premium Frequency", required: true, type: "select", group: "Premium & Term",
      options: ["Annual", "Semi-annual", "Quarterly", "Monthly", "Single premium"] },
    { key: "coverageStart", label: "Cover Start", required: true, type: "date", group: "Premium & Term" },
    { key: "coverageEnd", label: "Cover End", required: true, type: "date", group: "Premium & Term" },

    { key: "claimProcedure", label: "Notification & Claim Procedure", required: true, type: "textarea", group: "Provisions" },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: SA.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: SA.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Insurance Policy / Contract</div>
      <div class="muted">Issued under the Cooperative Insurance Companies Control Law and supervised by the Insurance Authority, with the general contract rules of the Civil Transactions Law.</div>
    </div>
    <div class="meta">
      <div><b>Policy:</b> {{contractRef}}</div>
      <div><b>Issued:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Insurer:</b> {{insurerName}} — Lic./CR: {{insurerLicense}} — {{insurerAddress}}</div>
    <div><b>Insured:</b> {{insuredName}} — ID/CR: {{insuredId}} — {{insuredAddress}}</div>
    <div><b>Beneficiary:</b> {{beneficiary}}</div>
  </div></div>

  <div class="sec"><h3>2. Subject & Cover</h3><div class="box">
    <div><b>Type:</b> {{insuranceType}}</div>
    <div><b>Insured Subject/Risk:</b> {{insuredSubject}}</div>
    <div><b>Covered Risks:</b> {{coveredRisks}}</div>
    <div><b>Exclusions:</b> {{exclusions}}</div>
    <div><b>Sum Insured:</b> {{sumInsured}} {{currency}}</div>
    <div class="muted">Under this policy the insurer undertakes, against a premium, to pay the insured or beneficiary the agreed indemnity or sum on the occurrence of the insured event. Cover is written by a licensed company on a cooperative-insurance basis, which is the regulated form of insurance in the Kingdom.</div>
  </div></div>

  <div class="sec"><h3>3. Premium & Term</h3><div class="box">
    <div><b>Premium:</b> {{premium}} {{currency}} — <b>Frequency:</b> {{premiumSchedule}}</div>
    <div><b>Cover:</b> {{coverageStart}} to {{coverageEnd}}</div>
  </div></div>

  <div class="sec"><h3>4. Insured's Duties & Claims</h3><div class="box">
    <div class="muted">The insured must disclose material facts accurately at inception, notify any aggravation of the risk, and on an event notify the insurer per: {{claimProcedure}}. Material concealment or misstatement carries the effects fixed by the applicable regulations.</div>
  </div></div>

  <div class="sec"><h3>5. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
    <div class="muted">Disputes are heard by the competent court or the committees designated under the insurance regulations.</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>For the Insurer</b><br/><br/>Name: {{insurerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Insured Signature</b><br/><br/>Name: {{insuredName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
