// lib/contracts/iq/index.ts
// العقود العراقية المعيارية المضافة لتوحيد مجموعة العراق مع بقية الاختصاصات.
// (عقود البيع/الإيجار/العمل/المقاولة/الشراكة/التوزيع/التوريد/عدم الإفشاء/الخدمات العامة
//  موجودة في lib/contracts/pro/ ومصنّفة كعراقية افتراضياً.)
import { ContractTemplate } from "../engine/types";

import { AGENCY_IQ_AR, AGENCY_IQ_EN } from "./agency";
import { PLEDGE_IQ_AR, PLEDGE_IQ_EN } from "./pledge";
import { GUARANTEE_IQ_AR, GUARANTEE_IQ_EN } from "./guarantee";
import { LOAN_IQ_AR, LOAN_IQ_EN } from "./loan";
import { DEPOSIT_IQ_AR, DEPOSIT_IQ_EN } from "./deposit";
import { SETTLEMENT_IQ_AR, SETTLEMENT_IQ_EN } from "./settlement";
import { INSURANCE_IQ_AR, INSURANCE_IQ_EN } from "./insurance";

import { SERVICE_TEMPLATES } from "./services";

export const IQ_TEMPLATES: ContractTemplate[] = [
  AGENCY_IQ_AR, AGENCY_IQ_EN,
  PLEDGE_IQ_AR, PLEDGE_IQ_EN,
  GUARANTEE_IQ_AR, GUARANTEE_IQ_EN,
  LOAN_IQ_AR, LOAN_IQ_EN,
  DEPOSIT_IQ_AR, DEPOSIT_IQ_EN,
  SETTLEMENT_IQ_AR, SETTLEMENT_IQ_EN,
  INSURANCE_IQ_AR, INSURANCE_IQ_EN,
  ...SERVICE_TEMPLATES,
];
