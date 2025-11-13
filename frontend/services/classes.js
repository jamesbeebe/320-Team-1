import api from "./api";

export const classService = {
  // Get all available classes
  async getAllClasses(userId) {
    try {
      return await api.get(`/classes/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  // Bulk enroll classes
  async bulkEnroll(classIds, userId) {
    try {
      return await api.post(`/classes/bulk-enroll`, {
        body: { classIds, userId },
      });
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
  // Add class to user
  async addClass(classId, userId) {
    try {
      return await api.post(`/classes/add/${classId}`, { body: { userId } });
    } catch (error) {
      throw error;
    }
  },

  // Remove class from user
  async removeClass(classId, userId) {
    try {
      return await api.post(`/classes/drop/${classId}`, { body: { userId } });
    } catch (error) {
      throw error;
    }
  },
};
