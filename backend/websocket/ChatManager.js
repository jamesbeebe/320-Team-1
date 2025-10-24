import { supabase } from "../supabase-client.js";
import { log } from "../logs/logger.js";
import { postMessageAndReturn } from "../messages/controller.js";
export class ChatManager {
  static instance = null;

  constructor() {
    if (ChatManager.instance) {
      return ChatManager.instance;
    }

    this.chatRooms = new Map(); // chatId -> Set of sockets
    ChatManager.instance = this;
  }

  static getInstance() {
    if (!ChatManager.instance) {
      ChatManager.instance = new ChatManager();
    }
    return ChatManager.instance;
  }

  setupWebSocket(websocketServer) {
    websocketServer.on("connection", (ws, req) => {
      this.handleConnection(ws, req);
    });
  }

  async handleConnection(ws, req) {
    const urlParts = req.url.split("/");
    const chatId = urlParts[urlParts.length - 1];

    if (!chatId) {
      ws.close(1008, "Chat ID required");
      return;
    }

    try {
      // Check if this is a valid chatId with database before persisting it within node memory
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatId)
        .single();

      if (error) {
        // this will throw an error if there is no rows as single expects at least one row
        log(
          "error",
          `Handle Connection Error: Invalid chat ID ${chatId}: ${error.message}`
        );
        ws.close(1008, "chat id not found");
        return;
      }
    } catch (err) {
      log(
        "error",
        `Handle Connection Error: Error validating chat ID ${chatId}: ${err.message}`
      );
      ws.close(1011, "Internal server error");
      return;
    }

    // Create room if doesn't exist
    if (!this.chatRooms.has(chatId)) {
      this.chatRooms.set(chatId, new Set());
    }

    const room = this.chatRooms.get(chatId);
    room.add(ws);

    log("info", `Client connected to chat ${chatId}`);

    ws.on("message", (data) => {
      this.handleMessage(ws, room, chatId, data);
    });

    ws.on("close", () => {
      this.handleDisconnect(ws, room, chatId);
    });
  }

  async handleMessage(ws, room, chatId, data) {
    try {
      const message = JSON.parse(data);
      const { d, error } = await postMessageAndReturn(
        chatId,
        message.user_id,
        message.content,
        message.timestamp
      );

      if (error) {
        log("error", `Error saving message to database: ${error.message}`);
        ws.close(1011, "Internal server error");
        return;
      }

      // Broadcast to everyone in the same chat after we have saved to the database
      for (const client of room) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(d));
        }
      }
    } catch (err) {
      log("error", `Chat Manager handling message error : ${err.message}`);
      ws.close(1011, "Internal server error");
      return;
    }
  }

  handleDisconnect(ws, room, chatId) {
    room.delete(ws);
    if (room.size === 0) {
      this.chatRooms.delete(chatId);
    }
    log("info", `Client left chat ${chatId}`);
  }

  // Utility methods you might find useful
  getChatRoom(chatId) {
    return this.chatRooms.get(chatId);
  }

  getAllChatRooms() {
    return this.chatRooms;
  }

  getRoomSize(chatId) {
    const room = this.chatRooms.get(chatId);
    return room ? room.size : 0;
  }
}
