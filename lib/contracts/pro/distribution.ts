 // lib/contracts/pro/distribution.ts
import { ContractTemplate } from "../engine/types";

/**
 * ======================================
 * Distribution / Agency Agreement – AR
 * ======================================
 */
export const DISTRIBUTION_AR: ContractTemplate = {
  id: 1031,
  slug: "pro-distribution-ar",
  title: "عقد توزيع / وكالة تجارية",
  lang: "ar",
  group: "PRO",
  fields: [
    // ── معلومات العقد ──
    { key: "contractNo", label: "رقم العقد", required: true, type: "text", group: "معلومات العقد" },
    { key: "date", label: "تاريخ العقد", required: true, type: "date", group: "معلومات العقد" },
    { key: "place", label: "مكان الإبرام", required: true, type: "text", group: "معلومات العقد" },

    // ── الطرف الأول (المورد) ──
    { key: "partyAName", label: "اسم المنتج/المورد", required: true, type: "text", group: "الطرف الأول (المورد)" },
    { key: "partyAAddress", label: "عنوان المنتج/المورد", required: true, type: "text", group: "الطرف الأول (المورد)" },

    // ── الطرف الثاني (الموزع) ──
    { key: "partyBName", label: "اسم الموزع/الوكيل", required: true, type: "text", group: "الطرف الثاني (الموزع)" },
    { key: "partyBAddress", label: "عنوان الموزع/الوكيل", required: true, type: "text", group: "الطرف الثاني (الموزع)" },

    // ── نطاق التوزيع ──
    { key: "products", label: "المنتجات", required: true, type: "textarea", group: "نطاق التوزيع" },
    { key: "territory", label: "النطاق الجغرافي", required: true, type: "text", group: "نطاق التوزيع",
      placeholder: "مثال: محافظة بغداد" },
    { key: "commissionRate", label: "العمولة/الخصم", required: true, type: "text", group: "نطاق التوزيع",
      placeholder: "مثال: 10%" },
    { key: "exclusivityClause", label: "بند الحصرية (إن وجد)", required: false, type: "textarea", group: "نطاق التوزيع" },

    // ── المدة ──
    { key: "startDate", label: "تاريخ البدء", required: true, type: "date", group: "المدة" },
    { key: "endDate", label: "تاريخ الانتهاء", required: true, type: "date", group: "المدة" },

    // ── السرية ──
    { key: "confidentialityPeriod", label: "مدة السرية بعد الانتهاء", required: false, type: "text", group: "السرية",
      placeholder: "مثال: سنتان" },

    // ── التواقيع ──
    { key: "partyASign", label: "اسم موقع الطرف الأول", required: true, type: "text", group: "التواقيع" },
    { key: "partyBSign", label: "اسم موقع الطرف الثاني", required: true, type: "text", group: "التواقيع" },
  ],
  html: `
<h1>عقد توزيع / وكالة تجارية</h1>
<p class="muted">رقم العقد {{contractNo}} — التاريخ {{date}} — المكان {{place}}</p>

<div class="box">
  <h2>الأطراف</h2>
  <p><b>الطرف الأول (المنتج / المورد):</b> {{partyAName}} — {{partyAAddress}}</p>
  <p><b>الطرف الثاني (الموزع / الوكيل):</b> {{partyBName}} — {{partyBAddress}}</p>
</div>

<h2>المادة (1): التعيين</h2>
<p>
بموجب هذا العقد، يعين الطرف الأول الطرف الثاني كموزع/وكيل لتوزيع وتسويق
{{products}} ضمن النطاق الجغرافي {{territory}}.
</p>

<h2>المادة (2): طبيعة العلاقة</h2>
<p>
يقر الطرفان بأن العلاقة بينهما هي علاقة توزيع/وكالة تجارية مستقلة،
ولا ينشأ عنها أي شراكة أو تمثيل قانوني خارج حدود هذا العقد.
</p>

<h2>المادة (3): نطاق التوزيع</h2>
<p>
يكون للطرف الثاني الحق في توزيع المنتجات داخل {{territory}} وفق الشروط
والسياسات التجارية للطرف الأول.
</p>

<h2>المادة (4): العمولة / الخصم</h2>
<p>
يستحق الطرف الثاني عمولة / خصم تجاري قدره {{commissionRate}}
وفق آلية التسوية المتفق عليها.
</p>

<h2>المادة (5): الالتزامات</h2>
<ul>
  <li>التزام الطرف الأول بتوفير المنتجات بالمواصفات المتفق عليها.</li>
  <li>التزام الطرف الثاني ببذل العناية اللازمة لتسويق وتوزيع المنتجات.</li>
  <li>الالتزام بالقوانين والأنظمة التجارية النافذة.</li>
</ul>

<h2>المادة (6): الحصرية (إن وجدت)</h2>
<p>
{{exclusivityClause}}
</p>

<h2>المادة (7): مدة العقد وإنهاؤه</h2>
<p>
تبدأ مدة هذا العقد من {{startDate}} وتنتهي في {{endDate}}،
ويجوز إنهاؤه وفق الشروط المتفق عليها أو في حال الإخلال الجوهري.
</p>

<h2>المادة (8): السرية</h2>
<p>
يلتزم الطرفان بالمحافظة على سرية المعلومات والبيانات التجارية
خلال مدة العقد ولمدة {{confidentialityPeriod}} بعد انتهائه.
</p>

<h2>المادة (9): القانون الواجب التطبيق والاختصاص</h2>
<p>{{governingLawClause}}</p>
<p>{{jurisdictionClause}}</p>

<h2>التوقيع</h2>
<p>
حرر هذا العقد من نسختين أصليتين، بيد كل طرف نسخة للعمل بموجبها.
</p>

<table class="sig">
  <tr>
    <th>الطرف الأول</th>
    <th>الطرف الثاني</th>
  </tr>
  <tr>
    <td>{{partyASign}}</td>
    <td>{{partyBSign}}</td>
  </tr>
</table>
`.trim(),
};

