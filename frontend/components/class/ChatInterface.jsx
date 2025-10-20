"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";
import axios from "axios";

// Mock data
const mockChannels = [
  {
    id: "1b6cd7de-c6ed-434a-953d-7ff9da5d6ac0",
    name: "CS 311 General",
    type: "general",
  },
  { id: 2, name: "Midterm 1 Review", type: "general" },
  { id: 3, name: "Dynamic Programming", type: "study-group" },
];

const userId = "d6154bad-467c-4e71-8def-206c8923cf6f";

export default function ChatInterface() {
  const [messageInput, setMessageInput] = useState("");
  const [channels] = useState(mockChannels);
  const [messages, setMessages] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const ws = useRef(null);
  const fetchMessages = async () => {
      try {
        const messagesMap = await populateMessages(selectedChannel.id);
        setMessages(messagesMap);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:3001/${selectedChannel.id}`);

    ws.current.onopen = () => console.log("Connected to", selectedChannel.id);
    ws.current.onmessage = (event) => {
      console.log("Received Message: ", event.data);
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, formatMessage(data)]);
    };
    ws.current.onerror = (err) => console.error("WebSocket error:", err);

    fetchMessages();

    return () => {
      console.log("Disconnecting from", selectedChannel.id);
      ws.current.close();
    };
  }, [selectedChannel]);

  const formatMessage = (message) => {
    const user = message.name;
        const timestamp = new Date(message.timestamp).toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }
        );

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
          isOwn: message.user_id === userId,
        };
  }

  const populateMessages = async (channelId) => {
    const response = await axios.get(`http://localhost:3001/api/messages/${channelId}`);
    const messagesResponse = response.data;
    const messagesMap = await Promise.all(
      messagesResponse.map((message) => {
        return formatMessage(message);
      })
    );
    return messagesMap;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // TODO: Send message to backend
      ws.current.send(
        JSON.stringify({
          user_id: userId,
          timestamp: new Date().toISOString(),
          content: messageInput,
        })
      );
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Channels Sidebar */}
      <Card className="w-64 p-4 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-4">Class Channels</h3>
        <div className="space-y-2">
          {channels
            .filter((channel) => channel.type === "general")
            .map((channel) => {
              return (
                <div
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel);
                    fetchMessages();
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChannel.id === channel.id
                      ? "bg-[#EF5350] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {channel.name}
                </div>
              );
            })}
        </div>
        <h3 className="font-semibold text-gray-900 mt-6 mb-4">Study Groups</h3>
        <div className="space-y-2">
          {channels
            .filter((channel) => channel.type === "study-group")
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
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-gray-700">
                  {msg.initials}
                </span>
              </div>
              <div className={`flex-1 ${msg.isOwn ? "text-right" : ""}`}>
                <div
                  className={`flex items-baseline gap-2 mb-1 ${
                    msg.isOwn ? "justify-end" : ""
                  }`}
                >
                  <span className="font-semibold text-gray-900 text-sm">
                    {msg.sender}
                  </span>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.isOwn
                      ? "bg-[#EF5350] text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
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
