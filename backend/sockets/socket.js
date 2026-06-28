import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],  
        methods: ["GET", "POST"], 
        credentials: true
    }
});

const userSocketMap = {}; //userId: SocketId


const getReceiverSocketId = (receiverId) => {
    if (!receiverId) return undefined;
    return userSocketMap[receiverId.toString().trim()];
}; 

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        const cleanUserId = userId.toString().trim();
        userSocketMap[cleanUserId] = socket.id;
        console.log(`📋 Total Registered Keys Online:`, Object.keys(userSocketMap));
        
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (userId) {
            const cleanUserId = userId.toString().trim();
            delete userSocketMap[cleanUserId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server, getReceiverSocketId };