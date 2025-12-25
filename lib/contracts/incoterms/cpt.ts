 // CPT (AR) - Incoterms 2020
import type { ContractTemplate } from "@/lib/contracts/engine/types"; // عدّل المسار حسب مشروعك

export const CPT_AR: ContractTemplate = {
  id: 2408,
  slug: "incoterms-cpt-ar",
  title: "عقد بيع دولي – CPT (إنكوتيرمز 2020) (عربي)",
  lang: "ar",
  group: "INCOTERMS",
  html: `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family: Arial, "Noto Naskh Arabic", "Amiri", sans-serif; padding:28px; line-height:1.9; color:#111}
    h1{font-size:20px; margin:0 0 10px}
    h2{font-size:14px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #ddd; border-radius:12px; padding:12px 14px; margin:10px 0}
    table{width:100%; border-collapse:collapse}
    td{vertical-align:top; padding:6px 8px; border-bottom:1px solid #eee}
    .sig td{border-bottom:none}
    .k{width:28%; color:#333; font-weight:700}
  </style>
</head>
<body>

  <h1>عقد بيع دولي – CPT (إنكوتيرمز® {{incotermsEdition}})</h1>
  <div class="muted">
    رقم المرجع: <b>{{contractRef}}</b> • التاريخ: <b>{{contractDate}}</b> • مدينة الإبرام: <b>{{contractCity}}</b>
  </div>

  <div class="box">
    <table>
      <tr><td class="k">البائع</td><td>
        <b>{{sellerName}}</b><br/>{{sellerAddress}}<br/><span class="muted">السجل/الترخيص:</span> {{sellerReg}}
      </td></tr>
      <tr><td class="k">المشتري</td><td>
        <b>{{buyerName}}</b><br/>{{buyerAddress}}<br/><span class="muted">السجل/الترخيص:</span> {{buyerReg}}
      </td></tr>
    </table>
  </div>

  <h2>1) البضاعة</h2>
  <div class="box">
    <table>
      <tr><td class="k">الوصف</td><td>{{goodsDescription}}</td></tr>
      <tr><td class="k">رمز HS (اختياري)</td><td>{{hsCode}}</td></tr>
      <tr><td class="k">الكمية</td><td>{{quantity}} {{unit}} (التسامح: {{tolerance}})</td></tr>
      <tr><td class="k">التعبئة/الوسم</td><td>{{packaging}}<br/>{{marking}}</td></tr>
    </table>
  </div>

  <h2>2) السعر والدفع</h2>
  <div class="box">
    <table>
      <tr><td class="k">سعر الوحدة</td><td>{{unitPrice}}</td></tr>
      <tr><td class="k">السعر الإجمالي</td><td><b>{{totalPrice}}</b> {{currency}}</td></tr>
      <tr><td class="k">شروط الدفع</td><td>{{paymentTerms}}</td></tr>
    </table>
  </div>

  <h2>3) شرط التسليم (CPT)</h2>
  <div class="box">
    <p>
      اتفق الطرفان على أن يكون التسليم وفق شرط <b>CPT – أجور النقل مدفوعة إلى</b>، إنكوتيرمز® {{incotermsEdition}}،
      إلى مكان الوصول المسمّى: <b>{{placeOfDestination}}</b>.
    </p>
    <table>
      <tr><td class="k">مكان الوصول المسمّى</td><td>{{placeOfDestination}}</td></tr>
      <tr><td class="k">مكان التسليم (تسليم للناقل)</td><td>{{placeOfDelivery}}</td></tr>
      <tr><td class="k">موعد/جدول الشحن</td><td>{{deliverySchedule}}</td></tr>
      <tr><td class="k">الناقل/وسيلة النقل</td><td>{{carrierDetails}}</td></tr>
    </table>

    <p class="muted">
      بموجب CPT: يلتزم البائع بالتعاقد على النقل ودفع أجور النقل إلى مكان الوصول المسمّى، بينما تنتقل المخاطر إلى المشتري
      عند تسليم البضاعة إلى أول ناقل في مكان التسليم.
    </p>
  </div>

  <h2>4) المستندات والفحص</h2>
  <div class="box">
    <table>
      <tr><td class="k">قائمة المستندات</td><td>{{documentsList}}</td></tr>
      <tr><td class="k">الفحص/الاعتراض</td><td>{{inspection}}</td></tr>
    </table>
  </div>

  <h2>5) القوة القاهرة</h2>
  <div class="box">{{forceMajeure}}</div>

  <h2>6) القانون الواجب التطبيق وفض النزاعات</h2>
  <div class="box">
    <table>
      <tr><td class="k">القانون الواجب التطبيق</td><td>{{governingLaw}}</td></tr>
      <tr><td class="k">فض النزاعات</td><td>{{disputeResolution}}</td></tr>
      <tr><td class="k">مقر التحكيم (إن وجد)</td><td>{{arbitrationSeat}}</td></tr>
      <tr><td class="k">لغة العقد المعتمدة</td><td>{{languagePrevails}}</td></tr>
    </table>
  </div>

  <h2>7) التواقيع</h2>
  <div class="box">
    <table class="sig">
      <tr>
        <td style="width:50%">
          <b>توقيع البائع</b><br/>
          الاسم/الصفة: {{sellerSignName}}<br/>
          التاريخ: {{sellerSignDate}}<br/><br/>
          التوقيع: ____________________
        </td>
        <td style="width:50%">
          <b>توقيع المشتري</b><br/>
          الاسم/الصفة: {{buyerSignName}}<br/>
          التاريخ: {{buyerSignDate}}<br/><br/>
          التوقيع: ____________________
        </td>
      </tr>
    </table>
  </div>

</body>
</html>`,
};
// CPT (EN) - Incoterms 2020
 // عدّل المسار حسب مشروعك

