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
  async getUserWithClasses(userId){
    try {
      const data = await api.get(`/users/${userId}/classes`);
      return data;
    } catch (error) {
      console.error("Error fetching user with classes:", error);
      throw error;
    }
  },
  async getUsersWithClasses(userId){
    try{
      const data = await api.get(`/users/classes`, { params: { userId } });
      return data;
    } catch (error) {
      console.error("Error fetching users with classes:", error);
      throw error;
    }
  }
}