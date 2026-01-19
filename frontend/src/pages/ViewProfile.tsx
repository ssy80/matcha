import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
}

const ViewProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/profile/me');
                if (response.data.success) {
                    setProfile(response.data.profile);
                } else {
                    setError('Failed to load profile');
                }
            } catch (err: any) {
                console.error("Error fetching profile:", err);
                setError('Error loading profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading)
        return <div>Loading Profile...</div>;
    if (error)
        return <div style={{ color: 'red' }}>{error}</div>;
    if (!profile)
        return <div>No profile found.</div>;

    // Find profile picture (if exists)
    const profilePic = profile.pictures.find(p => p.is_profile_picture === 1)?.picture;

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>My Profile</h1>
                <button onClick={() => navigate('/profile/edit')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    Edit Profile
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                {/* Profile Picture */}
                <div style={{ flexShrink: 0 }}>
                    {profilePic ? (
                        <img 
                            src={profilePic} 
                            alt="Profile" 
                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            No Photo
                        </div>
                    )}
                </div>

                {/* Basic Info */}
                <div>
                    <h2>{profile.first_name} {profile.last_name}</h2>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Gender:</strong> {profile.gender}</p>
                    <p><strong>Sexual Preference:</strong> {profile.sexual_preference}</p>
                </div>
            </div>

            {/* Biography */}
            <div style={{ marginBottom: '20px' }}>
                <h3>Biography</h3>
                <p style={{ background: 'rgba(0, 0, 0, 1)',
                    padding: '10px',
                    borderRadius: '5px',
                    color: 'rgba(255, 255, 255, 1)' }}>
                    {profile.biography || "No biography written yet."}
                </p>
            </div>

            {/* Interests */}
            <div style={{ marginBottom: '20px' }}>
                <h3>Interests</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {profile.interests && profile.interests.length > 0 ? (
                        profile.interests.map((interest, index) => (
                            <span key={index}
                            style={{
                                background: 'rgba(0, 255, 0, 1)',
                                color: 'rgba(255, 255, 255, 1)',
                                padding: '5px 10px',
                                borderRadius: '15px' }}>
                                {interest}
                            </span>
                        ))
                    ) : (
                        <p>No interests selected.</p>
                    )}
                </div>
            </div>

            {/* Gallery */}
            <div>
                <h3>Photo Gallery</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {profile.pictures.map((pic, index) => (
                        <img 
                            key={index} 
                            src={pic.picture} 
                            alt={`Gallery ${index}`} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #ddd' }} 
                        />
                    ))}
                    {profile.pictures.length === 0 && <p>No photos uploaded.</p>}
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;