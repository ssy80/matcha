import { Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Button } from "@/components/ui/button";

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
        return <div className="mt-4">Loading...</div>;

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-900 to-black px-4">
        <div className="text-center">

            {/* Title */}
            <h1 className="mb-4 text-5xl font-bold text-primary sm:text-6xl text-white">
            🍵 Matcha
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-md text-base text-muted-foreground sm:text-lg text-[#E91E63]">
            Soon-Yee and Axel&apos;s matchmaking service.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-[#E91E63] text-white">
                Login
                </Button>
            </Link>

            <Link to="/register">
                <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                Register
                </Button>
            </Link>
            </div>
        </div>
        </div>
    )
};

export default Welcome;