 // lib/validations/legalQuestion.ts
import { z } from "zod";

export const legalQuestionSchema = z.object({
  question_text: z.string().min(5),
  answer_text: z.string().min(5),
  jurisdiction: z.string().optional(),
  category: z.string().optional(),
});
