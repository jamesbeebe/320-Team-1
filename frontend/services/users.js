import api from './api';

// Mock mode toggle - will be replaced with real API calls tomorrow
const USE_MOCK = false;

export const userService = {
  // Get current user profile
  async getProfile() {
    if (USE_MOCK) {
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock user data (will come from backend tomorrow)
      return {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          major: 'Computer Science',
          gradYear: 2026
        }
      };
    }
    
    // Real API call (for tomorrow)
    return await api.get('/users/me');
  },

  // Update user profile
  async updateProfile(userData) {
    if (USE_MOCK) {
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('🎭 MOCK: Updating user profile:', userData);
      
      // Simulate successful update
      return {
        user: {
          id: '1',
          ...userData
        }
      };
    }
    
    // Real API call (for tomorrow)
    return await api.put('/users/me', { 
      body: userData 
    });
  },

  // Validate profile data
  validateProfile(data) {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (data.name && data.name.length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }

    if (!data.major || data.major.trim().length < 2) {
      errors.major = 'Major is required';
    }
    
    if (data.major && data.major.length > 100) {
      errors.major = 'Major must be less than 100 characters';
    }

    if (!data.gradYear) {
      errors.gradYear = 'Graduation year is required';
    }
    
    const year = parseInt(data.gradYear);
    if (isNaN(year) || year < 2024 || year > 2035) {
      errors.gradYear = 'Graduation year must be between 2024 and 2035';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

