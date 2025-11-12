"use client";

import Card from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { userService } from "@/services/user";
import { useAuth } from "@/context/AuthContext";

export default function Classmates({ classId }) {
  const [classmates, setClassmates] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const weights = [0.6, 0.3, 0.1]; // weights for classes, major, grad year

  useEffect(() => {
    async function fetchOwnUser() {
      try {
        const data = await userService.getUserWithClasses(user.id);
        const set = new Set();
        data.user_classes.forEach((uc) => set.add(uc.class_id));
        data.user_classes = set;
        setUserData(data);
      } catch (err) {
        console.error("Error fetching own user data:", err);
      }
    }

    fetchOwnUser();
  }, [user.id]);

  useEffect(() => {
    if (!userData){
      return;
    }

    async function fetchClassmates() {
      try {
        setLoading(true);
        const fetchedClassmates = await userService.getUsersWithClasses(
          classId,
          user.id
        );

        const updated = fetchedClassmates.map((c) => {
          const classMatch = c.user_classes.filter((uc) =>
            userData.user_classes.has(uc.class_id)
          ).length;
          const majorMatch = c.major === userData.major ? 1 : 0;
          const gradYearMatch = c.grad_year === userData.grad_year ? 1 : 0;
          c.compatibility = Math.round(
            (classMatch / userData.user_classes.size) * weights[0] * 100 +
              majorMatch * weights[1] * 100 +
              gradYearMatch * weights[2] * 100
          );
          return c;
        });

        setClassmates(
          updated.sort((a, b) => b.compatibility - a.compatibility)
        );
      } catch (err) {
        console.error("Error fetching classmates:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClassmates();
  }, [userData, classId]);

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
                        classmate.compatibility
                      )}`}
                      style={{ width: `${classmate.compatibility}%` }}
                    />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {classmate.compatibility}%
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
