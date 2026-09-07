// lib/contracts/sa/index.ts
// العقود السعودية (مصاغة وفق الأنظمة السعودية: نظام المعاملات المدنية م/191 لسنة 1444هـ ونظام العمل
// وتعديلاته 2025م ونظام الشركات وغيرها). النسخ الإنجليزية مكتوبة بلغة أصيلة لا ترجمة حرفية.
import { ContractTemplate } from "../engine/types";

// العقود المدنية/التجارية المسماة
import { SALE_SA_AR, SALE_SA_EN } from "./sale";
import { LEASE_SA_AR, LEASE_SA_EN } from "./lease";
import { EMPLOYMENT_SA_AR, EMPLOYMENT_SA_EN } from "./employment";
import { CONSTRUCTION_SA_AR, CONSTRUCTION_SA_EN } from "./construction";
import { PARTNERSHIP_SA_AR, PARTNERSHIP_SA_EN } from "./partnership";
import { AGENCY_SA_AR, AGENCY_SA_EN } from "./agency";
import { PLEDGE_SA_AR, PLEDGE_SA_EN } from "./pledge";
import { GUARANTEE_SA_AR, GUARANTEE_SA_EN } from "./guarantee";
import { LOAN_SA_AR, LOAN_SA_EN } from "./loan";
import { DEPOSIT_SA_AR, DEPOSIT_SA_EN } from "./deposit";
import { SETTLEMENT_SA_AR, SETTLEMENT_SA_EN } from "./settlement";
import { INSURANCE_SA_AR, INSURANCE_SA_EN } from "./insurance";

// عقود الخدمات
import { SERVICE_TEMPLATES } from "./services";

export const SA_TEMPLATES: ContractTemplate[] = [
  SALE_SA_AR, SALE_SA_EN,
  LEASE_SA_AR, LEASE_SA_EN,
  EMPLOYMENT_SA_AR, EMPLOYMENT_SA_EN,
  CONSTRUCTION_SA_AR, CONSTRUCTION_SA_EN,
  PARTNERSHIP_SA_AR, PARTNERSHIP_SA_EN,
  AGENCY_SA_AR, AGENCY_SA_EN,
  PLEDGE_SA_AR, PLEDGE_SA_EN,
  GUARANTEE_SA_AR, GUARANTEE_SA_EN,
  LOAN_SA_AR, LOAN_SA_EN,
  DEPOSIT_SA_AR, DEPOSIT_SA_EN,
  SETTLEMENT_SA_AR, SETTLEMENT_SA_EN,
  INSURANCE_SA_AR, INSURANCE_SA_EN,
  ...SERVICE_TEMPLATES,
];
