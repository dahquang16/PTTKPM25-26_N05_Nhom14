import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      console.log('Login response:', response.data);

      const data = response.data.data || response.data; 
      const userData = data.user || data;
      const tokenValue = data.token;

      if (!tokenValue) {
        throw new Error('Token not found in response');
      }

      setUser(userData);
      setToken(tokenValue);
      localStorage.setItem('token', tokenValue);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      console.log('Register response:', response.data);

      const data = response.data.data || response.data;
      const newUser = data.user || data;
      const tokenValue = data.token;

      if (tokenValue) {
        setUser(newUser);
        setToken(tokenValue);
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(newUser));
      }

      return { success: true, data };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAdmin = () => user && user.role === 'ADMIN';

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
