import api from './api';

export const studyGroupService = {
  // Get study groups for a class
  async getStudyGroups(classId) {
    try {
      return await api.get(`/study-groups?classId=${classId}`);
    } catch (error) {
      throw error;
    }
  },

  // Create a study group
  async createStudyGroup(classId, groupData) {
    try {
      return await api.post(`/chats/class/${classId}/`, {...groupData, type: "study-group"});
    } catch (error) {
      throw error;
    }
  },

  // Join a study group
  async joinStudyGroup(groupId) {
    try {
      return await api.post(`/study-groups/${groupId}/join`);
    } catch (error) {
      throw error;
    }
  },

  // Leave a study group
  async leaveStudyGroup(groupId) {
    try {
      return await api.post(`/study-groups/${groupId}/leave`);
    } catch (error) {
      throw error;
    }
  },

  // Get study group details
  async getStudyGroupDetails(groupId) {
    try {
      return await api.get(`/study-groups/${groupId}`);
    } catch (error) {
      throw error;
    }
  },

  // Update study group
  async updateStudyGroup(groupId, updates) {
    try {
      return await api.put(`/study-groups/${groupId}`, updates);
    } catch (error) {
      throw error;
    }
  },

  // Delete study group
  async deleteStudyGroup(groupId) {
    try {
      return await api.delete(`/study-groups/${groupId}`);
    } catch (error) {
      throw error;
    }
  },
};

