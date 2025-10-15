'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

const AuthContext = createContext({});

// Toggle between mock and real API
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'false';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      if (USE_MOCK_AUTH) {
        // MOCK MODE: Check localStorage for mock user
        const storedUser = localStorage.getItem('mockUser');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Failed to parse mock user:', error);
          }
        }
      } else {
        // REAL API MODE: Check with backend
        if (authService.isAuthenticated()) {
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error('Failed to get user from API:', error);
            authService.logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function - switches between mock and real API
  const login = async (email, password) => {
    try {
      if (USE_MOCK_AUTH) {
        // ============ MOCK MODE ============
        console.log('🎭 Using MOCK authentication (no backend needed)');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock user
        const mockUser = {
          id: '1',
          email: email,
          username: email.split('@')[0],
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        };
        
        // Store in localStorage
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        
        setUser(mockUser);
        router.push('/dashboard');
        return { user: mockUser };
      } else {
        // ============ REAL API MODE ============
        console.log('🔌 Using REAL API authentication');
        
        const data = await authService.login(email, password);
        setUser(data.user);
        router.push('/dashboard');
        return data;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function - switches between mock and real API
  const signup = async (username, email, password) => {
    try {
      if (USE_MOCK_AUTH) {
        // ============ MOCK MODE ============
        console.log('🎭 Using MOCK signup (no backend needed)');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock user
        const mockUser = {
          id: '1',
          email: email,
          username: username,
          name: username.charAt(0).toUpperCase() + username.slice(1),
        };
        
        // Store in localStorage
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        
        setUser(mockUser);
        router.push('/onboarding');
        return { user: mockUser };
      } else {
        // ============ REAL API MODE ============
        console.log('🔌 Using REAL API signup');
        
        const data = await authService.signup(username, email, password);
        setUser(data.user);
        router.push('/onboarding');
        return data;
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    if (USE_MOCK_AUTH) {
      // MOCK MODE
      localStorage.removeItem('mockUser');
      localStorage.removeItem('authToken');
    } else {
      // REAL API MODE
      authService.logout();
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isMockMode: USE_MOCK_AUTH }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

