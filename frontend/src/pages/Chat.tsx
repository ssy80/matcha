import { useEffect, useState, useRef} from "react";
import api from '../api/axios';
import { useNavigate } from "react-router-dom";

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
}

export default function Chat() {
    const [matches, setMatches] = useState<ChatUser[]>([]);
    const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [myUserId, setMyUserId] = useState<number | null>(null);

    // Reference for polling interval
    const pollInterval = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    // 1. Initial Load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userResponse = await api.get("/profile/me");
                if (userResponse.data.success) {
                    console.log("✅ Set My ID:", userResponse.data.profile.id);
                    setMyUserId(userResponse.data.profile.id);
                }
                else {
                    console.error("❌ Failed to fetch my profile:", userResponse.data.error);
                }

                const matchesResponse = await api.get("/profile/matches");
                if (matchesResponse.data.success) {
                    setMatches(matchesResponse.data.matches);
                }
            } catch (error) {
                console.error("Failed to load the chat initialization data", error);
            }
        };

        fetchInitialData();
    }, []);

    // 2. Load History when clicking a user
    useEffect(() => {
        if (!activeUser)
            return;

        const loadHistory = async () => {
            try {
                const historyResponse = await api.get(`/chat/history/${activeUser.id}`);
                if (historyResponse.data.success) {
                    setMessages(historyResponse.data.messages);
                    scrollToBottom();
                }
            } catch (error) {
                console.error("Failed to load message history", error);
            }
        };
        loadHistory();
        startPolling();
        
        return () => {
            stopPolling();
        };
    }, [activeUser]);

    // 3. Polling Logic
    const startPolling = () => {
        if (pollInterval.current)
            clearInterval(pollInterval.current);

        pollInterval.current = window.setInterval(async () => {
            if (!activeUser)
                return;
        try {
            const response = await api.get(`/chat/history/${activeUser.id}`);
            if (response.data.success) {
                setMessages(response.data.messages);
                scrollToBottom();
            }
        } catch (error) {
            console.error("Failed to poll message history", error);
        }
        }, 3000);
    };

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
        }
    };

    // 4. Send Message
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeUser || !myUserId)
            return;

        const tempMessage: Message = {
            id: Date.now(),
            from_user_id: myUserId,
            to_user_id: activeUser.id,
            message: newMessage.trim(),
            created_at: new Date().toISOString(),
        }

        setMessages((prevMessages) => [...prevMessages, tempMessage]);
        setNewMessage("");
        scrollToBottom();

        try{
            await api.post("/chat/send", {
                to_user_id: activeUser.id,
                message: tempMessage.message,
            });
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message");
        }
    }

    // 5. Scroll to Bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', maxWidth: '1000px', margin: '20px auto', border: '1px solid #444', borderRadius: '8px', overflow: 'hidden', background: '#222', color: '#fff' }}>
            
            {/* LEFT: Matches List */}
            <div style={{ width: '30%', borderRight: '1px solid #444', overflowY: 'auto', background: '#1a1a1a' }}>
                <h3 style={{ padding: '15px', margin: 0, borderBottom: '1px solid #444' }}>Matches</h3>
                {matches.length === 0 && <p style={{ padding: '15px', color: '#777' }}>No matches yet.</p>}
                
                {matches.map(user => (
                    <div 
                        key={user.id} 
                        onClick={() => setActiveUser(user)}
                        style={{ 
                            padding: '15px', 
                            cursor: 'pointer', 
                            background: activeUser?.id === user.id ? '#333' : 'transparent',
                            borderBottom: '1px solid #333',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#555', overflow: 'hidden' }}>
                            {user.picture ? <img src={user.picture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{user.first_name}</div>
                            <div style={{ fontSize: '0.8em', color: '#888' }}>@{user.username}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT: Chat Window */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
                {activeUser ? (
                    <>
                        {/* Header */}
                        <div style={{ padding: '15px', borderBottom: '1px solid #444', background: '#2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{activeUser.first_name} {activeUser.last_name}</h3>
                            <button onClick={() => navigate(`/profile/${activeUser.id}`)} style={{ background: 'transparent', border: '1px solid #666', color: '#ccc', borderRadius: '4px', cursor: 'pointer' }}>View Profile</button>
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {messages.map((msg, idx) => {
                                const isMe = msg.from_user_id === myUserId;
                                return (
                                    <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                        <div style={{ 
                                            background: isMe ? '#E91E63' : '#444', 
                                            padding: '10px 15px', 
                                            borderRadius: '15px', 
                                            borderBottomRightRadius: isMe ? '2px' : '15px',
                                            borderBottomLeftRadius: isMe ? '15px' : '2px',
                                        }}>
                                            {msg.message}
                                        </div>
                                        <div style={{ fontSize: '0.7em', color: '#666', marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>
                                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '15px', borderTop: '1px solid #444', display: 'flex', gap: '10px' }}>
                            <input 
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', outline: 'none', background: '#333', color: '#fff' }}
                            />
                            <button type="submit" style={{ background: '#E91E63', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                        Select a match to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}