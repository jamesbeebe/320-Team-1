import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import { ChatManager } from "./websocket/ChatManager.js";
import { messageRouter } from "./messages/routes.js";
import { authRouter } from "./auth/routes.js";
import { userRouter } from "./users/routes.js";

export const app = express();
export const httpServer = http.createServer(app);
export const websocketServer = new WebSocketServer({
  server: httpServer,
});

const PORT = 8080;

// CORS configuration to allow frontend requests
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());

// Setup WebSocket with ChatManager singleton
const chatManager = ChatManager.getInstance();
chatManager.setupWebSocket(websocketServer);

httpServer.listen(PORT, () => {
  console.log("server is running on port", PORT);
});

app.get("/test", (req, res) => {
  res.send("Hello World");
});

// set up auth route
app.use("/api/auth", authRouter);
// set up messages route
app.use("/api/messages", messageRouter);
app.use("/api/users", userRouter)