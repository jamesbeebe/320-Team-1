"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth";
import api from "@/services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // Store access token in memory only
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Connect API service to access token from context
  useEffect(() => {
    api.setTokenGetter(() => accessToken);
  }, [accessToken]);

  // Check if user is authenticated on mount and refresh token if needed
  useEffect(() => {
    authService
      .isAuthenticated()
      .then((user) => {
        setUser(user);
        setLoading(false);

        // If already authenticated and on auth pages, go to dashboard
        if (pathname === "/login" || pathname === "/signup") {
          router.replace("/dashboard");
        }
      })
      .catch((error) => {
        setLoading(false);
        if(pathname != "/signup"){
          router.push("/login");
        }
      });
  }, [pathname, router]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    setUser({ id: data.user.id, ...data.user.user_metadata });
    router.push("/dashboard");
  };

  const signup = async (username, email, password, major, gradYear) => {
    const data = await authService.signup(
      username,
      email,
      password,
      major,
      gradYear
    );

    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    setUser(data.user);
    router.push("/onboarding");
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setAccessToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
