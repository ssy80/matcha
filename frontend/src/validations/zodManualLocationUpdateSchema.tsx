import { z } from "zod"

export const manualLocationUpdateSchema = z.object({
    neighborhood: z
        .string()
        .trim()
        .min(3, "Neighborhood must be at least 3 characters")
        .max(50, "Neighborhood cannot exceed 50 characters"),

    ip: z.string().optional(),

})

export type ManualLocationUpdateFormValues = z.infer<typeof manualLocationUpdateSchema>
