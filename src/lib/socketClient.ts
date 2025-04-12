import { env } from "@/env";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";

let socket: Socket;

export const connectSocket = (userId: string) => {
    const {toast} = useToast();
    socket = io(env.NEXT_PUBLIC_WEBSOCKET_BACKEND_URL, {
        transports: ["websocket"],
    });

    socket.on("connect", () => {
        console.log("🔗 Socket connected");
        socket.emit("join", userId);
    });

    socket.on("subscription-activated", (data) => {
        console.log("🔥 Subscription event", data);
        // alert("Subscription Activated");
        toast({
            title: "Subscription Activated",
            description: "Your subscription has been activated successfully.",
        });
        location.reload();
    });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
