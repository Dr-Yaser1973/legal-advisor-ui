// lib/contracts/jo/index.ts
// العقود الأردنية (مصاغة وفق القوانين الأردنية).
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_JO_AR, SALE_JO_EN } from "./sale";
import { LEASE_JO_AR, LEASE_JO_EN } from "./lease";
import { EMPLOYMENT_JO_AR, EMPLOYMENT_JO_EN } from "./employment";
import { CONSTRUCTION_JO_AR, CONSTRUCTION_JO_EN } from "./construction";
import { PARTNERSHIP_JO_AR, PARTNERSHIP_JO_EN } from "./partnership";
import { AGENCY_JO_AR, AGENCY_JO_EN } from "./agency";
import { PLEDGE_JO_AR, PLEDGE_JO_EN } from "./pledge";
import { GUARANTEE_JO_AR, GUARANTEE_JO_EN } from "./guarantee";
import { LOAN_JO_AR, LOAN_JO_EN } from "./loan";
import { DEPOSIT_JO_AR, DEPOSIT_JO_EN } from "./deposit";
import { SETTLEMENT_JO_AR, SETTLEMENT_JO_EN } from "./settlement";
import { INSURANCE_JO_AR, INSURANCE_JO_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const JO_TEMPLATES: ContractTemplate[] = [
  SALE_JO_AR, SALE_JO_EN,
  LEASE_JO_AR, LEASE_JO_EN,
  EMPLOYMENT_JO_AR, EMPLOYMENT_JO_EN,
  CONSTRUCTION_JO_AR, CONSTRUCTION_JO_EN,
  PARTNERSHIP_JO_AR, PARTNERSHIP_JO_EN,
  AGENCY_JO_AR, AGENCY_JO_EN,
  PLEDGE_JO_AR, PLEDGE_JO_EN,
  GUARANTEE_JO_AR, GUARANTEE_JO_EN,
  LOAN_JO_AR, LOAN_JO_EN,
  DEPOSIT_JO_AR, DEPOSIT_JO_EN,
  SETTLEMENT_JO_AR, SETTLEMENT_JO_EN,
  INSURANCE_JO_AR, INSURANCE_JO_EN,
  ...SERVICE_TEMPLATES,
];
