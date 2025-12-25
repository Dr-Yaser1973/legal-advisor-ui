// lib/contracts/pro/nda.ts
import { ContractTemplate } from "../engine/types";

/**
 * ===============================
 * Non-Disclosure Agreement – AR
 * ===============================
 */
export const NDA_AR: ContractTemplate = {
  id: 1021,
  slug: "pro-nda-ar",
  title: "اتفاقية عدم إفشاء (NDA)",
  lang: "ar",
  group: "PRO",
  html: `
<h1>اتفاقية عدم إفشاء (NDA)</h1>
<p class="muted">رقم الاتفاقية {{contractNo}} — التاريخ {{date}} — المكان {{place}}</p>

<div class="box">
  <h2>الأطراف</h2>
  <p><b>الطرف الأول (المُفصح):</b> {{partyAName}} — {{partyAAddress}}</p>
  <p><b>الطرف الثاني (المُستلم):</b> {{partyBName}} — {{partyBAddress}}</p>
</div>

<h2>المادة (1): تعريف المعلومات السرية</h2>
<p>
تشمل المعلومات السرية جميع البيانات والمستندات والمعلومات الفنية أو التجارية
أو القانونية التي يفصح عنها الطرف الأول للطرف الثاني، سواء كانت مكتوبة أو شفهية
أو بأي وسيلة أخرى، والمتعلقة بـ {{confidentialInfoDef}}.
</p>

<h2>المادة (2): نطاق الالتزام</h2>
<ol>
  <li>عدم استخدام المعلومات السرية إلا لغرض {{purpose}}.</li>
  <li>عدم إفشاء المعلومات السرية لأي طرف ثالث دون موافقة خطية مسبقة.</li>
  <li>اتخاذ جميع التدابير المعقولة لحماية المعلومات السرية من الوصول غير المصرح به.</li>
</ol>

<h2>المادة (3): الاستثناءات</h2>
<p>
لا تسري أحكام السرية على المعلومات التي تكون متاحة للعامة دون إخلال بهذه الاتفاقية
أو التي يثبت الطرف المستلم علمه بها بشكل مشروع قبل الإفصاح.
</p>

<h2>المادة (4): مدة السرية</h2>
<p>
تظل التزامات السرية نافذة خلال مدة هذه الاتفاقية ولمدة {{confidentialityPeriod}}
بعد انتهائها أو إنهائها لأي سبب.
</p>

<h2>المادة (5): الإنهاء</h2>
<p>
لا يترتب على إنهاء هذه الاتفاقية إعفاء الطرف المستلم من التزامات السرية
المنصوص عليها فيها.
</p>

<h2>المادة (6): القانون الواجب التطبيق والاختصاص</h2>
<p>{{governingLawClause}}</p>
<p>{{jurisdictionClause}}</p>

<h2>التوقيع</h2>
<p>
حررت هذه الاتفاقية من نسختين أصليتين بيد كل طرف نسخة للعمل بموجبها.
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
 * Non-Disclosure Agreement – EN
 * ===============================
 */
export const NDA_EN: ContractTemplate = {
  id: 1022,
  slug: "pro-nda-en",
  title: "Non-Disclosure Agreement (NDA)",
  lang: "en",
  group: "PRO",
  html: `
<h1>Non-Disclosure Agreement (NDA)</h1>
<p class="muted">Agreement No. {{contractNo}} — Date {{date}} — Place {{place}}</p>

<div class="box">
  <h2>Parties</h2>
  <p><b>Disclosing Party:</b> {{partyAName}} — {{partyAAddress}}</p>
  <p><b>Receiving Party:</b> {{partyBName}} — {{partyBAddress}}</p>
</div>

<h2>Article 1: Definition of Confidential Information</h2>
<p>
Confidential Information includes all technical, commercial, legal, or other
information disclosed by the Disclosing Party to the Receiving Party, whether
in written, oral, or any other form, relating to {{confidentialInfoDef}}.
</p>

<h2>Article 2: Obligations of the Receiving Party</h2>
<ol>
  <li>Use the Confidential Information solely for {{purpose}}.</li>
  <li>Not disclose the Confidential Information to any third party without prior written consent.</li>
  <li>Take all reasonable measures to protect the Confidential Information.</li>
</ol>

<h2>Article 3: Exclusions</h2>
<p>
The obligations of confidentiality shall not apply to information that becomes
publicly available without breach of this Agreement or was lawfully known to
the Receiving Party prior to disclosure.
</p>

<h2>Article 4: Term of Confidentiality</h2>
<p>
The confidentiality obligations shall remain in force during the term of this
Agreement and for {{confidentialityPeriod}} thereafter.
</p>

<h2>Article 5: Termination</h2>
<p>
Termination of this Agreement shall not relieve the Receiving Party from its
confidentiality obligations.
</p>

<h2>Article 6: Governing Law and Jurisdiction</h2>
<p>{{governingLawClause}}</p>
<p>{{jurisdictionClause}}</p>

<h2>Execution</h2>
<p>
This Agreement is executed in two originals, one for each Party.
</p>

<table class="sig">
  <tr>
    <th>Disclosing Party</th>
    <th>Receiving Party</th>
  </tr>
  <tr>
    <td>{{partyASign}}</td>
    <td>{{partyBSign}}</td>
  </tr>
</table>
`.trim(),
};

