// lib/contracts/qa/index.ts
// العقود القطرية (مصاغة وفق القوانين القطرية).
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_QA_AR, SALE_QA_EN } from "./sale";
import { LEASE_QA_AR, LEASE_QA_EN } from "./lease";
import { EMPLOYMENT_QA_AR, EMPLOYMENT_QA_EN } from "./employment";
import { CONSTRUCTION_QA_AR, CONSTRUCTION_QA_EN } from "./construction";
import { PARTNERSHIP_QA_AR, PARTNERSHIP_QA_EN } from "./partnership";
import { AGENCY_QA_AR, AGENCY_QA_EN } from "./agency";
import { PLEDGE_QA_AR, PLEDGE_QA_EN } from "./pledge";
import { GUARANTEE_QA_AR, GUARANTEE_QA_EN } from "./guarantee";
import { LOAN_QA_AR, LOAN_QA_EN } from "./loan";
import { DEPOSIT_QA_AR, DEPOSIT_QA_EN } from "./deposit";
import { SETTLEMENT_QA_AR, SETTLEMENT_QA_EN } from "./settlement";
import { INSURANCE_QA_AR, INSURANCE_QA_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const QA_TEMPLATES: ContractTemplate[] = [
  SALE_QA_AR, SALE_QA_EN,
  LEASE_QA_AR, LEASE_QA_EN,
  EMPLOYMENT_QA_AR, EMPLOYMENT_QA_EN,
  CONSTRUCTION_QA_AR, CONSTRUCTION_QA_EN,
  PARTNERSHIP_QA_AR, PARTNERSHIP_QA_EN,
  AGENCY_QA_AR, AGENCY_QA_EN,
  PLEDGE_QA_AR, PLEDGE_QA_EN,
  GUARANTEE_QA_AR, GUARANTEE_QA_EN,
  LOAN_QA_AR, LOAN_QA_EN,
  DEPOSIT_QA_AR, DEPOSIT_QA_EN,
  SETTLEMENT_QA_AR, SETTLEMENT_QA_EN,
  INSURANCE_QA_AR, INSURANCE_QA_EN,
  ...SERVICE_TEMPLATES,
];
