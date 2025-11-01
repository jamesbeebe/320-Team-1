"use client"

import { useState} from "react";
import {useRouter, useParams} from "next/navigation";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export function StudyGroupsForm (){
  const router = useRouter();
  const {id} = useParams();
  const [formData, setFormData] = useState({
    studyGroupName: '',
    date: '',
    endTime: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      //Could add validation for date to be this semester

      //Could make the time inputs validate when selecting times.

      if(!formData.studyGroupName || formData.studyGroupName.trim() == ''){
        throw new Error("Study group name can't be empty.");
      }

      if(!formData.date){
        throw new Error("Date can't be empty.");
      }

      if(!formData.endTime){
        throw new Error("End time can't be empty.");
      }

      if(formData.endTime < formData.startTime){
        throw new Error("Invalid time: End Time is before Start Time.")
      }

      //Todo
      await createStudyGroup();

      router.push(`/class/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to create study group. Please try again.');
      console.error('Error creating study group: ', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Study Group Name"
            type="text"
            name="studyGroupName"
            value={formData.studyGroupName}
            onChange={handleChange}
            required
          />

          <Input
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Input
            label="End Time"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Study Group...' : 'Create Study Group'}
          </Button>
        </form>
      </Card>
    </div>
  )
}