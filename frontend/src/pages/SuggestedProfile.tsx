import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useSearchParams } from "react-router-dom";
import { type SortOption, type SortOrder } from "./Home";
import { type UserProfile } from "./ViewProfile";


interface SuggestedUser {
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

export default function Home() {

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [users, setUsers] = useState<SuggestedUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const sortOption = (searchParams.get("sort") ?? undefined) as SortOption | undefined;
    const sortOrder  = (searchParams.get("order") ?? undefined) as SortOrder | undefined;
    
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

    useEffect(() => {
        
        const getSuggestedUsers = async () => {
            setLoading(true);
            try{
                const res = await api.get('/search/suggested_profiles');
                setUsers(res.data.success ? res.data.profiles : []);
            }
            catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error("Error fetching suggested users: ", message);
                setError(`Error fetching suggested users: ${message}`);
            } finally {
                setLoading(false);
            }
        }
        
        getSuggestedUsers();
    }, []);

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

    if (loading && users.length === 0){
        return (
            <>
            <Spinner/><span>Loading Suggested Users...</span>
            </> 
        );
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
            Suggested People
        </h1>

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
