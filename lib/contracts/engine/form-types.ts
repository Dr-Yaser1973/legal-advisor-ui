export type ContractField = {
  key: string;
  label: string;
  required?: boolean;
};

export type ContractFormSchema = {
  slug: string;
  fields: ContractField[];
};

