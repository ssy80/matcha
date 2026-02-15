import { z } from "zod"


export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/

const isAtLeast18 = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()))
        age--;

    return age >= 18;
}

const isYearAtLeast1900 = (dateString: string) => {
    const year = new Date(dateString).getFullYear()
    return year >= 1900
}

export const registerSchema = z.object({
    first_name: z
        .string()
        .trim()
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name cannot exceed 50 characters"),
    last_name: z
        .string()
        .trim()
        .min(3, "Last name must be at least 3 characters")
        .max(50, "Last name cannot exceed 50 characters"),
    email: z
        .email("Invalid email address")
        .max(50, "Email cannot exceed 50 characters"),
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username cannot exceed 50 characters"),
    user_password: z
        .string()
        .trim()
        .regex(strongPasswordRegex, "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol")
        .min(6, "Password must be at least 6 characters")
        .max(12, "Password cannot exceed 12 characters"),
    date_of_birth: z
        .string()
        .min(1, "Date of birth is required")
        .refine(isYearAtLeast1900, {message: "Year of birth must be 1900 or later",})
        .refine(isAtLeast18, {message: "You must be at least 18 years old",}),
})

export type RegisterFormValues = z.infer<typeof registerSchema>;