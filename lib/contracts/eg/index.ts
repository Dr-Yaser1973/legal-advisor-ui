// lib/contracts/eg/index.ts
// العقود المصرية (مصاغة وفق القوانين المصرية).
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_EG_AR, SALE_EG_EN } from "./sale";
import { LEASE_EG_AR, LEASE_EG_EN } from "./lease";
import { EMPLOYMENT_EG_AR, EMPLOYMENT_EG_EN } from "./employment";
import { CONSTRUCTION_EG_AR, CONSTRUCTION_EG_EN } from "./construction";
import { PARTNERSHIP_EG_AR, PARTNERSHIP_EG_EN } from "./partnership";
import { AGENCY_EG_AR, AGENCY_EG_EN } from "./agency";
import { PLEDGE_EG_AR, PLEDGE_EG_EN } from "./pledge";
import { GUARANTEE_EG_AR, GUARANTEE_EG_EN } from "./guarantee";
import { LOAN_EG_AR, LOAN_EG_EN } from "./loan";
import { DEPOSIT_EG_AR, DEPOSIT_EG_EN } from "./deposit";
import { SETTLEMENT_EG_AR, SETTLEMENT_EG_EN } from "./settlement";
import { INSURANCE_EG_AR, INSURANCE_EG_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const EG_TEMPLATES: ContractTemplate[] = [
  SALE_EG_AR, SALE_EG_EN,
  LEASE_EG_AR, LEASE_EG_EN,
  EMPLOYMENT_EG_AR, EMPLOYMENT_EG_EN,
  CONSTRUCTION_EG_AR, CONSTRUCTION_EG_EN,
  PARTNERSHIP_EG_AR, PARTNERSHIP_EG_EN,
  AGENCY_EG_AR, AGENCY_EG_EN,
  PLEDGE_EG_AR, PLEDGE_EG_EN,
  GUARANTEE_EG_AR, GUARANTEE_EG_EN,
  LOAN_EG_AR, LOAN_EG_EN,
  DEPOSIT_EG_AR, DEPOSIT_EG_EN,
  SETTLEMENT_EG_AR, SETTLEMENT_EG_EN,
  INSURANCE_EG_AR, INSURANCE_EG_EN,
  ...SERVICE_TEMPLATES,
];
