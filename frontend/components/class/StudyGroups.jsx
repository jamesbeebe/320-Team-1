"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { studyGroupService } from "@/services";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

// Mock data

const mockStudyGroups = [
  {
    id: 1,
    name: "Midterm 1 Review",
    date: "October 10, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Library Study Room 204",
    spots: { filled: 2, total: 5 },
  },
  {
    id: 2,
    name: "Dynamic Programming Practice",
    date: "October 12, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "Zoom (link in chat)",
    spots: { filled: 5, total: 8 },
  },
  {
    id: 3,
    name: "Final Project Discussion",
    date: "October 15, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "Engineering Hall 201",
    spots: { filled: 3, total: 6 },
  },
];

export default function StudyGroups() {
  const { id } = useParams();
  const [studyGroups, setStudyGroups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getGroups = async () => {
      try {
        const res = await studyGroupService.getStudyGroups(id);
        const dataMap = res.map((group) => {
          const readableDate = new Date(group.expires_at).toLocaleString();
          const splitted = readableDate.split(", ");
          return {
            id: group.id,
            name: group.name,
            date: splitted[0],
            time: splitted[1].replace(":00", ""),
          };
        });
        setStudyGroups(dataMap);
      } catch (error) {
        setError(error.message);
        console.error("Error loading study groups: ", error);
      }
    };
    getGroups();
  }, []);
  return (
    <div>
      <div className="mb-6">
        <Link href={`/class/${id}/create-study-group`}>
          <Button className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Study Group
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {studyGroups.map((group) => (
          <Card key={group.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {group.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{group.time}</span>
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
