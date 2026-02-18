import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface HistoryUser {
    id?: number;
    user_id?: number;
    username: string;
    first_name?: string;
    last_name?: string;
    picture?: string | null;
    created_at?: string;
    updated_at?: string;
}

export default function History() {
    const [activeTab, setActiveTab] = useState<"likes" | "views">("likes");
    const [data, setData] = useState<HistoryUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const endpoint = activeTab === "likes" ? "/profile/liked_me_list" : "/profile/viewed_me_list";
                const res = await api.get(endpoint);

                if (res.data.success) {
                    const list =
                        activeTab === "likes"
                        ? res.data.liked_me_list ?? []
                        : res.data.viewed_me_list ?? [];

                    setData(list);
                }

            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error(`Error failed to fetch history: ${message}`);
                setError(`Error failed to fetch history: ${message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    
    if (error) {
        return <div className="mt-4 text-center text-red-500">Error: {error}</div>
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
        <Card>
            <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
                Activity History
            </CardTitle>

            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "likes" | "views")}
                className="mt-4"
            >
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="likes">❤️ Who Liked Me</TabsTrigger>
                <TabsTrigger value="views">👀 Who Viewed Me</TabsTrigger>
                </TabsList>
            </Tabs>
            </CardHeader>

            <CardContent className="space-y-3">

            {!loading && data.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                {activeTab === "likes"
                    ? "No likes yet."
                    : "No profile views yet."}
                </div>
            )}

            {!loading &&
                data.map((user) => {
                const targetId = user.user_id || user.id;
                const dateStr = user.created_at || user.updated_at;

                return (
                    <button
                    key={targetId}
                    onClick={() =>
                        targetId && navigate(`/profile/${targetId}`)
                    }
                    className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition hover:bg-muted"
                    >
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.picture ?? undefined} />
                        <AvatarFallback>
                        {user.first_name?.[0] ?? user.username?.[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <p className="font-medium">
                        {user.first_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                        @{user.username}
                        </p>
                    </div>

                    {dateStr && (
                        <span className="text-xs text-muted-foreground">
                        {new Date(dateStr).toLocaleDateString()}
                        </span>
                    )}
                    </button>
                );
                })}
            </CardContent>
        </Card>
        </div>
    );
}
