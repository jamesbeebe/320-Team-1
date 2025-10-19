'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';

// Mock data
const mockChannels = [
  { id: 1, name: 'CS 311 General', type: 'general' },
  { id: 2, name: 'Midterm 1 Review', type: 'study-group' },
  { id: 3, name: 'Dynamic Programming', type: 'study-group' },
];

const mockMessages = [
  {
    id: 1,
    sender: 'Sarah M.',
    initials: 'SM',
    message: 'Hey everyone! Looking forward to the study session tomorrow.',
    time: '2:30 PM',
    isOwn: false,
  },
  {
    id: 2,
    sender: 'You',
    initials: 'JD',
    message: 'Same here! Should we divide up the topics?',
    time: '2:32 PM',
    isOwn: true,
  },
  {
    id: 3,
    sender: 'Brian C.',
    initials: 'BC',
    message: 'Good idea. I can cover sorting algorithms if someone wants to do graph theory.',
    time: '2:35 PM',
    isOwn: false,
  },
];

export default function ChatInterface() {
  const [selectedChannel, setSelectedChannel] = useState(mockChannels[0]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // TODO: Send message to backend

      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Channels Sidebar */}
      <Card className="w-64 p-4 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-4">Class Channels</h3>
        <div className="space-y-2">
          <div
            onClick={() => setSelectedChannel(mockChannels[0])}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedChannel.id === mockChannels[0].id
                ? 'bg-[#EF5350] text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {mockChannels[0].name}
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mt-6 mb-4">Study Groups</h3>
        <div className="space-y-2">
          {mockChannels.slice(1).map((channel) => (
            <div
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`p-3 rounded-lg cursor-pointer transition-colors text-sm ${
                selectedChannel.id === channel.id ? 'bg-[#EF5350] text-white' : 'hover:bg-gray-100'
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
          <h2 className="text-xl font-semibold text-gray-900">{selectedChannel.name}</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse text-right' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-gray-700">{msg.initials}</span>
              </div>
              <div className={`flex-1 ${msg.isOwn ? 'text-right' : ''}`}>
                <div className= {`flex items-baseline gap-2 mb-1 ${msg.isOwn ? 'justify-end': ''}`}>
                  <span className="font-semibold text-gray-900 text-sm">{msg.sender}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    msg.isOwn ? 'bg-[#EF5350] text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.message}
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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

