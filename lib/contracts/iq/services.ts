// lib/contracts/iq/services.ts
// عقود الخدمات العراقية (استشارة، تدريب، تسويق، تطوير برمجي، خدمات إلكترونية، ترخيص، إدارة).
// تخضع للقواعد العامة للعقود في القانون المدني العراقي رقم 40 لسنة 1951 (القوة الملزمة
// للعقد وتنفيذه بحسن النية)، مع مراعاة القوانين الخاصة: حماية حق المؤلف رقم 3 لسنة 1971،
// التوقيع الإلكتروني والمعاملات الإلكترونية رقم 78 لسنة 2012، حماية المستهلك رقم 1 لسنة 2010.
import type { ContractTemplate, ContractField } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const IQ = getJurisdiction("IQ");

type ServiceSpec = {
  idBase: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  providerAr: string;
  providerEn: string;
  clientAr: string;
  clientEn: string;
  scopeLabelAr: string;
  scopeLabelEn: string;
  lawNoteAr: string;
  lawNoteEn: string;
  withIp: boolean;
};

function buildServiceContract(s: ServiceSpec): {
  AR: ContractTemplate;
  EN: ContractTemplate;
} {
  const arFields: ContractField[] = [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "بغداد" },

    { key: "providerName", label: `اسم ${s.providerAr}`, required: true, type: "text", group: s.providerAr },
    { key: "providerId", label: "الهوية/السجل التجاري", required: true, type: "text", group: s.providerAr },
    { key: "providerAddress", label: "العنوان", required: true, type: "text", group: s.providerAr },

    { key: "clientName", label: `اسم ${s.clientAr}`, required: true, type: "text", group: s.clientAr },
    { key: "clientId", label: "الهوية/السجل التجاري", required: true, type: "text", group: s.clientAr },
    { key: "clientAddress", label: "العنوان", required: true, type: "text", group: s.clientAr },

    { key: "scope", label: s.scopeLabelAr, required: true, type: "textarea", group: "نطاق العمل" },
    { key: "deliverables", label: "المخرجات/النتائج المتوقعة", required: true, type: "textarea", group: "نطاق العمل" },
    { key: "sla", label: "مستوى الخدمة/المعايير (إن وجدت)", required: false, type: "textarea", group: "نطاق العمل" },

    { key: "feeAmount", label: "قيمة الأتعاب/المقابل", required: true, type: "number", group: "المالية" },
    { key: "feeCurrency", label: "العملة", required: true, type: "select", group: "المالية",
      options: currencyOptionsAr(IQ.currencies) },
    { key: "paymentTerms", label: "شروط ومواعيد السداد", required: true, type: "textarea", group: "المالية" },

    { key: "startDate", label: "تاريخ البدء", required: true, type: "date", group: "المدة" },
    { key: "duration", label: "مدة العقد", required: true, type: "text", group: "المدة", placeholder: "مثال: 6 أشهر قابلة للتجديد" },
    { key: "terminationNotice", label: "مدة الإشعار قبل الإنهاء", required: false, type: "text", group: "المدة", placeholder: "مثال: 15 يوماً" },
  ];

  if (s.withIp) {
    arFields.push({
      key: "ipOwnership", label: "ملكية المخرجات وحقوق الملكية الفكرية", required: true, type: "select", group: "الملكية والسرية",
      options: ["تؤول ملكية المخرجات للعميل بعد سداد كامل المقابل", "يحتفظ مقدّم الخدمة بالملكية ويمنح العميل ترخيصاً بالاستخدام"],
    });
  }
  arFields.push(
    { key: "confidentiality", label: "بند السرية", required: false, type: "textarea", group: "الملكية والسرية" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: IQ.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: IQ.defaultCourtCityAr },
  );

  const arIpBlock = s.withIp
    ? `
  <div class="box">
    <div class="h">خامساً: الملكية الفكرية</div>
    <div class="p">{{ipOwnership}}</div>
    <div class="clause">تخضع حقوق المؤلف والمصنفات (ومنها البرمجيات) لأحكام قانون حماية حق المؤلف العراقي رقم 3 لسنة 1971 وتعديلاته؛ ولا يجوز لأي طرف استعمال علامات أو مصنفات الطرف الآخر خارج حدود هذا العقد.</div>
  </div>`
    : "";

  const AR: ContractTemplate = {
    id: s.idBase + 1,
    slug: `iq-${s.slug}-ar`,
    title: `${s.titleAr} (العراق) – عربي`,
    lang: "ar",
    group: "PRO",
    jurisdiction: "IQ",
    fields: arFields,
    html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">${s.titleAr}</div>
    <div class="subtitle">${s.lawNoteAr}</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>${s.providerAr}:</b> {{providerName}} — الهوية/السجل: {{providerId}} — العنوان: {{providerAddress}}</div>
    <div class="p"><b>${s.clientAr}:</b> {{clientName}} — الهوية/السجل: {{clientId}} — العنوان: {{clientAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: نطاق العمل والمخرجات</div>
    <div class="p"><b>${s.scopeLabelAr}:</b> {{scope}}</div>
    <div class="p"><b>المخرجات المتوقعة:</b> {{deliverables}}</div>
    <div class="p"><b>مستوى الخدمة/المعايير:</b> {{sla}}</div>
    <div class="clause">العقد ملزم للطرفين فلا يجوز نقضه ولا تعديله إلا باتفاقهما أو للأسباب التي يقرّرها القانون، ويجب تنفيذه بما يتفق مع حسن النية، عملاً بأحكام القانون المدني العراقي.</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: المقابل المالي والسداد</div>
    <div class="p"><b>قيمة المقابل:</b> {{feeAmount}} {{feeCurrency}}</div>
    <div class="p"><b>شروط ومواعيد السداد:</b> {{paymentTerms}}</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: المدة والإنهاء</div>
    <div class="p"><b>تاريخ البدء:</b> {{startDate}} — <b>المدة:</b> {{duration}}</div>
    <div class="p"><b>الإشعار قبل الإنهاء:</b> {{terminationNotice}}</div>
    <div class="p">يجوز لأي طرف إنهاء العقد بإشعار خطي مسبق، مع سداد مقابل ما أُنجز فعلاً حتى تاريخ الإنهاء، ودون إخلال بالتعويض عن الإنهاء غير المبرَّر.</div>
  </div>
${arIpBlock}
  <div class="box">
    <div class="h">${s.withIp ? "سادساً" : "خامساً"}: السرية والشروط الخاصة</div>
    <div class="p"><b>السرية:</b> {{confidentiality}}</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
  </div>

  <div class="box">
    <div class="h">${s.withIp ? "سابعاً" : "سادساً"}: القانون الواجب التطبيق وتسوية النزاعات</div>
    <ol class="ol">
      <li>يخضع هذا العقد ويُفسَّر وفق: <b>{{governingLaw}}</b>.</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع ${s.providerAr}</div><div class="sig-line"></div><div class="sig-name">{{providerName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع ${s.clientAr}</div><div class="sig-line"></div><div class="sig-name">{{clientName}}</div></div>
  </div>
  ${AR_CSS}
</div>
    `.trim(),
  };

  const enFields: ContractField[] = [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Baghdad" },

    { key: "providerName", label: `${s.providerEn} Name`, required: true, type: "text", group: s.providerEn },
    { key: "providerId", label: "ID / Commercial Reg.", required: true, type: "text", group: s.providerEn },
    { key: "providerAddress", label: "Address", required: true, type: "text", group: s.providerEn },

    { key: "clientName", label: `${s.clientEn} Name`, required: true, type: "text", group: s.clientEn },
    { key: "clientId", label: "ID / Commercial Reg.", required: true, type: "text", group: s.clientEn },
    { key: "clientAddress", label: "Address", required: true, type: "text", group: s.clientEn },

    { key: "scope", label: s.scopeLabelEn, required: true, type: "textarea", group: "Scope" },
    { key: "deliverables", label: "Deliverables", required: true, type: "textarea", group: "Scope" },
    { key: "sla", label: "Service Levels / Standards (if any)", required: false, type: "textarea", group: "Scope" },

    { key: "feeAmount", label: "Fee / Consideration", required: true, type: "number", group: "Financial" },
    { key: "feeCurrency", label: "Currency", required: true, type: "select", group: "Financial",
      options: currencyOptionsEn(IQ.currencies) },
    { key: "paymentTerms", label: "Payment Terms", required: true, type: "textarea", group: "Financial" },

    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "duration", label: "Duration", required: true, type: "text", group: "Term" },
    { key: "terminationNotice", label: "Termination Notice", required: false, type: "text", group: "Term" },
  ];
  if (s.withIp) {
    enFields.push({
      key: "ipOwnership", label: "IP Ownership of Deliverables", required: true, type: "select", group: "IP & Confidentiality",
      options: ["Deliverables vest in the Client upon full payment", "Provider retains ownership and grants the Client a licence to use"],
    });
  }
  enFields.push(
    { key: "confidentiality", label: "Confidentiality", required: false, type: "textarea", group: "IP & Confidentiality" },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: IQ.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: IQ.defaultCourtCityEn },
  );

  const enIpBlock = s.withIp
    ? `
  <div class="sec"><h3>5. Intellectual Property</h3><div class="box">
    <div>{{ipOwnership}}</div>
    <div class="muted">Copyright and works (including software) are subject to the Iraqi Copyright Protection Law No. 3 of 1971 (as amended); neither party may use the other's marks or works beyond this contract.</div>
  </div></div>`
    : "";

  const EN: ContractTemplate = {
    id: s.idBase + 2,
    slug: `iq-${s.slug}-en`,
    title: `${s.titleEn} (Iraq) — English`,
    lang: "en",
    group: "PRO",
    jurisdiction: "IQ",
    fields: enFields,
    html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">${s.titleEn}</div>
      <div class="muted">${s.lawNoteEn}</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>${s.providerEn}:</b> {{providerName}} — ID/Reg: {{providerId}} — {{providerAddress}}</div>
    <div><b>${s.clientEn}:</b> {{clientName}} — ID/Reg: {{clientId}} — {{clientAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Scope & Deliverables</h3><div class="box">
    <div><b>${s.scopeLabelEn}:</b> {{scope}}</div>
    <div><b>Deliverables:</b> {{deliverables}}</div>
    <div><b>Service Levels:</b> {{sla}}</div>
    <div class="muted">This Agreement is binding on the Parties and may be amended or rescinded only by mutual consent or on grounds provided by law, and must be performed in good faith under the Iraqi Civil Code.</div>
  </div></div>

  <div class="sec"><h3>3. Fees & Payment</h3><div class="box">
    <div><b>Fee:</b> {{feeAmount}} {{feeCurrency}}</div>
    <div><b>Payment Terms:</b> {{paymentTerms}}</div>
  </div></div>

  <div class="sec"><h3>4. Term & Termination</h3><div class="box">
    <div><b>Start:</b> {{startDate}} — <b>Duration:</b> {{duration}}</div>
    <div><b>Termination Notice:</b> {{terminationNotice}}</div>
    <div class="muted">Either party may terminate on prior written notice, paying for work actually performed to the termination date, without prejudice to compensation for unjustified termination.</div>
  </div></div>
${enIpBlock}
  <div class="sec"><h3>${s.withIp ? "6" : "5"}. Confidentiality & Special Terms</h3><div class="box">
    <div><b>Confidentiality:</b> {{confidentiality}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sec"><h3>${s.withIp ? "7" : "6"}. Governing Law & Disputes</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>${s.providerEn} Signature</b><br/><br/>Name: {{providerName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>${s.clientEn} Signature</b><br/><br/>Name: {{clientName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
    `.trim(),
  };

  return { AR, EN };
}

const GENERAL_LAW_AR =
  "مصاغ وفق القواعد العامة للعقود في القانون المدني العراقي رقم 40 لسنة 1951";
const GENERAL_LAW_EN =
  "Governed by the general contract rules of the Iraqi Civil Code No. 40 of 1951";

const consultancy = buildServiceContract({
  idBase: 9800, slug: "consultancy",
  titleAr: "عقد استشارة", titleEn: "Consultancy Agreement",
  providerAr: "المستشار", providerEn: "Consultant",
  clientAr: "العميل", clientEn: "Client",
  scopeLabelAr: "موضوع الاستشارة ونطاقها", scopeLabelEn: "Consultancy scope",
  lawNoteAr: GENERAL_LAW_AR, lawNoteEn: GENERAL_LAW_EN,
  withIp: true,
});

const training = buildServiceContract({
  idBase: 9810, slug: "training",
  titleAr: "عقد تدريب", titleEn: "Training Agreement",
  providerAr: "مقدّم التدريب", providerEn: "Training Provider",
  clientAr: "الجهة المتدرّبة", clientEn: "Client",
  scopeLabelAr: "البرنامج التدريبي وموضوعاته", scopeLabelEn: "Training programme",
  lawNoteAr: GENERAL_LAW_AR, lawNoteEn: GENERAL_LAW_EN,
  withIp: true,
});

const marketing = buildServiceContract({
  idBase: 9820, slug: "marketing",
  titleAr: "عقد إعلان وتسويق", titleEn: "Advertising & Marketing Agreement",
  providerAr: "الوكالة/مقدّم الخدمة", providerEn: "Agency",
  clientAr: "المُعلِن (العميل)", clientEn: "Advertiser (Client)",
  scopeLabelAr: "الحملة/الخدمات التسويقية والقنوات", scopeLabelEn: "Campaign / marketing services & channels",
  lawNoteAr:
    "مصاغ وفق القانون المدني العراقي رقم 40 لسنة 1951، ومع مراعاة قانون حماية المستهلك رقم 1 لسنة 2010",
  lawNoteEn:
    "Governed by the Iraqi Civil Code No. 40 of 1951, with regard to Consumer Protection Law No. 1 of 2010",
  withIp: true,
});

const software = buildServiceContract({
  idBase: 9830, slug: "software-development",
  titleAr: "عقد تطوير برمجي", titleEn: "Software Development Agreement",
  providerAr: "المطوّر", providerEn: "Developer",
  clientAr: "العميل", clientEn: "Client",
  scopeLabelAr: "نطاق التطوير والمواصفات الفنية", scopeLabelEn: "Development scope & specifications",
  lawNoteAr:
    "مصاغ وفق القانون المدني العراقي رقم 40 لسنة 1951، ومع مراعاة قانون حماية حق المؤلف رقم 3 لسنة 1971",
  lawNoteEn:
    "Governed by the Iraqi Civil Code No. 40 of 1951, with regard to Copyright Protection Law No. 3 of 1971",
  withIp: true,
});

const eservices = buildServiceContract({
  idBase: 9840, slug: "e-services",
  titleAr: "عقد خدمات إلكترونية", titleEn: "Electronic Services Agreement",
  providerAr: "مقدّم الخدمة الإلكترونية", providerEn: "Service Provider",
  clientAr: "المستخدم/العميل", clientEn: "User / Client",
  scopeLabelAr: "الخدمات الإلكترونية ونطاق الاستخدام", scopeLabelEn: "E-services & usage scope",
  lawNoteAr:
    "مصاغ وفق القانون المدني العراقي رقم 40 لسنة 1951، ومع مراعاة قانون التوقيع الإلكتروني والمعاملات الإلكترونية رقم 78 لسنة 2012",
  lawNoteEn:
    "Governed by the Iraqi Civil Code No. 40 of 1951, with regard to the Electronic Signature and Electronic Transactions Law No. 78 of 2012",
  withIp: true,
});

const licensing = buildServiceContract({
  idBase: 9850, slug: "licensing",
  titleAr: "عقد ترخيص", titleEn: "Licensing Agreement",
  providerAr: "المُرخِّص", providerEn: "Licensor",
  clientAr: "المُرخَّص له", clientEn: "Licensee",
  scopeLabelAr: "محل الترخيص ونطاقه (الحقوق/العلامة/البرمجية)", scopeLabelEn: "Licensed subject & scope (rights/mark/software)",
  lawNoteAr:
    "مصاغ وفق القانون المدني العراقي رقم 40 لسنة 1951، ومع مراعاة قانون حماية حق المؤلف رقم 3 لسنة 1971",
  lawNoteEn:
    "Governed by the Iraqi Civil Code No. 40 of 1951, with regard to Copyright Protection Law No. 3 of 1971",
  withIp: true,
});

const management = buildServiceContract({
  idBase: 9860, slug: "management",
  titleAr: "عقد إدارة", titleEn: "Management Agreement",
  providerAr: "المدير/الجهة المديرة", providerEn: "Manager",
  clientAr: "المالك (العميل)", clientEn: "Owner (Client)",
  scopeLabelAr: "الأصول/النشاط محل الإدارة وصلاحياتها", scopeLabelEn: "Managed assets/activity & powers",
  lawNoteAr: GENERAL_LAW_AR, lawNoteEn: GENERAL_LAW_EN,
  withIp: false,
});

export const SERVICE_TEMPLATES: ContractTemplate[] = [
  consultancy.AR, consultancy.EN,
  training.AR, training.EN,
  marketing.AR, marketing.EN,
  software.AR, software.EN,
  eservices.AR, eservices.EN,
  licensing.AR, licensing.EN,
  management.AR, management.EN,
];
