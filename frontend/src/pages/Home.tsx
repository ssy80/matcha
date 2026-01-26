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
    
    // 🔍 Search Filter States
    const [ageRange, setAgeRange] =  useState({min: 18, max: 99});
    const [fameRange, setFameRange] =  useState({min: 0, max: 5});
    // Initialize min distance to 0 so close matches appear by default
    const [distance, setDistance] =  useState({min: 0, max: 20000});
    const [searchTags, setSearchTags] =  useState<string[]>([]);
    
    const navigate = useNavigate();
    
    const fetchBroadSearch = async () => {
        setLoading(true);
        setError('');
        try {
            console.log("🔍 Performing broad search...");
            
            // Clean tags to remove empty strings caused by trailing commas
            const cleanTags = searchTags.filter(tag => tag.trim().length > 0);

            const searchCriteria = {
                min_dist_km: distance.min,
                max_dist_km: distance.max, 
                min_age: ageRange.min,
                max_age: ageRange.max,
                min_stars: fameRange.min,
                max_stars: fameRange.max,
                interests: cleanTags.length > 0 ? cleanTags : undefined,
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
            if (err.response && err.response.data) {
                console.error("🔍 Server Error Details:", err.response.data);
            } else {
                console.error("❌ Error fetching matches:", err);
            }
            setError('Could not load matches.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
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

    if (loading && users.length === 0)
      return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Finding people nearby... 🌏</div>;
    
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Discover People</h1>
            
            {/* Show Red Error only if it's a real error */}
            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

            {/* Show "No Results" message if list is empty */}
            {!loading && !error && users.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
                    <h3>No matches found.</h3>
                    <p style={{ color: '#888' }}>Try adjusting your filters to see more people!</p>
                </div>
            )}

            {/* 🔽 FILTER SECTION 🔽 */}
            <div className="filter-container">
                <h3 className="filter-title">Filter Results</h3>
                
                <div className="filter-row">
                    {/* 1. Age Filter */}
                    <div className="filter-group">
                        <label className="filter-label">Age Range</label>
                        <div className="filter-input-group">
                            <input 
                                type="number" 
                                className="filter-input"
                                value={ageRange.min}
                                onChange={(e) => setAgeRange({ ...ageRange, min: Number(e.target.value) })}
                                placeholder="Min"
                            />
                            <span className="filter-separator">to</span>
                            <input 
                                type="number" 
                                className="filter-input"
                                value={ageRange.max}
                                onChange={(e) => setAgeRange({ ...ageRange, max: Number(e.target.value) })}
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    {/* 2. Fame Rating Filter */}
                    <div className="filter-group">
                        <label className="filter-label">Fame Rating (0-5)</label>
                        <div className="filter-input-group">
                            <input 
                                type="number" 
                                className="filter-input"
                                min="0" max="5"
                                value={fameRange.min}
                                onChange={(e) => setFameRange({ ...fameRange, min: Number(e.target.value) })}
                                placeholder="0"
                            />
                            <span className="filter-separator">to</span>
                            <input 
                                type="number" 
                                className="filter-input"
                                min="0" max="5"
                                value={fameRange.max}
                                onChange={(e) => setFameRange({ ...fameRange, max: Number(e.target.value) })}
                                placeholder="5"
                            />
                        </div>
                    </div>

                    {/* 3. Tags Filter */}
                    <div className="filter-group">
                        <label className="filter-label">Interests</label>
                        <div className="filter-input-group">
                            <input 
                                type="text" 
                                className="filter-input"
                                style={{ width: '200px' }}
                                placeholder="e.g. vegan, geek"
                                value={searchTags.join(',')}
                                onChange={(e) => setSearchTags(e.target.value.split(',').map(tag => tag.trim()))}
                            />
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button onClick={fetchBroadSearch} className="apply-btn">
                        Apply Filters 🔎
                    </button>
                </div>
            </div>
            {/* 🔼 END FILTER SECTION 🔼 */}

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px' 
            }}>
                {Array.isArray(users) && users.length > 0 && (
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
                )}
            </div>
        </div>
    );
}