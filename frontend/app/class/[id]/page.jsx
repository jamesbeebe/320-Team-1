'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import StudyGroups from '@/components/class/StudyGroups';
import Classmates from '@/components/class/Classmates';
import ChatInterface from '@/components/class/ChatInterface';

// Mock data - will be replaced with backend API
const mockClass = {
  id: 1,
  code: 'CS 311',
  name: 'Intro to Algorithms',
  semester: 'Fall 2025',
};

const tabs = [
  { id: 'study-groups', name: 'Study Groups', component: StudyGroups },
  { id: 'classmates', name: 'Classmates', component: Classmates },
  { id: 'chat', name: 'Chat', component: ChatInterface },
];

export default function ClassDetailsPage({ params }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || StudyGroups;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mockClass.code} - {mockClass.name}
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#EF5350] text-[#EF5350]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Tab Content */}
        <div>
          <ActiveComponent />
        </div>
      </div>
    </>
  );
}

