'use client';

import Card from '@/components/ui/Card';

// Mock data
const mockClassmates = [
  { id: 1, name: 'Brian C.', initials: 'BC', compatibility: 95 },
  { id: 2, name: 'Sarah M.', initials: 'SM', compatibility: 88 },
  { id: 3, name: 'Alex T.', initials: 'AT', compatibility: 82 },
  { id: 4, name: 'Jordan L.', initials: 'JL', compatibility: 78 },
  { id: 5, name: 'Taylor K.', initials: 'TK', compatibility: 75 },
];

export default function Classmates() {
  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-400';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-4">
      {mockClassmates.map((classmate) => (
        <Card key={classmate.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-semibold text-gray-700">{classmate.initials}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{classmate.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getCompatibilityColor(classmate.compatibility)}`}
                    style={{ width: `${classmate.compatibility}%` }}
                  />
                </div>
                <span className="text-lg font-semibold text-gray-900">{classmate.compatibility}%</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

