import { z } from "zod"

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username cannot exceed 50 characters"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password cannot exceed 12 characters"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
