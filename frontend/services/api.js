// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if it exists
    const token = this.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Check content type to determine how to parse response
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      // Check if response is ok before trying to parse
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        if (isJson) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            errorMessage = `Failed to parse error response. Status: ${response.status}`;
          }
        } else {
          // Not JSON, likely HTML error page
          errorMessage = `Server returned non-JSON response (${
            contentType || "unknown type"
          }). Status: ${response.status}. URL: ${url}`;
        }

        throw new Error(errorMessage);
      }

      // Parse successful response as JSON
      if (!isJson) {
        throw new Error(
          `Expected JSON response but got ${contentType}. URL: ${url}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Token management
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export default new ApiService();
