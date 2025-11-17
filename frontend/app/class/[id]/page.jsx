"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { classService } from "@/services/classes";
import StudyGroups from "@/components/class/StudyGroups";
import Classmates from "@/components/class/Classmates";
import ChatInterface from "@/components/class/ChatInterface";

const tabs = [
  { id: "study-groups", name: "Study Groups", component: StudyGroups },
  { id: "classmates", name: "Classmates", component: Classmates },
  { id: "chat", name: "Chat", component: ChatInterface },
];

export default function ClassDetailsPage() {
  const router = useRouter();
  const { id: classId } = useParams();
  const searchParams = useSearchParams();
  const className = searchParams.get("name") || "";
  const classSection = searchParams.get("section") || "";
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const { user } = useAuth();

  const handleLeaveClass = async () => {
    try {
      await classService.removeClass(classId, user.id);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error leaving class:", error);
    }
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || StudyGroups;

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {classSection} - {className}
            </h1>
          </div>

          <div className="mt-4">
            <Button
              variant="secondary"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleLeaveClass}
            >
              Leave class
            </Button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-[#EF5350] text-[#EF5350]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div>
          <ActiveComponent />
        </div>
      </div>
    </>
  );
}
