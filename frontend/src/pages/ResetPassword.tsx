import { useEffect, useState } from 'react';
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get the token from the URL (e.g., ?token=xyz)
    const token = searchParams.get('reset_uuid');
    
    useEffect(() => {
        if (token){
            console.log('Reset token found in URL:', token);
        }
    }, [token]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Error: Passwords do not match!');
            return;
        }

        try {
            const response = await api.post('/users/reset_user_password', {
                reset_uuid: token,
                password: password 
            });

            console.log('Server says:', response.data);
            alert('Password reset successful! You can now login.');
            
            navigate('/login');

        } catch (error: any) {
            console.error('Error during password reset', error);
            alert('Password reset failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <div>
                <label>New Password:</label>
                <input 
                    type='password' 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Confirm Password:</label>
                <input 
                    type='password' 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                />
            </div>
            
            {!token ? (
                 <p style={{color: 'red'}}> 
                    Error: No token found. Please use the link from your email. 
                 </p>
            ) : (
                <button type='submit'>Set New Password</button>
            )}
        </form>        
    );
};

export default ResetPassword;