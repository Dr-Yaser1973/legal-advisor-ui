 import { ContractTemplate } from "./engine/types";

// PRO
import { SALE_AR, SALE_EN } from "./pro/sale";
import { SERVICES_AR, SERVICES_EN } from "./pro/services";
 import { NDA_AR, NDA_EN } from "./pro/nda";
 import { DISTRIBUTION_AR, DISTRIBUTION_EN } from "./pro/distribution";
// INCOTERMS
import { EXW_AR, EXW_EN } from "./incoterms/exw";
import { FCA_AR, FCA_EN } from "./incoterms/fca";
import { FAS_AR, FAS_EN } from "./incoterms/fas";
import { FOB_AR, FOB_EN } from "./incoterms/fob";
import { CFR_AR, CFR_EN } from "./incoterms/cfr";
import { CIF_AR, CIF_EN } from "./incoterms/cif";
import { CPT_AR, CPT_EN } from "./incoterms/cpt";
import { CIP_AR, CIP_EN } from "./incoterms/cip";
import { DAP_AR, DAP_EN } from "./incoterms/dap";
import { DPU_AR, DPU_EN } from "./incoterms/dpu";
import { DDP_AR, DDP_EN } from "./incoterms/ddp";

export const CONTRACT_CATALOG: ContractTemplate[] = [
  // PRO
  SALE_AR,
  SALE_EN,
  SERVICES_AR,
  SERVICES_EN,
   NDA_AR,
   NDA_EN,
   DISTRIBUTION_AR,
   DISTRIBUTION_EN,
   
  // INCOTERMS
    EXW_AR, EXW_EN,
  FCA_AR, FCA_EN,
  FAS_AR, FAS_EN,
  FOB_AR, FOB_EN,
  CFR_AR, CFR_EN,
  CIF_AR, CIF_EN,
  CPT_AR, CPT_EN,
  CIP_AR, CIP_EN,
  DAP_AR, DAP_EN,
  DPU_AR, DPU_EN,
  DDP_AR, DDP_EN,
];

export function getTemplateBySlug(slug: string): ContractTemplate | undefined {
  return CONTRACT_CATALOG.find(t => t.slug === slug);
}

export function listTemplates() {
  return CONTRACT_CATALOG.map(t => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    lang: t.lang,
    group: t.group,
  }));
}
