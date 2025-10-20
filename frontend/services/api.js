// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  class ApiService {
    constructor() {
      this.baseURL = API_BASE_URL;
    }
  
    // Helper method for making requests
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
  
      // Add auth token if it exists
      const token = this.getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
  
      try {
        const response = await fetch(url, config);
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }
  
        return data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    // Token management
    getToken() {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
      }
      return null;
    }
  
    setToken(token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
      }
    }
  
    removeToken() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
  
    // GET request
    get(endpoint) {
      return this.request(endpoint, { method: 'GET' });
    }
  
    // POST request
    post(endpoint, data) {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  
    // PUT request
    put(endpoint, data) {
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }
  
    // DELETE request
    delete(endpoint) {
      return this.request(endpoint, { method: 'DELETE' });
    }
  }
  
  export default new ApiService();

