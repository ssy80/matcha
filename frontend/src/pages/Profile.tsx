import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClipLoader } from "react-spinners";
import { updateProfileSchema } from '@/validations/zodProfileUpdateSchema';
import type { UpdateProfileFormValues }  from '../validations/zodProfileUpdateSchema';
import { validInterestValues } from '@/validations/zodProfileUpdateSchema';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import type { ProfileInterface } from '../interface/profileInterface';
import { imageUrlToBase64, fileToBase64 } from '@/utils/imageHelper';
import { Textarea } from "@/components/ui/textarea";


type Picture = {
  base64_image: string;
  isProfilePicture: 0 | 1;
};

const Profile = () => {

    const [profile, setProfile] = useState<ProfileInterface | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            biography: "",
            gender: undefined,
            sexual_preference: undefined,
            interests: [],
            pictures: [],
        },
    });

    useEffect(() => {
        if (!profile) return;

        const loadProfile = async () => {
            try {
                const pictures = profile.pictures ? await convertPicturesForForm(profile.pictures) : [];

                form.reset({
                    first_name: profile.first_name ?? "",
                    last_name: profile.last_name ?? "",
                    email: profile.email ?? "",
                    biography: profile.biography ?? "",
                    gender: profile.gender ?? undefined,
                    sexual_preference: profile.sexual_preference ?? undefined,
                    interests: profile.interests ?? [],
                    pictures,
                })
            } catch (err) {
                console.error("Failed to load profile images", err);
            }
        }
        loadProfile();
    }, [profile, form])

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/profile/me');
                setProfile(res.data.profile);
            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error(`Error fetching profile: ${message}`);
                setError(`Error fetching profile: ${message}`);
            }
        }
        fetchProfile();
    }, []);

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: UpdateProfileFormValues) => {
        try {
            await api.patch("/profile/update", data);
            alert("Profile updated successfully.");
            navigate("/profile");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Profile update failed: ${message}`);
            alert(`Profile update failed: ${message}`);
        }
    }

    if (error)
        return <div className="mt-4 text-red-500">Error: {error}</div>;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 mt-4">

        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle>Profile update</CardTitle>
            <CardDescription>
                Fill in your details to update your profile
            </CardDescription>
            </CardHeader>

            <CardContent>
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                >

                {/* First Name */}
                <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Last Name */}
                <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Biography */}
                <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Biography</FormLabel>
                        <FormControl>
                        <Textarea
                        {...field}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                            <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Sexual_preference */}
                <FormField
                    control={form.control}
                    name="sexual_preference"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sexual Preference</FormLabel>
                        <FormControl>
                            <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Select sexual preference" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="bi-sexual">Bi-Sexual</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Interests */}
                <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => {
                        const anchor = useComboboxAnchor()

                        return (
                        <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl>
                            <Combobox
                                multiple
                                items={validInterestValues}
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                {/* Chips + input */}
                                <ComboboxChips ref={anchor} className="w-full">
                                <ComboboxValue>
                                    {(values) => (
                                    <>
                                        {values.map((value: string) => (
                                        <ComboboxChip key={value}>
                                            {value}
                                        </ComboboxChip>
                                        ))}
                                        <ComboboxChipsInput placeholder="Select interests..." />
                                    </>
                                    )}
                                </ComboboxValue>
                                </ComboboxChips>

                                {/* Dropdown */}
                                <ComboboxContent anchor={anchor}>
                                <ComboboxEmpty>No interests found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                    <ComboboxItem key={item} value={item}>
                                        {item}
                                    </ComboboxItem>
                                    )}
                                </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )
                    }}
                />

                <FormField
                    control={form.control}
                    name="pictures"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pictures</FormLabel>

                        {/* Image previews */}
                        <div className="grid grid-cols-3 gap-3">
                            {field.value.map((pic, index) => (
                            <div
                                key={index}
                                className={`relative rounded-md border p-1 ${
                                pic.isProfilePicture === 1 ? "border-primary" : "border-muted"}`}
                            >
                                <img
                                src={pic.base64_image}
                                alt="profile"
                                className="h-32 w-full rounded-md object-cover"
                                />

                                {/* Profile selector */}
                                <label className="mt-1 flex cursor-pointer items-center gap-1 text-xs">
                                <input
                                    type="radio"
                                    checked={pic.isProfilePicture === 1}
                                    onChange={() => {
                                        form.setValue(
                                            "pictures",
                                            field.value.map((p, i) => ({
                                            ...p,
                                            isProfilePicture: i === index ? 1 : 0,
                                            })),
                                            { shouldValidate: true }
                                        )
                                    }}
                                />
                                Profile picture
                                </label>

                                {/* Remove */}
                                <button
                                type="button"
                                onClick={() =>
                                    form.setValue(
                                    "pictures",
                                    field.value.filter((_, i) => i !== index),
                                    { shouldValidate: true }
                                    )
                                }
                                className="absolute right-1 top-1 rounded bg-black/60 px-1 text-xs text-white"
                                >
                                ✕
                                </button>
                            </div>
                            ))}
                        </div>

                        {/* Upload controls */}
                        <FormControl>
                            <div className="mt-3 flex items-center gap-3">
                            <input
                                id="image-upload"
                                type="file"
                                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                                multiple
                                hidden
                                onChange={async (e) => {
                                    const files = Array.from(e.target.files ?? []);
                                    if (!files.length) return;

                                    const remainingSlots = 5 - field.value.length;
                                    const filesToAdd = files.slice(0, remainingSlots);

                                    const newImages: Picture[] = await Promise.all(
                                        filesToAdd.map(async (file, index): Promise<Picture> => ({
                                            base64_image: await fileToBase64(file),
                                            isProfilePicture:
                                            field.value.length === 0 && index === 0 ? 1 : 0,
                                        }))
                                    )

                                    form.setValue(
                                        "pictures",
                                        [...field.value, ...newImages],
                                        {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                            shouldTouch: true,
                                        }
                                    );

                                    e.target.value = "";
                                }}
                            />

                            <Button
                                type="button"
                                variant="outline"
                                disabled={field.value.length >= 5}
                                onClick={() =>
                                document.getElementById("image-upload")?.click()
                                }
                            >
                                Browse images
                            </Button>

                            <span className="text-xs text-muted-foreground">
                                {field.value.length}/5 images
                            </span>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <ClipLoader size={16} color="black" className="mr-2" />}
                    Update Profile
                </Button>
                </form>
            </Form>

            </CardContent>
        </Card>
        </div>
    )
}


const convertPicturesForForm = async (
    
    pictures: {
        picture: string
        is_profile_picture: number
    }[]

): Promise<UpdateProfileFormValues["pictures"]> => {

    return await Promise.all(
        pictures.map(async (pic) => ({
            base64_image: await imageUrlToBase64(pic.picture),
            isProfilePicture: pic.is_profile_picture as 0 | 1,
        }))
    )
}

export default Profile;