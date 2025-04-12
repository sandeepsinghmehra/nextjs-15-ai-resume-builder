import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // adjust as needed
    methods: ["GET", "POST"]
  },
});

app.use(cors());
app.use(express.json());

app.post("/emit", (req:any, res:any) => {
  console.log("Received emit request:", req.body);
    const { userId, event, payload } = req.body;
    if (!userId || !event) return res.status(400).send("Missing data");
  
    io.to(userId).emit(event, payload);
    console.log(`🔔 Emitted ${event} to ${userId}`);
    res.send("OK");
  });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId: string) => {
    console.log(`User joined room: ${userId}`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export function emitToUser(userId: string, event: string, payload: any) {
  io.to(userId).emit(event, payload);
}

server.listen(4001, () => {
  console.log("✅ Socket.IO server running on port 4001");
});
