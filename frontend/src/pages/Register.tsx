import { useState } from 'react';
import React from 'react'
import api from '../api/axios';

const Register = () => {

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [user_password, setUserPassword] = useState('');
    const [date_of_birth, setDateOfBirth] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await api.post('/users/register', {
                email,
                username,
                first_name,
                last_name,
                user_password,
                date_of_birth
            });
            console.log('Server says:', response.data);
            alert('Registration is confirmed! Check email to activate the account');
        } catch (error: any) {
            console.error('Error during registration', error);
            alert('Registration failed: ' + (error.response?.data?.error || error.message));
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input type='text' value={first_name} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
                <label>Last Name:</label>
                <input type='text' value={last_name} onChange={e => setLastName(e.target.value)} />
            </div>
            <div>
                <label>Email:</label>
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
                <label>Username:</label>
                <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type='password' value={user_password} onChange={e => setUserPassword(e.target.value)} />
            </div>
            <div>
                <label>Date of Birth:</label>
                <input type='date' value={date_of_birth} onChange={e => setDateOfBirth(e.target.value)} />
            </div>
            <button type='submit'>Register</button>
        </form>
    );
};

export default Register;