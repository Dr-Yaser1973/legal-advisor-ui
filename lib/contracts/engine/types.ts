 export type Language = "ar" | "en";
export type ContractGroup = "PRO" | "INCOTERMS";

/** تعريف حقل إدخال */
export type ContractField = {
  key: string;
  label: string;
  required?: boolean;
};

/** القالب */
export type ContractTemplate = {
  id: number;
  slug: string;
  title: string;
  lang: Language;
  group: ContractGroup;

  /** HTML الخام */
  html: string;

  /**
   * الحقول:
   * - إما معرفة يدويًا (PRO)
   * - أو مستخرجة تلقائيًا من {{placeholders}} (Incoterms)
   */
  fields?: ContractField[];
};
