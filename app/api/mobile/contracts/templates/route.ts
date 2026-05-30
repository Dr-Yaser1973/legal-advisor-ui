 import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/jwt";
import { CONTRACT_CATALOG } from "@/lib/contracts/catalog";
import {
  getIncotermsFieldUi,
  IncotermsTerm,
} from "@/lib/contracts/incoterms/incotermsFieldUi";
 import { ContractField, FieldType } from "@/lib/contracts/engine/types";

export const runtime = "nodejs";

// استخراج اسم الـ Term من الـ slug (مثال: incoterms-fob-premium-ar → FOB)
function extractTerm(slug: string): IncotermsTerm | null {
  const terms: IncotermsTerm[] = [
    "EXW","FCA","FAS","FOB","CFR","CIF","CPT","CIP","DAP","DPU","DDP"
  ];
  const upper = slug.toUpperCase();
  return terms.find((t) => upper.includes(t)) ?? null;
}

// تحويل FieldUiMap إلى ContractField[]
function uiMapToFields(
  uiMap: Record<string, { label: string; hint?: string; order: number }>,
  lang: "ar" | "en"
) {
  return Object.entries(uiMap)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, ui]) => ({
      key,
      label: ui.label,
      hint: ui.hint,
      required: true,
      type: inferType(key),
      group: inferGroup(key, lang),
    }));
}

// استنتاج نوع الحقل من اسم المفتاح
 function inferType(key: string): FieldType {
  if (key.toLowerCase().includes("date")) return "date";
  if (["unitPrice","totalPrice","quantity"].includes(key)) return "number";
  if (["paymentTerms","goodsDescription","documentsList","inspection",
       "forceMajeure","disputeResolution","packaging","importClearance",
       "insuranceCoverage"].includes(key)) return "textarea";
  if (key === "currency") return "select";
  if (key === "incotermsEdition") return "select";
  if (key === "languagePrevails") return "select";
  return "text";
}

// استنتاج المجموعة من اسم المفتاح
function inferGroup(key: string, lang: "ar" | "en"): string {
  const ar = lang === "ar";
  if (["contractRef","contractDate","contractCity","incotermsEdition"].includes(key))
    return ar ? "معلومات العقد" : "Contract Info";
  if (["sellerName","sellerAddress","sellerReg"].includes(key))
    return ar ? "البائع" : "Seller";
  if (["buyerName","buyerAddress","buyerReg"].includes(key))
    return ar ? "المشتري" : "Buyer";
  if (["goodsDescription","hsCode","quantity","unit","tolerance"].includes(key))
    return ar ? "البضاعة" : "Goods";
  if (["unitPrice","totalPrice","currency","paymentTerms"].includes(key))
    return ar ? "السعر والدفع" : "Price & Payment";
  if (["portOfShipment","portOfDestination","deliverySchedule",
       "finalDeliveryPlace","terminalName","carrierName","carrierRef"].includes(key))
    return ar ? "التسليم والشحن" : "Delivery & Shipment";
  if (["insuranceCoverage","insuranceCompany","insurancePolicyNo"].includes(key))
    return ar ? "التأمين" : "Insurance";
  if (["documentsList","inspection","packaging","marking"].includes(key))
    return ar ? "المستندات والفحص" : "Documents & Inspection";
  if (["importClearance"].includes(key))
    return ar ? "التخليص الجمركي" : "Import Clearance";
  if (["forceMajeure","governingLaw","disputeResolution",
       "arbitrationSeat","languagePrevails"].includes(key))
    return ar ? "أحكام قانونية" : "Legal Provisions";
  if (["sellerSignName","sellerSignDate","buyerSignName","buyerSignDate"].includes(key))
    return ar ? "التواقيع" : "Signatures";
  return ar ? "أخرى" : "Other";
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }
    await verifyUserToken(authHeader.split(" ")[1]);

    const templates = CONTRACT_CATALOG.map((t) => {
      let fields: ContractField[];

      if (Array.isArray(t.fields) && t.fields.length > 0) {
        // القالب له fields معرّفة مباشرة (PRO + الإنكوترمز الجديدة)
        fields = t.fields;
      } else if (t.group === "INCOTERMS") {
        // الإنكوترمز القديمة — نبني من incotermsFieldUi
        const term = extractTerm(t.slug);
        const lang = t.lang as "ar" | "en";
        if (term) {
          const uiMap = getIncotermsFieldUi(term, lang);
          fields = uiMapToFields(uiMap, lang);
        } else {
          fields = [];
        }
      } else {
        fields = [];
      }

      return {
        id: t.id,
        slug: t.slug,
        title: t.title,
        lang: t.lang,
        group: t.group,
        fields,
      };
    });

    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ error: "token غير صالح" }, { status: 401 });
  }
}
