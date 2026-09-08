// lib/contracts/om/index.ts
// العقود العُمانية (مصاغة وفق القوانين العُمانية).
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_OM_AR, SALE_OM_EN } from "./sale";
import { LEASE_OM_AR, LEASE_OM_EN } from "./lease";
import { EMPLOYMENT_OM_AR, EMPLOYMENT_OM_EN } from "./employment";
import { CONSTRUCTION_OM_AR, CONSTRUCTION_OM_EN } from "./construction";
import { PARTNERSHIP_OM_AR, PARTNERSHIP_OM_EN } from "./partnership";
import { AGENCY_OM_AR, AGENCY_OM_EN } from "./agency";
import { PLEDGE_OM_AR, PLEDGE_OM_EN } from "./pledge";
import { GUARANTEE_OM_AR, GUARANTEE_OM_EN } from "./guarantee";
import { LOAN_OM_AR, LOAN_OM_EN } from "./loan";
import { DEPOSIT_OM_AR, DEPOSIT_OM_EN } from "./deposit";
import { SETTLEMENT_OM_AR, SETTLEMENT_OM_EN } from "./settlement";
import { INSURANCE_OM_AR, INSURANCE_OM_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const OM_TEMPLATES: ContractTemplate[] = [
  SALE_OM_AR, SALE_OM_EN,
  LEASE_OM_AR, LEASE_OM_EN,
  EMPLOYMENT_OM_AR, EMPLOYMENT_OM_EN,
  CONSTRUCTION_OM_AR, CONSTRUCTION_OM_EN,
  PARTNERSHIP_OM_AR, PARTNERSHIP_OM_EN,
  AGENCY_OM_AR, AGENCY_OM_EN,
  PLEDGE_OM_AR, PLEDGE_OM_EN,
  GUARANTEE_OM_AR, GUARANTEE_OM_EN,
  LOAN_OM_AR, LOAN_OM_EN,
  DEPOSIT_OM_AR, DEPOSIT_OM_EN,
  SETTLEMENT_OM_AR, SETTLEMENT_OM_EN,
  INSURANCE_OM_AR, INSURANCE_OM_EN,
  ...SERVICE_TEMPLATES,
];
