// Base API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.tokenGetter = null; // Function to get token from context/memory
  }

  // Set a function that returns the current access token from context
  setTokenGetter(tokenGetter) {
    this.tokenGetter = tokenGetter;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    
    const config = {
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...options.headers,
      },
      credentials: "include", // Include cookies in the request
      ...options,
    };

    // Add auth token if it exists (from context/memory)
    const token = this.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      console.log(`HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    // Check content type to determine how to parse response
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");



    const data = await response.json();
    return data;
  }

  getToken() {
    if (this.tokenGetter) {
      return this.tokenGetter();
    }
    return null;
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
