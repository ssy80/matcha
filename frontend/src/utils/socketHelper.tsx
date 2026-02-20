import { io, Socket } from "socket.io-client";
import { API_HOST_URL } from "@/constants/config";

export function createSocket(token: string): Socket {
    return io(API_HOST_URL, {
        transports: ["websocket"],
        auth: { token },
    });
}