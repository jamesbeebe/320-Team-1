import api from "./api";

export const chatService = {
  // Get channels for a class
  async getChannels(classId) {
    try {
      return await api.get(`/chat/channels?classId=${classId}`);
    } catch (error) {
      throw error;
    }
  },

  // Get messages for a channel
  async getMessages(channelId, limit = 50, offset = 0) {
    try {
      return await api.get(
        `/chat/channels/${channelId}/messages?limit=${limit}&offset=${offset}`
      );
    } catch (error) {
      throw error;
    }
  },

  // Fetch messages for a specific channel (direct endpoint)
  async fetchMessages(channelId) {
    try {
      return await api.get(`/messages/${channelId}`);
    } catch (error) {
      console.error("Error loading messages:", error);
      throw error;
    }
  },

  // Send a message
  async sendMessage(channelId, message) {
    try {
      return await api.post(`/chat/channels/${channelId}/messages`, {
        message,
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete a message
  async deleteMessage(messageId) {
    try {
      return await api.delete(`/chat/messages/${messageId}`);
    } catch (error) {
      throw error;
    }
  },

  // Send a message via WebSocket
  sendMessageViaWebSocket(ws, userId, content) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          user_id: userId,
          timestamp: new Date().toISOString(),
          content: content,
        })
      );
    }
  },

  // WebSocket connection for real-time chat (generic)
  connectWebSocket(onMessage) {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const token = api.getToken();

    if (!token) {
      console.error('No auth token found for WebSocket connection');
      return null;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return ws;
  },
};

