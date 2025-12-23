import { useState } from 'react';
import React from 'react'
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await api.post('/users/reset_password_request', {
                email
            });
            console.log('Server says:', response.data);
            alert('Password reset request is successful! Please check your email for further instructions.');
            navigate('/login');

        } catch (error: any){
            console.error('Error during password reset request', error);
            alert('Password reset request failed: ' + (error.response?.data?.error || error.message));
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type='submit'>Request Password Reset</button>
        </form>
    )
}

export default ForgetPassword;