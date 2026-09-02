// lib/contracts/eg/partnership.ts
// عقد شركة/شراكة وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد الشركة 505 وما بعدها).
// للشركات التجارية تُراعى أيضاً أحكام قانون الشركات رقم 159 لسنة 1981.
import type { ContractTemplate } from "../engine/types";
import { currencyOptionsAr, currencyOptionsEn } from "../currencies";
import { getJurisdiction } from "../jurisdictions";
import { AR_CSS, EN_CSS } from "./_shared";

const EG = getJurisdiction("EG");

export const PARTNERSHIP_EG_AR: ContractTemplate = {
  id: 3401,
  slug: "eg-partnership-ar",
  title: "عقد شراكة (مصر) – عربي",
  lang: "ar",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "contractDate", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "contractCity", label: "مدينة الإبرام", required: true, type: "text", group: "معلومات العقد", placeholder: "القاهرة" },

    { key: "partner1Name", label: "اسم الشريك الأول", required: true, type: "text", group: "الشركاء" },
    { key: "partner1Id", label: "الرقم القومي للشريك الأول", required: true, type: "text", group: "الشركاء" },
    { key: "partner1Address", label: "عنوان الشريك الأول", required: true, type: "text", group: "الشركاء" },
    { key: "partner2Name", label: "اسم الشريك الثاني", required: true, type: "text", group: "الشركاء" },
    { key: "partner2Id", label: "الرقم القومي للشريك الثاني", required: true, type: "text", group: "الشركاء" },
    { key: "partner2Address", label: "عنوان الشريك الثاني", required: true, type: "text", group: "الشركاء" },
    { key: "otherPartners", label: "شركاء آخرون (إن وجدوا)", required: false, type: "textarea", group: "الشركاء" },

    { key: "companyName", label: "اسم/عنوان الشركة", required: true, type: "text", group: "الشركة" },
    { key: "purpose", label: "غرض الشركة (النشاط)", required: true, type: "textarea", group: "الشركة" },
    { key: "headOffice", label: "المركز الرئيسي", required: true, type: "text", group: "الشركة" },
    { key: "duration", label: "مدة الشركة", required: true, type: "text", group: "الشركة", placeholder: "مثال: 10 سنوات قابلة للتجديد" },

    { key: "totalCapital", label: "رأس المال الإجمالي", required: true, type: "number", group: "رأس المال" },
    { key: "capitalCurrency", label: "العملة", required: true, type: "select", group: "رأس المال",
      options: currencyOptionsAr(EG.currencies) },
    { key: "contributions", label: "حصص الشركاء (نقداً/عيناً/عملاً)", required: true, type: "textarea", group: "رأس المال",
      placeholder: "مثال: الشريك الأول 60% نقداً، الشريك الثاني 40% عملاً وخبرة" },

    { key: "profitSharing", label: "توزيع الأرباح والخسائر", required: true, type: "textarea", group: "الإدارة والأرباح",
      placeholder: "مثال: بنسبة الحصص في رأس المال" },
    { key: "management", label: "الإدارة والتوقيع عن الشركة", required: true, type: "textarea", group: "الإدارة والأرباح" },
    { key: "decisionRules", label: "قواعد اتخاذ القرار", required: false, type: "textarea", group: "الإدارة والأرباح" },

    { key: "withdrawalRules", label: "أحكام الانسحاب/التنازل عن الحصص", required: false, type: "textarea", group: "أحكام" },
    { key: "dissolution", label: "أحكام حلّ الشركة وتصفيتها", required: false, type: "textarea", group: "أحكام" },
    { key: "specialTerms", label: "شروط خاصة إضافية", required: false, type: "textarea", group: "أحكام" },
    { key: "governingLaw", label: "القانون الواجب التطبيق", required: true, type: "text", group: "أحكام", placeholder: EG.governingLawAr },
    { key: "disputeCity", label: "الاختصاص المكاني (محكمة)", required: true, type: "text", group: "أحكام", placeholder: EG.defaultCourtCityAr },
  ],
  html: `
<div class="doc rtl">
  <div class="header">
    <div class="title">عقد شركة (شراكة)</div>
    <div class="subtitle">مصاغ وفق القانون المدني المصري رقم 131 لسنة 1948 (مواد الشركة 505 وما بعدها)</div>
    <div class="meta">
      <div><span class="k">رقم العقد:</span> {{contractRef}}</div>
      <div><span class="k">التاريخ:</span> {{contractDate}}</div>
      <div><span class="k">مدينة الإبرام:</span> {{contractCity}}</div>
    </div>
  </div>

  <div class="box">
    <div class="h">أولاً: الشركاء</div>
    <div class="p"><b>الشريك الأول:</b> {{partner1Name}} — الرقم القومي: {{partner1Id}} — العنوان: {{partner1Address}}</div>
    <div class="p"><b>الشريك الثاني:</b> {{partner2Name}} — الرقم القومي: {{partner2Id}} — العنوان: {{partner2Address}}</div>
    <div class="p"><b>شركاء آخرون:</b> {{otherPartners}}</div>
  </div>

  <div class="box">
    <div class="h">ثانياً: بيانات الشركة</div>
    <div class="p"><b>الاسم/العنوان:</b> {{companyName}}</div>
    <div class="p"><b>الغرض/النشاط:</b> {{purpose}}</div>
    <div class="p"><b>المركز الرئيسي:</b> {{headOffice}}</div>
    <div class="p"><b>مدة الشركة:</b> {{duration}}</div>
  </div>

  <div class="box">
    <div class="h">ثالثاً: رأس المال والحصص</div>
    <div class="p"><b>رأس المال:</b> {{totalCapital}} {{capitalCurrency}}</div>
    <div class="p"><b>حصص الشركاء:</b> {{contributions}}</div>
    <div class="clause">تكون حصة كل شريك في رأس المال محلاً لالتزامه، ومن قدّم حصة عملٍ لا تدخل قيمتها في رأس المال بل يُقسَّم له نصيب في الربح وفق الاتفاق (المواد 509 وما بعدها مدني).</div>
  </div>

  <div class="box">
    <div class="h">رابعاً: الأرباح والخسائر والإدارة</div>
    <div class="p"><b>توزيع الأرباح والخسائر:</b> {{profitSharing}}</div>
    <div class="p"><b>الإدارة والتوقيع:</b> {{management}}</div>
    <div class="p"><b>قواعد القرار:</b> {{decisionRules}}</div>
    <div class="clause">يقع باطلاً كل اتفاق يحرم شريكاً من الربح أو يعفيه من كل خسارة (شرط الأسد — المادة 515 مدني).</div>
  </div>

  <div class="box">
    <div class="h">خامساً: الانسحاب والحلّ والتصفية</div>
    <div class="p"><b>الانسحاب/التنازل:</b> {{withdrawalRules}}</div>
    <div class="p"><b>الحلّ والتصفية:</b> {{dissolution}}</div>
  </div>

  <div class="box">
    <div class="h">سادساً: الشروط الخاصة والقانون الواجب</div>
    <div class="p"><b>شروط خاصة:</b> {{specialTerms}}</div>
    <ol class="ol">
      <li>يخضع هذا العقد وكل ما لم يرد فيه نصّ لأحكام <b>{{governingLaw}}</b> (ولأحكام قانون الشركات إن كانت الشركة تجارية).</li>
      <li>تختص محاكم <b>{{disputeCity}}</b> بنظر أي نزاع ينشأ عنه.</li>
    </ol>
  </div>

  <div class="signs">
    <div class="sig"><div class="sig-h">توقيع الشريك الأول</div><div class="sig-line"></div><div class="sig-name">{{partner1Name}}</div></div>
    <div class="sig"><div class="sig-h">توقيع الشريك الثاني</div><div class="sig-line"></div><div class="sig-name">{{partner2Name}}</div></div>
  </div>
  ${AR_CSS}
</div>
  `.trim(),
};

