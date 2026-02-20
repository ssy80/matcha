import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export interface UserProfile {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    biography: string;
    interests: string[];
    sexual_preference: string;
    pictures: { picture: string; is_profile_picture: number }[];
    fame_rating?: { stars: number; liked_count: number };
    is_i_liked?: boolean;
    is_liked_me?: boolean;
    is_blocked?: boolean;
    location: {latitude?: number, longitude?: number, neighborhood?: string, city?: string, country?: string};
    latitude?: number;
    longitude?: number;
    age?: number;
    last_seen?: string;
}


const ViewProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isLikedMe, setIsLikedMe] = useState(false)
    const [isILiked, setIsILiked] = useState(false)
    const [isFaked, setIsFaked] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    
    const navigate = useNavigate();

    const { id } = useParams<{ id?: string }>();
    const isOwnProfile = !id;

    useEffect(() => {
        
        const fetchProfileData = async () => {
            
            setLoading(true);
            
            try {
                
                if (isOwnProfile) {

                    const res = await api.get("/profile/me");
                    setProfile(res.data.success ? res.data.profile : null);

                } else {

                    const res = await api.get(`/profile/${id}`);
                    const profileData = res.data.success ? res.data.profile : null
                    setProfile(profileData);
                    setIsILiked(profileData.is_i_liked || false);
                    setIsBlocked(profileData.is_blocked || false)
                    setIsFaked(profileData.is_faked || false);
                    setIsLikedMe(profileData.is_liked_me || false);
                }

            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error(`Error loading profile: ${message}`);
                setError(`Error loading profile: ${message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);


    const profilePic = profile?.pictures?.find(p => p.is_profile_picture === 1)?.picture;

    const handleLike = async () => {
        if (!profile)
            return;

        if (isBlocked && !isILiked){
            return;
        }

        try {
            const newStatus = !isILiked;
            const payload = {
                liked_user_id: Number(profile.id),
                is_liked: Boolean(newStatus)
            };

            const response = await api.post("/profile/liked_profile", payload);
            response.data.success && setIsILiked(newStatus);

        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Failed to update like profile: ${message}`);
            alert(`Failed to update like profile: ${message}`);
        }
    };

    const handleBlock = async () => {
        if (!profile)
            return;

        try {
            const newStatus = !isBlocked;
            const payload = {
                blocked_user_id: Number(profile.id),
                is_blocked: Boolean(newStatus)
            };

            const response = await api.post("/profile/blocked_user", payload);
            if (response.data.success) {
                setIsBlocked(newStatus);
                setIsILiked(false);
            }

        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Failed to block user: ${message}`);
            alert(`Failed to block user: ${message}`);
        }
    };

    const handleReport = async () => {
        if (!profile)
            return;

        try {
            const newStatus = !isFaked;
            const payload = {
                faked_user_id: Number(profile.id),
                is_faked: Boolean(newStatus)
            };

            const response = await api.post("/profile/faked_user", payload);
            response.data.success && setIsFaked(newStatus);

        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Failed to report faked user: ${message}`);
            alert(`Failed to report faked user: ${message}`);
        }
    };

    const getOnlineStatus = (profile: UserProfile) => {
        if (!profile.last_seen) 
            return null;

        // Timezone Fix
        let utcDateString = profile.last_seen;

        if (!profile.last_seen?.endsWith("Z"))
            utcDateString += "Z";
        const lastSeen = new Date(utcDateString);

        // Calculate difference
        const now = new Date();
        const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60);

        // Consider online if last seen within 5 minutes and is_online flag is true
        const isActuallyOnline = diffMinutes < 5;
        
        if (isActuallyOnline) {
            return (
                <>
                <span className="items-center gap-2 text-sm font-bold text-green-500">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    ● Online
                </span>
                </>
            );    
        } else {
            return (
                <>
                <span className="text-sm text-muted-foreground">
                    Last seen: {lastSeen.toLocaleString()}
                </span>
                </>
            );
        }
    };


    if (loading)
        return <div className="mt-4 text-center">Loading Profile...</div>
    if (error)
        return <div className="mt-4 text-center text-red-500">Error: {error}</div>;
    if (!profile)
        return <div className="mt-4 text-center">No profile found.</div>;

    return (
        <div className="mx-auto max-w-3xl px-4 py-6 ">
            <Card>
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>
                        {isOwnProfile ? "My Profile" : profile.username} 
                    </CardTitle>
                </div>

                {/* Action buttons */}
                {isOwnProfile ? (
                <div className="start-end space-x-2 space-y-2">
                    <Button onClick={() => navigate("/profile/edit")}>
                    Edit Profile
                    </Button>
                    <Button onClick={() => navigate("/location/edit")}>
                    Edit Location
                    </Button>
                </div>
                ) : (
                <div className="flex flex-wrap gap-2">
                    <Button
                    variant={isILiked ? "destructive" : "secondary"}
                    onClick={handleLike}
                    >
                    {isILiked ? "Unlike 💔" : "Like ❤️"}
                    </Button>

                    <Button
                    variant={isBlocked ? "destructive" : "secondary"}
                    onClick={handleBlock}
                    >
                    {isBlocked ? "Unblock 🔓" : "Block 🚫"}
                    </Button>

                    <Button
                    variant={isFaked ? "outline" : "secondary"}
                    onClick={handleReport}
                    >
                    {isFaked ? "Reported ⚠️" : "Report Fake 🚩"}
                    </Button>
                </div>
                )}
            </CardHeader>

            <Separator />

            {/* Profile main */}
            <CardContent className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center">

            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
                <Avatar className="h-40 w-40 border md:h-48 md:w-48">
                <AvatarImage src={profilePic} />
                <AvatarFallback>No Photo</AvatarFallback>
                </Avatar>
            </div>

            {/* Info */}
            <div className="w-full max-w-md space-y-2 text-center md:text-left">
                <h2 className="text-xl font-semibold">
                {profile.first_name} {profile.last_name}
                </h2>

                {profile.fame_rating && (
                <Badge variant="secondary">
                    Fame ⭐ {profile.fame_rating.stars}
                </Badge>
                )}

                {isOwnProfile && (
                <p className="text-sm text-muted-foreground">
                    {profile.email}
                </p>
                )}

                <p>{getOnlineStatus(profile)}</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p><span className="text-muted-foreground">Age:</span> {profile.age ?? "N/A"}</p>
                <p><span className="text-muted-foreground">Gender:</span> {profile.gender}</p>
                <p><span className="text-muted-foreground">Preference:</span> {profile.sexual_preference}</p>
                <p><span className="text-muted-foreground">Location:</span> {profile.location.neighborhood}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {isLikedMe && (
                    <Badge variant="secondary">❤️ Liked me</Badge>
                )}
                {isLikedMe && isILiked && (
                    <Badge variant="secondary">🔗 Connected</Badge>
                )}
                </div>
            </div>
            </CardContent>

            {/* Biography */}
            <CardContent className="space-y-2">
                <h3 className="text-lg font-semibold">Biography</h3>
                <p className="rounded-md bg-muted p-4 text-sm">
                {profile.biography || "No biography written yet."}
                </p>
            </CardContent>

            <Separator />

            {/* Interests */}
            <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold">Interests</h3>
                <div className="flex flex-wrap gap-2">
                {profile.interests?.length ? (
                    profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="!bg-[#00ff00] !text-black">
                        {interest}
                    </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                    No interests selected.
                    </p>
                )}
                </div>
            </CardContent>



            <Separator />

            {/* Gallery */}
            <CardContent className="space-y-3">
            <h3 className="text-lg font-semibold">Photo Gallery</h3>

            {profile.pictures?.length ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {profile.pictures.map((pic, index) => (
                    <Dialog key={index}>
                    <DialogTrigger asChild>
                        <img
                        src={pic.picture}
                        alt={`Gallery ${index}`}
                        className="h-24 w-full cursor-pointer rounded-md object-cover transition hover:opacity-80"
                        />
                    </DialogTrigger>

                    <DialogContent className="max-w-3xl border-none bg-transparent p-0">

                        <VisuallyHidden>
                        <DialogTitle>Profile photo</DialogTitle>
                        <DialogDescription>
                            Enlarged profile photo. Click outside the image to close.
                        </DialogDescription>
                        </VisuallyHidden>
                        
                        <img
                        src={pic.picture}
                        alt={`Gallery ${index}`}
                        className="w-full max-h-[80vh] rounded-lg object-contain"
                        />
                    </DialogContent>
                    </Dialog>
                ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                No photos uploaded.
                </p>
            )}
            </CardContent>
            </Card>
        </div>
        )
};

export default ViewProfile;
