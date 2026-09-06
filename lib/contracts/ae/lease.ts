// lib/contracts/ae/lease.ts
// عقد إيجار وفق قانون المعاملات المدنية الاتحادي الإماراتي رقم 5 لسنة 1985 (أحكام الإيجار).
// ملاحظة: الإيجارات العقارية في بعض الإمارات (كدبي) تخضع أيضاً لقوانين إيجار محلية
// وجهات تنظيمية (مثل قانون تنظيم العلاقة الإيجارية في إمارة دبي).
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const AE = getJurisdiction("AE");

export const LEASE_AE_AR: ContractTemplate = {
  id: 5201,
  slug: "ae-lease-ar",
  title: "عقد إيجار (الإمارات) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "دبي" },

    { key: "lessorName", label: "اسم المؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorId", label: "الهوية/الرخصة للمؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorAddress", label: "عنوان المؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorPhone", label: "هاتف المؤجر", required: false, type: "text", group: "المؤجر" },

    { key: "lesseeName", label: "اسم المستأجر", required: true, type: "text", group: "المستأجر" },
    { key: "lesseeId", label: "الهوية/الرخصة للمستأجر", required: true, type: "text", group: "المستأجر" },
    { key: "lesseeAddress", label: "عنوان المستأجر", required: true, type: "text", group: "المستأجر" },
    { key: "lesseePhone", label: "هاتف المستأجر", required: false, type: "text", group: "المستأجر" },

    { key: "propertyDescription", label: "وصف العين المؤجرة", required: true, type: "textarea", group: "محل الإيجار" },
    { key: "propertyLocation", label: "موقع العين المؤجرة", required: true, type: "text", group: "محل الإيجار" },
    { key: "usageType", label: "نوع الاستعمال", required: true, type: "select", group: "محل الإيجار",
      options: ["سكني", "تجاري", "إداري/مكتبي", "صناعي", "زراعي"] },

    { key: "leaseStart", label: "تاريخ بدء الإيجار", required: true, type: "date", group: "المدة" },
    { key: "leaseEnd", label: "تاريخ انتهاء الإيجار", required: true, type: "date", group: "المدة" },

    { key: "rentAmount", label: "القيمة الإيجارية", required: true, type: "number", group: "المالية" },
    { key: "rentCurrency", label: "العملة", required: true, type: "select", group: "المالية",
      options: currencyOptionsAr(AE.currencies) },
    { key: "rentDueDate", label: "دورية السداد", required: true, type: "select", group: "المالية",
      options: ["سنوي (دفعة واحدة)", "نصف سنوي", "ربع سنوي", "شهري"] },
    { key: "securityDeposit", label: "مبلغ التأمين", required: false, type: "number", group: "المالية" },

    { key: "maintenanceTerms", label: "أحكام الصيانة", required: false, type: "textarea", group: "أحكام إضافية" },
    { key: "terminationNotice", label: "مدة الإخطار قبل الإنهاء", required: true, type: "text", group: "أحكام إضافية", placeholder: "مثال: 90 يوماً" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام إضافية", placeholder: AE.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة/لجنة)", required: true, type: "text", group: "أحكام إضافية", placeholder: AE.defaultCourtCityAr },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام إضافية" },

    { key: "lessorSignName", label: "اسم موقع المؤجر", required: true, type: "text", group: "التواقيع" },
    { key: "lesseeSignName", label: "اسم موقع المستأجر", required: true, type: "text", group: "التواقيع" },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد إيجار</div>
    <div class="subtitle">مصاغ وفق قانون المعاملات المدنية الاتحادي رقم 5 لسنة 1985</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: أطراف العقد</div>
    <table class="tbl">
      <tr><td class="th">المؤجر</td><td><b>الاسم:</b> {{lessorName}} — <b>الهوية/الرخصة:</b> {{lessorId}} — <b>العنوان:</b> {{lessorAddress}} — <b>الهاتف:</b> {{lessorPhone}}</td></tr>
      <tr><td class="th">المستأجر</td><td><b>الاسم:</b> {{lesseeName}} — <b>الهوية/الرخصة:</b> {{lesseeId}} — <b>العنوان:</b> {{lesseeAddress}} — <b>الهاتف:</b> {{lesseePhone}}</td></tr>
    </table>
  </div>

  <div class="box">
    <div class="h">ثانياً: العين المؤجرة</div>
    <div class="p"><b>الوصف:</b> {{propertyDescription}}</div>
    <div class="p"><b>الموقع:</b> {{propertyLocation}}</div>
    <div class="p"><b>الغرض من الاستعمال:</b> {{usageType}}</div>
    <div class="clause">يلتزم المستأجر باستعمال العين فيما أُعدّت له وبما لا يخالف الغرض المتفق عليه، وأن يبذل في المحافظة عليها عناية الشخص المعتاد.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: المدة والقيمة الإيجارية</div>
    <div class="p"><b>مدة الإيجار:</b> من {{leaseStart}} إلى {{leaseEnd}}.</div>
    <div class="p"><b>القيمة الإيجارية:</b> {{rentAmount}} {{rentCurrency}} — تُسدَّد بشكل {{rentDueDate}}.</div>
    <div class="p"><b>مبلغ التأمين:</b> {{securityDeposit}} (يُردّ عند انتهاء العقد بعد خصم ما يستحق على المستأجر إن وجد).</div>
    <div class="clause">يلتزم المؤجر بتسليم العين صالحة للانتفاع المتفق عليه وبضمان هذا الانتفاع طوال المدة، ويلتزم المستأجر بالوفاء بالأجرة في مواعيدها.</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: الصيانة والالتزامات</div>
    <ol class="ol">
      <li>يتحمّل المؤجر الإصلاحات الجسيمة الضرورية، ويتحمّل المستأجر الصيانة التأجيرية المعتادة، ما لم يُتفق على خلاف ذلك.</li>
      <li>لا يجوز للمستأجر التأجير من الباطن أو التنازل عن الإيجار إلا بموافقة المؤجر الكتابية، ما لم يوجد اتفاق يبيح ذلك.</li>
      <li><b>أحكام صيانة إضافية:</b> {{maintenanceTerms}}</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: انتهاء العقد وإخلاء العين</div>
    <ol class="ol">
      <li>ينتهي الإيجار بانقضاء مدّته، ويلتزم من يرغب في الإنهاء المبكر بإخطار الطرف الآخر بمدة لا تقل عن <b>{{terminationNotice}}</b>.</li>
      <li>يلتزم المستأجر عند انتهاء العقد بردّ العين بالحالة التي تسلّمها عليها مع مراعاة الاستهلاك المعتاد.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b> ووفق القوانين الإيجارية المحلية بالإمارة المعنية إن وُجدت.</li>
      <li>تختص محاكم/لجان <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع المؤجر</div><div class="sig-line"></div><div class="sig-name">{{lessorSignName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع المستأجر</div><div class="sig-line"></div><div class="sig-name">{{lesseeSignName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const LEASE_AE_EN: ContractTemplate = {
  id: 5202,
  slug: "ae-lease-en",
  title: "Lease Agreement (UAE) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "AE",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place/City of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Dubai" },

    { key: "lessorName", label: "Lessor (Landlord) Name", required: true, type: "text", group: "Lessor" },
    { key: "lessorId", label: "Lessor Emirates ID / Licence", required: true, type: "text", group: "Lessor" },
    { key: "lessorAddress", label: "Lessor Address", required: true, type: "text", group: "Lessor" },

    { key: "lesseeName", label: "Lessee (Tenant) Name", required: true, type: "text", group: "Lessee" },
    { key: "lesseeId", label: "Lessee Emirates ID / Licence", required: true, type: "text", group: "Lessee" },
    { key: "lesseeAddress", label: "Lessee Address", required: true, type: "text", group: "Lessee" },

    { key: "propertyDescription", label: "Description of Premises", required: true, type: "textarea", group: "Premises" },
    { key: "propertyLocation", label: "Location", required: true, type: "text", group: "Premises" },
    { key: "usageType", label: "Type of Use", required: true, type: "select", group: "Premises",
      options: ["Residential", "Commercial", "Administrative/Office", "Industrial", "Agricultural"] },

    { key: "leaseStart", label: "Lease Start Date", required: true, type: "date", group: "Term" },
    { key: "leaseEnd", label: "Lease End Date", required: true, type: "date", group: "Term" },

    { key: "rentAmount", label: "Rent Amount", required: true, type: "number", group: "Financial" },
    { key: "rentCurrency", label: "Currency", required: true, type: "select", group: "Financial",
      options: currencyOptionsEn(AE.currencies) },
    { key: "rentDueDate", label: "Payment Frequency", required: true, type: "select", group: "Financial",
      options: ["Annual (single)", "Semi-annual", "Quarterly", "Monthly"] },
    { key: "securityDeposit", label: "Security Deposit", required: false, type: "number", group: "Financial" },

    { key: "terminationNotice", label: "Notice Period Before Termination", required: true, type: "text", group: "Provisions", placeholder: "e.g. 90 days" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: AE.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: AE.defaultCourtCityEn },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Lease Agreement</div>
      <div class="muted">Governed by the UAE Civil Transactions Law No. 5 of 1985 (and local tenancy laws where applicable).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div class="row">
      <div><b>Lessor:</b> {{lessorName}}<br/><b>ID/Licence:</b> {{lessorId}}<br/><b>Address:</b> {{lessorAddress}}</div>
      <div><b>Lessee:</b> {{lesseeName}}<br/><b>ID/Licence:</b> {{lesseeId}}<br/><b>Address:</b> {{lesseeAddress}}</div>
    </div>
  </div></div>

  <div class="sec"><h3>2. Premises & Use</h3><div class="box">
    <div><b>Description:</b> {{propertyDescription}}</div>
    <div><b>Location:</b> {{propertyLocation}}</div>
    <div><b>Permitted Use:</b> {{usageType}}</div>
    <div class="muted">The Lessee shall use the premises for the agreed purpose and preserve them with reasonable care.</div>
  </div></div>

  <div class="sec"><h3>3. Term & Rent</h3><div class="box">
    <div><b>Term:</b> {{leaseStart}} to {{leaseEnd}}</div>
    <div><b>Rent:</b> {{rentAmount}} {{rentCurrency}} — payable {{rentDueDate}}</div>
    <div><b>Security Deposit:</b> {{securityDeposit}}</div>
    <div class="muted">Lessor shall deliver the premises fit for the agreed use and guarantee quiet enjoyment throughout the term.</div>
  </div></div>

  <div class="sec"><h3>4. Maintenance & Termination</h3><div class="box">
    <div class="muted">
      (a) Lessor bears necessary major repairs; Lessee bears ordinary lessee maintenance, unless otherwise agreed.<br/>
      (b) No sub-lease or assignment without the Lessor's written consent unless expressly permitted.<br/>
      (c) Early termination requires at least {{terminationNotice}} prior notice.<br/>
      (d) On expiry, Lessee returns the premises in their received condition, subject to fair wear and tear.
    </div>
  </div></div>

  <div class="sec"><h3>5. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction/Court:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
    <div class="muted">If left blank, the laws of the UAE and the applicable local tenancy law govern, and the courts/committees of {{contractCity}} have jurisdiction.</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Lessor Signature</b><br/><br/>Name: {{lessorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Lessee Signature</b><br/><br/>Name: {{lesseeName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
