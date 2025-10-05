import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { ChatManager } from "./websocket/ChatManager.js";

export const app = express();
export const httpServer = http.createServer(app);
export const websocketServer = new WebSocketServer({
  server: httpServer,
});

const PORT = 3000;

// Setup WebSocket with ChatManager singleton
const chatManager = ChatManager.getInstance();
chatManager.setupWebSocket(websocketServer);

httpServer.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
