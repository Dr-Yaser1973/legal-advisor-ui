// lib/contracts/bh/index.ts
// العقود البحرينية (مصاغة وفق القوانين البحرينية).
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_BH_AR, SALE_BH_EN } from "./sale";
import { LEASE_BH_AR, LEASE_BH_EN } from "./lease";
import { EMPLOYMENT_BH_AR, EMPLOYMENT_BH_EN } from "./employment";
import { CONSTRUCTION_BH_AR, CONSTRUCTION_BH_EN } from "./construction";
import { PARTNERSHIP_BH_AR, PARTNERSHIP_BH_EN } from "./partnership";
import { AGENCY_BH_AR, AGENCY_BH_EN } from "./agency";
import { PLEDGE_BH_AR, PLEDGE_BH_EN } from "./pledge";
import { GUARANTEE_BH_AR, GUARANTEE_BH_EN } from "./guarantee";
import { LOAN_BH_AR, LOAN_BH_EN } from "./loan";
import { DEPOSIT_BH_AR, DEPOSIT_BH_EN } from "./deposit";
import { SETTLEMENT_BH_AR, SETTLEMENT_BH_EN } from "./settlement";
import { INSURANCE_BH_AR, INSURANCE_BH_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const BH_TEMPLATES: ContractTemplate[] = [
  SALE_BH_AR, SALE_BH_EN,
  LEASE_BH_AR, LEASE_BH_EN,
  EMPLOYMENT_BH_AR, EMPLOYMENT_BH_EN,
  CONSTRUCTION_BH_AR, CONSTRUCTION_BH_EN,
  PARTNERSHIP_BH_AR, PARTNERSHIP_BH_EN,
  AGENCY_BH_AR, AGENCY_BH_EN,
  PLEDGE_BH_AR, PLEDGE_BH_EN,
  GUARANTEE_BH_AR, GUARANTEE_BH_EN,
  LOAN_BH_AR, LOAN_BH_EN,
  DEPOSIT_BH_AR, DEPOSIT_BH_EN,
  SETTLEMENT_BH_AR, SETTLEMENT_BH_EN,
  INSURANCE_BH_AR, INSURANCE_BH_EN,
  ...SERVICE_TEMPLATES,
];
