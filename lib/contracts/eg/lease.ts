// lib/contracts/eg/lease.ts
// عقد إيجار وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد الإيجار 558 وما بعدها).
// ملاحظة: الإيجارات الجديدة تخضع لأحكام القانون المدني (بعد القانون رقم 4 لسنة 1996)،
// دون الخضوع لقوانين إيجار الأماكن القديمة الاستثنائية.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";

const EG = getJurisdiction("EG");

export const LEASE_EG_AR: ContractTemplate = {
  id: 3201,
  slug: "eg-lease-ar",
  title: "عقد إيجار (مصر) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    { key: "lessorName", label: "اسم المؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorId", label: "الرقم القومي/السجل للمؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorAddress", label: "عنوان المؤجر", required: true, type: "text", group: "المؤجر" },
    { key: "lessorPhone", label: "هاتف المؤجر", required: false, type: "text", group: "المؤجر" },

    { key: "lesseeName", label: "اسم المستأجر", required: true, type: "text", group: "المستأجر" },
    { key: "lesseeId", label: "الرقم القومي/السجل للمستأجر", required: true, type: "text", group: "المستأجر" },
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
      options: currencyOptionsAr(EG.currencies) },
    { key: "rentDueDate", label: "دورية السداد", required: true, type: "select", group: "المالية",
      options: ["شهري", "ربع سنوي", "نصف سنوي", "سنوي"] },
    { key: "securityDeposit", label: "مبلغ التأمين", required: false, type: "number", group: "المالية" },

    { key: "maintenanceTerms", label: "أحكام الصيانة والترميمات", required: false, type: "textarea", group: "أحكام إضافية" },
    { key: "terminationNotice", label: "مدة الإخطار قبل الإنهاء", required: true, type: "text", group: "أحكام إضافية", placeholder: "مثال: 30 يوماً" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام إضافية",
      placeholder: EG.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام إضافية",
      placeholder: EG.defaultCourtCityAr },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام إضافية" },

    { key: "lessorSignName", label: "اسم موقع المؤجر", required: true, type: "text", group: "التواقيع" },
    { key: "lesseeSignName", label: "اسم موقع المستأجر", required: true, type: "text", group: "التواقيع" },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد إيجار</div>
    <div class="subtitle">مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> <span class="v">{{contractRef}}</span></div>
      <div><span class="k">التاريخ:</span> <span class="v">{{contractDate}}</span></div>
      <div><span class="k">مدينة الإبرام:</span> <span class="v">{{contractCity}}</span></div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: أطراف العقد</div>
    <table class="tbl">
      <tr>
        <td class="th">المؤجر</td>
        <td>
          <div><b>الاسم:</b> {{lessorName}}</div>
          <div><b>الرقم القومي/السجل:</b> {{lessorId}}</div>
          <div><b>العنوان:</b> {{lessorAddress}}</div>
          <div><b>الهاتف:</b> {{lessorPhone}}</div>
        </td>
      </tr>
      <tr>
        <td class="th">المستأجر</td>
        <td>
          <div><b>الاسم:</b> {{lesseeName}}</div>
          <div><b>الرقم القومي/السجل:</b> {{lesseeId}}</div>
          <div><b>العنوان:</b> {{lesseeAddress}}</div>
          <div><b>الهاتف:</b> {{lesseePhone}}</div>
        </td>
      </tr>
    </table>
  </div>

  <div class="box">
    <div class="h">ثانياً: العين المؤجرة</div>
    <div class="p"><b>الوصف:</b> {{propertyDescription}}</div>
    <div class="p"><b>الموقع:</b> {{propertyLocation}}</div>
    <div class="p"><b>الغرض من الاستعمال:</b> {{usageType}}</div>
    <div class="clause">
      يلتزم المستأجر باستعمال العين فيما أُعدّت له وبما لا يخالف الغرض المتفق عليه، وأن يبذل في المحافظة عليها عناية الشخص المعتاد (المادتان 579 و583 مدني).
    </div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: المدة والقيمة الإيجارية</div>
    <div class="p"><b>مدة الإيجار:</b> من {{leaseStart}} إلى {{leaseEnd}}.</div>
    <div class="p"><b>القيمة الإيجارية:</b> {{rentAmount}} {{rentCurrency}} — تُسدَّد بشكل {{rentDueDate}}.</div>
    <div class="p"><b>مبلغ التأمين:</b> {{securityDeposit}} (يُردّ عند انتهاء العقد بعد خصم ما يستحق على المستأجر إن وجد).</div>
    <div class="clause">
      يلتزم المستأجر بالوفاء بالأجرة في مواعيد استحقاقها، ويلتزم المؤجر بتسليم العين صالحة للانتفاع المتفق عليه وبضمان هذا الانتفاع طوال مدة الإيجار (المواد 564 و567 مدني).
    </div>
  </div>

  <div class="box">
    <div class="h">رابعاً: الصيانة والالتزامات</div>
    <ol class="ol">
      <li>يتحمّل المؤجر الترميمات الضرورية والإصلاحات الجسيمة، ويتحمّل المستأجر الترميمات التأجيرية المعتادة، ما لم يُتفق على خلاف ذلك.</li>
      <li>لا يجوز للمستأجر التنازل عن الإيجار أو التأجير من الباطن إلا بموافقة المؤجر الكتابية، ما لم يوجد اتفاق يبيح ذلك.</li>
      <li><b>أحكام صيانة إضافية:</b> {{maintenanceTerms}}</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: انتهاء العقد وإخلاء العين</div>
    <ol class="ol">
      <li>ينتهي الإيجار بانقضاء مدّته دون حاجة إلى تنبيه بالإخلاء، ما لم يُتفق على خلاف ذلك.</li>
      <li>يلتزم من يرغب في إنهاء العقد قبل مدّته بإخطار الطرف الآخر بمدة لا تقل عن <b>{{terminationNotice}}</b>.</li>
      <li>يلتزم المستأجر عند انتهاء العقد بردّ العين بالحالة التي تسلّمها عليها مع مراعاة الاستهلاك المعتاد.</li>
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
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عن هذا العقد.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig">
      <div class="sig-h">توقيع المؤجر</div>
      <div class="sig-line"></div>
      <div class="sig-name">{{lessorSignName}}</div>
    </div>
    <div class="sig">
      <div class="sig-h">توقيع المستأجر</div>
      <div class="sig-line"></div>
      <div class="sig-name">{{lesseeSignName}}</div>
    </div>
  </div>

  <style>
    .rtl{direction:rtl;text-align:right}
    .doc{font-family:"Noto Naskh Arabic","Amiri",Arial,sans-serif;font-size:16px;line-height:1.9;color:#111;background:#fff;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
    .header{border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin-bottom:12px}
    .title{font-size:20px;font-weight:800;margin-bottom:2px}
    .subtitle{font-size:12px;color:#444;margin-bottom:10px}
    .meta{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#222}
    .k{color:#444}
    .box{border:1px solid #e5e7eb;border-radius:14px;padding:14px;margin:10px 0}
    .h{font-size:15px;font-weight:800;margin-bottom:10px}
    .p{margin:6px 0}
    .muted{color:#666;font-size:12px}
    .tbl{width:100%;border-collapse:collapse}
    .tbl td{border:1px solid #e5e7eb;padding:10px;vertical-align:top}
    .th{width:120px;background:#f7f7f7;font-weight:800}
    .ol{margin:0;padding-right:18px}
    .ol li{margin:6px 0}
    .clause{margin-top:8px;padding:10px;border-radius:12px;background:#fafafa;border:1px dashed #e5e7eb}
    .signs{display:flex;gap:12px;margin-top:14px}
    .sig{flex:1;border:1px solid #e5e7eb;border-radius:14px;padding:12px}
    .sig-h{font-weight:800;margin-bottom:10px}
    .sig-line{height:26px;border-bottom:1px solid #111}
    .sig-name{margin-top:8px;font-size:12px;color:#333}
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>
</div>
  `.trim(),
};

export const LEASE_EG_EN: ContractTemplate = {
  id: 3202,
  slug: "eg-lease-en",
  title: "Lease Agreement (Egypt) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place/City of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

    { key: "lessorName", label: "Lessor (Landlord) Name", required: true, type: "text", group: "Lessor" },
    { key: "lessorId", label: "Lessor National ID / Reg.", required: true, type: "text", group: "Lessor" },
    { key: "lessorAddress", label: "Lessor Address", required: true, type: "text", group: "Lessor" },

    { key: "lesseeName", label: "Lessee (Tenant) Name", required: true, type: "text", group: "Lessee" },
    { key: "lesseeId", label: "Lessee National ID / Reg.", required: true, type: "text", group: "Lessee" },
    { key: "lesseeAddress", label: "Lessee Address", required: true, type: "text", group: "Lessee" },

    { key: "propertyDescription", label: "Description of Premises", required: true, type: "textarea", group: "Premises" },
    { key: "propertyLocation", label: "Location", required: true, type: "text", group: "Premises" },
    { key: "usageType", label: "Type of Use", required: true, type: "select", group: "Premises",
      options: ["Residential", "Commercial", "Administrative/Office", "Industrial", "Agricultural"] },

    { key: "leaseStart", label: "Lease Start Date", required: true, type: "date", group: "Term" },
    { key: "leaseEnd", label: "Lease End Date", required: true, type: "date", group: "Term" },

    { key: "rentAmount", label: "Rent Amount", required: true, type: "number", group: "Financial" },
    { key: "rentCurrency", label: "Currency", required: true, type: "select", group: "Financial",
      options: currencyOptionsEn(EG.currencies) },
    { key: "rentDueDate", label: "Payment Frequency", required: true, type: "select", group: "Financial",
      options: ["Monthly", "Quarterly", "Semi-annual", "Annual"] },
    { key: "securityDeposit", label: "Security Deposit", required: false, type: "number", group: "Financial" },

    { key: "terminationNotice", label: "Notice Period Before Termination", required: true, type: "text", group: "Provisions", placeholder: "e.g. 30 days" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: EG.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: EG.defaultCourtCityEn },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  <style>
    .doc{font-family:Arial,sans-serif;line-height:1.8;font-size:16px;color:#111;background:#fff}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;border-bottom:1px solid #ddd;padding-bottom:10px;margin-bottom:14px}
    .title{font-size:18px;font-weight:700}
    .meta{font-size:12px;color:#444}
    .box{border:1px solid #e5e5e5;border-radius:12px;padding:12px;margin:10px 0}
    .sec{margin:14px 0}
    .sec h3{margin:0 0 6px;font-size:14px}
    .row{display:flex;gap:12px;flex-wrap:wrap}
    .row > div{flex:1;min-width:220px}
    .muted{color:#555;font-size:12px}
    .sig{display:flex;gap:18px;margin-top:18px}
    .sig .sbox{flex:1;border:1px dashed #bbb;border-radius:12px;padding:12px;min-height:110px}
    @media print{.box{border:none !important;border-radius:0 !important;padding:0 !important;margin:10px 0 !important}}
  </style>

  <div class="hdr">
    <div>
      <div class="title">Lease Agreement</div>
      <div class="muted">Governed by the Egyptian Civil Code No. 131 of 1948 (Arts. 558 ff.).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="sec">
      <h3>1. Parties</h3>
      <div class="row">
        <div><b>Lessor:</b> {{lessorName}}<br/><b>ID/Reg:</b> {{lessorId}}<br/><b>Address:</b> {{lessorAddress}}</div>
        <div><b>Lessee:</b> {{lesseeName}}<br/><b>ID/Reg:</b> {{lesseeId}}<br/><b>Address:</b> {{lesseeAddress}}</div>
      </div>
    </div>
  </div>

  <div class="sec">
    <h3>2. Premises & Use</h3>
    <div class="box">
      <div><b>Description:</b> {{propertyDescription}}</div>
      <div><b>Location:</b> {{propertyLocation}}</div>
      <div><b>Permitted Use:</b> {{usageType}}</div>
      <div class="muted">Lessee shall use the premises for the agreed purpose and preserve them with the care of an ordinary person (Arts. 579, 583 Civil Code).</div>
    </div>
  </div>

  <div class="sec">
    <h3>3. Term & Rent</h3>
    <div class="box">
      <div><b>Term:</b> {{leaseStart}} to {{leaseEnd}}</div>
      <div><b>Rent:</b> {{rentAmount}} {{rentCurrency}} — payable {{rentDueDate}}</div>
      <div><b>Security Deposit:</b> {{securityDeposit}}</div>
      <div class="muted">Lessor shall deliver the premises fit for the agreed use and guarantee quiet enjoyment throughout the term (Arts. 564, 567 Civil Code).</div>
    </div>
  </div>

  <div class="sec">
    <h3>4. Maintenance & Termination</h3>
    <div class="box">
      <div class="muted">
        (a) Lessor bears necessary/major repairs; Lessee bears ordinary lessee repairs, unless otherwise agreed.<br/>
        (b) No assignment or sub-lease without the Lessor's written consent unless expressly permitted.<br/>
        (c) Early termination requires at least {{terminationNotice}} prior notice to the other Party.<br/>
        (d) On expiry, Lessee returns the premises in their received condition, subject to fair wear and tear.
      </div>
    </div>
  </div>

  <div class="sec">
    <h3>5. Governing Law & Special Terms</h3>
    <div class="box">
      <div><b>Governing Law:</b> {{governingLaw}}</div>
      <div><b>Jurisdiction/Court:</b> {{disputeCity}}</div>
      <div><b>Special Terms:</b> {{specialTerms}}</div>
      <div class="muted">If left blank, the laws of the Arab Republic of Egypt apply and the courts of {{contractCity}} have jurisdiction.</div>
    </div>
  </div>

  <div class="sig">
    <div class="sbox"><b>Lessor Signature</b><br/><br/>Name: {{lessorName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Lessee Signature</b><br/><br/>Name: {{lesseeName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
