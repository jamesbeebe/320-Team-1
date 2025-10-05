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

  handleConnection(ws, req) {
    const urlParts = req.url.split("/");
    const chatId = urlParts[urlParts.length - 1];

    if (!chatId) {
      ws.close(1008, "Chat ID required");
      return;
    }

    // TODO: check if this is a valid chatId with database before persisting it within node memory

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

  handleMessage(ws, room, chatId, data) {
    try {
      const message = JSON.parse(data);

      console.log("user: ", message.user);
      console.log("time: ", message.time);
      console.log("message: ", message.message);

      // Broadcast to everyone in the same chat
      for (const client of room) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ chatId, ...message }));
        }
      }

      // TODO: save message to database here
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
