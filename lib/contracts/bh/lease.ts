// lib/contracts/bh/lease.ts
// عقد إيجار وفق القانون المدني البحريني (المرسوم بقانون رقم 19 لسنة 2001) — أحكام الإيجار،
// مع مراعاة قانون إيجار العقارات رقم 27 لسنة 2014 فيما يخضع له.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const BH = getJurisdiction("BH");

export const LEASE_BH_AR: ContractTemplate = {
  id: 19201,
  slug: "bh-lease-ar",
  title: "عقد إيجار (البحرين) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "BH",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "المنامة" },

    { key: "lessorName", label: "اسم المؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorId", label: "الرقم الشخصي/السجل التجاري للمؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorAddress", label: "عنوان المؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorPhone", label: "هاتف المؤجر", required: false, type: "text", group: "المؤجر" },

    { key: "lesseeName", label: "اسم المستأجر", required: true, type: "text", group: "المستأجر" },
    { key: "lesseeId", label: "الرقم الشخصي/السجل التجاري للمستأجر", required: true, type: "text", group: "المستأجر" },
    { key: "lesseeAddress", label: "عنوان المستأجر", required: true, type: "text", group: "المستأجر" },
    { key: "lesseePhone", label: "هاتف المستأجر", required: false, type: "text", group: "المستأجر" },

    { key: "propertyDescription", label: "وصف المأجور", required: true, type: "textarea", group: "محل الإيجار" },
    { key: "propertyLocation", label: "موقع المأجور", required: true, type: "text", group: "محل الإيجار" },
    { key: "usageType", label: "نوع الاستعمال", required: true, type: "select", group: "محل الإيجار",
      options: ["سكني", "تجاري", "إداري/مكتبي", "صناعي", "زراعي"] },

    { key: "leaseStart", label: "تاريخ بدء الإيجار", required: true, type: "date", group: "المدة" },
    { key: "leaseEnd", label: "تاريخ انتهاء الإيجار", required: true, type: "date", group: "المدة" },

    { key: "rentAmount", label: "بدل الإيجار", required: true, type: "number", group: "المالية" },
    { key: "rentCurrency", label: "العملة", required: true, type: "select", group: "المالية",
      options: currencyOptionsAr(BH.currencies) },
    { key: "rentDueDate", label: "دورية السداد", required: true, type: "select", group: "المالية",
      options: ["شهري", "ربع سنوي", "نصف سنوي", "سنوي"] },
    { key: "securityDeposit", label: "مبلغ التأمين", required: false, type: "number", group: "المالية" },

    { key: "maintenanceTerms", label: "أحكام الصيانة والترميمات", required: false, type: "textarea", group: "أحكام إضافية" },
    { key: "terminationNotice", label: "مدة الإشعار قبل الإنهاء", required: true, type: "text", group: "أحكام إضافية", placeholder: "مثال: 30 يوماً" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام إضافية", placeholder: BH.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (المحكمة)", required: true, type: "text", group: "أحكام إضافية", placeholder: BH.defaultCourtCityAr },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام إضافية" },

    { key: "lessorSignName", label: "اسم موقع المؤجر", required: true, type: "text", group: "التواقيع" },
    { key: "lesseeSignName", label: "اسم موقع المستأجر", required: true, type: "text", group: "التواقيع" },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد إيجار</div>
    <div class="subtitle">مصاغ وفق القانون المدني البحريني (المرسوم بقانون رقم 19 لسنة 2001)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: أطراف العقد</div>
    <table class="tbl">
      <tr><td class="th">المؤجر</td><td><b>الاسم:</b> {{lessorName}} — <b>الرقم الشخصي/السجل:</b> {{lessorId}} — <b>العنوان:</b> {{lessorAddress}} — <b>الهاتف:</b> {{lessorPhone}}</td></tr>
      <tr><td class="th">المستأجر</td><td><b>الاسم:</b> {{lesseeName}} — <b>الرقم الشخصي/السجل:</b> {{lesseeId}} — <b>العنوان:</b> {{lesseeAddress}} — <b>الهاتف:</b> {{lesseePhone}}</td></tr>
    </table>
  </div>

  <div class="box">
    <div class="h">ثانياً: المأجور</div>
    <div class="p"><b>الوصف:</b> {{propertyDescription}}</div>
    <div class="p"><b>الموقع:</b> {{propertyLocation}}</div>
    <div class="p"><b>الغرض من الاستعمال:</b> {{usageType}}</div>
    <div class="clause">يلتزم المستأجر باستعمال المأجور فيما أُعدّ له وبما لا يخالف الغرض المتفق عليه، وأن يبذل في المحافظة عليه عناية الشخص المعتاد، عملاً بأحكام الإيجار في القانون المدني البحريني.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: المدة وبدل الإيجار</div>
    <div class="p"><b>مدة الإيجار:</b> من {{leaseStart}} إلى {{leaseEnd}}.</div>
    <div class="p"><b>بدل الإيجار:</b> {{rentAmount}} {{rentCurrency}} — يُسدَّد بشكل {{rentDueDate}}.</div>
    <div class="p"><b>مبلغ التأمين:</b> {{securityDeposit}} (يُردّ عند انتهاء العقد بعد خصم ما يستحق على المستأجر إن وجد).</div>
    <div class="clause">يلتزم المؤجر بتسليم المأجور صالحاً للانتفاع المتفق عليه وبضمان هذا الانتفاع طوال مدة الإيجار، ويلتزم المستأجر بالوفاء ببدل الإيجار في مواعيد استحقاقه.</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: الصيانة والالتزامات</div>
    <ol class="ol">
      <li>يتحمّل المؤجر الإصلاحات الجسيمة الضرورية لبقاء المأجور صالحاً للانتفاع، ويتحمّل المستأجر الترميمات التأجيرية المعتادة، ما لم يُتفق على خلاف ذلك.</li>
      <li>لا يجوز للمستأجر التنازل عن الإيجار أو التأجير من الباطن إلا بموافقة المؤجر الكتابية، ما لم يوجد اتفاق يبيح ذلك.</li>
      <li><b>أحكام صيانة إضافية:</b> {{maintenanceTerms}}</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: انتهاء العقد وإخلاء المأجور</div>
    <ol class="ol">
      <li>ينتهي الإيجار بانقضاء مدّته، مع مراعاة أحكام قانون إيجار العقارات رقم 27 لسنة 2014 واختصاص لجنة المنازعات الإيجارية فيما يخضع له.</li>
      <li>يلتزم من يرغب في إنهاء العقد قبل مدّته بإشعار الطرف الآخر كتابةً بمدة لا تقل عن <b>{{terminationNotice}}</b>.</li>
      <li>يلتزم المستأجر عند انتهاء العقد بردّ المأجور بالحالة التي تسلّمه عليها مع مراعاة الاستهلاك المعتاد.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة</div>
    <div class="p">{{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">سابعاً: القانون الواجب التطبيق وتسوية النزاعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص المحكمة المختصة في <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن هذا العقد.</li>
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

export const LEASE_BH_EN: ContractTemplate = {
  id: 19202,
  slug: "bh-lease-en",
  title: "Lease Agreement (Bahrain) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "BH",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place/City of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Manama" },

    { key: "lessorName", label: "Lessor (Landlord) Name", required: true, type: "text", group: "Lessor" },
    { key: "lessorId", label: "Lessor CPR / CR", required: true, type: "text", group: "Lessor" },
    { key: "lessorAddress", label: "Lessor Address", required: true, type: "text", group: "Lessor" },

    { key: "lesseeName", label: "Lessee (Tenant) Name", required: true, type: "text", group: "Lessee" },
    { key: "lesseeId", label: "Lessee CPR / CR", required: true, type: "text", group: "Lessee" },
    { key: "lesseeAddress", label: "Lessee Address", required: true, type: "text", group: "Lessee" },

    { key: "propertyDescription", label: "Description of Premises", required: true, type: "textarea", group: "Premises" },
    { key: "propertyLocation", label: "Location", required: true, type: "text", group: "Premises" },
    { key: "usageType", label: "Type of Use", required: true, type: "select", group: "Premises",
      options: ["Residential", "Commercial", "Administrative/Office", "Industrial", "Agricultural"] },

    { key: "leaseStart", label: "Lease Start Date", required: true, type: "date", group: "Term" },
    { key: "leaseEnd", label: "Lease End Date", required: true, type: "date", group: "Term" },

    { key: "rentAmount", label: "Rent Amount", required: true, type: "number", group: "Financial" },
    { key: "rentCurrency", label: "Currency", required: true, type: "select", group: "Financial",
      options: currencyOptionsEn(BH.currencies) },
    { key: "rentDueDate", label: "Payment Frequency", required: true, type: "select", group: "Financial",
      options: ["Monthly", "Quarterly", "Semi-annual", "Annual"] },
    { key: "securityDeposit", label: "Security Deposit", required: false, type: "number", group: "Financial" },

    { key: "terminationNotice", label: "Notice Period Before Termination", required: true, type: "text", group: "Provisions", placeholder: "e.g. 30 days" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: BH.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: BH.defaultCourtCityEn },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Lease Agreement</div>
      <div class="muted">Governed by the Bahraini Civil Code (Decree-Law No. 19 of 2001), Lease provisions.</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div class="row">
      <div><b>Lessor:</b> {{lessorName}}<br/><b>CPR/CR:</b> {{lessorId}}<br/><b>Address:</b> {{lessorAddress}}</div>
      <div><b>Lessee:</b> {{lesseeName}}<br/><b>CPR/CR:</b> {{lesseeId}}<br/><b>Address:</b> {{lesseeAddress}}</div>
    </div>
  </div></div>

  <div class="sec"><h3>2. Premises & Use</h3><div class="box">
    <div><b>Description:</b> {{propertyDescription}}</div>
    <div><b>Location:</b> {{propertyLocation}}</div>
    <div><b>Permitted Use:</b> {{usageType}}</div>
    <div class="muted">The Lessee shall use the premises only for the agreed purpose and preserve them with the care of an ordinary person under the Civil Code.</div>
  </div></div>

  <div class="sec"><h3>3. Term & Rent</h3><div class="box">
    <div><b>Term:</b> {{leaseStart}} to {{leaseEnd}}</div>
    <div><b>Rent:</b> {{rentAmount}} {{rentCurrency}} — payable {{rentDueDate}}</div>
    <div><b>Security Deposit:</b> {{securityDeposit}}</div>
    <div class="muted">The Lessor shall deliver the premises fit for the agreed use and guarantee quiet enjoyment throughout the term.</div>
  </div></div>

  <div class="sec"><h3>4. Maintenance & Termination</h3><div class="box">
    <div class="muted">
      (a) The Lessor bears the major repairs needed to keep the premises usable; the Lessee bears ordinary tenant repairs, unless otherwise agreed.<br/>
      (b) No assignment or sub-lease without the Lessor's written consent unless expressly permitted.<br/>
      (c) Early termination requires at least {{terminationNotice}} prior written notice to the other Party.<br/>
      (d) On expiry, the Lessee returns the premises in their received condition, subject to fair wear and tear; the Property Leasing Law No. 27 of 2014 and the Rent Disputes Committee apply to leases within their scope.
    </div>
  </div></div>

  <div class="sec"><h3>5. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction/Court:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
    <div class="muted">If left blank, the laws of the Kingdom of Bahrain apply and the competent court in {{contractCity}} has jurisdiction.</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Lessor Signature</b><br/><br/>Name: {{lessorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Lessee Signature</b><br/><br/>Name: {{lesseeName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