/**
 * ======================================
 * Distribution / Agency Agreement – EN
 * ======================================
 */
export const DISTRIBUTION_EN: ContractTemplate = {
  id: 1032,
  slug: "pro-distribution-en",
  title: "Distribution / Commercial Agency Agreement",
  lang: "en",
  group: "PRO",
  fields: [
    // ── Contract Info ──
    { key: "contractNo", label: "Contract No.", required: true, type: "text", group: "Contract Info" },
    { key: "date", label: "Date", required: true, type: "date", group: "Contract Info" },
    { key: "place", label: "Place of Execution", required: true, type: "text", group: "Contract Info" },

    // ── Party A (Principal) ──
    { key: "partyAName", label: "Principal/Supplier Name", required: true, type: "text", group: "Party A (Principal)" },
    { key: "partyAAddress", label: "Principal/Supplier Address", required: true, type: "text", group: "Party A (Principal)" },

    // ── Party B (Distributor) ──
    { key: "partyBName", label: "Distributor/Agent Name", required: true, type: "text", group: "Party B (Distributor)" },
    { key: "partyBAddress", label: "Distributor/Agent Address", required: true, type: "text", group: "Party B (Distributor)" },

    // ── Distribution Scope ──
    { key: "products", label: "Products", required: true, type: "textarea", group: "Distribution Scope" },
    { key: "territory", label: "Territory", required: true, type: "text", group: "Distribution Scope",
      placeholder: "e.g. Baghdad Governorate" },
    { key: "commissionRate", label: "Commission/Discount", required: true, type: "text", group: "Distribution Scope",
      placeholder: "e.g. 10%" },
    { key: "exclusivityClause", label: "Exclusivity Clause (if any)", required: false, type: "textarea", group: "Distribution Scope" },

    // ── Term ──
    { key: "startDate", label: "Start Date", required: true, type: "date", group: "Term" },
    { key: "endDate", label: "End Date", required: true, type: "date", group: "Term" },

    // ── Confidentiality ──
    { key: "confidentialityPeriod", label: "Confidentiality Period After Termination", required: false, type: "text", group: "Confidentiality",
      placeholder: "e.g. 2 years" },

    // ── Signatures ──
    { key: "partyASign", label: "Party A Signatory Name", required: true, type: "text", group: "Signatures" },
    { key: "partyBSign", label: "Party B Signatory Name", required: true, type: "text", group: "Signatures" },
  ],
  html: `
<h1>Distribution / Commercial Agency Agreement</h1>
<p class="muted">Contract No. {{contractNo}} — Date {{date}} — Place {{place}}</p>

<div class="box">
  <h2>Parties</h2>
  <p><b>Party A (Principal / Supplier):</b> {{partyAName}} — {{partyAAddress}}</p>
  <p><b>Party B (Distributor / Agent):</b> {{partyBName}} — {{partyBAddress}}</p>
</div>

<h2>Article 1: Appointment</h2>
<p>
The Principal hereby appoints the Distributor/Agent to market and distribute
{{products}} within the territory of {{territory}}.
</p>

<h2>Article 2: Nature of Relationship</h2>
<p>
The relationship between the Parties is that of independent commercial
distribution/agency, and nothing herein shall be deemed to create a partnership.
</p>

<h2>Article 3: Territory</h2>
<p>
The Distributor shall distribute the products within {{territory}} in accordance
with the Principal’s commercial policies.
</p>

<h2>Article 4: Commission / Discount</h2>
<p>
The Distributor shall be entitled to a commission / commercial discount of
{{commissionRate}}, subject to the agreed settlement mechanism.
</p>

<h2>Article 5: Obligations</h2>
<ul>
  <li>The Principal shall supply the products as agreed.</li>
  <li>The Distributor shall use best efforts to promote and distribute the products.</li>
  <li>Both Parties shall comply with applicable laws and regulations.</li>
</ul>

<h2>Article 6: Exclusivity (if any)</h2>
<p>
{{exclusivityClause}}
</p>

<h2>Article 7: Term and Termination</h2>
<p>
This Agreement shall commence on {{startDate}} and expire on {{endDate}},
unless terminated earlier in accordance with its terms.
</p>

<h2>Article 8: Confidentiality</h2>
<p>
The Parties shall maintain the confidentiality of all commercial information
during the term of this Agreement and for {{confidentialityPeriod}} thereafter.
</p>

<h2>Article 9: Governing Law and Jurisdiction</h2>
<p>{{governingLawClause}}</p>
<p>{{jurisdictionClause}}</p>

<h2>Execution</h2>
<p>
This Agreement is executed in two originals, one for each Party.
</p>

<table class="sig">
  <tr>
    <th>Principal</th>
    <th>Distributor</th>
  </tr>
  <tr>
    <td>{{partyASign}}</td>
    <td>{{partyBSign}}</td>
  </tr>
</table>
`.trim(),
};