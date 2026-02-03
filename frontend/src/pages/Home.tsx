import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
    num_shared_interests?: number;
    match_score?: number;
}

export default function Home() {
    const [users, setUsers] = useState<SuggestedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // 🔍 Search Filter States
    const [ageRange, setAgeRange] =  useState({min: 18, max: 99});
    const [fameRange, setFameRange] =  useState({min: 0, max: 5});
    const [distance, setDistance] =  useState({min: 0, max: 20000});
    const [searchTags, setSearchTags] =  useState<string[]>([]);

    // 🔃 Sorting State
    const [sortOption, setSortOption] = useState('match_score');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
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
            
            if (response.data.success && Array.isArray(response.data.profiles)) {
                setUsers(response.data.profiles);
            } else {
                console.warn("⚠️ Unexpected response format:", response.data);
                setUsers([]);
            }
        } catch (err: any) {
            console.error("❌ Error fetching matches:", err);
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
    const renderStars = (rating: any) => (typeof rating === 'object' ? rating.stars : rating || 0);

    // Helper to get distance safely
    const getDistance = (user: SuggestedUser) => user.distance_km ?? user.distance ?? 0;

    // Sorting Logic
    const getSortedUsers = () => {
        const sorted = [...users];
        
        sorted.sort((a, b) => {
            let valA, valB;

            switch (sortOption) {
                case 'age':
                    valA = a.age; valB = b.age;
                    break;
                case 'distance':
                    valA = getDistance(a); valB = getDistance(b);
                    break;
                case 'fame':
                    valA = renderStars(a.fame_rating); valB = renderStars(b.fame_rating);
                    break;
                case 'tags':
                    valA = a.num_shared_interests || 0; valB = b.num_shared_interests || 0;
                    break;
                case 'match_score':
                default:
                    valA = a.match_score || 0; valB = b.match_score || 0;
            }

            if (valA < valB)
                return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB)
                return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    };

    if (loading && users.length === 0)
      return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Finding people nearby... 🌏</div>;
    
    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Discover People</h1>
            
            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

            {!loading && !error && users.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
                    <h3>No matches found.</h3>
                    <p style={{ color: '#888' }}>Try adjusting your filters to see more people!</p>
                </div>
            )}

            {/* Filter & Sort Section */}
            <div className="filter-container">
                <h3 className="filter-title">Filter & Sort</h3>
                
                <div className="filter-row" style={{ borderBottom: '1px solid #444', paddingBottom: '15px', marginBottom: '15px' }}>
                    <div className="filter-group">
                        <label className="filter-label">Sort By:</label>
                        <select 
                            value={sortOption} 
                            onChange={(e) => setSortOption(e.target.value)}
                            className="filter-input"
                            style={{ padding: '8px', minWidth : '200px' }}
                        >
                            <option value="match_score">✨ Smart Match</option>
                            <option value="distance">📍 Distance</option>
                            <option value="age">🎂 Age</option>
                            <option value="fame">⭐ Fame Rating</option>
                            <option value="tags">🏷️ Common Interests</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Order:</label>
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                            className="filter-input"
                            style={{ padding: '8px', minWidth : '240px' }}
                        >
                            <option value="asc">⬆ Ascending (Low to High)</option>
                            <option value="desc">⬇ Descending (High to Low)</option>
                        </select>
                    </div>
                </div>

                <div className="filter-row">
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

                    <div className="filter-group">
                        <label className="filter-label">Max Distance (km)</label>
                        <div className="filter-input-group">
                            <input 
                                type="number" 
                                className="filter-input"
                                min="0"
                                value={distance.max}
                                onChange={(e) => setDistance({ ...distance, max: Number(e.target.value) })}
                                placeholder="e.g. 50"
                            />
                        </div>
                    </div>

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

                    <button onClick={fetchBroadSearch} className="apply-btn">
                        Apply Filters 🔎
                    </button>
                </div>
            </div>

            {/* List */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px' 
            }}>
                {getSortedUsers().map((user) => (
                    <div 
                        key={user.id} 
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

                            {/* Show shared interest count if available */}
                            {user.num_shared_interests !== undefined && (
                                <div style={{fontSize: '0.8em', color: '#4CAF50', marginBottom: '5px'}}>
                                    {user.num_shared_interests} Shared Interests
                                </div>
                            )}

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
                ))}
            </div>
        </div>
    );
}