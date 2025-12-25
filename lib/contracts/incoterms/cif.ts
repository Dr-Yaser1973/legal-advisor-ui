 // lib/contracts/incoterms/cif.premium.ts
 import { ContractTemplate } from "../engine/types";
 // CIF Premium (AR) — Option C (legal drafting + UX labels) — no API changes
export const CIF_AR: ContractTemplate = {
  id: 2040,
  slug: "incoterms-cif-premium-ar",
  title: "عقد بيع دولي (CIF) احترافي — عربي",
  lang: "ar",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root{ --fg:#111; --muted:#555; --line:#ddd; --bg:#fff; }
    *{ box-sizing:border-box; }
    body{ font-family: "Noto Naskh Arabic","Amiri","Arial",sans-serif; color:var(--fg); background:var(--bg); padding:28px; line-height:1.85; }
    h1{ font-size:20px; margin:0 0 10px; }
    h2{ font-size:15px; margin:18px 0 8px; }
    h3{ font-size:13px; margin:12px 0 6px; }
    .muted{ color:var(--muted); font-size:12px; }
    .hr{ height:1px; background:var(--line); margin:14px 0; }
    .box{ border:1px solid var(--line); border-radius:12px; padding:12px 14px; margin:10px 0; }
    .grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .k{ font-weight:700; }
    table{ width:100%; border-collapse:collapse; margin:8px 0; }
    td,th{ border:1px solid var(--line); padding:8px 10px; vertical-align:top; }
    th{ background:#f6f6f6; font-weight:700; }
    ul{ margin:8px 0; padding:0 18px; }
    .sig{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:18px; }
    .sig .box{ min-height:120px; }
    .small{ font-size:12px; }
  </style>
</head>
<body>

  <h1>عقد بيع دولي وفق شرط CIF (Incoterms® {{incotermsEdition}})</h1>
  <div class="muted">
    رقم المرجع: <span class="k">{{contractRef}}</span> — تاريخ العقد: <span class="k">{{contractDate}}</span> — مكان الإبرام: <span class="k">{{contractCity}}</span>
  </div>

  <div class="hr"></div>

  <h2>أولاً: أطراف العقد</h2>
  <div class="grid">
    <div class="box">
      <div class="k">الطرف الأول (البائع)</div>
      <div>{{sellerName}}</div>
      <div class="muted">العنوان: {{sellerAddress}}</div>
      <div class="muted">السجل/الترخيص/الهوية: {{sellerReg}}</div>
    </div>
    <div class="box">
      <div class="k">الطرف الثاني (المشتري)</div>
      <div>{{buyerName}}</div>
      <div class="muted">العنوان: {{buyerAddress}}</div>
      <div class="muted">السجل/الترخيص/الهوية: {{buyerReg}}</div>
    </div>
  </div>

  <div class="box">
    <div class="k">تمهيد</div>
    <div>
      حيث يرغب الطرفان في إبرام عقد بيع دولي للبضاعة المحددة أدناه، وبموجب شرط
      <span class="k">CIF</span> وفق قواعد
      <span class="k">Incoterms® {{incotermsEdition}}</span>،
      فقد اتفقا وهما بكامل الأهلية والرضا على ما يأتي، ويُعد هذا التمهيد جزءًا لا يتجزأ من العقد.
    </div>
  </div>

  <h2>ثانياً: التعريفات والتفسير</h2>
  <div class="box small">
    <ul>
      <li><span class="k">قواعد الانكوتيرمز:</span> تعني قواعد Incoterms® {{incotermsEdition}} الصادرة عن غرفة التجارة الدولية (ICC).</li>
      <li><span class="k">البضاعة:</span> تعني البضاعة موضوع البيع المبينة في هذا العقد.</li>
      <li><span class="k">سريان أحكام CIF:</span> في حال التعارض بين هذا العقد وقواعد الانكوتيرمز، تُفسَّر الالتزامات التجارية الخاصة بالتسليم/المخاطر/التكاليف وفق CIF ما لم ينص هذا العقد صراحة على خلاف ذلك.</li>
    </ul>
  </div>

  <h2>ثالثاً: موضوع العقد — البضاعة والمواصفات</h2>
  <table>
    <tr>
      <th style="width:30%">وصف البضاعة</th>
      <td>{{goodsDescription}}</td>
    </tr>
    <tr>
      <th>الرمز الجمركي (HS) — إن وجد</th>
      <td>{{hsCode}}</td>
    </tr>
    <tr>
      <th>الكمية</th>
      <td>{{quantity}} {{unit}} <span class="muted">(نسبة/حد التسامح: {{tolerance}})</span></td>
    </tr>
    <tr>
      <th>التعبئة والتغليف والوسم</th>
      <td>{{packaging}}<div class="muted">الوسم/العلامات: {{marking}}</div></td>
    </tr>
  </table>

  <h2>رابعاً: السعر والعملة وشروط الدفع</h2>
  <table>
    <tr>
      <th style="width:30%">سعر الوحدة</th>
      <td>{{unitPrice}} {{currency}}</td>
    </tr>
    <tr>
      <th>السعر الإجمالي</th>
      <td>{{totalPrice}} {{currency}}</td>
    </tr>
    <tr>
      <th>شروط الدفع</th>
      <td>{{paymentTerms}}</td>
    </tr>
  </table>
  <div class="muted">
    يُعد السعر شاملاً للتكاليف التي يتحملها البائع بموجب CIF، بما في ذلك أجور الشحن البحري والتأمين ضمن الحد المتفق عليه أدناه.
  </div>

  <h2>خامساً: شرط التسليم CIF — الموانئ والجدول الزمني</h2>
  <table>
    <tr>
      <th style="width:30%">ميناء الشحن</th>
      <td>{{portOfShipment}}</td>
    </tr>
    <tr>
      <th>ميناء المقصد</th>
      <td>{{portOfDestination}}</td>
    </tr>
    <tr>
      <th>جدول/موعد التسليم</th>
      <td>{{deliverySchedule}}</td>
    </tr>
  </table>

  <div class="box">
    <div class="k">نقل المخاطر</div>
    <div>
      تنتقل مخاطر هلاك/تلف البضاعة من البائع إلى المشتري عند
      <span class="k">تحميل البضاعة على متن السفينة</span>
      في ميناء الشحن <span class="k">{{portOfShipment}}</span>،
      وذلك وفق CIF (Incoterms® {{incotermsEdition}})،
      مع بقاء التزام البائع بإبرام عقد الشحن والتأمين وفق هذا العقد.
    </div>
  </div>

  <h2>سادساً: الشحن والنقل والمستندات</h2>
  <div class="box">
    <div class="k">التزامات البائع بالمستندات</div>
    <div>يلتزم البائع بتقديم المستندات الآتية (أو ما يعادلها) للمشتري ضمن المهل المعقولة تجاريًا:</div>
    <div class="small">{{documentsList}}</div>
    <div class="muted">يُراعى أن تكون المستندات مطابقة لبيانات البضاعة والكميات والموانئ وأسماء الأطراف.</div>
  </div>

  <h2>سابعاً: التأمين (Insurance) — نطاق التغطية</h2>
  <table>
    <tr>
      <th style="width:30%">نطاق/مستوى التغطية</th>
      <td>{{insuranceCoverage}}</td>
    </tr>
    <tr>
      <th>شركة التأمين</th>
      <td>{{insuranceCompany}}</td>
    </tr>
    <tr>
      <th>رقم الوثيقة/الشهادة</th>
      <td>{{insurancePolicyNo}}</td>
    </tr>
  </table>
  <div class="box small">
    <ul>
      <li>يلتزم البائع بإبرام التأمين لصالح المشتري/أو لمنفعة المشتري على الأقل ضمن الحدود المشار إليها أعلاه وبما يتوافق مع CIF.</li>
      <li>أي تغطيات إضافية (مثل أخطار الحرب/الإضرابات أو زيادة مبلغ التأمين) لا تكون ملزمة للبائع إلا إذا نُص عليها صراحة أو قبلها كتابة.</li>
    </ul>
  </div>

  <h2>ثامناً: الفحص والقبول والمطالبات</h2>
  <div class="box">
    <div class="k">الفحص</div>
    <div>{{inspection}}</div>
  </div>
  <div class="box">
    <div class="k">المطالبات</div>
    <div>
      في حال وجود عيب ظاهر أو نقص في الكمية، يلتزم المشتري بإخطار البائع خطيًا خلال مدة معقولة من تاريخ الاستلام/التفريغ،
      مع تزويد المستندات المؤيدة (محضر، صور، تقرير جهة فحص إن أمكن). لا يخل ذلك بحقوق المشتري تجاه شركة التأمين وفق وثيقة التأمين.
    </div>
  </div>

  <h2>تاسعاً: الامتثال والقيود</h2>
  <div class="box small">
    <ul>
      <li><span class="k">الامتثال القانوني والعقوبات:</span> يقر الطرفان بالالتزام بالقوانين المعمول بها ولوائح التصدير/الاستيراد والعقوبات ذات الصلة.</li>
      <li><span class="k">مكافحة الرشوة والفساد:</span> يتعهد الطرفان بالامتناع عن أي ممارسات فساد أو رشاوى مرتبطة بالعقد.</li>
      <li><span class="k">القوة القاهرة:</span> {{forceMajeure}}</li>
    </ul>
  </div>

  <h2>عاشراً: القانون الواجب التطبيق وتسوية المنازعات</h2>
  <table>
    <tr>
      <th style="width:30%">القانون الواجب التطبيق</th>
      <td>{{governingLaw}}</td>
    </tr>
    <tr>
      <th>آلية تسوية المنازعات</th>
      <td>{{disputeResolution}}</td>
    </tr>
    <tr>
      <th>مقر/مكان التحكيم (إن وجد)</th>
      <td>{{arbitrationSeat}}</td>
    </tr>
  </table>

  <h2>حادي عشر: أحكام ختامية</h2>
  <div class="box small">
    <ul>
      <li><span class="k">الإخطارات:</span> تُرسل الإخطارات إلى عناوين الأطراف المبينة أعلاه أو أي عنوان بديل يُخطر به خطيًا.</li>
      <li><span class="k">عدم التنازل والتنازل/الحوالة:</span> لا يُعد عدم ممارسة أي حق تنازلاً عنه. لا يجوز التنازل عن العقد إلا بموافقة خطية.</li>
      <li><span class="k">كامل الاتفاق:</span> يمثل هذا العقد كامل الاتفاق ويلغي ما سبقه من مراسلات/عروض بشأن موضوعه.</li>
      <li><span class="k">لغة العقد:</span> {{languagePrevails}}</li>
    </ul>
  </div>

  <div class="sig">
    <div class="box">
      <div class="k">توقيع البائع</div>
      <div class="muted">الاسم/الصفة: {{sellerSignName}}</div>
      <div class="muted">التاريخ: {{sellerSignDate}}</div>
      <div class="muted">الختم (إن وجد):</div>
    </div>
    <div class="box">
      <div class="k">توقيع المشتري</div>
      <div class="muted">الاسم/الصفة: {{buyerSignName}}</div>
      <div class="muted">التاريخ: {{buyerSignDate}}</div>
      <div class="muted">الختم (إن وجد):</div>
    </div>
  </div>

</body>
</html>
`.trim(),
};
// CIF Premium (EN) — Option C
export const CIF_EN: ContractTemplate = {
  id: 2041,
  slug: "incoterms-cif-premium-en",
  title: "International Sale Contract (CIF) — English",
  lang: "en",
  group: "INCOTERMS",
  html: `
<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    :root{ --fg:#111; --muted:#555; --line:#ddd; --bg:#fff; }
    *{ box-sizing:border-box; }
    body{ font-family: Arial, "Times New Roman", serif; color:var(--fg); background:var(--bg); padding:28px; line-height:1.65; }
    h1{ font-size:20px; margin:0 0 10px; }
    h2{ font-size:15px; margin:18px 0 8px; }
    .muted{ color:var(--muted); font-size:12px; }
    .hr{ height:1px; background:var(--line); margin:14px 0; }
    .box{ border:1px solid var(--line); border-radius:12px; padding:12px 14px; margin:10px 0; }
    .grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .k{ font-weight:700; }
    table{ width:100%; border-collapse:collapse; margin:8px 0; }
    td,th{ border:1px solid var(--line); padding:8px 10px; vertical-align:top; }
    th{ background:#f6f6f6; font-weight:700; }
    ul{ margin:8px 0; padding-left:18px; }
    .sig{ display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:18px; }
    .sig .box{ min-height:120px; }
    .small{ font-size:12px; }
  </style>
</head>
<body>

  <h1>International Sale Contract under CIF (Incoterms® {{incotermsEdition}})</h1>
  <div class="muted">
    Ref: <span class="k">{{contractRef}}</span> — Date: <span class="k">{{contractDate}}</span> — Place: <span class="k">{{contractCity}}</span>
  </div>

  <div class="hr"></div>

  <h2>1. Parties</h2>
  <div class="grid">
    <div class="box">
      <div class="k">Seller</div>
      <div>{{sellerName}}</div>
      <div class="muted">Address: {{sellerAddress}}</div>
      <div class="muted">Reg/ID: {{sellerReg}}</div>
    </div>
    <div class="box">
      <div class="k">Buyer</div>
      <div>{{buyerName}}</div>
      <div class="muted">Address: {{buyerAddress}}</div>
      <div class="muted">Reg/ID: {{buyerReg}}</div>
    </div>
  </div>

  <div class="box">
    <div class="k">Recitals</div>
    <div>
      The Parties wish to enter into an international sale contract for the goods described herein
      on CIF terms under Incoterms® {{incotermsEdition}}. This recital forms an integral part of the Contract.
    </div>
  </div>

  <h2>2. Goods & Specifications</h2>
  <table>
    <tr><th style="width:30%">Goods</th><td>{{goodsDescription}}</td></tr>
    <tr><th>HS Code (if any)</th><td>{{hsCode}}</td></tr>
    <tr><th>Quantity</th><td>{{quantity}} {{unit}} <span class="muted">(Tolerance: {{tolerance}})</span></td></tr>
    <tr><th>Packing & Marking</th><td>{{packaging}}<div class="muted">Marking: {{marking}}</div></td></tr>
  </table>

  <h2>3. Price & Payment</h2>
  <table>
    <tr><th style="width:30%">Unit Price</th><td>{{unitPrice}} {{currency}}</td></tr>
    <tr><th>Total Price</th><td>{{totalPrice}} {{currency}}</td></tr>
    <tr><th>Payment Terms</th><td>{{paymentTerms}}</td></tr>
  </table>

  <h2>4. CIF Delivery — Ports & Schedule</h2>
  <table>
    <tr><th style="width:30%">Port of Shipment</th><td>{{portOfShipment}}</td></tr>
    <tr><th>Port of Destination</th><td>{{portOfDestination}}</td></tr>
    <tr><th>Delivery Schedule</th><td>{{deliverySchedule}}</td></tr>
  </table>

  <div class="box">
    <div class="k">Risk Transfer</div>
    <div>
      Risk transfers from Seller to Buyer when the goods are loaded on board the vessel at the port of shipment
      ({{portOfShipment}}) in accordance with CIF (Incoterms® {{incotermsEdition}}), while Seller remains obliged to
      arrange carriage and insurance as stated herein.
    </div>
  </div>

  <h2>5. Shipping & Documents</h2>
  <div class="box">
    <div class="k">Documents</div>
    <div class="small">{{documentsList}}</div>
    <div class="muted">Documents must be consistent with the goods, quantities, ports, and Parties’ details.</div>
  </div>

  <h2>6. Insurance</h2>
  <table>
    <tr><th style="width:30%">Coverage Level</th><td>{{insuranceCoverage}}</td></tr>
    <tr><th>Insurer</th><td>{{insuranceCompany}}</td></tr>
    <tr><th>Policy/Certificate No.</th><td>{{insurancePolicyNo}}</td></tr>
  </table>
  <div class="box small">
    <ul>
      <li>Seller shall procure insurance for Buyer’s benefit at least to the extent stated above, consistent with CIF.</li>
      <li>Any additional cover (war/strikes or increased insured amount) is only binding if expressly agreed in writing.</li>
    </ul>
  </div>

  <h2>7. Inspection, Acceptance & Claims</h2>
  <div class="box"><div class="k">Inspection</div><div>{{inspection}}</div></div>
  <div class="box">
    <div class="k">Claims</div>
    <div>
      Buyer shall notify Seller in writing within a commercially reasonable time upon discovery of apparent defects/shortage,
      enclosing supporting evidence. This does not prejudice Buyer’s rights under the insurance policy.
    </div>
  </div>

  <h2>8. Compliance & Force Majeure</h2>
  <div class="box small">
    <ul>
      <li><span class="k">Sanctions/Export-Import Compliance:</span> The Parties shall comply with applicable laws and regulations.</li>
      <li><span class="k">Anti-bribery:</span> The Parties shall not engage in corrupt practices related to this Contract.</li>
      <li><span class="k">Force Majeure:</span> {{forceMajeure}}</li>
    </ul>
  </div>

  <h2>9. Governing Law & Dispute Resolution</h2>
  <table>
    <tr><th style="width:30%">Governing Law</th><td>{{governingLaw}}</td></tr>
    <tr><th>Dispute Resolution</th><td>{{disputeResolution}}</td></tr>
    <tr><th>Arbitration Seat (if any)</th><td>{{arbitrationSeat}}</td></tr>
  </table>

  <h2>10. Final Provisions</h2>
  <div class="box small">
    <ul>
      <li><span class="k">Notices:</span> Notices shall be sent to the addresses stated above unless updated in writing.</li>
      <li><span class="k">Assignment:</span> No assignment without prior written consent.</li>
      <li><span class="k">Entire Agreement:</span> This Contract constitutes the entire agreement between the Parties.</li>
      <li><span class="k">Contract Language:</span> {{languagePrevails}}</li>
    </ul>
  </div>

  <div class="sig">
    <div class="box">
      <div class="k">Seller Signature</div>
      <div class="muted">Name/Title: {{sellerSignName}}</div>
      <div class="muted">Date: {{sellerSignDate}}</div>
    </div>
    <div class="box">
      <div class="k">Buyer Signature</div>
      <div class="muted">Name/Title: {{buyerSignName}}</div>
      <div class="muted">Date: {{buyerSignDate}}</div>
    </div>
  </div>

</body>
</html>
`.trim(),
};
