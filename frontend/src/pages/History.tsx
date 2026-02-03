import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
    const [activeTab, setActiveTab] = useState<'likes' | 'views'>('likes');
    const [data, setData] = useState<HistoryUser[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const endpoint = activeTab === 'likes' ? '/profile/liked_me' : '/profile/viewed_me';
                const res = await api.get(endpoint);

                if (res.data.success) {
                    const list = res.data.liked_me_list || res.data.viewed_me_list || [];
                    setData(list);
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', background: '#222', color: '#fff', borderRadius: '8px', border: '1px solid #444' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Activity History</h2>

            <div style={{ display: 'flex', borderBottom: '1px solid #444', marginBottom: '20px' }}>
                <button 
                    onClick={() => setActiveTab('likes')}
                    style={{ flex: 1, padding: '15px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', borderBottom: activeTab === 'likes' ? '3px solid #E91E63' : 'none', fontWeight: activeTab === 'likes' ? 'bold' : 'normal' }}
                >
                    ❤️ Who Liked Me
                </button>
                <button 
                    onClick={() => setActiveTab('views')}
                    style={{ flex: 1, padding: '15px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', borderBottom: activeTab === 'views' ? '3px solid #2196F3' : 'none', fontWeight: activeTab === 'views' ? 'bold' : 'normal' }}
                >
                    👀 Who Viewed Me
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#777' }}>
                            {activeTab === 'likes' ? "No likes yet." : "No profile views yet."}
                        </div>
                    )}

                    {data.map((user, index) => {
                        const targetId = user.user_id || user.id;
                        const dateStr = user.created_at || user.updated_at;

                        return (
                            <div 
                                key={targetId || index} 
                                onClick={() => targetId && navigate(`/profile/${targetId}`)}
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', 
                                    background: '#333', borderRadius: '8px', cursor: 'pointer', transition: '0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#444'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#333'}
                            >
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#555', overflow: 'hidden', flexShrink: 0 }}>
                                    {user.picture ? (
                                        <img src={user.picture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '0.8em' }}>N/A</span>
                                    )}
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    {/* Fallback to username if name is missing */}
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                        {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
                                    </div>
                                    <div style={{ color: '#aaa', fontSize: '0.9em' }}>@{user.username}</div>
                                </div>

                                {dateStr && (
                                    <div style={{ color: '#777', fontSize: '0.8em' }}>
                                        {new Date(dateStr).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}