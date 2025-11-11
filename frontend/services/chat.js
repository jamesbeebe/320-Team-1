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

  async getChannelsForUser(userId){
    try{
      return await api.get(`/chats/class/all/${userId}`)

    } catch (error) {
      throw error;
    }
  },

  // Get messages for a channel
  async getMessages(channelId, startDate = null, endDate = null) {
    try {
      let url = `/messages/${channelId}`;
      const params = new URLSearchParams();

      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      return await api.get(url);
    } catch (error) {
      console.error("Error loading messages:", error);
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

  // Connect to a specific channel using WebSocket with auto-reconnection
  connectToChannel(channelId, callbacks = {}) {
    const {
      onMessage,
      onError,
      onOpen,
      onClose,
      reconnect = true,
      reconnectInterval = 3000,
      maxReconnectAttempts = 5,
    } = callbacks;

    let ws = null;
    let reconnectAttempts = 0;
    let reconnectTimer = null;
    let intentionallyClosed = false;

    const connect = () => {
      const WS_BASE_URL =
        process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

      // Normalize WebSocket URL
      const wsUrl =
        WS_BASE_URL.startsWith("ws://") || WS_BASE_URL.startsWith("wss://")
          ? WS_BASE_URL
          : `ws://${WS_BASE_URL.replace(/^https?:\/\//, "")}`;

      ws = new WebSocket(`${wsUrl}/${channelId}`);

      ws.onopen = () => {
        console.log(`Connected to channel ${channelId}`);
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        if (onOpen) onOpen();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          if (onError) onError(error);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for channel ${channelId}:`, error);
        if (onError) onError(error);
      };

      ws.onclose = (event) => {
        console.log(
          `Disconnected from channel ${channelId}`,
          event.code,
          event.reason
        );
        if (onClose) onClose(event);

        // Attempt to reconnect if not intentionally closed
        if (
          !intentionallyClosed &&
          reconnect &&
          reconnectAttempts < maxReconnectAttempts
        ) {
          reconnectAttempts++;
          console.log(
            `Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`
          );
          reconnectTimer = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          console.error("Max reconnection attempts reached");
          if (onError) {
            onError(new Error("Failed to reconnect after maximum attempts"));
          }
        }
      };

      return ws;
    };

    // Initial connection
    ws = connect();

    // Return WebSocket wrapper with utility methods
    return {
      get socket() {
        return ws;
      },

      get readyState() {
        return ws ? ws.readyState : WebSocket.CLOSED;
      },

      // Send a message through the WebSocket
      sendMessage(userId, content) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              user_id: userId,
              timestamp: new Date().toISOString(),
              content: content,
            })
          );
          return true;
        } else {
          console.error("WebSocket is not open. Cannot send message.");
          if (onError) {
            onError(new Error("WebSocket connection is not open"));
          }
          return false;
        }
      },

      // Close the WebSocket connection
      close() {
        intentionallyClosed = true;
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
        if (ws) {
          ws.close();
        }
      },

      // Manually trigger reconnection
      reconnect() {
        if (ws) {
          ws.close();
        }
        intentionallyClosed = false;
        reconnectAttempts = 0;
        connect();
      },
    };
  },
};
