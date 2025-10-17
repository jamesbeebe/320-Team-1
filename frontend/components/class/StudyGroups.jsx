'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Mock data
const mockStudyGroups = [
  {
    id: 1,
    name: 'Midterm 1 Review',
    date: 'October 10, 2025',
    time: '3:00 PM - 5:00 PM',
    location: 'Library Study Room 204',
    spots: { filled: 2, total: 5 },
  },
  {
    id: 2,
    name: 'Dynamic Programming Practice',
    date: 'October 12, 2025',
    time: '7:00 PM - 9:00 PM',
    location: 'Zoom (link in chat)',
    spots: { filled: 5, total: 8 },
  },
  {
    id: 3,
    name: 'Final Project Discussion',
    date: 'October 15, 2025',
    time: '4:00 PM - 6:00 PM',
    location: 'Engineering Hall 201',
    spots: { filled: 3, total: 6 },
  },
];

export default function StudyGroups() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Study Group
        </Button>
      </div>

      <div className="space-y-4">
        {mockStudyGroups.map((group) => (
          <Card key={group.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{group.name}</h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{group.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{group.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{group.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>
                      {group.spots.filled}/{group.spots.total} spots filled
                    </span>
                  </div>
                </div>
              </div>

              <Button className="ml-4">Join</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

