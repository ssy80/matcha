import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface ImageUpload {
    file: File;
    preview: string;
}

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const ALLOWED_TAGS = ['#music', '#movie', '#gym', '#swim', '#jog', '#cycle', '#animal', '#vegan', '#dinner', '#travel', '#dance'];

const Profile = () => {
    const [gender, setGender] = useState('');
    const [sexualPreference, setSexualPreference] = useState('bi-sexual');
    const [biography, setBiography] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        city: ''
    });
    const [locationStatus, setLocationStatus] = useState('');
    const [photos, setPhotos] = useState<ImageUpload[]>([]);

    const navigate = useNavigate();

    const handleAddTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTag = e.target.value;
        if (!newTag) return;
        if (tags.length >= 5) {
            alert("You can only select up to 5 interests.");
            return;
        }
        if (!tags.includes(newTag)) {
            setTags([...tags, newTag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleGPS = (event: React.MouseEvent) => {
        event.preventDefault();
        setLocationStatus('Locating...');

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                
                setLocation(prev => ({
                    ...prev,
                    latitude: latitude,
                    longitude: longitude,
                }));
                
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    if (!response.ok) throw new Error("Map service failed");
                    
                    const data = await response.json();
                    const cityName = data.address.city || data.address.town || data.address.village || data.address.state || '';
                    
                    setLocation(prev => ({ ...prev, city: cityName }));
                    setLocationStatus(`Location found: ${cityName}`);
                    
                } catch (error) {
                    console.error("Could not fetch city name", error);
                    setLocationStatus('Location coordinates found');
                }

            }, (error) => {
                setLocationStatus('Unable to retrieve your location');
                console.error('Error retrieving location:', error);
            });
        } else {
            setLocationStatus('Geolocation is not supported by the browser');
        }
    };

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
    };

    const removePhoto = (indexToRemove: number) => {
        URL.revokeObjectURL(photos[indexToRemove].preview);
        setPhotos(photos.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // 1. Format photos
        const formattedPictures = await Promise.all(
            photos.map(async (photo, index) => {
                const base64String = await convertFileToBase64(photo.file);
                return {
                    base64_image: base64String,
                    isProfilePicture: index === 0 ? 1 : 0
                };
            })
        );

        // 2. Prepare Profile Data
        const profileData = {
            gender: gender,
            sexual_preference: sexualPreference,
            biography: biography,
            interests: tags,
            pictures: formattedPictures
        };

        // 3. Send Profile Update
        try {
            console.log("Sending Profile Data...", profileData);
            await api.patch('/profile/update', profileData);
        } catch (error: any) {
            console.error('Error saving profile:', error);
            const errorMessage = error?.response?.data?.error || error?.message || 'Unknown error';
            alert('Failed to save profile: ' + errorMessage);
            return;
        }

        // 4. Send Location Update
        let finalLat = location.latitude;
        let finalLng = location.longitude;
        const finalCity = location.city;

        // If user typed a city but didn't use GPS (coords are 0), fetch coords
        if (finalCity && (finalLat === 0 || finalLng === 0)) {
            try {
                console.log(`🌍 Looking up coordinates for manual entry: "${finalCity}"...`);
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(finalCity)}`);
                const geoData = await geoRes.json();

                if (geoData && geoData.length > 0) {
                    finalLat = parseFloat(geoData[0].lat);
                    finalLng = parseFloat(geoData[0].lon);
                    console.log(`✅ Resolved "${finalCity}" to Lat: ${finalLat}, Lng: ${finalLng}`);
                }
            } catch (err) {
                console.warn("Could not resolve coordinates for manual city input:", err);
            }
        }

        let locationUpdateErrorMessage: string | null = null;
        
        // Only send if we have valid data
        if (finalLat !== 0 && finalLng !== 0) {
            try {
                console.log("Sending Location Update:", { latitude: finalLat, longitude: finalLng, city: finalCity });
                
                await api.post('/location/update', {
                    latitude: finalLat,
                    longitude: finalLng,
                    city: finalCity
                });
                console.log("Location update sent successfully.");
            } catch (error: any) {
                console.error('Error updating location:', error);
                locationUpdateErrorMessage = error?.response?.data?.error || error?.message || 'Unknown error';
            }
        } else {
            console.warn("Skipping location update: No valid coordinates found.");
        }

        if (locationUpdateErrorMessage) {
            alert('Profile saved, but failed to update location: ' + locationUpdateErrorMessage);
        } else {
            alert('Profile saved successfully!');
        }
        navigate('/profile');
    };

    // Bonus: GDPR Export Logic
    const handleExportData = async () => {
        try {
            const response = await api.get('/profile/export', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'my_matcha_data.json');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Export failed", error);
            alert("Failed to download data. Ensure you are logged in.");
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', paddingBottom: '50px' }}>
            <h2>Complete Your Profile</h2>
            <form onSubmit={handleSubmit}>
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
                        <option value="other">Non-Binary / Other</option>
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>I am interested in:</label>
                    <select
                        value={sexualPreference}
                        onChange={(e) => setSexualPreference(e.target.value)}
                        required
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    >
                        <option value="male">Men</option>
                        <option value="female">Women</option>
                        <option value="bi-sexual">Everyone (Both)</option>
                    </select>
                </div>

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

                <div style={{ marginBottom: '15px' }}>
                    <label>Interests (Max 5):</label>
                    <select 
                        onChange={handleAddTag} 
                        value="" 
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    >
                        <option value="" disabled>Select an interest...</option>
                        {ALLOWED_TAGS.map(tag => (
                            <option key={tag} value={tag} disabled={tags.includes(tag)}>
                                {tag}
                            </option>
                        ))}
                    </select>
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {tags.map(tag => (
                            <span
                                key={tag}
                                onClick={() => removeTag(tag)}
                                style={{ background: 'rgba(0, 255, 0, 1)', color: 'rgba(255, 255, 255, 1)', padding: '5px 10px', borderRadius: '15px', cursor: 'pointer' }}
                            >
                                {tag} X
                            </span>
                        ))}
                    </div>
                    <small style={{ color: 'rgba(255, 255, 255, 1)' }}>{tags.length}/5 selected</small>
                </div>

                <div style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                    <label>Photos (Max 5):</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={photos.length >= 5} style={{ display: 'block', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {photos.map((photo, index) => (
                            <div key={index} style={{ position: 'relative' }}>
                                <img src={photo.preview} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
                                <button type="button" onClick={() => removePhoto(index)} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                    <label>Location (Required):</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button onClick={handleGPS} style={{ background: '#4CAF50', color: 'white' }}>Locate Me</button>
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
                    <small style={{ color: '#666' }}>Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}</small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button type="submit" style={{ padding: '10px', background: '#E91E63', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1em' }}>
                        Save Profile
                    </button>

                    {/* Bonus: Data Export Button */}
                    <button 
                        type="button" 
                        onClick={handleExportData} 
                        style={{ padding: '10px', background: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        📥 Download My Data (GDPR)
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;