"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { classService } from "@/services/classes";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [userClasses, setUserClasses] = useState([]);

  const router = useRouter();
  console.log(user);

  const handleLeaveClass = async (e, classId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await classService.removeClass(classId, user.id);
      setUserClasses((prev) => prev.filter((c) => c.id !== classId));
    } catch (error) {
      console.error("Error leaving class:", error);
    }
  };
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading) {
      const fetchUserClasses = async () => {
        try {
          const data = await classService.getAllClasses(user.id);
          console.log("user classes ->", data);
          setUserClasses(data);
        } catch (error) {
          console.error("Error fetching user classes:", error);
        }
      };
      if (user) {
        fetchUserClasses();
      }
    }
  }, [loading]);

  if (loading) return null;
  if (!user) return null;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Classes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userClasses.map((cls) => (
            <Link
              key={cls.id}
              href={{
                pathname: `/class/${cls.id}`,
                query: {
                  name: `${cls.subject} ${cls.catalog}`,
                  section: cls.section,
                },
              }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-[#800000] mb-1">
                      {cls.subject} {cls.catalog}
                    </h2>
                    <p className="text-gray-900 font-medium"> {cls.section}</p>
                  </div>
                  <div className="mt-auto">
                    <Button
                      variant="secondary"
                      className="text-[#A30000] border-[#A30000] hover:bg-red-50"
                      onClick={(e) => handleLeaveClass(e, cls.id)}
                    >
                      Leave
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {/* Add New Class Card */}
          <Link href="/onboarding">
            <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-[#800000] transition-colors duration-200 cursor-pointer h-full flex items-center justify-center min-h-[200px]">
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
