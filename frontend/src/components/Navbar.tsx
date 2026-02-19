import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import { formatMessageTime } from "@/utils/timeHelper";


// Interface matching the Backend "Event" model + "from_username"
interface AppEvent {
    id: number;
    event_type: "liked_me" | "viewed_me" | "connected" | "disconnected" | "new_message" | "unliked_me";
    from_user_id: number;
    from_username: string;
    created_at: string;
}

const Navbar = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<AppEvent[]>([]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const pollInterval = useRef<number | null>(null);

    const handleLogout = async () => {
        try {
            await api.post("/users/logout");
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Error failed to logout: ${message}`);
            alert(`Error failed to logout: ${message}`);
        } finally {
            localStorage.removeItem("token");
            navigate("/");
        }
    };

    // Poll for Notifications
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get("/event/get");

                if (res.data.success && res.data.events.length > 0) {
                    const newEvents = res.data.events;
                    //console.log("🔔 New Notification:", newEvents);
                    setNotifications(prev => [...newEvents, ...prev]);
                }

            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error(`Error fetching events: ${message}`);
            }
        };

        pollInterval.current = window.setInterval(fetchEvents, 3000);

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };

    }, []);

    // Helper to format messages
    const getNotificationText = (evt: AppEvent) => {
        switch(evt.event_type) {
            case "liked_me": return `❤️ ${evt.from_username} liked you!`;
            case "viewed_me": return `👀 ${evt.from_username} viewed your profile.`;
            case "connected": return `💞 You matched with ${evt.from_username}!`;
            case "disconnected": return `💔 Connection lost with ${evt.from_username}.`;
            case "new_message": return `💌 Message from ${evt.from_username}`;
            default: return `New interaction from ${evt.from_username}`;
        }
    };

    const handleNotificationClick = (evt: AppEvent) => {
        if (evt.event_type === "new_message") {
            navigate("/chat");
        } else {
            navigate(`/profile/${evt.from_user_id}`);
        }
    };

    const unreadCount = notifications.length;


    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

            {/* Logo */}
            <Link to="/home" className="text-lg font-semibold">
                🍵 Matcha
            </Link>

            {/* Desktop Nav */}
            <nav className="ml-8 hidden items-center gap-6 md:flex">
                <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground">
                Search Profiles
                </Link>
                <Link to="/search/suggested" className="text-sm text-muted-foreground hover:text-foreground">
                Suggested Profiles
                </Link>
                <Link to="/chat" className="text-sm text-muted-foreground hover:text-foreground">
                Chat
                </Link>
                <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground">
                Activity
                </Link>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground">
                My Profile
                </Link>
            </nav>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-2">

                {/* Notifications */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                    🔔
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {unreadCount}
                        </span>
                    )}
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64">
                    <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <button
                        onClick={(e) => {
                        e.stopPropagation()
                        setNotifications([])
                        }}
                        className="text-xs text-destructive"
                    >
                        Clear
                    </button>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        No new alerts
                    </div>
                    ) : (
                    notifications.map((notif) => (
                        <DropdownMenuItem
                        key={notif.id}
                        className="flex cursor-pointer flex-col items-start gap-1"
                        onClick={() => handleNotificationClick(notif)}
                        >
                        <span className="text-sm">
                            {getNotificationText(notif)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formatMessageTime(notif.created_at)}
                        </span>
                        </DropdownMenuItem>
                    ))
                    )}
                </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout (desktop) */}
                <Button
                onClick={handleLogout}
                variant="secondary"
                className="hidden md:inline-flex cursor-pointer"
                >
                Logout
                </Button>

                {/* Mobile menu */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="ghost" className="md:hidden">
                    ☰
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="flex flex-col gap-4 pt-10">
                    <Link to="/search/" onClick={() => setMobileOpen(false)}>Search Profiles</Link>
                    <Link to="/search/suggested" onClick={() => setMobileOpen(false)}>Suggested Profiles</Link>
                    <Link to="/chat" onClick={() => setMobileOpen(false)}>Chat</Link>
                    <Link to="/history" onClick={() => setMobileOpen(false)}>Activity</Link>
                    <Link to="/profile" onClick={() => setMobileOpen(false)}>My Profile</Link>

                    <Button onClick={handleLogout} variant="destructive" className="cursor-pointer">
                    Logout
                    </Button>
                </SheetContent>
                </Sheet>
            </div>
            </div>
        </header>
        )
};


export default Navbar;
