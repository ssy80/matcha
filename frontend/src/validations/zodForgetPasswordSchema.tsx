import { z } from "zod"

export const forgetPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .max(50, "Email cannot exceed 50 characters"),
})

export type ForgetPasswordFormValues = z.infer<typeof forgetPasswordSchema>;