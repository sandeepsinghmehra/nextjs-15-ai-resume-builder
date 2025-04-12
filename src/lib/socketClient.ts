import { env } from "@/env";
import { io, Socket } from "socket.io-client";


let socket: Socket;

export const connectSocket = (userId: string,  onConfirmed: () => void) => {
   
    socket = io(env.NEXT_PUBLIC_WEBSOCKET_BACKEND_URL, {
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("🔗 Socket connected");
        socket.emit("join", userId);
    });

    socket.on("subscription-activated", (data) => {
        console.log("🔥 Subscription event", data);
        onConfirmed();
    });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
