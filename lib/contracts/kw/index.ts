// lib/contracts/kw/index.ts
// العقود الكويتية (مصاغة وفق القوانين الكويتية).
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_KW_AR, SALE_KW_EN } from "./sale";
import { LEASE_KW_AR, LEASE_KW_EN } from "./lease";
import { EMPLOYMENT_KW_AR, EMPLOYMENT_KW_EN } from "./employment";
import { CONSTRUCTION_KW_AR, CONSTRUCTION_KW_EN } from "./construction";
import { PARTNERSHIP_KW_AR, PARTNERSHIP_KW_EN } from "./partnership";
import { AGENCY_KW_AR, AGENCY_KW_EN } from "./agency";
import { PLEDGE_KW_AR, PLEDGE_KW_EN } from "./pledge";
import { GUARANTEE_KW_AR, GUARANTEE_KW_EN } from "./guarantee";
import { LOAN_KW_AR, LOAN_KW_EN } from "./loan";
import { DEPOSIT_KW_AR, DEPOSIT_KW_EN } from "./deposit";
import { SETTLEMENT_KW_AR, SETTLEMENT_KW_EN } from "./settlement";
import { INSURANCE_KW_AR, INSURANCE_KW_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const KW_TEMPLATES: ContractTemplate[] = [
  SALE_KW_AR, SALE_KW_EN,
  LEASE_KW_AR, LEASE_KW_EN,
  EMPLOYMENT_KW_AR, EMPLOYMENT_KW_EN,
  CONSTRUCTION_KW_AR, CONSTRUCTION_KW_EN,
  PARTNERSHIP_KW_AR, PARTNERSHIP_KW_EN,
  AGENCY_KW_AR, AGENCY_KW_EN,
  PLEDGE_KW_AR, PLEDGE_KW_EN,
  GUARANTEE_KW_AR, GUARANTEE_KW_EN,
  LOAN_KW_AR, LOAN_KW_EN,
  DEPOSIT_KW_AR, DEPOSIT_KW_EN,
  SETTLEMENT_KW_AR, SETTLEMENT_KW_EN,
  INSURANCE_KW_AR, INSURANCE_KW_EN,
  ...SERVICE_TEMPLATES,
];
