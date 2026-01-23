import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

interface UserProfile {
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
    city?: string;
    latitude?: number;
    longitude?: number;
    age?: number;
}

const ViewProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [displayLocation, setDisplayLocation] = useState<string>('Unknown');
    
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();

    const isOwnProfile = !id; 

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                let userData: UserProfile;

                // 1. Fetch my own Profile Data
                if (isOwnProfile) {

                    console.log("Fetching MY profile...");
                    const res = await api.get('/profile/me');
                    if (!res.data.success) throw new Error('Failed to load my profile');
                    userData = res.data.profile;

                    try {
                        const locRes = await api.get('/location/get');
                        if (locRes.data && locRes.data.location) {
                            userData.latitude = locRes.data.location.latitude;
                            userData.longitude = locRes.data.location.longitude;
                            if (locRes.data.location.city) {
                                userData.city = locRes.data.location.city;
                            }
                        }
                    } catch (e) { 
                        console.warn("Could not fetch my location:", e); 
                    }

                } else {
                    // Fetching Another User's Profile
                    console.log(`Fetching profile for user ${id}...`);
                    const res = await api.get(`/profile/${id}`);
                    if (!res.data.success)
                        throw new Error('Failed to load user profile');
                    // For backend structure
                    userData = res.data.profile || res.data.user;
                }

                setProfile(userData);

            } catch (err: any) {
                console.error("Error loading profile:", err);
                setError('Could not load profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id, isOwnProfile]); // Re-run when ID changes

    // 2. Geolocation
    useEffect(() => {
        if (!profile)
            return;

        const resolveCity = async () => {
            if (profile.city && profile.city !== 'Unknown') {
                setDisplayLocation(profile.city);
                return;
            }
            if (profile.latitude && profile.longitude) {
                try {
                    setDisplayLocation('Locating...');
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${profile.latitude}&lon=${profile.longitude}`);
                    if (!res.ok) throw new Error("Map service failed");
                    
                    const data = await res.json();
                    const address = data.address || {};
                    const city = address.city || address.town || address.village || address.state || 'Unknown Location';
                    
                    setDisplayLocation(city);
                } catch (error) {
                    // Fallback
                    setDisplayLocation(`${profile.latitude.toFixed(2)}, ${profile.longitude.toFixed(2)}`);
                }
            } else {
                setDisplayLocation('Unknown');
            }
        };

        resolveCity();
    }, [profile]);

    if (loading)
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Profile...</div>;
    if (error)
        return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
    if (!profile)
        return <div>No profile found.</div>;

    const profilePic = profile.pictures?.find(p => p.is_profile_picture === 1)?.picture;

    return (
        <div style={{ maxWidth: '600px',margin: '20px auto', padding: '20px', border: '1px solid #444', borderRadius: '8px', color: '#fff', background: '#222' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                {/* Dynamic Title */}
                <h1>{isOwnProfile ? "My Profile" : profile.username}</h1>
                
                {/* Dynamic Buttons */}
                {isOwnProfile ? (
                    <button 
                        onClick={() => navigate('/profile/edit')} 
                        style={{ padding: '8px 16px', cursor: 'pointer', background: '#333', color: '#fff', border: '1px solid #666', borderRadius: '4px' }}
                    >
                        Edit Profile
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{ padding: '8px 16px', cursor: 'pointer', background: '#E91E63', color: 'white', border: 'none', borderRadius: '4px' }}>
                            Like ❤️
                        </button>
                        <button style={{ padding: '8px 16px', cursor: 'pointer', background: '#555', color: 'white', border: 'none', borderRadius: '4px' }}>
                            Block 🚫
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flexShrink: 0 }}>
                    <div style={{ 
                        width: '150px', height: '150px', borderRadius: '50%', background: '#eee', 
                        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #555' 
                    }}>
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ color: '#000' }}>No Photo</span>
                        )}
                    </div>
                </div>

                <div style={{ flexGrow: 1 }}>
                    <h2 style={{ marginTop: 0 }}>{profile.first_name} {profile.last_name}</h2>
                    {/* Only show Username/Email if it's MY profile, or depending on your privacy rules */}
                    {isOwnProfile && <p style={{ margin: '5px 0' }}><strong style={{ color: '#aaa' }}>Email:</strong> {profile.email}</p>}
                    
                    <p style={{ margin: '5px 0' }}><strong style={{ color: '#aaa' }}>Age:</strong> {profile.age || 'N/A'}</p>
                    <p style={{ margin: '5px 0' }}><strong style={{ color: '#aaa' }}>Gender:</strong> {profile.gender}</p>
                    <p style={{ margin: '5px 0' }}><strong style={{ color: '#aaa' }}>Sexual Preference:</strong> {profile.sexual_preference}</p>
                    <p style={{ margin: '5px 0' }}><strong style={{ color: '#aaa' }}>Location:</strong> {displayLocation}</p>
                    {profile.fame_rating && (
                        <p style={{ margin: '5px 0' }}><strong style={{ color: '#aaa' }}>Fame:</strong> {profile.fame_rating.stars} ⭐</p>
                    )}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Biography</h3>
                <div style={{ background: '#000', padding: '15px', borderRadius: '5px', minHeight: '60px' }}>
                    {profile.biography || "No biography written yet."}
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Interests</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {profile.interests && profile.interests.length > 0 ? (
                        profile.interests.map((interest, index) => (
                            <span key={index} style={{ background: '#00ff00', color: '#000', padding: '5px 12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '14px' }}>
                                {interest}
                            </span>
                        ))
                    ) : (
                        <p style={{ color: '#888' }}>No interests selected.</p>
                    )}
                </div>
            </div>

            <div>
                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Photo Gallery</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {profile.pictures && profile.pictures.map((pic, index) => (
                        <img 
                            key={index} 
                            src={pic.picture} 
                            alt={`Gallery ${index}`} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #444' }} 
                        />
                    ))}
                    {(!profile.pictures || profile.pictures.length === 0) && <p style={{ color: '#888' }}>No photos uploaded.</p>}
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;