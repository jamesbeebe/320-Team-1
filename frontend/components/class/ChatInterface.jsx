"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { chatService } from "@/services/chat";
import Card from "@/components/ui/Card";

const getChannelId = (ch) => ch?.chat_id ?? ch?.class_id ?? null;

export default function ChatInterface() {
  const {id} = useParams();
  const [messageInput, setMessageInput] = useState("");
  const [chanels, setChanels] = useState([]);
  const [chanelMessages, setChanelMessages] = useState({});
  const [selectedChanel, setSelectedChanel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const messagesScrollBottomRef = useRef(null);
  const { user, loading } = useAuth();

  // fetch study group chats that the user is enrolled in
  useEffect(() => {
    if (loading || !user) return;
    const getStudyGroupChats = async () => {
      const studyGroupChats = await chatService.getChannelsForUser(user.id, id);
      setChanels(studyGroupChats || []);
      setSelectedChanel((prev) => prev ?? studyGroupChats?.[0] ?? null);
    };
    getStudyGroupChats();
  }, [loading, user]);

  const formatMessage = (message) => {
    const messageSenderName = message.name || "Unknown User";
    const timestamp = new Date(message.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const [firstName = "User", lastName = ""] = messageSenderName.split(" ");
    const sender = `${firstName} ${
      lastName ? lastName[0].toUpperCase() + "." : ""
    }`;
    const initials = `${firstName[0].toUpperCase()}${
      lastName ? lastName[0].toUpperCase() : ""
    }`;

    return {
      id: message.id,
      chat_id: message.chat_id,
      user_id: message.user_id,
      timestamp,
      content: message.content,
      sender,
      initials,
      isOwn: user ? message.user_id === user.id : false,
    };
  };

  // Fetch messages for a specific chanel
  const fetchMessages = async (channelId) => {
    setIsLoading(true);
    setError(null);
    try {
      const messagesResponse = await chatService.getMessages(channelId);
      const list = Array.isArray(messagesResponse)
        ? messagesResponse
        : messagesResponse?.data || [];
      const messagesMap = list.map(formatMessage);
      setChanelMessages((prev) => ({ ...prev, [channelId]: messagesMap }));
    } catch (error) {
      console.error("Error loading messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChanel) return;
    // Reset connection state and error when changing chanels
    setIsConnected(false);
    setError(null);

    const channelId = getChannelId(selectedChanel);

    const handleMessage = (message) => {
      setChanelMessages((prev) => {
        const oldMessages = prev[channelId] || [];
        // Prevent duplicate messages by checking if message already exists
        const isDuplicate = oldMessages.some((msg) => msg.id === message.id);
        if (isDuplicate) return prev;

        return {
          ...prev,
          [channelId]: [...oldMessages, formatMessage(message)],
        };
      });
    };

    const handleError = (err) => {
      console.error("WebSocket error:", err);
      setError(err.message || "Connection error occurred");
      setIsConnected(false);
    };

    const handleOpen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
      setError(null);
    };

    const handleClose = (event) => {
      console.log("WebSocket connection closed", event);
      setIsConnected(false);
    };

    const wsConnection = chatService.connectToChannel(channelId, {
      onMessage: handleMessage,
      onError: handleError,
      onOpen: handleOpen,
      onClose: handleClose,
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
    });

    ws.current = wsConnection;

    // Fetch initial messages
    fetchMessages(channelId);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [selectedChanel]);

  const currentChannelId = selectedChanel ? getChannelId(selectedChanel) : null;
  const messages = currentChannelId
    ? chanelMessages[currentChannelId] || []
    : [];

  useEffect(() => {
    if (messagesScrollBottomRef.current) {
      messagesScrollBottomRef.current.scrollTop =
        messagesScrollBottomRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    console.log("handleSendMessage called");
    e.preventDefault();
    if (!messageInput.trim() || !user) return;

    if (!ws.current || !isConnected) {
      setError("Not connected. Please wait...");
      return;
    }

    console.log("Sending message to WebSocket", user.id, messageInput.trim());
    const success = ws.current.sendMessage(user.id, messageInput.trim());

    if (success) {
      setMessageInput("");
      setError(null);
    } else {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* chanels Sidebar */}
      <Card className="w-64 p-4 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-4">Class Channels</h3>
        <div className="space-y-2">
          {chanels
            .filter((c) => c.chat_type === "general" && new Date(c.expires_at).getTime() > Date.now())
            .map((chanel) => (
              <div
                key={getChannelId(chanel)}
                onClick={() => setSelectedChanel(chanel)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChanel &&
                  getChannelId(selectedChanel) === getChannelId(chanel)
                    ? "bg-[#EF5350] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {chanel.chat_name}
              </div>
            ))}
        </div>
        <h3 className="font-semibold text-gray-900 mt-6 mb-4">Study Groups</h3>
        <div className="space-y-2">
          {chanels
            .filter((c) => c.chat_type === "study-group" && new Date(c.expires_at).getTime() > Date.now())
            .map((chanel) => (
              <div
                key={getChannelId(chanel)}
                onClick={() => setSelectedChanel(chanel)}
                className={`p-3 rounded-lg cursor-pointer transition-colors text-sm ${
                  selectedChanel &&
                  getChannelId(selectedChanel) === getChannelId(chanel)
                    ? "bg-[#EF5350] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {chanel.chat_name}
              </div>
            ))}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 p-6 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedChanel?.name || "Select a channel"}
            </h2>
            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? "Connected" : "Connecting..."}
              </span>
            </div>
          </div>
          {/* Error Banner */}
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Messages */}
        <div
          ref={messagesScrollBottomRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4"
        >
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">
                No messages yet. Start the conversation!
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.isOwn ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-700">
                    {message.initials}
                  </span>
                </div>
                <div className={`flex-1 ${message.isOwn ? "text-right" : ""}`}>
                  <div
                    className={`flex items-baseline gap-2 mb-1 ${
                      message.isOwn ? "justify-end" : ""
                    }`}
                  >
                    <span className="font-semibold text-gray-900 text-sm">
                      {message.sender}
                    </span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? "bg-[#EF5350] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF5350] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!selectedChanel || !isConnected || !messageInput.trim()}
            className="bg-[#EF5350] hover:bg-[#E53935] text-white p-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </Card>
    </div>
  );
}
