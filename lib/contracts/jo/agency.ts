// lib/contracts/jo/agency.ts
// عقد وكالة وفق القانون المدني الأردني رقم 43 لسنة 1976 (أحكام الوكالة).
import type { ContractTemplate } from "../engine/types";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "../doc-styles";

const JO = getJurisdiction("JO");

export const AGENCY_JO_AR: ContractTemplate = {
  id: 7501,
  slug: "jo-agency-ar",
  title: "عقد وكالة (الأردن) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "JO",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "عمّان" },

    { key: "principalName", label: "اسم الموكِّل", required: true, type: "text", group: "الموكِّل" },
    { key: "principalId", label: "الرقم الوطني/السجل للموكِّل", required: true, type: "text", group: "الموكِّل" },
    { key: "principalAddress", label: "عنوان الموكِّل", required: true, type: "text", group: "الموكِّل" },

    { key: "agentName", label: "اسم الوكيل", required: true, type: "text", group: "الوكيل" },
    { key: "agentId", label: "الرقم الوطني/السجل للوكيل", required: true, type: "text", group: "الوكيل" },
    { key: "agentAddress", label: "عنوان الوكيل", required: true, type: "text", group: "الوكيل" },

    { key: "scope", label: "الأعمال محل الوكالة", required: true, type: "textarea", group: "محل الوكالة",
      placeholder: "حدّد الأعمال بدقة، مثلاً: بيع عقار محدد، إدارة حساب، المرافعة أمام جهة معينة..." },
    { key: "agencyType", label: "نوع الوكالة", required: true, type: "select", group: "محل الوكالة",
      options: ["خاصة (عمل محدد)", "عامة (كل الأعمال التي تقبل النيابة)"] },
    { key: "specialAuthority", label: "أعمال تتطلب تفويضاً خاصاً (بيع/رهن/تبرع/صلح/إقرار)", required: false, type: "textarea", group: "محل الوكالة" },
    { key: "subAgent", label: "حق إنابة الغير", required: true, type: "select", group: "محل الوكالة",
      options: ["لا يجوز للوكيل إنابة غيره", "يجوز للوكيل إنابة غيره"] },

    { key: "remuneration", label: "أجر الوكيل", required: true, type: "select", group: "الأجر والمدة",
      options: ["بدون أجر (تبرعاً)", "بأجر متفق عليه"] },
    { key: "remunerationDetails", label: "تفاصيل الأجر (إن وجد)", required: false, type: "text", group: "الأجر والمدة" },
    { key: "duration", label: "مدة الوكالة", required: false, type: "text", group: "الأجر والمدة", placeholder: "مثال: حتى إتمام العمل" },

    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: JO.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: JO.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد وكالة</div>
    <div class="subtitle">مصاغ وفق القانون المدني الأردني رقم 43 لسنة 1976 (أحكام الوكالة)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: طرفا العقد</div>
    <div class="p"><b>الموكِّل:</b> {{principalName}} — الرقم الوطني/السجل: {{principalId}} — العنوان: {{principalAddress}}</div>
    <div class="p"><b>الوكيل:</b> {{agentName}} — الرقم الوطني/السجل: {{agentId}} — العنوان: {{agentAddress}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: محل الوكالة ونطاقها</div>
    <div class="p"><b>الأعمال محل الوكالة:</b> {{scope}}</div>
    <div class="p"><b>نوع الوكالة:</b> {{agencyType}}</div>
    <div class="p"><b>حق إنابة الغير:</b> {{subAgent}}</div>
    <div class="clause">الوكالة العامة لا تخوّل الوكيل إلا أعمال الإدارة. أما البيع والرهن والتبرع والصلح والإقرار وسائر التصرفات التي تخرج عن الإدارة فلا بدّ فيها من تفويض خاص صريح، عملاً بأحكام الوكالة في القانون المدني الأردني.</div>
    <div class="p"><b>تفويض خاص مُمنوح:</b> {{specialAuthority}}</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: الأجر والمدة</div>
    <div class="p"><b>الأجر:</b> {{remuneration}} — {{remunerationDetails}}</div>
    <div class="p"><b>مدة الوكالة:</b> {{duration}}</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: التزامات الوكيل</div>
    <ol class="ol">
      <li>ينفّذ الوكيل الوكالة دون أن يتجاوز حدودها، ويبذل عناية معقولة، ويكون مسؤولاً عن الغش وعن الخطأ الجسيم.</li>
      <li>يلتزم الوكيل بموافاة الموكِّل بالحساب وبتقديم ما استلمه لحساب الموكِّل.</li>
    </ol>
  </div>

  <div class="box">
    <div class="h">خامساً: التزامات الموكِّل والانتهاء</div>
    <ol class="ol">
      <li>يلتزم الموكِّل بأداء الأجر المتفق عليه وردّ ما أنفقه الوكيل من مصروفات في تنفيذ الوكالة.</li>
      <li>تنتهي الوكالة بإتمام العمل أو بانقضاء المدة أو بموت أحد الطرفين أو بعزل الوكيل أو باعتزاله، مع مراعاة أحكام العزل في وقت غير مناسب.</li>
    </ol>
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
    <div class="sig"><div class="sig-h">توقيع الموكِّل</div><div class="sig-line"></div><div class="sig-name">{{principalName}}</div></div>
    <div class="sig"><div class="sig-h">توقيع الوكيل</div><div class="sig-line"></div><div class="sig-name">{{agentName}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const AGENCY_JO_EN: ContractTemplate = {
  id: 7502,
  slug: "jo-agency-en",
  title: "Agency / Mandate Agreement (Jordan) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "JO",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Amman" },

    { key: "principalName", label: "Principal Name", required: true, type: "text", group: "Principal" },
    { key: "principalId", label: "Principal ID / Reg.", required: true, type: "text", group: "Principal" },
    { key: "principalAddress", label: "Principal Address", required: true, type: "text", group: "Principal" },

    { key: "agentName", label: "Agent Name", required: true, type: "text", group: "Agent" },
    { key: "agentId", label: "Agent ID / Reg.", required: true, type: "text", group: "Agent" },
    { key: "agentAddress", label: "Agent Address", required: true, type: "text", group: "Agent" },

    { key: "scope", label: "Scope of Mandate", required: true, type: "textarea", group: "Mandate" },
    { key: "agencyType", label: "Type of Mandate", required: true, type: "select", group: "Mandate",
      options: ["Special (specific act)", "General (all acts admitting representation)"] },
    { key: "specialAuthority", label: "Acts Needing Special Authority (sale/mortgage/donation/settlement/admission)", required: false, type: "textarea", group: "Mandate" },
    { key: "subAgent", label: "Sub-delegation", required: true, type: "select", group: "Mandate",
      options: ["Agent may not delegate", "Agent may delegate"] },

    { key: "remuneration", label: "Remuneration", required: true, type: "select", group: "Fee & Term",
      options: ["Gratuitous", "For an agreed fee"] },
    { key: "remunerationDetails", label: "Fee Details (if any)", required: false, type: "text", group: "Fee & Term" },
    { key: "duration", label: "Duration", required: false, type: "text", group: "Fee & Term" },

    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: JO.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: JO.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Agency / Mandate Agreement</div>
      <div class="muted">Governed by the Jordanian Civil Code No. 43 of 1976 (Mandate provisions).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Parties</h3>
    <div><b>Principal:</b> {{principalName}} — ID/Reg: {{principalId}} — {{principalAddress}}</div>
    <div><b>Agent:</b> {{agentName}} — ID/Reg: {{agentId}} — {{agentAddress}}</div>
  </div></div>

  <div class="sec"><h3>2. Scope</h3><div class="box">
    <div><b>Scope:</b> {{scope}}</div>
    <div><b>Type:</b> {{agencyType}} &nbsp; <b>Sub-delegation:</b> {{subAgent}}</div>
    <div class="muted">A general mandate covers only acts of administration; sale, mortgage, donation, settlement, admission and other acts beyond administration require express special authority under the Jordanian Civil Code.</div>
    <div><b>Special Authority Granted:</b> {{specialAuthority}}</div>
  </div></div>

  <div class="sec"><h3>3. Fee & Term</h3><div class="box">
    <div><b>Remuneration:</b> {{remuneration}} — {{remunerationDetails}}</div>
    <div><b>Duration:</b> {{duration}}</div>
  </div></div>

  <div class="sec"><h3>4. Agent's Duties</h3><div class="box">
    <div class="muted">The Agent shall act within, and not exceed, the scope of the mandate, shall exercise reasonable care, is liable for fraud and gross fault, and shall render account to the Principal and hand over whatever is received on the Principal's behalf.</div>
  </div></div>

  <div class="sec"><h3>5. Principal's Duties & Termination</h3><div class="box">
    <div class="muted">The Principal pays the agreed fee and reimburses expenses. The mandate ends on completion, expiry, death of a party, revocation or the agent's resignation, subject to liability for untimely revocation.</div>
  </div></div>

  <div class="sec"><h3>6. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Principal Signature</b><br/><br/>Name: {{principalName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Agent Signature</b><br/><br/>Name: {{agentName}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
