import { z } from "zod"

const base64ImageRegex = /^data:image\/(png|jpg|jpeg);base64,[A-Za-z0-9+/=]+$/

//const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; 

const getBase64Size = (base64: string) => {
    const base64Data = base64.split(",")[1];
    const padding = (base64Data.match(/=+$/) || [""])[0].length;
    return (base64Data.length * 3) / 4 - padding;
};

const pictureSchema = z.object({
    base64_image: z
    .string()
    .regex(base64ImageRegex, "Only .jpg, .jpeg, and .png images are allowed")
    .refine(
        (value) => getBase64Size(value) <= MAX_IMAGE_SIZE,
        "Each image must be smaller than 2MB"
    ),

    isProfilePicture: z.union([
    z.literal(0),
    z.literal(1),
    ]),
})

export const validGenderValues = [
    "male", 
    "female", 
    "other"
] as const

export const validSexualPreferenceValues = [
  "male",
  "female",
  "bi-sexual",
] as const

export const validInterestValues = [
  "#music",
  "#movie",
  "#gym",
  "#swim",
  "#jog",
  "#cycle",
  "#animal",
  "#vegan",
  "#dinner",
  "#travel",
  "#dance",
] as const

export const updateProfileSchema = z.object({
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
    biography: z
        .string()
        .trim()
        .min(1, "Biography must be at least 1 characters")
        .max(500, "Biography cannot exceed 500 characters"),
    gender: z
        .enum(validGenderValues, {message: "Invalid gender selection",}),
    sexual_preference: z
        .enum(validSexualPreferenceValues, {message: "Invalid sexual preference selection",}),
    interests: z
        .array(z.enum(validInterestValues, {message: "Invalid interest selected",}))
        .min(1, "Select at least one interest"),
    pictures: z
        .array(pictureSchema)
        .min(1, "At least one picture is required")
        .max(5, "You can upload up to 5 pictures")
        .refine((pictures) => pictures.filter((p) => p.isProfilePicture === 1).length === 1,
            {message: "Exactly one picture must be marked as profile picture",}),

})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export type ValidInterestValues = typeof validInterestValues[number];

export type ValidGenderValues = typeof validGenderValues[number];

export type ValidSexualPreferenceValues = typeof validSexualPreferenceValues[number];
