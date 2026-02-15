import { z } from "zod"
import { validInterestValues } from "./zodProfileUpdateSchema"


export const searchProfileSchema = z.object({
  min_dist_km: z
    .number()
    .min(0, "Minimum dist is 0")
    .max(50000, "Maximum dist is <= 50000"),

  max_dist_km: z
    .number()
    .min(0, "Minimum dist is 0")
    .max(50000, "Maximum dist is <= 50000"),

  min_age: z
    .number()
    .int()
    .min(18, "Minimum age is 18")
    .max(120, "Maximum age is 120"),

  max_age: z
    .number()
    .int()
    .min(18, "Minimum age is 18")
    .max(120, "Maximum age is 120"),

  interests: z
    .array(z.enum(validInterestValues))
    .default([]),

  min_stars: z
    .number()
    .min(0, "Minimum stars is 0")
    .max(5, "Maximum stars is 5"),

  max_stars: z
    .number()
    .min(0, "Minimum stars is 0")
    .max(5, "Maximum stars is 5"),
})
.refine(data => data.min_age <= data.max_age, {
  message: "Min age cannot exceed max age",
  path: ["min_age"],
})
.refine(data => data.min_dist_km <= data.max_dist_km, {
  message: "Min distance cannot exceed max distance",
  path: ["min_dist_km"],
})
.refine(data => data.min_stars <= data.max_stars, {
  message: "Min stars cannot exceed max stars",
  path: ["min_stars"],
})


export type SearchProfileFormValues = z.infer<typeof searchProfileSchema>;