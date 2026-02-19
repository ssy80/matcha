import { z } from "zod"

export const manualLocationUpdateSchema = z.object({
    neighborhood: z
        .string()
        .trim()
        .min(3, "Neighborhood must be at least 3 characters")
        .max(50, "Neighborhood cannot exceed 50 characters"),

    latitude: z
        .number()
        .min(-90, "Latitude must be >= -90")
        .max(90, "Latitude must be <= 90"),

    longitude: z
        .number()
        .min(-180, "Longitude must be >= -180")
        .max(180, "Longitude must be <= 180"),

})

export type ManualLocationUpdateFormValues = z.infer<typeof manualLocationUpdateSchema>
