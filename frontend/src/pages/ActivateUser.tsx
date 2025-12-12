import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AxiosError } from "axios";


export default function ActivateUser() {
    const location = useLocation();
    const [message, setMessage] = useState("");

    // Extract query params
    const params = new URLSearchParams(location.search);
    const activationUUID = params.get("activation_uuid");

    //async function activateUser() {
    const activateUser = useCallback(async () => {
        try {    
            const response = await axios.post(
                "http://localhost:3000/api/users/activate",
                {
                    activation_uuid: activationUUID            
                },
                {
                    headers: { 
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage("Your account has been successfully activated!");
            console.log("response: ", response);
            console.log("response.data: ", response.data);
            console.log("response.data.success: ", response.data.success);            
            
        } catch (error: unknown) {
            const err = error as AxiosError;
            setMessage("Activation failed.");
            console.error(err);
            console.error("http status: ", err.status);
     
            if (err.response){
                console.log("Backend response: ", err.response.data);
            }
        }
    }, [activationUUID]);

    useEffect(() => {
        if (activationUUID) {
            activateUser();
        }
    }, [activationUUID]);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}
