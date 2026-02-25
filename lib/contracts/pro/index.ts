import { ContractTemplate } from "../engine/types";
import { SALE_AR, SALE_EN } from "./sale";
import { SERVICES_AR, SERVICES_EN } from "./services";
import { NDA_AR, NDA_EN } from "./nda";
import { DISTRIBUTION_AR, DISTRIBUTION_EN } from "./distribution";
import { LEASE_AR, LEASE_EN } from "./lease";
import { CONSTRUCTION_AR,CONSTRUCTION_EN } from "./construction";
import {PARTNERSHIP_AR, PARTNERSHIP_EN } from "./partnership";

export const PRO_TEMPLATES: ContractTemplate[] = [
  SALE_AR,
  SALE_EN,
  SERVICES_AR,
  SERVICES_EN,
  NDA_AR,
  NDA_EN,
  DISTRIBUTION_AR,
  DISTRIBUTION_EN,
  LEASE_AR,
  LEASE_EN,
    CONSTRUCTION_AR,
  CONSTRUCTION_EN,
  PARTNERSHIP_AR,
  PARTNERSHIP_EN,
];

