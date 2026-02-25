import type { ContractTemplate } from "../engine/types";

export const LEASE_AR: ContractTemplate = {
  id: 1201,
  slug: "pro-lease-ar",
  title: "عقد إيجار احترافي (Pro) – عربي",
  lang: "ar",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "رقم العقد", required: true },
    { key: "contractDate", label: "تاريخ العقد (YYYY-MM-DD)", required: true },
    { key: "contractCity", label: "مدينة الإبرام", required: true },

    { key: "lessorName", label: "اسم المؤجر", required: true },
    { key: "lessorId", label: "هوية/سجل المؤجر", required: true },
    { key: "lessorAddress", label: "عنوان المؤجر", required: true },
    { key: "lessorPhone", label: "هاتف المؤجر", required: false },

    { key: "lesseeName", label: "اسم المستأجر", required: true },
    { key: "lesseeId", label: "هوية/سجل المستأجر", required: true },
    { key: "lesseeAddress", label: "عنوان المستأجر", required: true },
    { key: "lesseePhone", label: "هاتف المستأجر", required: false },

    { key: "propertyDescription", label: "وصف المأجور", required: true },
    { key: "propertyLocation", label: "موقع المأجور", required: true },
    { key: "usageType", label: "نوع الاستعمال (سكني/تجاري...)", required: true },

    { key: "leaseStart", label: "تاريخ بدء الإيجار", required: true },
    { key: "leaseEnd", label: "تاريخ انتهاء الإيجار", required: true },

    { key: "rentAmount", label: "بدل الإيجار", required: true },
    { key: "rentCurrency", label: "العملة", required: true },
    { key: "rentDueDate", label: "موعد الاستحقاق (شهري/سنوي)", required: true },

    { key: "securityDeposit", label: "مبلغ التأمين (إن وجد)", required: false },

    { key: "maintenanceTerms", label: "أحكام الصيانة", required: false },
    { key: "terminationNotice", label: "مدة الإشعار قبل الإنهاء", required: true },

    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true },
    { key: "disputeCity", label: "الاختصاص المكاني", required: true },

    { key: "specialTerms", label: "شروط خاصة إضافية", required: false },
  ],

  html: `
<div class="doc rtl">

  <div class="header">
    <div class="title">عقد إيجار</div>
    <div class="subtitle">نموذج احترافي (PRO)</div>
    <div class="meta">
      <div><b>رقم العقد:</b> {{contractRef}}</div>
      <div><b>التاريخ:</b> {{contractDate}}</div>
      <div><b>مدينة الإبرام:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: أطراف العقد</div>

    <p><b>المؤجر:</b> {{lessorName}} – {{lessorId}} – {{lessorAddress}} – {{lessorPhone}}</p>
    <p><b>المستأجر:</b> {{lesseeName}} – {{lesseeId}} – {{lesseeAddress}} – {{lesseePhone}}</p>

    <div class="note">
      ويُشار إليهما معاً بـ "الطرفين".
    </div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل الإيجار</div>
    <p><b>وصف المأجور:</b> {{propertyDescription}}</p>
    <p><b>الموقع:</b> {{propertyLocation}}</p>
    <p><b>نوع الاستعمال:</b> {{usageType}}</p>
  </div>

  <div class="box">
    <div class="h">ثالثاً: مدة الإيجار</div>
    <p>تبدأ مدة الإيجار في {{leaseStart}} وتنتهي في {{leaseEnd}}.</p>
    <p>ولا يجوز تجديد العقد إلا باتفاق خطي بين الطرفين.</p>
  </div>

  <div class="box">
    <div class="h">رابعاً: بدل الإيجار والتأمين</div>
    <p><b>بدل الإيجار:</b> {{rentAmount}} {{rentCurrency}}</p>
    <p><b>موعد الاستحقاق:</b> {{rentDueDate}}</p>
    <p><b>مبلغ التأمين:</b> {{securityDeposit}}</p>

    <div class="clause">
      يلتزم المستأجر بسداد بدل الإيجار في مواعيده المحددة، ويحق للمؤجر المطالبة بالتعويض عن التأخير وفقاً للقانون.
    </div>
  </div>

  <div class="box">
    <div class="h">خامساً: الصيانة والمسؤولية</div>
    <p>{{maintenanceTerms}}</p>
    <ol class="ol">
      <li>يلتزم المستأجر بالمحافظة على المأجور واستعماله وفق الغرض المتفق عليه.</li>
      <li>يتحمل المؤجر الصيانة الهيكلية ما لم يتفق على خلاف ذلك.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">سادساً: الإنهاء والإخلاء</div>
    <p>يجوز لأي من الطرفين إنهاء العقد بإشعار خطي مدته {{terminationNotice}} قبل الإنهاء.</p>
  </div>

  <div class="box">
    <div class="h">سابعاً: القانون والاختصاص</div>
    <p>يخضع هذا العقد لأحكام {{governingLaw}}.</p>
    <p>تختص محاكم {{disputeCity}} بالنظر في أي نزاع.</p>
  </div>

  <div class="box">
    <div class="h">ثامناً: الشروط الخاصة</div>
    <p>{{specialTerms}}</p>
  </div>

  <div class="signs">
    <div class="sig">
      <b>المؤجر</b><br/><br/>
      {{lessorName}}
    </div>
    <div class="sig">
      <b>المستأجر</b><br/><br/>
      {{lesseeName}}
    </div>
  </div>

</div>
`.trim(),
};

