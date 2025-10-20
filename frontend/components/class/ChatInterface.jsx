"use client";

import { useState, useEffect, useRef } from "react";
import { authService } from "@/services/auth";
import { chatService } from "@/services/chat";
import Card from "@/components/ui/Card";

// Mock channels
const mockChannels = [
  {
    id: "1b6cd7de-c6ed-434a-953d-7ff9da5d6ac0",
    name: "CS 311 General",
    type: "general",
  },
  {
    id: "aa36e595-aae4-4a3f-b26e-952549a4d65d",
    name: "Midterm 1 Review",
    type: "general",
  },
  {
    id: "ba2f80dd-8a7b-498d-a7ea-7e7bd003641b",
    name: "Dynamic Programming",
    type: "study-group",
  },
];

export default function ChatInterface() {
  const [messageInput, setMessageInput] = useState("");
  const [channels] = useState(mockChannels);
  const [channelMessages, setChannelMessages] = useState({});
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const ws = useRef(null);
  const messagesScrollBottomRef = useRef(null);
  const { user } = authService.useAuth();

  const formatMessage = (message) => {
    const user = message.name;
    const timestamp = new Date(message.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const [firstName, lastName] = user.split(" ");
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
      isOwn: message.user_id === user.id,
    };
  };

  // Fetch messages for a specific channel
  const fetchMessages = async (channelId) => {
    try {
      const messagesResponse = await chatService.fetchMessages(channelId);
      const messagesMap = messagesResponse.map(formatMessage);
      setChannelMessages((prev) => ({ ...prev, [channelId]: messagesMap }));
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    const handleMessage = (message) => {
      setChannelMessages((prev) => {
        const oldMessages = prev[selectedChannel.id] || [];
        return {
          ...prev,
          [selectedChannel.id]: [...oldMessages, formatMessage(message)],
        };
      });
    };

    const handleError = (err) => {
      console.error("WebSocket error:", err);
    };

    const wsChannel = chatService.connectToChannel(
      selectedChannel.id,
      handleMessage,
      handleError
    );
    ws.current = wsChannel;

    fetchMessages(selectedChannel.id);

    return () => {
      wsChannel.close();
    };
  }, [selectedChannel]);

  const messages = channelMessages[selectedChannel.id] || [];

  useEffect(() => {
    if (messagesScrollBottomRef.current) {
      messagesScrollBottomRef.current.scrollTop =
        messagesScrollBottomRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    chatService.sendMessageViaWebSocket(ws.current, user.id, messageInput);

    setMessageInput("");
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Channels Sidebar */}
      <Card className="w-64 p-4 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-4">Class Channels</h3>
        <div className="space-y-2">
          {channels
            .filter((c) => c.type === "general")
            .map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChannel.id === channel.id
                    ? "bg-[#EF5350] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {channel.name}
              </div>
            ))}
        </div>
        <h3 className="font-semibold text-gray-900 mt-6 mb-4">Study Groups</h3>
        <div className="space-y-2">
          {channels
            .filter((c) => c.type === "study-group")
            .map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`p-3 rounded-lg cursor-pointer transition-colors text-sm ${
                  selectedChannel.id === channel.id
                    ? "bg-[#EF5350] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {channel.name}
              </div>
            ))}
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 p-6 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedChannel.name}
          </h2>
        </div>

        {/* Messages */}
        <div
          ref={messagesScrollBottomRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4"
        >
          {messages.map((message) => (
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
          ))}
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
            className="bg-[#EF5350] hover:bg-[#E53935] text-white p-3 rounded-lg transition-colors"
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
