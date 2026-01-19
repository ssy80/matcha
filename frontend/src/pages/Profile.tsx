import { useState } from 'react';
import React from 'react';

const Profile = () => {
    // 1. Initialize State for the basic fields
    const [gender, setGender] = useState('');
    const [sexualPreference, setSexualPreference] = useState('bisexual'); // Defaulting to bisexual is often safer given the logic rules later 
    const [biography, setBiography] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

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

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log({ gender, sexualPreference, biography, tags });
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
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
};

export default Profile;