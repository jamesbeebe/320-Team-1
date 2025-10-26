import api from "./api";

function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function setCookie(value, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${process.env.AUTH_TOKEN_NAME}=${value}; expires=${expires.toUTCString()}; path=/; secure; sameSite=strict`;
}

function deleteCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const authService = {
  // Check if user is authenticated
  async isAuthenticated() {
    const authCookie = getCookie(process.env.AUTH_TOKEN_NAME);
    if (authCookie) {
      // Try to refresh the token with the backend
      try {
        await this.refreshAuthToken();
        // Return the user by fetching from backend or decode token
        // For now, just return that auth exists
        return { authenticated: true };
      } catch (error) {
        // Token refresh failed - user needs to login again
        console.error("Token refresh failed:", error);
        deleteCookie("auth_token");
        return null;
      }
    }
    return null;
  },

  // Login
  async login(email, password) {
    try {
      const data = await api.post("/auth/login", { email, password });
      if (data.accessToken) {
        // Store in cookie (backend sets it, but we also set it client-side as backup)
        setCookie(data.accessToken);
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
        // Store in cookie (backend sets it, but we also set it client-side as backup)
        setCookie(data.accessToken);
        api.setToken(data.accessToken);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // refresh auth token
  async refreshAuthToken() {
    const data = await api.post("/auth/refresh-auth-token");
    if (data.session?.access_token) {
      api.setToken(data.session.access_token);
      setCookie(data.session.access_token);
    }
    return data;
  },

  // Logout
  logout() {
    // Clear token from localStorage
    api.removeToken();
    // Clear cookie
    deleteCookie("auth_token");
  },
};
