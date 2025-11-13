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

    // apply query params to URL
    if (
      params &&
      typeof params === "object" &&
      Object.keys(params).length > 0
    ) {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
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

    // apply body to config
    config.body = isFormData
      ? restOptions.body
      : (hasBody ? JSON.stringify(restOptions.body) : undefined);
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    // Check content type to determine how to parse response
    const contentType = response.headers.get("content-type");

    return await response.json();
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
  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: data?.body,
      params: data?.params,
    });
  }

  // PUT request
  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: data?.body,
      params: data?.params,
    });
  }

  // DELETE request
  delete(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "DELETE",
      params: data?.params,
      body: data?.body,
    });
  }
}

export default new ApiService();
