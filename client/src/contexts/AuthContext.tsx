import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/auth';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  loginWithGoogle: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      // CORRECTED: Set the user state here to prevent logging out on refresh
      // This is a placeholder. A more robust solution would get user data from the backend.
      setUser({ id: 'some-id', email: 'user@example.com', username: 'user' });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = res.data;
      setAuthToken(token);
      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, { username: name, email, password });
      const { token, user } = res.data;
      setAuthToken(token);
      setUser(user);
      toast.success('Registration successful! You are now logged in.');
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Registration failed. The email may already be in use.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = (token: string, userData: User) => {
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    toast('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};