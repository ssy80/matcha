import { z } from "zod";
import { strongPasswordRegex } from "./zodRegisterSchema";

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .trim()
        .regex(strongPasswordRegex, "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol")
        .min(6, "Password must be at least 6 characters")
        .max(12, "Password cannot exceed 12 characters"),
    confirmPassword: z
        .string()
        .trim()
        .regex(strongPasswordRegex, "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol")
        .min(6, "Confirm password must be at least 6 characters")
        .max(12, "Confirm password cannot exceed 12 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
