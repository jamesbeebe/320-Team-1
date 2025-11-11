import api from "./api";

export const authService = {
  // Check if user is authenticated by validating refresh token
  async isAuthenticated() {
    try {
      const data = await api.get("/auth/me");
      console.log("the data from isAuthenticated",data);
      return {id: data.user.id, ...data.user.user_metadata};
    } catch (error) {
      console.log("Authentication check failed:", error);
      throw error;
    }
  },

  // Login - backend will set httpOnly cookie with refresh_token
  async login(email, password) {
    try {
      const data = await api.post("/auth/login", { email, password });
      // Backend sets refresh_token as httpOnly cookie
      // Return accessToken to be stored in memory (Context API state)
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Register - backend will set httpOnly cookie with refresh_token
  async signup(username, email, password, major, gradYear) {
    try {
      const data = await api.post("/auth/signup", {
        name: username,
        email,
        password,
        major,
        gradYear: gradYear,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },


  // Logout - clears httpOnly cookie on server
  async logout() {
    try {
      await api.post("/auth/logout");
      // Backend clears refresh_token cookie
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};
