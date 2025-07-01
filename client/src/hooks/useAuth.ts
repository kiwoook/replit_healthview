import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock user data for client-only version
const mockUser: User = {
  id: "1",
  email: "user@example.com",
  firstName: "김철수",
  lastName: "김",
  profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      const authStatus = localStorage.getItem('healthview-auth');
      if (authStatus === 'authenticated') {
        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    // Simulate loading delay
    setTimeout(checkAuth, 500);
  }, []);

  const login = () => {
    localStorage.setItem('healthview-auth', 'authenticated');
    setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('healthview-auth');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
  };
}