import { z } from "zod";

export const SearchParamsSchema = z
  .object({
    tags: z
      .string()
      .optional()
      .transform((val) => val?.split(",")),
    startDate: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    endDate: z
      .string()
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
    keyword: z
      .string()
      .optional()
      .transform((val) => val?.trim()),
  })
  .refine(
    (data) => {
      if (data.startDate || data.endDate) {
        return data.startDate && data.endDate;
      }
      return true;
    },
    { message: "Both startDate and endDate must be provided together" }
  );

export type ValidatedSearchParams = z.infer<typeof SearchParamsSchema>;