export const LEASE_EN: ContractTemplate = {
  id: 1202,
  slug: "pro-lease-en",
  title: "Lease Agreement (PRO) — English",
  lang: "en",
  group: "PRO",

  fields: [
    { key: "contractRef", label: "Contract Ref", required: true },
    { key: "contractDate", label: "Date", required: true },
    { key: "contractCity", label: "Place of Execution", required: true },

    { key: "lessorName", label: "Lessor Name", required: true },
    { key: "lessorId", label: "Lessor ID", required: true },
    { key: "lessorAddress", label: "Lessor Address", required: true },

    { key: "lesseeName", label: "Lessee Name", required: true },
    { key: "lesseeId", label: "Lessee ID", required: true },
    { key: "lesseeAddress", label: "Lessee Address", required: true },

    { key: "propertyDescription", label: "Property Description", required: true },
    { key: "propertyLocation", label: "Property Location", required: true },
    { key: "usageType", label: "Permitted Use", required: true },

    { key: "leaseStart", label: "Lease Start Date", required: true },
    { key: "leaseEnd", label: "Lease End Date", required: true },

    { key: "rentAmount", label: "Rent Amount", required: true },
    { key: "rentCurrency", label: "Currency", required: true },
    { key: "rentDueDate", label: "Due Date", required: true },

    { key: "securityDeposit", label: "Security Deposit", required: false },
    { key: "governingLaw", label: "Governing Law", required: false },
    { key: "disputeCity", label: "Jurisdiction", required: false },
  ],

  html: `
<div class="doc" dir="ltr">

  <h2>Lease Agreement (PRO)</h2>

  <p><b>Ref:</b> {{contractRef}}</p>
  <p><b>Date:</b> {{contractDate}}</p>

  <h3>1. Parties</h3>
  <p><b>Lessor:</b> {{lessorName}}</p>
  <p><b>Lessee:</b> {{lesseeName}}</p>

  <h3>2. Property</h3>
  <p>{{propertyDescription}}</p>
  <p>Location: {{propertyLocation}}</p>
  <p>Permitted Use: {{usageType}}</p>

  <h3>3. Term</h3>
  <p>From {{leaseStart}} to {{leaseEnd}}</p>

  <h3>4. Rent</h3>
  <p>{{rentAmount}} {{rentCurrency}}</p>
  <p>Due: {{rentDueDate}}</p>
  <p>Security Deposit: {{securityDeposit}}</p>

  <h3>5. Governing Law</h3>
  <p>{{governingLaw}}</p>
  <p>Jurisdiction: {{disputeCity}}</p>

  <br/><br/>
  <div>
    <b>Lessor Signature:</b> ___________________
  </div>
  <br/>
  <div>
    <b>Lessee Signature:</b> ___________________
  </div>

</div>
`,
};