export const CPT_EN: ContractTemplate = {
  id: 2407,
  slug: "incoterms-cpt-en",
  title: "CPT (Incoterms 2020) – International Sale Contract (English)",
  lang: "en",
  group: "INCOTERMS",
  html: `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{font-family: Arial, sans-serif; padding:28px; line-height:1.65; color:#111}
    h1{font-size:20px; margin:0 0 10px}
    h2{font-size:14px; margin:18px 0 8px}
    .muted{color:#555; font-size:12px}
    .box{border:1px solid #ddd; border-radius:12px; padding:12px 14px; margin:10px 0}
    table{width:100%; border-collapse:collapse}
    td{vertical-align:top; padding:6px 8px; border-bottom:1px solid #eee}
    .sig td{border-bottom:none}
    .k{width:26%; color:#333}
  </style>
</head>
<body>

  <h1>International Sale Contract – CPT (Incoterms® {{incotermsEdition}})</h1>
  <div class="muted">
    Contract Ref: <b>{{contractRef}}</b> • Date: <b>{{contractDate}}</b> • City: <b>{{contractCity}}</b>
  </div>

  <div class="box">
    <table>
      <tr><td class="k"><b>Seller</b></td><td>
        <b>{{sellerName}}</b><br/>{{sellerAddress}}<br/><span class="muted">Registration/License:</span> {{sellerReg}}
      </td></tr>
      <tr><td class="k"><b>Buyer</b></td><td>
        <b>{{buyerName}}</b><br/>{{buyerAddress}}<br/><span class="muted">Registration/License:</span> {{buyerReg}}
      </td></tr>
    </table>
  </div>

  <h2>1) Goods</h2>
  <div class="box">
    <table>
      <tr><td class="k">Description</td><td>{{goodsDescription}}</td></tr>
      <tr><td class="k">HS Code (optional)</td><td>{{hsCode}}</td></tr>
      <tr><td class="k">Quantity</td><td>{{quantity}} {{unit}} (Tolerance: {{tolerance}})</td></tr>
      <tr><td class="k">Packaging / Marking</td><td>{{packaging}}<br/>{{marking}}</td></tr>
    </table>
  </div>

  <h2>2) Price & Payment</h2>
  <div class="box">
    <table>
      <tr><td class="k">Unit Price</td><td>{{unitPrice}}</td></tr>
      <tr><td class="k">Total Price</td><td><b>{{totalPrice}}</b> {{currency}}</td></tr>
      <tr><td class="k">Payment Terms</td><td>{{paymentTerms}}</td></tr>
    </table>
  </div>

  <h2>3) Delivery Term (CPT)</h2>
  <div class="box">
    <p>
      The Parties agree that delivery shall be made under <b>CPT – Carriage Paid To</b>, Incoterms® {{incotermsEdition}},
      at the named place of destination: <b>{{placeOfDestination}}</b>.
    </p>
    <table>
      <tr><td class="k">Named Place of Destination</td><td>{{placeOfDestination}}</td></tr>
      <tr><td class="k">Place of Delivery (handover to carrier)</td><td>{{placeOfDelivery}}</td></tr>
      <tr><td class="k">Delivery / Dispatch Schedule</td><td>{{deliverySchedule}}</td></tr>
      <tr><td class="k">Carrier / Transport Mode</td><td>{{carrierDetails}}</td></tr>
    </table>

    <p class="muted">
      Note: Under CPT, the Seller contracts and pays for carriage to the named destination, while risk transfers to the Buyer
      when the goods are handed over to the first carrier at the place of delivery.
    </p>
  </div>

  <h2>4) Documents</h2>
  <div class="box">
    <table>
      <tr><td class="k">Documents List</td><td>{{documentsList}}</td></tr>
      <tr><td class="k">Inspection / Claims</td><td>{{inspection}}</td></tr>
    </table>
  </div>

  <h2>5) Force Majeure</h2>
  <div class="box">{{forceMajeure}}</div>

  <h2>6) Governing Law & Dispute Resolution</h2>
  <div class="box">
    <table>
      <tr><td class="k">Governing Law</td><td>{{governingLaw}}</td></tr>
      <tr><td class="k">Dispute Resolution</td><td>{{disputeResolution}}</td></tr>
      <tr><td class="k">Arbitration Seat (if any)</td><td>{{arbitrationSeat}}</td></tr>
      <tr><td class="k">Language Prevails</td><td>{{languagePrevails}}</td></tr>
    </table>
  </div>

  <h2>7) Signatures</h2>
  <div class="box">
    <table class="sig">
      <tr>
        <td style="width:50%">
          <b>Seller</b><br/>
          Name/Title: {{sellerSignName}}<br/>
          Date: {{sellerSignDate}}<br/><br/>
          Signature: ____________________
        </td>
        <td style="width:50%">
          <b>Buyer</b><br/>
          Name/Title: {{buyerSignName}}<br/>
          Date: {{buyerSignDate}}<br/><br/>
          Signature: ____________________
        </td>
      </tr>
    </table>
  </div>

</body>
</html>`,
};
