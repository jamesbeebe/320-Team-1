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
    authService.isAuthenticated().then((user) => {
      if (user) {
        setUser(user);
        router.push("/dashboard");
      } else {
        router.push("/login"); 
      }
      setLoading(false);
    });
  }, []);

  // Login function
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    router.push("/dashboard");
  };

  // Signup function
  const signup = async (username, email, password, major, gradYear) => {
    const data = await authService.signup(
      username,
      email,
      password,
      major,
      gradYear
    );
    setUser(data.user);
    router.push("/onboarding");
  };

  // Logout function
  const logout = async () => {
    authService.logout();
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
