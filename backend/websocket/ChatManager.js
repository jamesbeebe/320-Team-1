import { supabase } from "../supabase-client.js";
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
        console.error(`Invalid chat ID ${chatId}:`, error);
        ws.close(1008, "chat id not found");
        return;
      }
    } catch (err) {
      console.error(`Error validating chat ID ${chatId}:`, err);
      ws.close(1011, "Internal server error");
      return;
    }

    // Create room if doesn't exist
    if (!this.chatRooms.has(chatId)) {
      this.chatRooms.set(chatId, new Set());
    }

    const room = this.chatRooms.get(chatId);
    room.add(ws);

    console.log(`Client connected to chat ${chatId}`);

    ws.on("message", (data) => {
      this.handleMessage(ws, room, chatId, data);
    });

    ws.on("close", () => {
      this.handleDisconnect(ws, room, chatId);
    });
  }

  async handleMessage(ws, room, chatId, data) {
    try {
      console.log("message --->", data);
      const message = JSON.parse(data);
      const { d, error } = await supabase.from("messages").insert({
        chat_id: chatId,
        user_id: message.user_id,
        timestamp: message.timestamp,
        content: message.content,
      });

      if (error) {
        console.error("Error saving message to database:", error);
        ws.close(1011, "Internal server error");
        return;
      }

      // Broadcast to everyone in the same chat after we have saved to the database
      for (const client of room) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ chatId, ...message }));
        }
      }
    } catch (err) {
      console.error("Invalid message:", err);
    }
  }

  handleDisconnect(ws, room, chatId) {
    room.delete(ws);
    if (room.size === 0) {
      this.chatRooms.delete(chatId);
    }
    console.log(`Client left chat ${chatId}`);
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
