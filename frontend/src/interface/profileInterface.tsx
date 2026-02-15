import type { ValidInterestValues } from "@/validations/zodProfileUpdateSchema";
import type { ValidGenderValues } from "@/validations/zodProfileUpdateSchema";
import type { ValidSexualPreferenceValues } from "@/validations/zodProfileUpdateSchema";

//export type Gender = "male" | "female" | "other";
//export type SexualPreference = "male" | "female" | "bi-sexual";


export interface ProfileInterface {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: ValidGenderValues;
    biography: string;
    date_of_birth: string;
    age: number;
    interests: ValidInterestValues[];
    sexual_preference: ValidSexualPreferenceValues;
    pictures: { picture: string; is_profile_picture: number }[];
    last_seen: string;
    is_online: boolean;
}
