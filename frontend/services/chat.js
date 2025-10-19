import api from './api';

export const chatService = {
  // Get channels for a class
  // To do : Issue # 19 

  
  // Get messages for a channel
  async getMessages(channelId, startDate, endDate) {
    try {
      return await api.get(`chat/${channelId}/messages?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
      throw error;
    }
  },

  // WebSocket connection for real-time chat
  connectWebSocket(chatId, onMessage) {
    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || `ws://localhost:8080/chat/${chatId}`;
    const token = api.getToken();
    
    if (!token) {
      console.error('No auth token found for WebSocket connection');
      return null;
    }

    const ws = new WebSocket(`${WS_URL}}`);
    
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

