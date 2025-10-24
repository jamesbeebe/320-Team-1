import api from "./api";

export const authService = {
  // Login
  async login(email, password) {
    try {
      const data = await api.post("/auth/login", { email, password });
      if (data.accessToken) {
        api.setToken(data.accessToken);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Register
  async signup(username, email, password, major, gradYear) {
    try {
      const data = await api.post("/auth/signup", {
        name: username,
        email,
        password,
        major,
        gradYear: gradYear,
      });
      if (data.accessToken) {
        api.setToken(data.accessToken);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout() {
    api.removeToken();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!api.getToken();
  },
};
