"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        const data = await authService.getCurrentUser();
        setUser(data);
      }
    };
    initAuth();
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => { 
    const data = await authService.login(email, password);
    setUser(data);
    router.push("/dashboard");
  };

  // Signup function - switches between mock and real API
  const signup = async (username, email, password, major, gradYear) => {
        const data = await authService.signup(
          username,
          email,
          password,
          major,
          gradYear
        );
    setUser(data);
    router.push("/onboarding");
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
