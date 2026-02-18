import { useEffect, useState, useRef } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import {
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatMessageTime } from "@/utils/timeHelper";


interface ChatUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    picture: string | null;
}

interface Message {
    id: number;
    from_user_id: number;
    to_user_id: number;
    message: string;
    created_at: string;
    message_status?: "new" | "read" | "delivered";
}

export default function Chat() {
    const [matches, setMatches] = useState<ChatUser[]>([]);
    const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [myUserId, setMyUserId] = useState<number | null>(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [error, setError] = useState("");

    const pollInterval = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                let response = await api.get("/profile/me");
                setMyUserId(response.data.success ? response.data.profile.id : null);

                response = await api.get("/profile/matches");
                setMatches(response.data.success ? response.data.matches : []);

            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error(`Error failed to load chat init data: ${message}`);
                setError(`Error failed to load chat init data: ${message}`);
                
            }
        };
        fetchInitialData();
    }, []);

    //Load History & Start Polling
    useEffect(() => {
        if (!activeUser)
            return;

        const loadHistory = async () => {
            try {
                const response = await api.get(`/chat/history/${activeUser.id}`);
                setMessages(response.data.success ? response.data.messages : []);
                setTimeout(scrollToBottom, 100);

            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error(`Error failed to load history: ${message}`);
                alert(`Error failed to load history: ${message}`);
            }
        };

        loadHistory();
        startPolling();
        
        return () => stopPolling();
    }, [activeUser]);

    //Polling Logic
    const startPolling = () => {
        if (pollInterval.current)
            clearInterval(pollInterval.current);

        pollInterval.current = window.setInterval(async () => {
            if (!activeUser) 
                return;
            
            try {
                const response = await api.get(`/chat/history/${activeUser.id}`);
                setMessages(response.data.success ? response.data.messages : []);

            } catch (err: any) {
                const message = err?.response?.data?.error || "Unknown error";
                console.error(`Error failed to get chat message: ${message}`);
                alert(`Error failed to get chat message: ${message}`);
            }
        }, 3000);
    };

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
        }
    };

    // Send Message
    const handleSend = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUser || !myUserId)
            return;

        const tempMessage: Message = {
            id: Date.now(),
            from_user_id: myUserId,
            to_user_id: activeUser.id,
            message: newMessage.trim(),
            created_at: new Date().toISOString(),
            message_status: "new"
        };

        setMessages((prev) => [...prev, tempMessage]);
        setNewMessage("");

        try {
            const payload = {
                to_user_id: activeUser.id,
                message: tempMessage.message,
            }
            await api.post("/chat/send", payload);
        } catch (err: any) {
            const message = err?.response?.data?.error || "Unknown error";
            console.error(`Error failed to send chat message: ${message}`);
            alert(`Error failed to send chat message: ${message}`);
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (!scrollAreaRef.current)
            return;

        const viewport = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]"
        ) as HTMLDivElement | null;

        if (!viewport)
            return;

        const distanceFromBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;

        const NEAR_BOTTOM_PX = 240;

        if (distanceFromBottom < NEAR_BOTTOM_PX) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);

    if (error) {
        return <div className="mt-4 text-center text-red-500">Error: {error}</div>
    }

    return (
        
        <div className="mx-auto mt-4 flex h-full max-w-6xl rounded-xl border bg-background">

            {/* LEFT: MATCHES LIST */}
            {(!isMobile || !activeUser) && (
            <aside className="w-full md:w-1/3 border-r">
                <CardHeader className="border-b">
                <h3 className="text-lg font-semibold">Matches</h3>
                </CardHeader>

                <ScrollArea className="h-full">
                {matches.length === 0 && (
                    <p className="p-4 text-muted-foreground">No matches yet.</p>
                )}

                {matches.map(user => (
                    <button
                    key={user.id}
                    onClick={() => setActiveUser(user)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted transition ${
                        activeUser?.id === user.id ? "bg-muted" : ""
                    }`}
                    >
                    <Avatar>
                        <AvatarImage src={user.picture ?? undefined} />
                        <AvatarFallback>
                        {user.first_name[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="font-medium">{user.first_name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                    </div>
                    </button>
                ))}
                </ScrollArea>
            </aside>
            )}

            {/* RIGHT: CHAT PANEL */}
            {(!isMobile || activeUser) && (
            <section className="flex w-full md:w-2/3 h-full min-h-0 flex-col">

                {activeUser ? (
                <>
                    {/* HEADER */}
                    <div className="sticky top-0 z-10 grid w-full grid-cols-[1fr_auto] items-center border-b bg-background px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                        {isMobile && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveUser(null)}
                        >
                            ←
                        </Button>
                        )}
                        <Avatar>
                        <AvatarImage src={activeUser.picture ?? undefined} />
                        <AvatarFallback>
                            {activeUser.first_name[0]}
                        </AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-semibold">
                            {activeUser.first_name} {activeUser.last_name}
                        </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="shrink-0"
                        size="sm"
                        onClick={() => navigate(`/profile/${activeUser.id}`)}
                    >
                        View Profile
                    </Button>
                    </div>

                    {/* MESSAGES */}
                    <ScrollArea 
                    ref={scrollAreaRef}
                    className="flex-1 min-h-0 px-4 py-4"
                    >
                    <div className="flex flex-col gap-3">
                        {messages.map((msg, idx) => {
                        const isMe = msg.from_user_id === myUserId;

                        return (
                            <div
                            key={idx}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                isMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                            >
                                {msg.message}
                                <div
                                className={`mt-1 text-[10px] text-muted-foreground ${
                                    isMe ? "text-right" : ""
                                }`}
                                >
                                {formatMessageTime(msg.created_at)}
                                {isMe && (
                                    <span className="ml-1">
                                    {msg.message_status === "read"
                                        ? "✓✓"
                                        : "✓"}
                                    </span>
                                )}
                                </div>
                            </div>
                            </div>
                        );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                    </ScrollArea>

                    {/* INPUT */}
                    <form
                    onSubmit={handleSend}
                    className="flex gap-2 border-t px-4 py-3"
                    >
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <Button type="submit">Send</Button>
                    </form>
                </>
                ) : (
                <div className="flex flex-1 items-center justify-center text-muted-foreground">
                    Select a match to start chatting
                </div>
                )}
            </section>
            )}
        </div>
        );
}
