import api from "./api";

export const authService = {
  // Check if user is authenticated by validating refresh token
  async isAuthenticated() {
    try {
      const data = await api.get("/auth/me");
      return data.user || null;
    } catch (error) {
      console.error("Authentication check failed:", error);
      return null;
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
      // Backend sets refresh_token as httpOnly cookie
      // Return accessToken to be stored in memory (Context API state)
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh access token using httpOnly cookie
  // This should be called automatically when access token expires or on app load
  async refreshAuthToken() {
    try {
      const data = await api.get("/auth/refresh");
      // Backend sends new accessToken in JSON and sets new refresh_token cookie
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
