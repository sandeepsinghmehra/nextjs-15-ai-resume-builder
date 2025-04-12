// "use client";

// import { useEffect } from "react";
// import { useToast } from "@/hooks/use-toast";
// import { io } from "socket.io-client";
// import { useUser } from "@clerk/nextjs";
// import { connectSocket, disconnectSocket } from "@/lib/socketClient";

// // let socket: any;

// export function ListenForSubscription() {
//   const { user } = useUser();
  

//   useEffect(() => {
//     if (!user) return;
//     connectSocket(user.id);
//     return () => disconnectSocket();
//   }, [user]);
//   return null;
// }

