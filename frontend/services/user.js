import api from "./api";

export const userService = {
  
  async getUser(userId){
    try {
      const data = await api.get(`/users/${userId}`);
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async getUsersCompatibility(userId, classId){
    try{
      const data = await api.get(`/users/${userId}/compatibility/${classId}`);
      return data;
    } catch (error) {
      console.error("Error fetching users compatibility:", error);
      throw error;
    }
  }
  
}