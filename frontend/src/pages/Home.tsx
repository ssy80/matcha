import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

// 1. Updated Interface to match Backend Object Structure
interface SuggestedUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    age: number;
    fame_rating: { stars: number; liked_count: number } | number; 
    distance_km?: number;
    distance?: number;
    tags: string[];
    profile_picture: string | null;
}

export default function Home() {
    const [users, setUsers] = useState<SuggestedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBroadSearch = async () => {
            try {
                console.log("🔍 Performing broad search...");
                
                // We use search_profiles to get a wider range of results
                const searchCriteria = {
                    min_dist_km: 0,
                    max_dist_km: 5, 
                    min_age: 18,
                    max_age: 99,
                    min_stars: 0,
                    max_stars: 5
                };

                const response = await api.post('/search/search_profiles', searchCriteria);
                console.log("✅ Search Response:", response.data);

                if (response.data.success && Array.isArray(response.data.profiles)) {
                    setUsers(response.data.profiles);
                } else {
                    console.warn("⚠️ Unexpected response format:", response.data);
                    setUsers([]);
                }
            } catch (err: any) {
                console.error("❌ Error fetching matches:", err);
                setError('Could not load matches. Is the backend running?');
            } finally {
                setLoading(false);
            }
        };

        fetchBroadSearch();
    }, []);

    const handleProfileClick = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    // Helper to extract stars safely
    const renderStars = (rating: SuggestedUser['fame_rating']) => {
        if (typeof rating === 'object' && rating !== null) {
            return rating.stars;
        }
        return rating || 0;
    };

    // Helper to get distance safely
    const getDistance = (user: SuggestedUser) => {
        return user.distance_km ?? user.distance ?? 0;
    };

    if (loading)
      return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Finding people nearby... 🌏</div>;
    
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Discover People</h1>
            
            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px' 
            }}>
                {Array.isArray(users) && users.length > 0 ? (
                    users.map((user, index) => (
                        <div 
                            key={user.id || index} 
                            onClick={() => handleProfileClick(user.id)}
                            style={{ 
                                border: '1px solid #444', 
                                borderRadius: '10px', 
                                overflow: 'hidden', 
                                cursor: 'pointer',
                                background: '#222',
                                transition: 'transform 0.2s',
                                color: '#fff'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ height: '250px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {user.profile_picture ? (
                                    <img 
                                        src={user.profile_picture} 
                                        alt={user.username} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <span style={{ color: '#888' }}>No Photo</span>
                                )}
                            </div>

                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 5px 0' }}>
                                    {user.first_name} {user.last_name}
                                </h3>
                                <p style={{ margin: 0, color: '#aaa', fontSize: '0.9em' }}>
                                    Age: {user.age || '?'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9em', color: '#aaa' }}>
                                    <span>📍 {Math.round(getDistance(user))} km</span>
                                    <span>⭐ {renderStars(user.fame_rating)}</span>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                    {(user.tags || []).slice(0, 3).map((tag, idx) => (
                                        <span key={idx} style={{ 
                                            background: '#4CAF50', 
                                            color: 'white', 
                                            padding: '2px 8px', 
                                            borderRadius: '10px', 
                                            fontSize: '0.8em' 
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !error && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px' }}>
                            <h3>No matches found yet.</h3>
                            <p style={{ color: '#888' }}>Try updating your profile or waiting for more users to join!</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}