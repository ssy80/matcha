import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { 
    FormControl, 
    FormItem, 
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { searchProfileSchema, type SearchProfileFormValues } from "@/validations/zodSearchProfileSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validInterestValues } from "@/validations/zodProfileUpdateSchema";
import { ClipLoader } from "react-spinners";
import { formToSearchParams, searchParamsToForm } from "../utils/homeHelper";
import { useSearchParams } from "react-router-dom";
import { type UserProfile } from "./ViewProfile";


interface SearchUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    age: number;
    fame_rating: { stars: number; liked_count: number };
    distance_km: number;
    tags: string[];
    profile_picture: string | null;
    num_shared_interest: number;
}

export type SortOption = "age" | "distance" | "fame" | "tags";
export type SortOrder = "asc" | "desc";

export default function Home() {

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [users, setUsers] = useState<SearchUser[]>([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const sortOption = (searchParams.get("sort") ?? undefined) as SortOption | undefined;
    const sortOrder  = (searchParams.get("order") ?? undefined) as SortOrder | undefined;

    const form = useForm({
        resolver: zodResolver(searchProfileSchema),
        defaultValues: {
            min_dist_km: 0,
            max_dist_km: 10000,
            min_age: 18,
            max_age: 120,
            min_stars: 0,
            max_stars: 5,
            interests: [],
        },
    })

    const { isSubmitting } = form.formState;

    useEffect(() => {

        const fetchLoginProfile = async () => {
            try{
                const res = await api.get('/profile/me');
                setProfile(res.data.success ? res.data.profile : null);
            }catch(err: any){
                const message = err?.response?.data?.error || "Unknown error";
                console.error("Error fetching login profile: ", message);
                setError(`Error fetching login profile: ${message}`);
            }
        }

        fetchLoginProfile();
    },[])

    const onSubmit = async (data: SearchProfileFormValues) => {

        const params = formToSearchParams(data);

        if (sortOption) params.set("sort", sortOption);
        if (sortOrder) params.set("order", sortOrder);

        navigate({ pathname: "/home", search: params.toString() });
    }

    useEffect(() => {
        if (!searchParams.toString()) 
            return;

        const criteria = searchParamsToForm(searchParams);

        form.reset(criteria);

        const fetchSearch = async () => {
            try {
                const res = await api.post("/search/search_profiles", criteria);
                setUsers(res.data.success ? res.data.profiles : []);
            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error("Error fetching matches: ", message);
                setError(`Error fetching matches: ${message}`);
            }
        };

        fetchSearch();
    }, [searchParams]);

    const handleProfileClick = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    const hasUserSorted = (sortOption !== undefined && sortOrder !== undefined);

    const getSortedUsers = () => {
        if (!hasUserSorted) 
            return users;

        const sorted = [...users];

        sorted.sort((a, b) => {
            let valA = 0;
            let valB = 0;

            switch (sortOption) {
            case "age":
                valA = a.age;
                valB = b.age;
                break
            case "distance":
                valA = a.distance_km;
                valB = b.distance_km;
                break
            case "fame":
                valA = a.fame_rating.stars;
                valB = b.fame_rating.stars;
                break
            case "tags":
                valA = a.num_shared_interest;
                valB = b.num_shared_interest;
                break
            }

            return sortOrder === "asc" ? valA - valB : valB - valA;
        })

        return sorted;
    }

    if (error) {
        return <div className="mt-4 text-red-500">Error: {error}</div>;
    }

    if (profile?.gender === null){
        return (
            <>
            <div className="mt-4 text-red-500">Please complete your Profile by clicking My Profile and Edit Profile.</div>
            </>
        );
    }
    
    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-6 text-center text-3xl font-bold">
            Browse Profile
        </h1>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="mb-6">
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">

                {/* Age range */}
                <div className="space-y-1">
                <Label>Age</Label>

                <div className="flex gap-2">
                    {/* Min age */}
                    <FormField
                    control={form.control}
                    name="min_age"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormControl>
                            <Input
                            type="number"
                            placeholder="Min"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Max age */}
                    <FormField
                    control={form.control}
                    name="max_age"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormControl>
                            <Input
                            type="number"
                            placeholder="Max"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                </div>

                {/* Distance */}
                <FormField
                control={form.control}
                name="max_dist_km"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl>
                        <Input
                        type="number"
                        placeholder="Max distance"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Fame rating */}
                <FormField
                control={form.control}
                name="min_stars"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fame Rating ⭐</FormLabel>
                    <FormControl>
                        <div className="flex gap-2">
                        <Input
                            type="number"
                            min={0}
                            max={5}
                            placeholder="Min"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FormField
                            control={form.control}
                            name="max_stars"
                            render={({ field }) => (
                            <Input
                                type="number"
                                min={0}
                                max={5}
                                placeholder="Max"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                            )}
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Interests (multi-select) */}
                <FormField
                control={form.control}
                name="interests"
                render={({ field }) => {
                    const anchor = useComboboxAnchor()

                    return (
                    <FormItem className="sm:col-span-2 lg:col-span-4">
                        <FormLabel>Interests</FormLabel>
                        <FormControl>
                        <Combobox
                            multiple
                            items={validInterestValues}
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <ComboboxChips ref={anchor} className="w-full">
                            <ComboboxValue>
                                {(values) => (
                                <>
                                    {values.map((value: string) => (
                                    <ComboboxChip key={value}>
                                        {value}
                                    </ComboboxChip>
                                    ))}
                                    <ComboboxChipsInput placeholder="Select interests…" />
                                </>
                                )}
                            </ComboboxValue>
                            </ComboboxChips>

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

            </CardContent>

            <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <ClipLoader size={16} color="black" className="mr-2" />}
                    Search
                </Button>
            </CardFooter>
           
            </Card>

        </form>
        </Form>

        {/* FILTERS */}
        <Card className="mb-6 justify-center items-center">

            <CardContent className="flex flex-row items-center gap-4">
                {/* Filter By */}
                <Label htmlFor="filter">Filter</Label>
                <Select
                value={sortOption}
                onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("sort", value);
                    setSearchParams(params, { replace: true });
                }}
            >
                    <SelectTrigger className="w-full max-w-48 text-white data-[placeholder-shown]:text-muted-foreground">
                    <SelectValue placeholder="By" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="distance">📍 Distance</SelectItem>
                    <SelectItem value="age">🎂 Age</SelectItem>
                    <SelectItem value="fame">⭐ Fame</SelectItem>
                    <SelectItem value="tags">🏷️ Shared Interests</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort by Order */}
                <Label htmlFor="sort">Sort</Label>

                <Select
                    value={sortOrder}
                    onValueChange={(value) => {
                        const params = new URLSearchParams(searchParams);
                        params.set("order", value);
                        setSearchParams(params, { replace: true });
                    }}
                > 
                    <SelectTrigger className="text-white data-[placeholder-shown]:text-muted-foreground">
                    <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="desc">⬇ High → Low</SelectItem>
                    <SelectItem value="asc">⬆ Low → High</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>


        {/* USER GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {getSortedUsers().map((user) => (
            <Card
                key={user.id}
                className="cursor-pointer transition hover:shadow-lg"
                onClick={() => handleProfileClick(user.id)}
            >
                <div className="relative h-56 w-full overflow-hidden">
                {user.profile_picture ? (
                    <img
                    src={user.profile_picture}
                    alt={user.username}
                    className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                    No photo
                    </div>
                )}
                </div>

                <CardContent className="space-y-2 p-4">
                <h3 className="font-semibold">
                    {user.first_name} {user.last_name}
                </h3>

                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>🎂 {user.age ?? "?"}</span>
                    <span>📍 {user.distance_km.toFixed(2)} km</span>

                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>⭐ {user.fame_rating.stars}</span>
                   {user.num_shared_interest !== undefined && (
                    <span className="text-green-500">
                        {user.num_shared_interest} shared interest
                    </span>
                    )}
                </div>

                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    )
}
