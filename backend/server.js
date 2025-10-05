import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

export const app = express();
export const httpServer = http.createServer(app);
export const websocketServer = new WebSocketServer({
  server: httpServer,
  // path: "/chat/:chatId"
});
const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log("server is running on port", PORT);
});

// todo: add authentication to the websocket server

const chatRooms = new Map(); // chatId -> Set of sockets

websocketServer.on("connection", (ws, req) => {
  const urlParts = req.url.split("/");
  const chatId = urlParts[urlParts.length - 1]; // extract :chatId

  if (!chatId) {
    // check to see if this chatId is valid by comparing it with the database
    ws.close(1008, "Chat ID required");
    return;
  }

  // To do check if this is a valid chatId with database before persisting it within node memory.

  // Create room if doesn’t exist
  if (!chatRooms.has(chatId)) {
    chatRooms.set(chatId, new Set());
  }

  const room = chatRooms.get(chatId);
  room.add(ws);

  console.log(`Client connected to chat ${chatId}`);

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      // Save message to DB here if needed
      console.log("user: ", message.user)
      console.log("time: ", message .time)
      console.log("message: ", message.message)
      
      // Broadcast to everyone in the same chat
      for (const client of room) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ chatId, ...message }));
        }
      }

      //TODO: save message to database here
    } catch (err) {
      console.error("Invalid message:", err);
    }
  });

  ws.on("close", () => {
    room.delete(ws);
    if (room.size === 0) {
      chatRooms.delete(chatId);
    }
    console.log(`Client left chat ${chatId}`);
  });
});

