'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import IcsFileUpload from '@/components/ui/IcsFileUpload';

// Mock data - will be replaced with backend API
const mockClasses = [
  { id: 1, code: 'CS 311', name: 'Intro to Algorithms', professor: 'Dr. Smith' },
  { id: 2, code: 'MATH 241', name: 'Calculus III', professor: 'Dr. Johnson' },
  { id: 3, code: 'PHYS 211', name: 'University Physics', professor: 'Dr. Williams' },
  { id: 4, code: 'CS 225', name: 'Data Structures', professor: 'Dr. Brown' },
  { id: 5, code: 'ECE 220', name: 'Computer Systems', professor: 'Dr. Davis' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [addedClasses, setAddedClasses] = useState([]);

  const filteredClasses = mockClasses.filter(
    (cls) =>
      !addedClasses.includes(cls.id) &&
      (cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.professor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddClass = (classId) => {
    setAddedClasses([...addedClasses, classId]);
  };

  const handleContinue = () => {
    // TODO: Save classes to backend
    console.log('Added classes:', addedClasses);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Your Classes</h1>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-[#EF5350] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EF5350] focus:border-transparent"
          />
        </div>

        <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#EF5350] transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{cls.code}</h3>
                  <p className="text-sm text-gray-600">{cls.name}</p>
                  <p className="text-sm text-gray-500">{cls.professor}</p>
                </div>
                <Button onClick={() => handleAddClass(cls.id)} className="px-6">
                  Add
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              {searchQuery ? 'No classes found' : 'Start typing to search for classes'}
            </p>
          )}
        </div>

        <Button
          onClick={handleContinue}
          disabled={addedClasses.length === 0}
          className="w-full bg-[#FFCDD2] hover:bg-[#EF9A9A] text-gray-700"
        >
          View My Dashboard
        </Button>

        {addedClasses.length > 0 && (
          <p className="text-center text-sm text-gray-600 mt-4">
            {addedClasses.length} {addedClasses.length === 1 ? 'class' : 'classes'} added
          </p>
        )}
      </Card>
      <IcsFileUpload/>
    </div>
  );
}

