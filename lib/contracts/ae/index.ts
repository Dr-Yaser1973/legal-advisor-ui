// lib/contracts/ae/index.ts
// العقود الإماراتية (مصاغة وفق القوانين الاتحادية الإماراتية).
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_AE_AR, SALE_AE_EN } from "./sale";
import { LEASE_AE_AR, LEASE_AE_EN } from "./lease";
import { EMPLOYMENT_AE_AR, EMPLOYMENT_AE_EN } from "./employment";
import { CONSTRUCTION_AE_AR, CONSTRUCTION_AE_EN } from "./construction";
import { PARTNERSHIP_AE_AR, PARTNERSHIP_AE_EN } from "./partnership";
import { AGENCY_AE_AR, AGENCY_AE_EN } from "./agency";
import { PLEDGE_AE_AR, PLEDGE_AE_EN } from "./pledge";
import { GUARANTEE_AE_AR, GUARANTEE_AE_EN } from "./guarantee";
import { LOAN_AE_AR, LOAN_AE_EN } from "./loan";
import { DEPOSIT_AE_AR, DEPOSIT_AE_EN } from "./deposit";
import { SETTLEMENT_AE_AR, SETTLEMENT_AE_EN } from "./settlement";
import { INSURANCE_AE_AR, INSURANCE_AE_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const AE_TEMPLATES: ContractTemplate[] = [
  SALE_AE_AR, SALE_AE_EN,
  LEASE_AE_AR, LEASE_AE_EN,
  EMPLOYMENT_AE_AR, EMPLOYMENT_AE_EN,
  CONSTRUCTION_AE_AR, CONSTRUCTION_AE_EN,
  PARTNERSHIP_AE_AR, PARTNERSHIP_AE_EN,
  AGENCY_AE_AR, AGENCY_AE_EN,
  PLEDGE_AE_AR, PLEDGE_AE_EN,
  GUARANTEE_AE_AR, GUARANTEE_AE_EN,
  LOAN_AE_AR, LOAN_AE_EN,
  DEPOSIT_AE_AR, DEPOSIT_AE_EN,
  SETTLEMENT_AE_AR, SETTLEMENT_AE_EN,
  INSURANCE_AE_AR, INSURANCE_AE_EN,
  ...SERVICE_TEMPLATES,
];
