import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import '../App.css';

// Interface matching the Backend "Event" model + "from_username"
interface AppEvent {
    id: number;
    event_type: 'liked_me' | 'viewed_me' | 'connected' | 'disconnected' | 'new_message' | 'unliked_me';
    from_user_id: number;
    from_username: string;
    created_at: string;
}

const Navbar = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<AppEvent[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Polling Ref
    const pollInterval = useRef<number | null>(null);

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
        } catch (err) {
            console.warn("Logout failed on server, clearing local session anyway.");
        } finally {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    // Poll for Notifications
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/event/get');
                if (res.data.success && res.data.events.length > 0) {
                    const newEvents = res.data.events;
                    console.log("🔔 New Notification:", newEvents);
                    setNotifications(prev => [...newEvents, ...prev]);
                }
            } catch (err) {
                console.error("Error fetching events:", err);
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
            case 'liked_me': return `❤️ ${evt.from_username} liked you!`;
            case 'viewed_me': return `👀 ${evt.from_username} viewed your profile.`;
            case 'connected': return `💞 You matched with ${evt.from_username}!`;
            case 'disconnected': return `💔 Connection lost with ${evt.from_username}.`;
            case 'new_message': return `💌 Message from ${evt.from_username}`;
            default: return `New interaction from ${evt.from_username}`;
        }
    };

    const handleNotificationClick = (evt: AppEvent) => {
        setShowDropdown(false);
        if (evt.event_type === 'new_message') {
            navigate('/chat');
        } else {
            navigate(`/profile/${evt.from_user_id}`);
        }
    };

    const unreadCount = notifications.length;

    return (
        <nav style={{ padding: '10px 20px', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                <Link to="/home" style={{ color: '#fff', textDecoration: 'none' }}>🍵 Matcha</Link>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/home" style={{ color: '#ccc', textDecoration: 'none' }}>Browsing</Link>
                <Link to="/chat" style={{ color: '#ccc', textDecoration: 'none' }}>Chat</Link>
                <Link to="/history" style={{ color: '#ccc', textDecoration: 'none' }}>Activity</Link>
                <Link to="/profile" style={{ color: '#ccc', textDecoration: 'none' }}>My Profile</Link>

                {/* 🔔 Notification Bell */}
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
                    <span style={{ fontSize: '1.2em' }}>🔔</span>
                    {unreadCount > 0 && (
                        <div style={{ 
                            position: 'absolute', top: '-5px', right: '-5px', 
                            background: 'red', color: 'white', borderRadius: '50%', 
                            width: '18px', height: '18px', fontSize: '12px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                            {unreadCount}
                        </div>
                    )}

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div style={{
                            position: 'absolute', top: '30px', right: '0', width: '250px',
                            background: '#222', border: '1px solid #444', borderRadius: '5px',
                            zIndex: 1000, boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                            maxHeight: '300px', overflowY: 'auto'
                        }}>
                            <div style={{ padding: '10px', borderBottom: '1px solid #444', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Notifications</span>
                                <span onClick={(e) => { e.stopPropagation(); setNotifications([]); }} style={{ fontSize: '0.8em', color: '#E91E63', cursor: 'pointer' }}>Clear</span>
                            </div>
                            
                            {notifications.length === 0 ? (
                                <div style={{ padding: '15px', color: '#777', textAlign: 'center' }}>No new alerts</div>
                            ) : (
                                notifications.map((notif, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => handleNotificationClick(notif)}
                                        style={{ 
                                            padding: '10px', borderBottom: '1px solid #333', fontSize: '0.9em',
                                            cursor: 'pointer', transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {getNotificationText(notif)}
                                        <div style={{ fontSize: '0.7em', color: '#666', marginTop: '3px' }}>
                                            {new Date(notif.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <button onClick={handleLogout} style={{ background: '#555', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;