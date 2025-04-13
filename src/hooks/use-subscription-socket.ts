import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socketClient";



export function useSubscriptionSocket(userId: string, onConfirmed: () => void) {
    useEffect(() => {
        if (!userId) return;
        // console.log("Connecting to socket with userId:", userId);
        connectSocket(userId, onConfirmed);
        return () => disconnectSocket();
    }, [userId]);
}
