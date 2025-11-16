"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import IcsFileUpload from "@/components/ui/IcsFileUpload";
import { useAuth } from "@/context/AuthContext";
import { classService } from "@/services/classes";

export default function OnboardingPage() {
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await classService.getListOfClasses();
        setAllClasses(classes || []);
      } catch (e) {
        console.error("Can't access list of classes", e);
        setAllClasses([]);
      };
    }
    fetchClasses();
  }, []);

  const router = useRouter();
  const { user, loading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [currClasses, setCurrClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);

  // Filter available classes for manual search
  const filteredClasses = allClasses.filter(
    (cls) =>
      !currClasses.some((added) => added.id === cls.id) &&
      (cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.catalog.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  console.log("There are " + filteredClasses.length + " classes")
  const handleAddClass = (cls) => {
    const newClass = {
      id: cls.id,
      subject: cls.subject,
      catalog: cls.catalog,
      section: cls.section,
    };
    setCurrClasses((prev) => [...prev, newClass]);
  };

  const handleRemoveClass = (id) => {
    setCurrClasses((prev) => prev.filter((cls) => cls.id !== id));
  };

  const handleIcsUpload = (uploadedData) => {
    const parsedClasses = uploadedData.classIds.map((id, index) => ({
      id: id,
      subject: uploadedData.parsedData.subjectArray[index],
      catalog: uploadedData.parsedData.catalogArray[index],
      section: uploadedData.parsedData.sectionArray[index],
    }));

    setCurrClasses((prev) => {
      const newOnes = parsedClasses.filter(
        (cls) => !prev.some((c) => c.id === cls.id)
      );
      return [...prev, ...newOnes];
    });
  };

  const handleContinue = async () => {
    if (loading || !user) return;
    const classId = currClasses.map((c) => c.id);
    console.log(classId)
    try {
      await classService.bulkEnroll(classId, user.id);
      router.push("/dashboard");
    } catch (e) {
      console.error("Bulk enroll failed", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 px-6 py-10">
      <div className="flex flex-col md:flex-row justify-center items-start gap-8 w-full max-w-7xl mx-auto">
        <Card className="w-full md:w-1/3 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Add Classes Manually
          </h1>
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
                    <h3 className="font-semibold text-gray-900">{cls.subject} {cls.catalog}</h3>
                    <p className="text-sm text-gray-600">{"Section " + cls.section}</p>
                  </div>
                  <Button
                    onClick={() => handleAddClass(cls)}
                  >
                    Add
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                {searchQuery ? "No classes found" : "Start typing to search"}
              </p>
            )}
          </div>
        </Card>
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <IcsFileUpload onFileUpload={handleIcsUpload} />
        </div>
        <Card className="w-full md:w-1/3 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Current Added Classes
          </h1>

          <div className="space-y-3 max-h-[28rem] overflow-y-auto">
            {currClasses.length > 0 ? (
              currClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#EF5350] transition-colors bg-white"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {cls.subject} {cls.catalog}
                    </h3>
                    {cls.section && (
                      <p className="text-sm text-gray-500">
                        Section {cls.section}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleRemoveClass(cls.id)}
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
          className={`w-full ${Button.className} text-gray-700 text-lg py-4 transition-colors`}>
          Save and Go to Dashboard
        </Button>

        {currClasses.length > 0 && (
          <p className="text-center text-sm text-gray-600 mt-3">
            {currClasses.length}{" "}
            {currClasses.length === 1 ? "class" : "classes"} added
          </p>
        )}
      </div>
    </div>
  );
}
