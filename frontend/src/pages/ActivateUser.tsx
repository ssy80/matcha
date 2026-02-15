import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";


export default function ActivateUser() {
    const location = useLocation();
    const [message, setMessage] = useState("");

    // Extract query params
    const params = new URLSearchParams(location.search);
    const activationUUID = params.get("activation_uuid");

    useEffect(() => {

        const activateUser = async () => {
            try{
                const payload = {
                    activation_uuid: activationUUID
                };

                await api.post('/users/activate', payload);
                setMessage("Your account has been successfully activated!");

            }catch(err: any){
                const message = err?.response?.data?.error || "Unknown error";
                console.error("Error activate user: ", message);
                setMessage(`Error activate user: ${message}`);
            }
        }

        activateUser();
    },[activationUUID])

    return (
        <div className="flex min-h-screen items-start justify-center bg-background px-4">
            <div className="flex max-w-md flex-col items-center text-center gap-4">
            
                {/* Title */}
                <h1 className="mb-2 text-xl font-semibold">
                🍵 Matcha - Account Activation
                </h1>

                {/* Message */} 
                <p className="mb-6 text-lg text-muted-foreground">
                    {message}
                </p>

                {/* Back to Landing page */}
                <Link to="/home" className="text-sm text-primary hover:underline">
                    Back to Home
                </Link>

            </div>
        </div>
    );
}
