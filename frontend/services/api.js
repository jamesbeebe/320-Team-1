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
    let url = `${this.baseURL}${endpoint}`;
    const { params, ...restOptions } = options;
    const hasBody = !!restOptions.body;
    const isFormData = hasBody && restOptions.body instanceof FormData;

    const config = {
      headers: {
        ...(hasBody && !isFormData && { "Content-Type": "application/json" }),
        ...restOptions.headers,
      },
      credentials: "include", // Include cookies in the request
      ...restOptions,
    };

    // Add auth token if it exists (from context/memory)
    const token = this.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const method = (config.method || "GET").toUpperCase();
    if (method === "GET") {
      let query = params;
      if (!query && hasBody) {
        try {
          query =
            typeof restOptions.body === "string"
              ? JSON.parse(restOptions.body)
              : restOptions.body;
        } catch {
          // ignore parse error
        }
      }
      if (query && typeof query === "object" && Object.keys(query).length > 0) {
        const qs = new URLSearchParams();
        Object.entries(query).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          if (Array.isArray(value)) {
            value.forEach((v) => qs.append(key, String(v)));
          } else if (typeof value === "object") {
            qs.append(key, JSON.stringify(value));
          } else {
            qs.append(key, String(value));
          }
        });
        const sep = url.includes("?") ? "&" : "?";
        url += sep + qs.toString();
      }
      delete config.body;
    } else if (hasBody && !isFormData && typeof restOptions.body !== "string") {
      config.body = JSON.stringify(restOptions.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      console.log(`HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    // Check content type to determine how to parse response
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    if (isJson) {
      return await response.json();
    }
    return await response.text();
  }

  getToken() {
    if (this.tokenGetter) {
      return this.tokenGetter();
    }
    return null;
  }

  // GET request
  get(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "GET",
      params: data?.params,
      body: data?.body,
    });
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
