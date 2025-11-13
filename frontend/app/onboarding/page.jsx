'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import IcsFileUpload from '@/components/ui/IcsFileUpload';
import { useAuth } from '@/context/AuthContext';

// Mock class data — replace with real backend data later
const mockClasses = [
  { id: 1, code: 'CS 311', name: 'Intro to Algorithms', professor: 'Dr. Smith' },
  { id: 2, code: 'MATH 241', name: 'Calculus III', professor: 'Dr. Johnson' },
  { id: 3, code: 'PHYS 211', name: 'University Physics', professor: 'Dr. Williams' },
  { id: 4, code: 'CS 225', name: 'Data Structures', professor: 'Dr. Brown' },
  { id: 5, code: 'ECE 220', name: 'Computer Systems', professor: 'Dr. Davis' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [currClasses, setCurrClasses] = useState([]);

  // Filter available classes for manual search
  const filteredClasses = mockClasses.filter(
    (cls) =>
      !currClasses.some((added) => added.classId === cls.id) &&
      (cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.professor.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddClass = (cls) => {
    const newClass = {
      classId: cls.id,
      subject: cls.code,
      name: cls.name,
      professor: cls.professor,
    };
    setCurrClasses((prev) => [...prev, newClass]);
  };

  const handleRemoveClass = (classId) => {
    setCurrClasses((prev) => prev.filter((cls) => cls.classId !== classId));
  };

  const handleIcsUpload = (uploadedData) => {
    const parsedClasses = uploadedData.classIds.map((id, index) => ({
      classId: id,
      subject: uploadedData.parsedData.subjectArray[index],
      catalog: uploadedData.parsedData.catalogArray[index],
      section: uploadedData.parsedData.sectionArray[index],
    }));

    setCurrClasses((prev) => {
      const newOnes = parsedClasses.filter(
        (cls) => !prev.some((c) => c.classId === cls.classId)
      );
      return [...prev, ...newOnes];
    });
  };

  const handleContinue = () => {
    
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-6 py-10">
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 w-full max-w-7xl mx-auto">
        <Card className="w-full md:w-1/3 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Classes Manually</h1>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
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
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#EF5350] transition-colors bg-white"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{cls.code}</h3>
                    <p className="text-sm text-gray-600">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.professor}</p>
                  </div>
                  <Button
                    onClick={() => handleAddClass(cls)}
                    className="px-6 bg-[#FFCDD2] hover:bg-[#EF9A9A] text-gray-700"
                  >
                    Add
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                {searchQuery ? 'No classes found' : 'Start typing to search'}
              </p>
            )}
          </div>
        </Card>
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <IcsFileUpload onFileUpload={handleIcsUpload} />
        </div>
        <Card className="w-full md:w-1/3 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Current Added Classes</h1>

          <div className="space-y-3 max-h-[28rem] overflow-y-auto">
            {currClasses.length > 0 ? (
              currClasses.map((cls) => (
                <div
                  key={cls.classId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#EF5350] transition-colors bg-white"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {cls.subject} {cls.catalog}
                    </h3>
                    {cls.name && <p className="text-sm text-gray-600">{cls.name}</p>}
                    {cls.professor && (
                      <p className="text-sm text-gray-500">{cls.professor}</p>
                    )}
                    {cls.section && (
                      <p className="text-sm text-gray-500">Section {cls.section}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleRemoveClass(cls.classId)}
                    className="px-6 bg-[#FFCDD2] hover:bg-[#EF9A9A] text-gray-700"
                  >
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 border border-dashed border-gray-300 rounded-lg bg-white">
                No classes added yet
              </p>
            )}
          </div>
        </Card>
      </div>
      <div className="w-full max-w-7xl mx-auto mt-10">
        <Button
          onClick={handleContinue}
          disabled={currClasses.length === 0}
          className={`w-full ${
            currClasses.length > 0
              ? 'bg-[#FFCDD2] hover:bg-[#EF9A9A]'
              : 'bg-gray-200 cursor-not-allowed'
          } text-gray-700 text-lg py-4 transition-colors`}
        >
          Enroll in Classes
        </Button>

        {currClasses.length > 0 && (
          <p className="text-center text-sm text-gray-600 mt-3">
            {currClasses.length} {currClasses.length === 1 ? 'class' : 'classes'} added
          </p>
        )}
      </div>
    </div>
  )
}
