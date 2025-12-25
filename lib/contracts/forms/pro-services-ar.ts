import { ContractFormSchema } from "../engine/form-types";

export const PRO_SERVICES_AR_FORM: ContractFormSchema = {
  slug: "pro-services-ar",
  fields: [
    { key: "partyAName", label: "الطرف الأول", required: true },
    { key: "partyBName", label: "الطرف الثاني", required: true },
    { key: "servicesScope", label: "نطاق الخدمات", required: true },
    { key: "fees", label: "الأتعاب", required: true },
  ],
};

