import api from './api';

export const classService = {
  // Get all available classes
  async getAllClasses() {
    try {
      return await api.get('/classes');
    } catch (error) {
      throw error;
    }
  },

  // Search classes
  async searchClasses(query) {
    try {
      return await api.get(`/classes/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      throw error;
    }
  },

  // Get user's classes
  async getUserClasses() {
    try {
      return await api.get('/classes/my-classes');
    } catch (error) {
      throw error;
    }
  },

  // Add class to user
  async addClass(classId) {
    try {
      return await api.post('/classes/add', { classId });
    } catch (error) {
      throw error;
    }
  },

  // Remove class from user
  async removeClass(classId) {
    try {
      return await api.delete(`/classes/${classId}`);
    } catch (error) {
      throw error;
    }
  },

  // Get class details
  async getClassDetails(classId) {
    try {
      return await api.get(`/classes/${classId}`);
    } catch (error) {
      throw error;
    }
  },

  // Get classmates for a class
  async getClassmates(classId) {
    try {
      return await api.get(`/classes/${classId}/classmates`);
    } catch (error) {
      throw error;
    }
  },
};