export const PARTNERSHIP_EG_EN: ContractTemplate = {
  id: 3402,
  slug: "eg-partnership-en",
  title: "Partnership Agreement (Egypt) — English",
  lang: "en",
  group: "PRO",
  jurisdiction: "EG",
  fields: [
    { key: "contractRef", label: "Contract Ref", required: true, type: "text", group: "Contract Info" },
    { key: "contractDate", label: "Contract Date", required: true, type: "date", group: "Contract Info" },
    { key: "contractCity", label: "Place of Execution", required: true, type: "text", group: "Contract Info", placeholder: "Cairo" },

    { key: "partner1Name", label: "Partner 1 Name", required: true, type: "text", group: "Partners" },
    { key: "partner1Id", label: "Partner 1 National ID", required: true, type: "text", group: "Partners" },
    { key: "partner1Address", label: "Partner 1 Address", required: true, type: "text", group: "Partners" },
    { key: "partner2Name", label: "Partner 2 Name", required: true, type: "text", group: "Partners" },
    { key: "partner2Id", label: "Partner 2 National ID", required: true, type: "text", group: "Partners" },
    { key: "partner2Address", label: "Partner 2 Address", required: true, type: "text", group: "Partners" },
    { key: "otherPartners", label: "Other Partners (if any)", required: false, type: "textarea", group: "Partners" },

    { key: "companyName", label: "Company Name", required: true, type: "text", group: "Company" },
    { key: "purpose", label: "Purpose / Activity", required: true, type: "textarea", group: "Company" },
    { key: "headOffice", label: "Head Office", required: true, type: "text", group: "Company" },
    { key: "duration", label: "Duration", required: true, type: "text", group: "Company" },

    { key: "totalCapital", label: "Total Capital", required: true, type: "number", group: "Capital" },
    { key: "capitalCurrency", label: "Currency", required: true, type: "select", group: "Capital",
      options: currencyOptionsEn(EG.currencies) },
    { key: "contributions", label: "Partners' Contributions (cash/in-kind/work)", required: true, type: "textarea", group: "Capital" },

    { key: "profitSharing", label: "Profit & Loss Distribution", required: true, type: "textarea", group: "Management" },
    { key: "management", label: "Management & Signing Authority", required: true, type: "textarea", group: "Management" },
    { key: "decisionRules", label: "Decision Rules", required: false, type: "textarea", group: "Management" },

    { key: "withdrawalRules", label: "Withdrawal / Transfer of Shares", required: false, type: "textarea", group: "Provisions" },
    { key: "dissolution", label: "Dissolution & Liquidation", required: false, type: "textarea", group: "Provisions" },
    { key: "specialTerms", label: "Special Terms", required: false, type: "textarea", group: "Provisions" },
    { key: "governingLaw", label: "Governing Law", required: false, type: "text", group: "Provisions", placeholder: EG.governingLawEn },
    { key: "disputeCity", label: "Jurisdiction / Court", required: false, type: "text", group: "Provisions", placeholder: EG.defaultCourtCityEn },
  ],
  html: `
<div class="doc" dir="ltr" lang="en">
  ${EN_CSS}
  <div class="hdr">
    <div>
      <div class="title">Partnership Agreement</div>
      <div class="muted">Governed by the Egyptian Civil Code No. 131 of 1948 (Company, Arts. 505 ff.).</div>
    </div>
    <div class="meta">
      <div><b>Ref:</b> {{contractRef}}</div>
      <div><b>Date:</b> {{contractDate}}</div>
      <div><b>Place:</b> {{contractCity}}</div>
    </div>
  </div>

  <div class="box"><div class="sec"><h3>1. Partners</h3>
    <div><b>Partner 1:</b> {{partner1Name}} — ID: {{partner1Id}} — {{partner1Address}}</div>
    <div><b>Partner 2:</b> {{partner2Name}} — ID: {{partner2Id}} — {{partner2Address}}</div>
    <div><b>Other Partners:</b> {{otherPartners}}</div>
  </div></div>

  <div class="sec"><h3>2. Company</h3><div class="box">
    <div><b>Name:</b> {{companyName}}</div>
    <div><b>Purpose:</b> {{purpose}}</div>
    <div><b>Head Office:</b> {{headOffice}}</div>
    <div><b>Duration:</b> {{duration}}</div>
  </div></div>

  <div class="sec"><h3>3. Capital & Contributions</h3><div class="box">
    <div><b>Capital:</b> {{totalCapital}} {{capitalCurrency}}</div>
    <div><b>Contributions:</b> {{contributions}}</div>
    <div class="muted">A contribution of work earns a share of profit per agreement but does not form part of the capital (Arts. 509 ff. Civil Code).</div>
  </div></div>

  <div class="sec"><h3>4. Profit, Loss & Management</h3><div class="box">
    <div><b>Profit/Loss:</b> {{profitSharing}}</div>
    <div><b>Management:</b> {{management}}</div>
    <div><b>Decision Rules:</b> {{decisionRules}}</div>
    <div class="muted">Any clause excluding a partner from profit or from all loss is void (leonine clause, Art. 515 Civil Code).</div>
  </div></div>

  <div class="sec"><h3>5. Withdrawal, Dissolution & Liquidation</h3><div class="box">
    <div><b>Withdrawal/Transfer:</b> {{withdrawalRules}}</div>
    <div><b>Dissolution:</b> {{dissolution}}</div>
  </div></div>

  <div class="sec"><h3>6. Governing Law & Special Terms</h3><div class="box">
    <div><b>Governing Law:</b> {{governingLaw}}</div>
    <div><b>Jurisdiction:</b> {{disputeCity}}</div>
    <div><b>Special Terms:</b> {{specialTerms}}</div>
  </div></div>

  <div class="sig">
    <div class="sbox"><b>Partner 1 Signature</b><br/><br/>Name: {{partner1Name}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
    <div class="sbox"><b>Partner 2 Signature</b><br/><br/>Name: {{partner2Name}}<br/>Signature: ___________________<br/>Date: {{contractDate}}</div>
  </div>
</div>
`,
};
