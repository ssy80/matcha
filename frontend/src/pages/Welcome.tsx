import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Welcome = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await api.get('/profile/me');
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading)
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
            color: 'white',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '20px', color: '#E91E63' }}>Matcha</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '40px', color: '#ccc' }}>
                Soon-Yee and Axel's Matchmaking Service.
            </p>
            
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/login">
                    <button style={{ 
                        padding: '15px 40px', 
                        fontSize: '1.2rem', 
                        background: '#E91E63', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '30px', 
                        cursor: 'pointer' 
                    }}>
                        Login
                    </button>
                </Link>
                <Link to="/register">
                    <button style={{ 
                        padding: '15px 40px', 
                        fontSize: '1.2rem', 
                        background: 'transparent', 
                        border: '2px solid #E91E63', 
                        color: '#E91E63', 
                        borderRadius: '30px', 
                        cursor: 'pointer' 
                    }}>
                        Register
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Welcome;