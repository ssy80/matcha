import { useState } from 'react';
import React from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await api.post('/users/login', {
                username,
                password
            });
            localStorage.setItem('token', response.data.token)
            console.log('Server says:', response.data);
            alert('Login is successful!');
            navigate('/home');
        } catch (error: any) {
            console.error('Error during login', error);
            alert('Login failed:' + (error.response?.data?.error || error.message));
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type='submit'>Login</button>
        </form>
    );
};

export default Login;