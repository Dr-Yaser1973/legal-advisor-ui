// lib/contracts/eg/services.ts
// عقود الخدمات المصرية (استشارة، تدريب، تسويق، تطوير برمجي، خدمات إلكترونية، ترخيص، إدارة).
// هذه عقود تخضع للقواعد العامة للعقود في القانون المدني المصري رقم 131 لسنة 1948
// (سلطان الإرادة والقوة الملزمة للعقد — المادتان 147 و148)، مع مراعاة القوانين الخاصة
// المشار إليها في كل عقد (حماية الملكية الفكرية 82/2002، التوقيع الإلكتروني 15/2004،
// حماية البيانات الشخصية 151/2020، حماية المستهلك 181/2018).
import type { ContractTemplate, ContractField } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "./_shared";

const EG = getJurisdiction("EG");

type ServiceSpec = {
  idBase: number; // AR = idBase+1, EN = idBase+2
  slug: string; // بدون بادئة eg-
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
  withIp: boolean; // إدراج بند ملكية المخرجات/الحقوق الفكرية
};

function buildServiceContract(s: ServiceSpec): {
  AR: ContractTemplate;
  EN: ContractTemplate;
} {
  const arFields: ContractField[] = [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    { key: "providerName", label: `اسم ${s.providerAr}`, required: true, type: "text", group: s.providerAr },
    { key: "providerId", label: "الرقم القومي/السجل التجاري", required: true, type: "text", group: s.providerAr },
    { key: "providerAddress", label: "العنوان", required: true, type: "text", group: s.providerAr },

    { key: "clientName", label: `اسم ${s.clientAr}`, required: true, type: "text", group: s.clientAr },
    { key: "clientId", label: "الرقم القومي/السجل التجاري", required: true, type: "text", group: s.clientAr },
    { key: "clientAddress", label: "العنوان", required: true, type: "text", group: s.clientAr },

    { key: "scope", label: s.scopeLabelAr, required: true, type: "textarea", group: "نطاق العمل" },
    { key: "deliverables", label: "المخرجات/النتائج المتوقعة", required: true, type: "textarea", group: "نطاق العمل" },
    { key: "sla", label: "مستوى الخدمة/المعايير (إن وجدت)", required: false, type: "textarea", group: "نطاق العمل" },

    { key: "feeAmount", label: "قيمة الأتعاب/المقابل", required: true, type: "number", group: "المالية" },
    { key: "feeCurrency", label: "العملة", required: true, type: "select", group: "المالية",
      options: currencyOptionsAr(EG.currencies) },
    { key: "paymentTerms", label: "شروط ومواعيد السداد", required: true, type: "textarea", group: "المالية" },

    { key: "startDate", label: "تاريخ البدء", required: true, type: "date", group: "المدة" },
    { key: "duration", label: "مدة العقد", required: true, type: "text", group: "المدة", placeholder: "مثال: 6 أشهر قابلة للتجديد" },
    { key: "terminationNotice", label: "مدة الإخطار قبل الإنهاء", required: false, type: "text", group: "المدة", placeholder: "مثال: 15 يوماً" },
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
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: EG.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: EG.defaultCourtCityAr },
  );

  const arIpBlock = s.withIp
    ? `
  <div class="box">
    <div class="h">خامساً: الملكية الفكرية</div>
    <div class="p">{{ipOwnership}}</div>
    <div class="clause">تخضع حقوق المؤلف والحقوق المجاورة والمصنفات (ومنها البرمجيات) لأحكام قانون حماية حقوق الملكية الفكرية رقم 82 لسنة 2002؛ ولا يجوز لأي طرف استعمال علامات أو مصنفات الطرف الآخر خارج حدود هذا العقد.</div>
  </div>`
    : "";

  const AR: ContractTemplate = {
    id: s.idBase + 1,
    slug: `eg-${s.slug}-ar`,
    title: `${s.titleAr} (مصر) – عربي`,
    lang: "ar",
    group: "PRO",
    jurisdiction: "EG",
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
    <div class="p"><b>${s.providerAr}:</b> {{providerName}} — الرقم القومي/السجل: {{providerId}} — العنوان: {{providerAddress}}</div>
    <div class="p"><b>${s.clientAr}:</b> {{clientName}} — الرقم القومي/السجل: {{clientId}} — العنوان: {{clientAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: نطاق العمل والمخرجات</div>
    <div class="p"><b>${s.scopeLabelAr}:</b> {{scope}}</div>
    <div class="p"><b>المخرجات المتوقعة:</b> {{deliverables}}</div>
    <div class="p"><b>مستوى الخدمة/المعايير:</b> {{sla}}</div>
    <div class="clause">العقد شريعة المتعاقدين، فلا يجوز نقضه ولا تعديله إلا باتفاق الطرفين أو للأسباب التي يقرّرها القانون، ويُنفَّذ بطريقة تتفق مع ما يوجبه حسن النية (المادتان 147 و148 مدني).</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: المقابل المالي والسداد</div>
    <div class="p"><b>قيمة المقابل:</b> {{feeAmount}} {{feeCurrency}}</div>
    <div class="p"><b>شروط ومواعيد السداد:</b> {{paymentTerms}}</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: المدة والإنهاء</div>
    <div class="p"><b>تاريخ البدء:</b> {{startDate}} — <b>المدة:</b> {{duration}}</div>
    <div class="p"><b>الإخطار قبل الإنهاء:</b> {{terminationNotice}}</div>
    <div class="p">يجوز لأي طرف إنهاء العقد بإخطار كتابي مسبق، مع سداد مقابل ما أُنجز فعلاً من أعمال حتى تاريخ الإنهاء، ودون إخلال بالتعويض عن الإنهاء غير المبرَّر.</div>
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
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

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
      options: currencyOptionsEn(EG.currencies) },
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
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: EG.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: EG.defaultCourtCityEn },
  );

  const enIpBlock = s.withIp
    ? `
  <div class="sec"><h3>5. Intellectual Property</h3><div class="box">
    <div>{{ipOwnership}}</div>
    <div class="muted">Copyright, neighbouring rights and works (including software) are subject to the IP Protection Law No. 82 of 2002; neither party may use the other's marks or works beyond this contract.</div>
  </div></div>`
    : "";

  const EN: ContractTemplate = {
    id: s.idBase + 2,
    slug: `eg-${s.slug}-en`,
    title: `${s.titleEn} (Egypt) — English`,
    lang: "en",
    group: "PRO",
    jurisdiction: "EG",
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
    <div class="muted">The contract is the law of the parties; it may be revoked or amended only by mutual consent or on legal grounds, and must be performed in good faith (Arts. 147–148 Civil Code).</div>
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
  "مصاغ وفق القواعد العامة للعقود في القانون المدني المصري رقم 131 لسنة 1948 (المادتان 147 و148)";
const GENERAL_LAW_EN =
  "Governed by the general contract rules of the Egyptian Civil Code No. 131 of 1948 (Arts. 147–148)";

const consultancy = buildServiceContract({
  idBase: 4300, slug: "consultancy",
  titleAr: "عقد استشارة", titleEn: "Consultancy Agreement",
  providerAr: "المستشار", providerEn: "Consultant",
  clientAr: "العميل", clientEn: "Client",
  scopeLabelAr: "موضوع الاستشارة ونطاقها", scopeLabelEn: "Consultancy scope",
  lawNoteAr: GENERAL_LAW_AR, lawNoteEn: GENERAL_LAW_EN,
  withIp: true,
});

const training = buildServiceContract({
  idBase: 4400, slug: "training",
  titleAr: "عقد تدريب", titleEn: "Training Agreement",
  providerAr: "مقدّم التدريب", providerEn: "Training Provider",
  clientAr: "الجهة المتدرّبة", clientEn: "Client",
  scopeLabelAr: "البرنامج التدريبي وموضوعاته", scopeLabelEn: "Training programme",
  lawNoteAr: GENERAL_LAW_AR, lawNoteEn: GENERAL_LAW_EN,
  withIp: true,
});

const marketing = buildServiceContract({
  idBase: 4500, slug: "marketing",
  titleAr: "عقد إعلان وتسويق", titleEn: "Advertising & Marketing Agreement",
  providerAr: "الوكالة/مقدّم الخدمة", providerEn: "Agency",
  clientAr: "المُعلِن (العميل)", clientEn: "Advertiser (Client)",
  scopeLabelAr: "الحملة/الخدمات التسويقية والقنوات", scopeLabelEn: "Campaign / marketing services & channels",
  lawNoteAr:
    "مصاغ وفق القواعد العامة للعقود في القانون المدني المصري رقم 131 لسنة 1948، ومع مراعاة قانون حماية المستهلك رقم 181 لسنة 2018",
  lawNoteEn:
    "Governed by the general contract rules of the Egyptian Civil Code No. 131 of 1948, with regard to Consumer Protection Law No. 181 of 2018",
  withIp: true,
});

const software = buildServiceContract({
  idBase: 4600, slug: "software-development",
  titleAr: "عقد تطوير برمجي", titleEn: "Software Development Agreement",
  providerAr: "المطوّر", providerEn: "Developer",
  clientAr: "العميل", clientEn: "Client",
  scopeLabelAr: "نطاق التطوير والمواصفات الفنية", scopeLabelEn: "Development scope & specifications",
  lawNoteAr:
    "مصاغ وفق القواعد العامة للعقود في القانون المدني المصري رقم 131 لسنة 1948، ومع مراعاة قانون حماية حقوق الملكية الفكرية رقم 82 لسنة 2002",
  lawNoteEn:
    "Governed by the general contract rules of the Egyptian Civil Code No. 131 of 1948, with regard to the IP Protection Law No. 82 of 2002",
  withIp: true,
});

const eservices = buildServiceContract({
  idBase: 4700, slug: "e-services",
  titleAr: "عقد خدمات إلكترونية", titleEn: "Electronic Services Agreement",
  providerAr: "مقدّم الخدمة الإلكترونية", providerEn: "Service Provider",
  clientAr: "المستخدم/العميل", clientEn: "User / Client",
  scopeLabelAr: "الخدمات الإلكترونية ونطاق الاستخدام", scopeLabelEn: "E-services & usage scope",
  lawNoteAr:
    "مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948، ومع مراعاة قانون التوقيع الإلكتروني رقم 15 لسنة 2004 وقانون حماية البيانات الشخصية رقم 151 لسنة 2020",
  lawNoteEn:
    "Governed by the Egyptian Civil Code No. 131 of 1948, with regard to the E-Signature Law No. 15 of 2004 and Personal Data Protection Law No. 151 of 2020",
  withIp: true,
});

const licensing = buildServiceContract({
  idBase: 4800, slug: "licensing",
  titleAr: "عقد ترخيص", titleEn: "Licensing Agreement",
  providerAr: "المُرخِّص", providerEn: "Licensor",
  clientAr: "المُرخَّص له", clientEn: "Licensee",
  scopeLabelAr: "محل الترخيص ونطاقه (الحقوق/العلامة/البرمجية)", scopeLabelEn: "Licensed subject & scope (rights/mark/software)",
  lawNoteAr:
    "مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948، ومع مراعاة قانون حماية حقوق الملكية الفكرية رقم 82 لسنة 2002",
  lawNoteEn:
    "Governed by the Egyptian Civil Code No. 131 of 1948, with regard to the IP Protection Law No. 82 of 2002",
  withIp: true,
});

const management = buildServiceContract({
  idBase: 4900, slug: "management",
  titleAr: "عقد إدارة", titleEn: "Management Agreement",
  providerAr: "المدير/الجهة المديرة", providerEn: "Manager",
  clientAr: "المالك (العميل)", clientEn: "Owner (Client)",
  scopeLabelAr: "الأصول/النشاط محل الإدارة وصلاحياتها", scopeLabelEn: "Managed assets/activity & powers",
  lawNoteAr: GENERAL_LAW_AR, lawNoteEn: GENERAL_LAW_EN,
  withIp: false,
});

export const CONSULTANCY_EG_AR = consultancy.AR;
export const CONSULTANCY_EG_EN = consultancy.EN;
export const TRAINING_EG_AR = training.AR;
export const TRAINING_EG_EN = training.EN;
export const MARKETING_EG_AR = marketing.AR;
export const MARKETING_EG_EN = marketing.EN;
export const SOFTWARE_EG_AR = software.AR;
export const SOFTWARE_EG_EN = software.EN;
export const ESERVICES_EG_AR = eservices.AR;
export const ESERVICES_EG_EN = eservices.EN;
export const LICENSING_EG_AR = licensing.AR;
export const LICENSING_EG_EN = licensing.EN;
export const MANAGEMENT_EG_AR = management.AR;
export const MANAGEMENT_EG_EN = management.EN;

export const SERVICE_TEMPLATES: ContractTemplate[] = [
  consultancy.AR, consultancy.EN,
  training.AR, training.EN,
  marketing.AR, marketing.EN,
  software.AR, software.EN,
  eservices.AR, eservices.EN,
  licensing.AR, licensing.EN,
  management.AR, management.EN,
];
