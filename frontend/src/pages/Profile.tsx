import { useState } from 'react';
import React from 'react';

interface ImageUpload {
    file: File;
    preview: string;
}

const Profile = () => {
    // 1. Initialize State for the basic fields
    const [gender, setGender] = useState('');
    const [sexualPreference, setSexualPreference] = useState('bisexual');
    const [biography, setBiography] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        city: ''
    });
    const [locationStatus, setLocationStatus] = useState('');
    const [photos,setPhotos] = useState<ImageUpload[]>([]);

    // Helper to add a tag
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            let newTag = currentTag.trim();
            if (!newTag.startsWith('#')) newTag = '#' + newTag;

            if (!tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setCurrentTag('');
        }
    };

    // Helper to remove a tag
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // To handle GPS Location
    const handleGPS = (event: React.MouseEvent) => {
        event.preventDefault();
        setLocationStatus('Locating...');

        if ("geolocation" in navigator) {
            console.log("Browser does support Geolocation");
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

                setLocation(prev => ({
                    ...prev,
                    latitude: latitude,
                    longitude: longitude,
                }));
                setLocationStatus('Location has been found');
                console.log('Updated location state:', {latitude, longitude});
            }, (error) => {
                setLocationStatus('Unable to retrieve your location');
                console.error('Error retrieving location:', error);
            });
        }
        else {
            setLocationStatus('Geolocation is not supported by the browser');
        }
    };

    // To handle uploading Images
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            if (photos.length >= 5) {
                alert('You can only upload up to 5 photos.');
                return;
            }

            const newPhoto: ImageUpload = {
                file: file,
                preview: URL.createObjectURL(file)
            };

            setPhotos([...photos, newPhoto]);
        }
    }

    // Remove Photos
    const removePhoto = (indexToRemove: number) => {
        URL.revokeObjectURL(photos[indexToRemove].preview);
        setPhotos(photos.filter((_, index) => index !== indexToRemove));
    };

    // Form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ gender, sexualPreference, biography, tags, location, photos });
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Complete Your Profile</h2>
            <form onSubmit={handleSubmit}>
                
                {/* GENDER */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Gender:</label>
                    <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* SEXUAL PREFERENCES */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Sexual Preferences:</label>
                    <select 
                        value={sexualPreference} 
                        onChange={(e) => setSexualPreference(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    >
                        <option value="heterosexual">Heterosexual</option>
                        <option value="homosexual">Homosexual</option>
                        <option value="bisexual">Bisexual</option>
                    </select>
                </div>

                {/* BIOGRAPHY */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Biography:</label>
                    <textarea 
                        value={biography} 
                        onChange={(e) => setBiography(e.target.value)}
                        placeholder="Tell us about yourself..."
                        rows={4}
                        required
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                </div>

                {/* INTEREST TAGS */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Interests (Press Enter to add):</label>
                    <input 
                        type="text" 
                        value={currentTag} 
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="e.g. #vegan"
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    
                    {/* Display the tags */}
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {tags.map(tag => (
                            <span 
                                key={tag} 
                                onClick={() => removeTag(tag)}
                                style={{ 
                                    background: '#eee', 
                                    padding: '5px 10px', 
                                    borderRadius: '15px', 
                                    cursor: 'pointer' 
                                }}
                            >
                                {tag} ✕
                            </span>
                        ))}
                    </div>
                </div>

                {/* PHOTOS SECTION */}
                <div style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                    <label>Photos (Max 5):</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        disabled={photos.length >= 5}
                        style={{ display: 'block', marginBottom: '10px' }}
                    />

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {photos.map((photo, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img 
                                    src={photo.preview} 
                                    alt="preview" 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => removePhoto(index)}
                                    style={{ 
                                        position: 'absolute', top: 0, right: 0, 
                                        background: 'red', color: 'white', border: 'none', cursor: 'pointer' 
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LOCATION SECTION */}
                <div style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                    <label>Location (Required):</label>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button onClick={handleGPS} style={{ background: '#4CAF50', color: 'white' }}>
                            📍 Locate Me
                        </button>
                        <span>{locationStatus}</span>
                    </div>

                    <input 
                        type="text" 
                        value={location.city} 
                        onChange={(e) => setLocation({ ...location, city: e.target.value })}
                        placeholder="Or type your City/Neighborhood manually"
                        required={location.latitude === 0 && location.longitude === 0 && !location.city}
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    
                    {/* Debug View - to see coordinates updating */}
                    <small style={{ color: '#666' }}>
                        Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
                    </small>
                </div>
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default Profile;