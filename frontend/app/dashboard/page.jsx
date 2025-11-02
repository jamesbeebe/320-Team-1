'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Header from '@/components/layout/Header';

// Mock data - will be replaced with backend API
const mockUserClasses = [
  {
    id: 27,
    code: 'CS 311',
    name: 'Intro to Algorithms',
    semester: 'Fall 2025',
    students: ['AB', 'CD', 'EF', 'GH'],
    totalStudents: 24,
  },
  {
    id: 2,
    code: 'MATH 241',
    name: 'Calculus III',
    semester: 'Fall 2025',
    students: ['KL', 'MN', 'OP'],
    totalStudents: 18,
  },
  {
    id: 3,
    code: 'PHYS 211',
    name: 'University Physics',
    semester: 'Fall 2025',
    students: ['QR', 'ST', 'UV', 'WX'],
    totalStudents: 32,
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Classes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUserClasses.map((cls) => (
            <Link key={cls.id} href={`/class/${cls.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-[#EF5350] mb-1">{cls.code}</h2>
                    <p className="text-gray-900 font-medium">{cls.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{cls.semester}</p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        {cls.students.slice(0, 4).map((student, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700"
                          >
                            {student}
                          </div>
                        ))}
                      </div>
                      {cls.totalStudents > 4 && (
                        <span className="text-sm text-gray-600">+{cls.totalStudents - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {/* Add New Class Card */}
          <Link href="/onboarding">
            <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-[#EF5350] transition-colors duration-200 cursor-pointer h-full flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Add a new class</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}

