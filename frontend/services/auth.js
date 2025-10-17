import api from './api';

export const authService = {
  // Login
  async login(email, password) {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.token) {
        api.setToken(data.token);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Register
  async signup(username, email, password) {
    try {
      const data = await api.post('/auth/register', { username, email, password });
      if (data.token) {
        api.setToken(data.token);
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

  // Get current user
  async getCurrentUser() {
    try {
      return await api.get('/auth/me');
    } catch (error) {
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!api.getToken();
  },
};

