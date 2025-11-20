'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/users';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    gradYear: '',
  });
  
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          // For now, use data from AuthContext
          // Tomorrow we'll fetch from backend
          const profileData = {
            name: user.name || '',
            email: user.email || '',
            major: user.major || '',
            gradYear: user.gradYear || '',
          };
          
          setFormData(profileData);
          setOriginalData(profileData);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setErrors({ general: 'Failed to load profile data' });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Check if form has changes
  useEffect(() => {
    const changed = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear success message when user starts editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setErrors({});
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrors({});
    setSuccessMessage('');

    // Validate form
    const validation = userService.validateProfile(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setSaving(true);
      
      // Update profile (mock for now, real API tomorrow)
      const updatedProfile = await userService.updateProfile({
        name: formData.name,
        major: formData.major,
        gradYear: parseInt(formData.gradYear),
      });

      // Update AuthContext with new user data
      if (updateUser) {
        updateUser({
          name: formData.name,
          major: formData.major,
          gradYear: parseInt(formData.gradYear),
        });
      }

      // Update original data to new values
      setOriginalData(formData);
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ 
        general: error.message || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                error={errors.name}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="bg-gray-50 cursor-not-allowed"
                helperText="Email cannot be changed"
              />
            </div>
          </Card>

          {/* Academic Information Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Academic Information</h2>
            <div className="space-y-4">
              <Input
                label="Major"
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                required
                error={errors.major}
              />

              <Input
                label="Graduation Year"
                type="number"
                name="gradYear"
                value={formData.gradYear}
                onChange={handleChange}
                placeholder="e.g., 2026"
                min="2024"
                max="2035"
                required
                error={errors.gradYear}
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={!hasChanges || saving}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={!hasChanges || saving}
              className="min-w-[150px]"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>

          {/* Unsaved Changes Warning */}
          {hasChanges && !saving && (
            <p className="text-sm text-amber-600 text-center">
              You have unsaved changes
            </p>
          )}
        </form>

        {/* Additional Info */}
        <Card className="p-6 mt-6 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Account Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>User ID: {user.id}</p>
            <p>Member since: {new Date().toLocaleDateString()}</p>
          </div>
        </Card>
      </div>
    </>
  );
}

