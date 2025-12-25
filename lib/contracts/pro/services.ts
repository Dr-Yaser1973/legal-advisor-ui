// lib/contracts/pro/services.ts
import { ContractTemplate } from "../engine/types";

/**
 * ===============================
 * Services Agreement – AR
 * ===============================
 */
export const SERVICES_AR: ContractTemplate = {
  id: 1011,
  slug: "pro-services-ar",
  title: "عقد تقديم خدمات (تجاري / مهني)",
  lang: "ar",
  group: "PRO",
  html: `
<h1>عقد تقديم خدمات</h1>
<p class="muted">رقم العقد {{contractNo}} — التاريخ {{date}} — المكان {{place}}</p>

<div class="box">
  <h2>الأطراف</h2>
  <p><b>الطرف الأول (العميل):</b> {{partyAName}} — {{partyAAddress}}</p>
  <p><b>الطرف الثاني (مقدم الخدمة):</b> {{partyBName}} — {{partyBAddress}}</p>
</div>

<h2>المادة (1): نطاق الخدمات</h2>
<p>{{servicesScope}}</p>

<h2>المادة (2): مدة العقد</h2>
<p>تبدأ مدة هذا العقد من {{startDate}} وتنتهي في {{endDate}}، ما لم يُنهَ وفقًا لأحكامه.</p>

<h2>المادة (3): الأتعاب وشروط الدفع</h2>
<ul>
  <li>قيمة الأتعاب المتفق عليها: {{fees}}.</li>
  <li>طريقة وجدول الدفع: {{paymentTerms}}.</li>
</ul>

<h2>المادة (4): التزامات مقدم الخدمة</h2>
<ul>
  <li>تنفيذ الخدمات المتفق عليها بمهنية وكفاءة.</li>
  <li>الالتزام بالأنظمة والقوانين النافذة.</li>
  <li>المحافظة على مصالح العميل.</li>
</ul>

<h2>المادة (5): السرية</h2>
<p>
يلتزم الطرفان بالمحافظة على سرية المعلومات والبيانات المتبادلة خلال مدة العقد
ولمدة {{confidentialityPeriod}} بعد انتهائه.
</p>

<h2>المادة (6): الإنهاء</h2>
<p>
يجوز لأي من الطرفين إنهاء العقد وفق الشروط المتفق عليها أو في حال الإخلال الجوهري
بأي من التزاماته، مع مراعاة أحكام القانون.
</p>

<h2>المادة (7): القانون الواجب التطبيق والاختصاص</h2>
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
 * ===============================
 * Services Agreement – EN
 * ===============================
 */
export const SERVICES_EN: ContractTemplate = {
  id: 1012,
  slug: "pro-services-en",
  title: "Services Agreement (Commercial / Professional)",
  lang: "en",
  group: "PRO",
  html: `
<h1>Services Agreement</h1>
<p class="muted">Contract No. {{contractNo}} — Date {{date}} — Place {{place}}</p>

<div class="box">
  <h2>Parties</h2>
  <p><b>Party A (Client):</b> {{partyAName}} — {{partyAAddress}}</p>
  <p><b>Party B (Service Provider):</b> {{partyBName}} — {{partyBAddress}}</p>
</div>

<h2>Article 1: Scope of Services</h2>
<p>{{servicesScope}}</p>

<h2>Article 2: Term</h2>
<p>
This Agreement shall commence on {{startDate}} and remain in force until {{endDate}},
unless terminated earlier in accordance with its provisions.
</p>

<h2>Article 3: Fees and Payment</h2>
<ul>
  <li>Agreed fees: {{fees}}.</li>
  <li>Payment method and schedule: {{paymentTerms}}.</li>
</ul>

<h2>Article 4: Service Provider Obligations</h2>
<ul>
  <li>Perform the services with due professional care and skill.</li>
  <li>Comply with applicable laws and regulations.</li>
  <li>Act in the best interest of the Client.</li>
</ul>

<h2>Article 5: Confidentiality</h2>
<p>
The Parties shall maintain the confidentiality of all exchanged information
during the term of this Agreement and for {{confidentialityPeriod}} thereafter.
</p>

<h2>Article 6: Termination</h2>
<p>
Either Party may terminate this Agreement in accordance with the agreed terms
or in case of material breach, subject to applicable law.
</p>

<h2>Article 7: Governing Law and Jurisdiction</h2>
<p>{{governingLawClause}}</p>
<p>{{jurisdictionClause}}</p>

<h2>Execution</h2>
<p>
This Agreement is executed in two originals, one for each Party.
</p>

<table class="sig">
  <tr>
    <th>Party A</th>
    <th>Party B</th>
  </tr>
  <tr>
    <td>{{partyASign}}</td>
    <td>{{partyBSign}}</td>
  </tr>
</table>
`.trim(),
};

