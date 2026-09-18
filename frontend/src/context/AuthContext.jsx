import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('freshcart_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('freshcart_token'));
  const [loading, setLoading] = useState(() => {
    const hasToken = !!localStorage.getItem('freshcart_token');
    const hasUser = !!localStorage.getItem('freshcart_user');
    // If token exists but no user yet, wait for fetchMe. If user exists, don't block.
    return hasToken && !hasUser;
  });

  const fetchMe = async () => {
    const savedToken = localStorage.getItem('freshcart_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('freshcart_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      // Only logout on explicit 401 Unauthorized (expired or invalid token)
      if (err.response && err.response.status === 401) {
        console.warn('[AuthContext] Session expired or invalid token');
        logout();
      } else {
        console.warn('[AuthContext] Background sync warning:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);


  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const { user: loggedInUser, token: authToken } = res.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('freshcart_user', JSON.stringify(loggedInUser));
      localStorage.setItem('freshcart_token', authToken);
      return loggedInUser;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const { user: registeredUser, token: authToken } = res.data;
      setUser(registeredUser);
      setToken(authToken);
      localStorage.setItem('freshcart_user', JSON.stringify(registeredUser));
      localStorage.setItem('freshcart_token', authToken);
      return registeredUser;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    try {
      authService.logout();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('freshcart_user');
    localStorage.removeItem('freshcart_token');
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('freshcart_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUserState,
    fetchMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
