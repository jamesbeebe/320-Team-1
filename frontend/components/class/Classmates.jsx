"use client";

import Card from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { userService } from "@/services/user";
import { useAuth } from "@/context/AuthContext";

export default function Classmates({ classId }) {
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchClassmates() {
      try {
        setLoading(true);
        const data = await userService.getUsersCompatibility(user.id, classId);
        const classmatesData = data.map((classmate) => ({
          id: classmate.id,
          name: classmate.name,
          weighted_score: classmate.weighted_score * 100,
        }));
        setClassmates(classmatesData);
      } catch (err) {
        console.error("Error fetching classmates compatibility:", err);
      }
      finally{
        setLoading(false);
      }
    }
    fetchClassmates();
  }, [user.id, classId]);

  const getCompatibilityColor = (score) => {
    if (score >= 95) return "bg-green-600";
    if (score >= 85) return "bg-green-500";
    if (score >= 75) return "bg-lime-400";
    if (score >= 65) return "bg-yellow-400";
    if (score >= 50) return "bg-orange-400";
    if (score >= 35) return "bg-orange-500";
    if (score >= 20) return "bg-red-500";
    return "bg-red-600";
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-lg font-semibold text-gray-900">
          Loading classmates...
        </p>
      ) : (
        classmates.map((classmate) => (
          <Card
            key={classmate.id}
            className="p-6 border-width-1 border-gray-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {classmate.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCompatibilityColor(
                        classmate.weighted_score
                      )}`}
                      style={{ width: `${classmate.weighted_score}%` }}
                    />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {classmate.weighted_score}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
