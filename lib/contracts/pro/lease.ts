import type { ContractTemplate } from "../engine/types";

export const LEASE_AR: ContractTemplate = {
  id: 1201,
  slug: "pro-lease-ar",
  title: "عقد إيجار احترافي (Pro) – عربي",
  lang: "ar",
  group: "PRO",

   fields: [
  // ── معلومات العقد ──
  { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
  { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
  { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد" },

  // ── المؤجر ──
  { key: "lessorName", label: "اسم المؤجر", required: true, type: "text", group: "المؤجر" },
  { key: "lessorId", label: "هوية/سجل المؤجر", required: true, type: "text", group: "المؤجر" },
  { key: "lessorAddress", label: "عنوان المؤجر", required: true, type: "text", group: "المؤجر" },
  { key: "lessorPhone", label: "هاتف المؤجر", required: false, type: "text", group: "المؤجر" },

  // ── المستأجر ──
  { key: "lesseeName", label: "اسم المستأجر", required: true, type: "text", group: "المستأجر" },
  { key: "lesseeId", label: "هوية/سجل المستأجر", required: true, type: "text", group: "المستأجر" },
  { key: "lesseeAddress", label: "عنوان المستأجر", required: true, type: "text", group: "المستأجر" },
  { key: "lesseePhone", label: "هاتف المستأجر", required: false, type: "text", group: "المستأجر" },

  // ── محل الإيجار ──
  { key: "propertyDescription", label: "وصف المأجور", required: true, type: "textarea", group: "محل الإيجار" },
  { key: "propertyLocation", label: "موقع المأجور", required: true, type: "text", group: "محل الإيجار" },
  { key: "usageType", label: "نوع الاستعمال", required: true, type: "select", group: "محل الإيجار",
    options: ["سكني", "تجاري", "صناعي", "زراعي", "مكتبي"] },

  // ── المدة ──
  { key: "leaseStart", label: "تاريخ بدء الإيجار", required: true, type: "date", group: "المدة" },
  { key: "leaseEnd", label: "تاريخ انتهاء الإيجار", required: true, type: "date", group: "المدة" },

  // ── المالية ──
  { key: "rentAmount", label: "بدل الإيجار", required: true, type: "number", group: "المالية" },
  { key: "rentCurrency", label: "العملة", required: true, type: "select", group: "المالية",
    options: ["دينار عراقي", "دولار أمريكي", "يورو"] },
  { key: "rentDueDate", label: "موعد الاستحقاق", required: true, type: "select", group: "المالية",
    options: ["شهري", "ربع سنوي", "نصف سنوي", "سنوي"] },
  { key: "securityDeposit", label: "مبلغ التأمين", required: false, type: "number", group: "المالية" },

  // ── أحكام ──
  { key: "maintenanceTerms", label: "أحكام الصيانة", required: false, type: "textarea", group: "أحكام إضافية" },
  { key: "terminationNotice", label: "مدة الإشعار قبل الإنهاء", required: true, type: "text", group: "أحكام إضافية",
    placeholder: "مثال: 30 يوماً" },
  { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام إضافية",
    placeholder: "القانون المدني العراقي رقم 40 لسنة 1951" },
  { key: "disputeCity", label: "الاختصاص المكاني", required: true, type: "text", group: "أحكام إضافية",
    placeholder: "بغداد" },
  { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام إضافية" },
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
    // ── Contract Info ──
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info" },

    // ── Lessor ──
    { key: "lessorName", label: "Lessor Name", required: true, type: "text", group: "Lessor" },
    { key: "lessorId", label: "Lessor ID", required: true, type: "text", group: "Lessor" },
    { key: "lessorAddress", label: "Lessor Address", required: true, type: "text", group: "Lessor" },
    { key: "lessorPhone", label: "Lessor Phone", required: false, type: "text", group: "Lessor" },

    // ── Lessee ──
    { key: "lesseeName", label: "Lessee Name", required: true, type: "text", group: "Lessee" },
    { key: "lesseeId", label: "Lessee ID", required: true, type: "text", group: "Lessee" },
    { key: "lesseeAddress", label: "Lessee Address", required: true, type: "text", group: "Lessee" },
    { key: "lesseePhone", label: "Lessee Phone", required: false, type: "text", group: "Lessee" },

    // ── Property ──
    { key: "propertyDescription", label: "Property Description", required: true, type: "textarea", group: "Property" },
    { key: "propertyLocation", label: "Property Location", required: true, type: "text", group: "Property" },
    { key: "usageType", label: "Permitted Use", required: true, type: "select", group: "Property",
      options: ["Residential", "Commercial", "Industrial", "Agricultural", "Office"] },

    // ── Term ──
    { key: "leaseStart", label: "Lease Start Date", required: true, type: "date", group: "Term" },
    { key: "leaseEnd", label: "Lease End Date", required: true, type: "date", group: "Term" },

    // ── Financial ──
    { key: "rentAmount", label: "Rent Amount", required: true, type: "number", group: "Financial" },
    { key: "rentCurrency", label: "Currency", required: true, type: "select", group: "Financial",
      options: ["IQD", "USD", "EUR"] },
    { key: "rentDueDate", label: "Due Date", required: true, type: "select", group: "Financial",
      options: ["Monthly", "Quarterly", "Semi-annual", "Annual"] },
    { key: "securityDeposit", label: "Security Deposit", required: false, type: "number", group: "Financial" },

    // ── Additional ──
    { key: "maintenanceTerms", label: "Maintenance Terms", required: false, type: "textarea", group: "Additional" },
    { key: "terminationNotice", label: "Termination Notice Period", required: true, type: "text", group: "Additional",
      placeholder: "e.g. 30 days" },
    { key: "governingLaw", label: "Governing Law", required: true, type: "text", group: "Additional",
      placeholder: "Iraqi Civil Code No. 40 of 1951" },
    { key: "disputeCity", label: "Jurisdiction", required: true, type: "text", group: "Additional",
      placeholder: "Baghdad" },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Additional" },
  ],

  html: `
<div class="doc" dir="ltr">

  <div class="header">
    <div class="title">Lease Agreement</div>
    <div class="subtitle">Professional Template (PRO)</div>
    <div class="meta">
      <div><b>Contract Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place of Execution:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">1. Parties</div>
    <p><b>Lessor:</b> {{lessorName}} – {{lessorId}} – {{lessorAddress}} – {{lessorPhone}}</p>
    <p><b>Lessee:</b> {{lesseeName}} – {{lesseeId}} – {{lesseeAddress}} – {{lesseePhone}}</p>
    <div class="note">Hereinafter jointly referred to as "the Parties".</div>
  </div>

  <div class="box">
    <div class="h">2. Leased Property</div>
    <p><b>Description:</b> {{propertyDescription}}</p>
    <p><b>Location:</b> {{propertyLocation}}</p>
    <p><b>Permitted Use:</b> {{usageType}}</p>
  </div>

  <div class="box">
    <div class="h">3. Lease Term</div>
    <p>The lease term commences on {{leaseStart}} and expires on {{leaseEnd}}.</p>
    <p>The contract may not be renewed except by written agreement between the Parties.</p>
  </div>

  <div class="box">
    <div class="h">4. Rent &amp; Security Deposit</div>
    <p><b>Rent:</b> {{rentAmount}} {{rentCurrency}}</p>
    <p><b>Due Date:</b> {{rentDueDate}}</p>
    <p><b>Security Deposit:</b> {{securityDeposit}}</p>
    <div class="clause">
      The Lessee shall pay the rent on its due dates, and the Lessor shall be entitled to claim compensation for delay in accordance with the law.
    </div>
  </div>

  <div class="box">
    <div class="h">5. Maintenance &amp; Liability</div>
    <p>{{maintenanceTerms}}</p>
    <ol class="ol">
      <li>The Lessee shall maintain the property and use it for the agreed purpose.</li>
      <li>The Lessor shall bear structural maintenance unless otherwise agreed.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">6. Termination &amp; Eviction</div>
    <p>Either Party may terminate this contract by written notice of {{terminationNotice}} prior to termination.</p>
  </div>

  <div class="box">
    <div class="h">7. Governing Law &amp; Jurisdiction</div>
    <p>This contract is governed by {{governingLaw}}.</p>
    <p>The courts of {{disputeCity}} shall have jurisdiction over any dispute.</p>
  </div>

  <div class="box">
    <div class="h">8. Special Terms</div>
    <p>{{specialTerms}}</p>
  </div>

  <div class="signs">
    <div class="sig"><b>Lessor</b><br/><br/>{{lessorName}}</div>
    <div class="sig"><b>Lessee</b><br/><br/>{{lesseeName}}</div>
  </div>

</div>
`.trim(),
};